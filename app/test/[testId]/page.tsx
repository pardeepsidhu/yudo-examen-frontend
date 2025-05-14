"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";


import {
  Card,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Info,
  PlayCircle,
  Lock,
  Volume2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAttendTest, answerQuestion } from "@/app/api/test.api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestDetails from "./testDetails";
import { useTheme } from "@/app/context/theme.context";
import { Textarea } from "@/components/ui/textarea";
import { CodeRunner } from "./codeRunner";
import { TestAttempt as TestAttempt2 } from "./testDetails";
import { flushSync } from "react-dom";






export default function TestPage() {
  const params = useParams();
  const [testData, setTestData] = useState<TestAttempt2| null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const {theme} = useTheme()
    // const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState("es");
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [translatedDescription,setTranslatedDesctription]=useState("");
  const [translatedSolution,setTranslatedSolution]=useState("")
  // const [text, setText] = useState("");
// setSelectedTranslation("en")
  const fetchTest = async () => {
      try {
        if (!params.testId) {
          throw new Error("Test ID not found in URL parameters");
        }
        const response = await getAttendTest(params.testId as string);
        console.log("home")
        console.log(response.data)
        if (!response || !response.success) {
          throw new Error(response?.message || "Failed to load test");
        }
        setTestData(response.data);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error loading test";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    

    fetchTest();
  }, [params.testId]);

  const handleOptionSelect = async (option: string) => {
    if (!testData?.test?.questions || !testData.test.questions[currentQuestionIndex]) {
      toast.error("Question data not available");
      return;
    }

    const currentQuestion = testData.test.questions[currentQuestionIndex];

    try {
      const testId = testData.test._id
      if (!testId) {
        throw new Error("Test ID not found");
      }

      if (!currentQuestion._id) {
        throw new Error("Question ID not found");
      }

      if (!currentQuestion.rightOption) {
        throw new Error("Right option not defined");
      }

      const response = await answerQuestion(
        testId,
        currentQuestion._id,
        option === currentQuestion.rightOption
      );

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to record answer");
      }

      // Update test data with new response
      // setTestData(response.data);
      await fetchTest()
      toast.success("Answer recorded successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error recording answer";
      toast.error(errorMessage);
    }
  };


  const getYouTubeEmbedUrl = (url: string | undefined): string => {
    if (!url) return '';

    try {
      // Handle YouTube shorts URLs
      if (url.includes('youtube.com/shorts/')) {
        const videoId = url.split('shorts/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }
      
      // Handle regular YouTube URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }
      
      // Handle youtu.be URLs
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }
      
      // Return original URL if not a YouTube URL
      return url;
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return url;
    }
  };


  const handleNext = () => {
    if (testData?.test?.questions && 
        Array.isArray(testData.test.questions) && 
        currentQuestionIndex < testData.test.questions.length - 1) {
          setTranslatedDesctription("")
          setTranslatedSolution("")
          setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex > 0) {
      setTranslatedDesctription("")
       setTranslatedSolution("")
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };



  const handleTextToSpeech = (textToRead: string) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis is not supported in this browser.');
    alert('Text-to-speech is not supported in your browser.');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  const textToSpeak = textToRead || "No text available to speak";

  const speak = () => {
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const lang = selectedTranslation || 'en-US';
    utterance.lang = lang;

    // Try to pick a sweet female voice
    const femaleVoice = voices.find(v =>
      v.lang.startsWith(lang) &&
      /female|woman|samantha|karen|google uk english female/i.test(v.name)
    ) || voices.find(v => /female|woman/i.test(v.name)) || voices[0];

    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('Using voice:', femaleVoice.name);
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (err) => {
      console.error('Speech synthesis error:', err);
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Ensure voices are loaded
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = speak;
  } else {
    speak();
  }
};


const translateText = async (text: string,type: 'des' | "sol",lang:string) => {

// console.log(text)
  if (!text.trim()) {
    toast.error("No text available");
    return;
  }
if(lang==="en") {
  setTranslatedDesctription("")
  setTranslatedSolution("")
  return;
}
  try {
    // Split the text if it's longer than 500 characters
    const chunks = splitTextIntoChunks(text, 500);
    let translatedText = "";

    for (const chunk of chunks) {
      // Call MyMemory API to get translated text
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|${lang}`);
      const data = await response.json();

      if (data.responseData) {
        translatedText += data.responseData.translatedText + " ";
      } else {
        toast.error("Translation failed");
        return;
      }
    }
   console.log(translatedText)
    if(type ==="des"){
  setTranslatedDesctription(translatedText);
    }
    else{
      setTranslatedSolution(translatedText)
    }
   setShowTranslationOptions(false)
    // return translatedText.trim();

  } catch (error) {
    console.error("Translation failed:", error);
    toast.error("Error while translating");
  }
};

// Helper function to split text into smaller chunks
function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}



  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Enhanced null checks before rendering content
  if (!testData ) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No test data available. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle case where questions array might be missing or empty
  const questions = testData.test?.questions || [];
  if (questions.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Alert className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertDescription>This test doesn&apos;t have any questions yet.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Safely get current question or provide fallback
  const currentQuestion = questions[currentQuestionIndex] || null;
  if (!currentQuestion && questions.length > 0) {
    // Reset to first question if current index is invalid
    setCurrentQuestionIndex(0);
  }

  const totalQuestions = testData.test?.totalQuestions || questions.length || 0;
  const progress = testData.progress|| 0;
  const answeredQuestionIds = testData?.answeredQuestionIds || [];

  // Extract question attempt information for checking answers
  const questionsAttended = testData.questionsAttended || [];
  const questionAttemptsMap = new Map(
    questionsAttended.map((qa )=> [qa.question._id, qa])
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
        {/* <Translator from='en' to='es'>this is my car</Translator> */}
       
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Test Details
              </TabsTrigger>
              <TabsTrigger value="attend" className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Attend Test
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <TestDetails testData={testData  } />
            </TabsContent>

            <TabsContent value="attend" className="mt-4">
              <div className="flex-1 flex overflow-hidden">
                {/* Question Navigation */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-4 gap-2">
                      {questions.map((_, index) => {
                        const questionId = questions[index]?._id;
                        const isAnswered = questionId ? answeredQuestionIds.includes(questionId) : true;
                        
                        const isCorrect = questionId && questionAttemptsMap.has(questionId) ? 
                          questionAttemptsMap.get(questionId)?.isRight : false;
                        
                        return (
                          <Button
                            key={index}
                            variant={currentQuestionIndex === index ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0",
                              isAnswered && isCorrect && "bg-green-500 hover:bg-green-600",
                              isAnswered && !isCorrect && "bg-red-500 hover:bg-red-600"
                            )}
                            onClick={() => setCurrentQuestionIndex(index)}
                          >
                            {index + 1}
                          </Button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Progress Bar */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                      <span>{Math.round(progress as number)}% Complete</span>
                    </div>
                    <Progress value={progress as number} className="h-2" />
                  </div>

                  {/* Question Content */}
                  {currentQuestion && (
                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="p-6 space-y-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentQuestionIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="p-6 space-y-6 bg-white dark:bg-gray-800 shadow-lg">



                {/* Question Title */}
                                <div className="mb-0">
                                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {currentQuestion.title}
                                  </h2>
                                  {/* {currentQuestion.description && (
                                    <p className="text-gray-600 dark:text-gray-300">
                                      {currentQuestion.description}
                                    </p>
                                  )} */}
                                </div>



                             <Tabs defaultValue="Answer" className="">
    <TabsList
  className="grid w-full grid-cols-5 mb-3 gap-1 p-1 rounded-lg shadow-sm h-auto"
  style={{ backgroundColor: theme.neutral }}
>
  <TabsTrigger
    value="Answer"
    className="rounded-md text-xs font-medium py-1 transition-all"
    style={{ backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.secondary)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    Answer
  </TabsTrigger>
  <TabsTrigger
    value="Description"
    className="rounded-md text-xs font-medium py-1 transition-all"
    style={{ backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.secondary)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    Description
  </TabsTrigger>
  <TabsTrigger
    value="Solution"
    className="rounded-md text-xs font-medium py-1 transition-all"
    style={{ backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.secondary)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    Solution
  </TabsTrigger>
  <TabsTrigger
    value="Media"
    className={`rounded-md text-xs font-medium py-1 transition-all relative ${!currentQuestion.image && !currentQuestion.video && (!currentQuestion.shorts || currentQuestion.shorts.length === 0) ? "cursor-not-allowed opacity-70" : ""}`}
    style={{ backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = !currentQuestion.image && !currentQuestion.video && (!currentQuestion.shorts || currentQuestion.shorts.length === 0) ? "transparent" : theme.secondary)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    disabled={!currentQuestion.image && !currentQuestion.video && (!currentQuestion.shorts || currentQuestion.shorts.length === 0)}
  >
    Media
    {!currentQuestion.image && !currentQuestion.video && (!currentQuestion.shorts || currentQuestion.shorts.length === 0) && (
      <Lock className="h-3 w-3 ml-1 inline" />
    )}
  </TabsTrigger>
  <TabsTrigger
    value="Code"
    className={`rounded-md text-xs font-medium py-1 transition-all relative ${!currentQuestion.code ? "cursor-not-allowed opacity-70" : ""}`}
    style={{ backgroundColor: "transparent" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = !currentQuestion.code ? "transparent" : theme.secondary)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    disabled={!currentQuestion.code}
  >
    Code
    {!currentQuestion.code && (
      <Lock className="h-3 w-3 ml-1 inline" />
    )}
  </TabsTrigger>
</TabsList>


       <TabsContent value="Answer">
       {currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                                  <RadioGroup
                                    value=""
                                    onValueChange={handleOptionSelect}
                                    className="space-y-4"
                                  >
                                    {currentQuestion.options.map((option, index) => {
                                      if (!option) return null;
                                      
                                      const currentQuestionId = currentQuestion._id;
                                      const isAnswered = currentQuestionId ? answeredQuestionIds.includes(currentQuestionId) : false;
                                      const isSelected = currentQuestionId && questionAttemptsMap.has(currentQuestionId);
                                      const correctOption = currentQuestion.rightOption;
                                      
                                      return (
                                        <div
                                          key={index}
                                          className={cn(
                                            "relative flex items-center space-x-3 p-4 rounded-lg border transition-all",
                                            isSelected && option === correctOption
                                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                              : isSelected && option !== correctOption
                                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                              : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                                          )}
                                        >
                                          <RadioGroupItem
                                            value={option}
                                            id={`option-${index}`}
                                            className="peer sr-only"
                                            disabled={isAnswered}
                                          />
                                          <Label
                                            htmlFor={`option-${index}`}
                                            className="flex-1 cursor-pointer text-gray-900 dark:text-white"
                                          >
                                            {option}
                                          </Label>
                                          {isAnswered && (
                                            <div className="absolute right-4">
                                              {option === correctOption ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                              ) : isSelected && option !== correctOption ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                              ) : null}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </RadioGroup>
                                ) : (
                                  <Alert>
                                    <AlertDescription>No options available for this question.</AlertDescription>
                                  </Alert>
                                )}
      </TabsContent>
      <TabsContent value="Description">
       <div className="w-full max-w-4xl mx-auto">
      {/* Text area */}

{/* Controls */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mt-3 mb-3">
        <button
          className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
          onClick={()=>handleTextToSpeech(translatedDescription || currentQuestion.description || "")}
        >
        
          <Volume2 className={`h-4 w-4 ${isSpeaking ? "text-blue-500" : ""}`} />
          <span className="hidden sm:inline">Text to Speech</span>
        </button>
        
        <div className="relative">
          <button
            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
            onClick={ ()=>setShowTranslationOptions(true)}
          >
            
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Translate</span>
            {selectedTranslation !== "en" && <span className="text-xs font-medium ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{selectedTranslation.toUpperCase()}</span>}
          </button>
          
          {showTranslationOptions && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg p-1 border border-gray-200">
              {["en", "es", "fr", "de", "zh", "ja"].map((lang) => (
                <button
                  key={lang}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedTranslation === lang ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={ async()=>{   await translateText(currentQuestion.description || "","des",lang); flushSync(()=>setSelectedTranslation(lang))}}
                >
                  {lang === "en" ? "English" : 
                   lang === "es" ? "Spanish" : 
                   lang === "fr" ? "French" : 
                   lang === "de" ? "German" : 
                   lang === "zh" ? "Chinese" : 
                   lang === "ja" ? "Japanese" : lang}
                </button>
              ))}
            </div>
           )} 
        </div>
        
      
      </div>


      <textarea
        value={translatedDescription || currentQuestion.description}
        readOnly={true}
        placeholder="Enter your text here..."
        className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
      />
      
      
    </div>
      </TabsContent>
      <TabsContent value="Solution">

      

{/* Controls */}
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mt-3 mb-3">
        <button
          className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
          onClick={()=>handleTextToSpeech(translatedSolution || currentQuestion.solution || "")}
        >
        
          <Volume2 className={`h-4 w-4 ${isSpeaking ? "text-blue-500" : ""}`} />
          <span className="hidden sm:inline">Text to Speech</span>
        </button>
        
        <div className="relative">
          <button
            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
            onClick={ ()=>setShowTranslationOptions(true)}
          >
            
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Translate</span>
            {selectedTranslation !== "en" && <span className="text-xs font-medium ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">{selectedTranslation.toUpperCase()}</span>}
          </button>
          
          {showTranslationOptions && (
            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg p-1 border border-gray-200">
              {["en", "es", "fr", "de", "zh", "ja"].map((lang) => (
                <button
                  key={lang}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedTranslation === lang ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={ async()=>{   await translateText( currentQuestion.solution || "","sol",lang); flushSync(()=>setSelectedTranslation(lang))}}
                >
                  {lang === "en" ? "English" : 
                   lang === "es" ? "Spanish" : 
                   lang === "fr" ? "French" : 
                   lang === "de" ? "German" : 
                   lang === "zh" ? "Chinese" : 
                   lang === "ja" ? "Japanese" : lang}
                </button>
              ))}
            </div>
           )} 
        </div>
        
      
      </div>

         <Textarea 
                            id="q-description" 
                            name="description" 
                            placeholder="Optional description or context for the question" 
                            value={translatedSolution || currentQuestion.solution}
                               readOnly={true}
                              rows={5}
                              className='max-h-100'
                            />
                            
      </TabsContent>
       <TabsContent value="Media">
        <div className="space-y-2">

                          
                           
                        </div>
                          <div className='flex gap-3'>
                        {currentQuestion.image && (
                        
                              <div className="w-full relative group">
                                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                    onClick={() => window.open(currentQuestion.image, '_blank')}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M15 3h6v6"></path>
                                      <path d="M10 14L21 3"></path>
                                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    </svg>
                                  </button>
                                  <button 
                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                    onClick={() => {
                                      const elem = document.createElement('div');
                                      elem.style.position = 'fixed';
                                      elem.style.top = '0';
                                      elem.style.left = '0';
                                      elem.style.width = '100%';
                                      elem.style.height = '100%';
                                      elem.style.backgroundColor = 'rgba(0,0,0,0.9)';
                                      elem.style.zIndex = '9999';
                                      elem.style.display = 'flex';
                                      elem.style.justifyContent = 'center';
                                      elem.style.alignItems = 'center';
                                      
                                      const img = document.createElement('img');
                                      img.src = currentQuestion.image|| "";
                                      img.style.maxWidth = '90%';
                                      img.style.maxHeight = '90%';
                                      img.style.objectFit = 'contain';
                                      
                                      elem.appendChild(img);
                                      
                                      elem.onclick = () => document.body.removeChild(elem);
                                      document.body.appendChild(elem);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                    </svg>
                                  </button>
                                </div>
                                <img 
                                  src={currentQuestion.image} 
                                  alt="Question image" 
                                  className="w-full h-60 rounded-md object-cover cursor-pointer"
                                  onClick={() => {
                                    const elem = document.createElement('div');
                                    elem.style.position = 'fixed';
                                    elem.style.top = '0';
                                    elem.style.left = '0';
                                    elem.style.width = '100%';
                                    elem.style.height = '100%';
                                    elem.style.backgroundColor = 'rgba(0,0,0,0.9)';
                                    elem.style.zIndex = '9999';
                                    elem.style.display = 'flex';
                                    elem.style.justifyContent = 'center';
                                    elem.style.alignItems = 'center';
                                    
                                    const img = document.createElement('img');
                                    img.src = currentQuestion.image || "";
                                    img.style.maxWidth = '100%';
                                    img.style.maxHeight = '100%';
                                    img.style.objectFit = 'contain';
                                    
                                    elem.appendChild(img);
                                    
                                    elem.onclick = () => document.body.removeChild(elem);
                                    document.body.appendChild(elem);
                                  }}
                                />
                              </div>
                        )}
                        
                        {currentQuestion.video && (
                              <div className="w-full relative group">
                                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                    onClick={() => window.open(getYouTubeEmbedUrl(currentQuestion.video), '_blank')}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M15 3h6v6"></path>
                                      <path d="M10 14L21 3"></path>
                                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                    </svg>
                                  </button>
                                  <button 
                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                    onClick={() => {
                                      const elem = document.createElement('div');
                                      elem.style.position = 'fixed';
                                      elem.style.top = '0';
                                      elem.style.left = '0';
                                      elem.style.width = '100%';
                                      elem.style.height = '100%';
                                      elem.style.backgroundColor = 'rgba(0,0,0,0.9)';
                                      elem.style.zIndex = '9999';
                                      elem.style.display = 'flex';
                                      elem.style.justifyContent = 'center';
                                      elem.style.alignItems = 'center';
                                      
                                      const iframe = document.createElement('iframe');
                                      iframe.src = getYouTubeEmbedUrl(currentQuestion.video);
                                      iframe.style.width = '95%';
                                      iframe.style.height = '95%';
                                      iframe.style.border = 'none';
                                      iframe.allowFullscreen = true;
                                      
                                      elem.appendChild(iframe);
                                      
                                      // Add close button
                                      const closeBtn = document.createElement('button');
                                      closeBtn.innerHTML = '×';
                                      closeBtn.style.position = 'absolute';
                                      closeBtn.style.top = '20px';
                                      closeBtn.style.right = '20px';
                                      closeBtn.style.fontSize = '30px';
                                      closeBtn.style.color = 'white';
                                      closeBtn.style.background = 'none';
                                      closeBtn.style.border = 'none';
                                      closeBtn.style.cursor = 'pointer';
                                      closeBtn.onclick = (e) => {
                                        e.stopPropagation();
                                        document.body.removeChild(elem);
                                      };
                                      
                                      elem.appendChild(closeBtn);
                                      document.body.appendChild(elem);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                    </svg>
                                  </button>
                                </div>
                                <iframe 
                                  src={getYouTubeEmbedUrl(currentQuestion.video)} 
                                  className="w-full h-60 rounded-md"
                                  allowFullScreen
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                              </div>
                        )}
                          </div>
                        
                        {currentQuestion.shorts && currentQuestion.shorts.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {currentQuestion.shorts.map((short, index) => (
                                <div key={index} className="relative group">
                                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                      onClick={() => window.open(getYouTubeEmbedUrl(short), '_blank')}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6"></path>
                                        <path d="M10 14L21 3"></path>
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                      </svg>
                                    </button>
                                    <button 
                                      className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                      onClick={() => {
                                        const elem = document.createElement('div');
                                        elem.style.position = 'fixed';
                                        elem.style.top = '0';
                                        elem.style.left = '0';
                                        elem.style.width = '100%';
                                        elem.style.height = '100%';
                                        elem.style.backgroundColor = 'rgba(0,0,0,0.9)';
                                        elem.style.zIndex = '9999';
                                        elem.style.display = 'flex';
                                        elem.style.justifyContent = 'center';
                                        elem.style.alignItems = 'center';
                                        
                                        const iframe = document.createElement('iframe');
                                        iframe.src = getYouTubeEmbedUrl(short);
                                        iframe.style.width = '80%';
                                        iframe.style.height = '80%';
                                        iframe.style.border = 'none';
                                        iframe.allowFullscreen = true;
                                        
                                        elem.appendChild(iframe);
                                        
                                        // Add close button
                                        const closeBtn = document.createElement('button');
                                        closeBtn.innerHTML = '×';
                                        closeBtn.style.position = 'absolute';
                                        closeBtn.style.top = '20px';
                                        closeBtn.style.right = '20px';
                                        closeBtn.style.fontSize = '30px';
                                        closeBtn.style.color = 'white';
                                        closeBtn.style.background = 'none';
                                        closeBtn.style.border = 'none';
                                        closeBtn.style.cursor = 'pointer';
                                        closeBtn.onclick = (e) => {
                                          e.stopPropagation();
                                          document.body.removeChild(elem);
                                        };
                                        
                                        elem.appendChild(closeBtn);
                                        document.body.appendChild(elem);
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <iframe 
                                    src={getYouTubeEmbedUrl(short)} 
                                    className="w-full h-40 rounded-md"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  />
                                </div>
                            ))}
                          </div>
                        )}
                        
                        
      </TabsContent>
       <TabsContent value="Code">
      {currentQuestion.code &&  <CodeRunner code={currentQuestion.code} language={currentQuestion.codeLang?currentQuestion.code:""} /> }
      </TabsContent>
    </Tabs>
                              </Card>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>


                      <Button
                        onClick={handleNext}
                        disabled={currentQuestionIndex >= questions.length - 1}
                        className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}