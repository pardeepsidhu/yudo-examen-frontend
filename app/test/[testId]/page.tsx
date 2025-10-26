"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Card } from "@/components/ui/card";
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
  const [testData, setTestData] = useState<TestAttempt2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const { theme } = useTheme();
  // const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState("es");
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [translatedDescription, setTranslatedDesctription] = useState("");
  const [translatedSolution, setTranslatedSolution] = useState("");
  // const [text, setText] = useState("");
  // setSelectedTranslation("en")
  const fetchTest = useCallback(async () => {
    try {
      if (!params.testId) {
        throw new Error("Test ID not found in URL parameters");
      }
      const response = await getAttendTest(params.testId as string);

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to load test");
      }
      setTestData(response.data);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error loading test";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTranslatedDesctription("");
      setTranslatedSolution("");
    }
  }, [params.testId]); // Only depends on params.testId

  useEffect(() => {
    fetchTest();
  }, [params.testId, fetchTest]);

  const handleOptionSelect = async (option: string) => {
    if (
      !testData?.test?.questions ||
      !testData.test.questions[currentQuestionIndex]
    ) {
      toast.error("Question data not available");
      return;
    }

    const currentQuestion = testData.test.questions[currentQuestionIndex];

    try {
      const testId = testData.test._id;
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
      await fetchTest();
      toast.success("Answer recorded successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error recording answer";
      toast.error(errorMessage);
    }
  };

  const getYouTubeEmbedUrl = (url: string | undefined): string => {
    if (!url) return "";

    try {
      // Handle YouTube shorts URLs
      if (url.includes("youtube.com/shorts/")) {
        const videoId = url.split("shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }

      // Handle regular YouTube URLs
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }

      // Handle youtu.be URLs
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}?loop=1&controls=0&showinfo=0&rel=0`;
      }

      // Return original URL if not a YouTube URL
      return url;
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      return url;
    }
  };

  const handleNext = () => {
    if (
      testData?.test?.questions &&
      Array.isArray(testData.test.questions) &&
      currentQuestionIndex < testData.test.questions.length - 1
    ) {
      setTranslatedDesctription("");
      setTranslatedSolution("");
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex > 0) {
      setTranslatedDesctription("");
      setTranslatedSolution("");
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleTextToSpeech = (textToRead: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("Speech synthesis is not supported in this browser.");
      alert("Text-to-speech is not supported in your browser.");
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
      const lang = selectedTranslation || "en-US";
      utterance.lang = lang;

      // Try to pick a sweet female voice
      const femaleVoice =
        voices.find(
          (v) =>
            v.lang.startsWith(lang) &&
            /female|woman|samantha|karen|google uk english female/i.test(v.name)
        ) ||
        voices.find((v) => /female|woman/i.test(v.name)) ||
        voices[0];

      if (femaleVoice) {
        utterance.voice = femaleVoice;

      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (err) => {
        console.error("Speech synthesis error:", err);
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

  const translateText = async (
    text: string,
    type: "des" | "sol",
    lang: string
  ) => {
    // console.log(text)
    if (!text.trim()) {
      toast.error("No text available");
      return;
    }
    if (lang === "en") {
      setTranslatedDesctription("");
      setTranslatedSolution("");
      return;
    }
    try {
      // Split the text if it's longer than 500 characters
      const chunks = splitTextIntoChunks(text, 500);
      let translatedText = "";

      for (const chunk of chunks) {
        // Call MyMemory API to get translated text
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            chunk
          )}&langpair=en|${lang}`
        );
        const data = await response.json();

        if (data.responseData) {
          translatedText += data.responseData.translatedText + " ";
        } else {
          toast.error("Translation failed");
          return;
        }
      }

      if (type === "des") {
        setTranslatedDesctription(translatedText);
      } else {
        setTranslatedSolution(translatedText);
      }
      setShowTranslationOptions(false);
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

  // Loading State
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Animated loader container */}
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200/30 animate-ping" />

            {/* Main loader */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
          </div>

          {/* Loading text with animation */}
          <div className="text-center space-y-2">
            <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
              Loading test...
            </p>
            <div className="flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200" />
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce animation-delay-400" />
            </div>
          </div>
        </div>

        <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(30px, -30px) scale(1.1); opacity: 0.3; }
        }
        .animate-blob { animation: blob 7s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden flex justify-center flex justify-center">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />

            <div className="p-6 space-y-4">
              {/* Error icon with animation */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Error content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h3>
                <AlertDescription className="text-base text-gray-600 leading-relaxed">
                  {error}
                </AlertDescription>
              </div>

              {/* Action button */}
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </Alert>
        </div>

        <style jsx>{`
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
      </div>
    );
  }

  // No Test Data State
  if (!testData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gray-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden flex justify-center">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

            <div className="p-6 space-y-4">
              {/* Info icon */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">No Test Data Available</h3>
                <AlertDescription className="text-base text-gray-600 leading-relaxed">
                  No test data available. Please try again later.
                </AlertDescription>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:scale-[1.02]"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Refresh
                </button>
              </div>
            </div>
          </Alert>
        </div>

        <style jsx>{`
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
      </div>
    );
  }

  // No Questions State
  const questions = testData?.test?.questions || [];
  if (questions.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 max-w-md w-full">
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden flex justify-center">
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400" />

            <div className="p-6 space-y-4">
              {/* Warning icon with animation */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Info className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">No Questions Yet</h3>
                <AlertDescription className="text-base text-gray-600 leading-relaxed">
                  This test doesn&apos;t have any questions yet. Please check back later or contact the test creator.
                </AlertDescription>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                  <p className="text-xs text-gray-500 font-medium">Test Status</p>
                  <p className="text-sm font-bold text-indigo-600">Empty</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
                  <p className="text-xs text-gray-500 font-medium">Questions</p>
                  <p className="text-sm font-bold text-orange-600">0</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:scale-[1.02]"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.href = '/test'}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Browse Tests
                </button>
              </div>
            </div>
          </Alert>
        </div>

        <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(30px, -30px) scale(1.1); opacity: 0.3; }
        }
        .animate-blob { animation: blob 7s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
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
  const progress = testData.progress || 0;
  const answeredQuestionIds = testData?.answeredQuestionIds || [];

  // Extract question attempt information for checking answers
  const questionsAttended = testData.questionsAttended || [];
  const questionAttemptsMap = new Map(
    questionsAttended.map((qa) => [qa.question._id, qa])
  );

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-gradient-to-br"
      style={{
        background: `linear-gradient(135deg, ${theme.neutral} 0%, ${theme.tertiary} 100%)`,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="grid w-full grid-cols-2 rounded-lg shadow-sm h-auto"
              style={{
                background: theme.neutral,
                border: `1px solid ${theme.primary}22`,
                minHeight: 44,
              }}
            >
              <TabsTrigger
                value="details"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold py-2 px-1 rounded-md transition-all focus-visible:ring-2"
                style={{
                  color: activeTab === "details" ? theme.primary : `${theme.primary}88`,
                  background: activeTab === "details" ? theme.tertiary : "transparent",
                  border: activeTab === "details" ? `1.5px solid ${theme.primary}` : "none",
                  fontWeight: 600,
                }}
              >
                <Info className="h-4 w-4" />
                <span className="hidden xs:inline">Test Details</span>
                <span className="inline xs:hidden">Details</span>
              </TabsTrigger>
              <TabsTrigger
                value="attend"
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold py-2 px-1 rounded-md transition-all focus-visible:ring-2"
                style={{
                  color: activeTab === "attend" ? theme.primary : `${theme.primary}88`,
                  background: activeTab === "attend" ? theme.tertiary : "transparent",
                  border: activeTab === "attend" ? `1.5px solid ${theme.primary}` : "none",
                  fontWeight: 600,
                }}
              >
                <PlayCircle className="h-4 w-4" />
                <span className="hidden xs:inline">Attend Test</span>
                <span className="inline xs:hidden">Attend</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="m-0 mt-4">
              <TestDetails testData={testData} />
            </TabsContent>

            <TabsContent value="attend" className="mt-4">
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-2">
                {/* Question Navigation */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2 sm:p-4 bg-white/80 dark:bg-gray-900/40 rounded-lg md:rounded-r-none mb-2 md:mb-0">
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-8 md:grid-cols-4 gap-2">
                      {questions.map((_, index) => {
                        const questionId = questions[index]?._id;
                        const isAnswered = questionId
                          ? answeredQuestionIds.includes(questionId)
                          : true;
                        const isCorrect =
                          questionId && questionAttemptsMap.has(questionId)
                            ? questionAttemptsMap.get(questionId)?.isRight
                            : false;
                        return (
                          <Button
                            key={index}
                            variant={
                              currentQuestionIndex === index
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 rounded-full text-xs font-bold",
                              isAnswered &&
                              isCorrect &&
                              "bg-green-500 hover:bg-green-600 text-white border-none",
                              isAnswered &&
                              !isCorrect &&
                              "bg-red-500 hover:bg-red-600 text-white border-none",
                              currentQuestionIndex === index &&
                              `border-2 border-[${theme.primary}]`
                            )}
                            style={{
                              color:
                                currentQuestionIndex === index
                                  ? theme.primary
                                  : `${theme.primary}88`,
                              background:
                                currentQuestionIndex === index
                                  ? theme.tertiary
                                  : "",
                              borderColor:
                                currentQuestionIndex === index
                                  ? theme.primary
                                  : "",
                            }}
                            onClick={() => { setCurrentQuestionIndex(index); setTranslatedDesctription(""); setTranslatedSolution(""); }}
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
                  <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 gap-1 font-medium">
                      <span>
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                      <span>{Math.round(progress as number)}% Complete</span>
                    </div>
                    <Progress
                      value={progress as number}
                      className="h-2"
                      style={{
                        background: theme.tertiary,
                        color: theme.primary,
                      }}
                    />
                  </div>

                  {/* Question Content */}
                  {currentQuestion && (
                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentQuestionIndex}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card
                                className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl"
                                style={{
                                  border: `1.5px solid ${theme.primary}22`,
                                  background: theme.white,
                                }}
                              >
                                {/* Question Title */}
                                <div className="mb-0">
                                  <h2
                                    className="text-base sm:text-lg md:text-xl font-bold"
                                    style={{
                                      color: theme.primary,
                                      fontFamily: "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {currentQuestion.title}
                                  </h2>
                                </div>

                                <Tabs defaultValue="Answer" className="">
                                  <TabsList
                                    className="grid w-full grid-cols-5 mb-2 sm:mb-3 gap-1 p-1 rounded-lg shadow-sm h-auto"
                                    style={{
                                      background: theme.neutral,
                                      border: `1px solid ${theme.primary}22`,
                                    }}
                                  >
                                    {["Answer", "Description", "Solution", "Media", "Code"].map(
                                      (tab) => {
                                        const isDisabled =
                                          (tab === "Media" &&
                                            !currentQuestion.image &&
                                            !currentQuestion.video &&
                                            (!currentQuestion.shorts ||
                                              currentQuestion.shorts.length === 0)) ||
                                          (tab === "Code" && !currentQuestion.code);
                                        const isActive =
                                          activeTab === tab ||
                                          (tab === "Answer" && !activeTab);
                                        return (
                                          <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className={`rounded-md text-[11px] xs:text-xs sm:text-sm font-semibold py-1 px-1 transition-all focus-visible:ring-2 ${isDisabled
                                              ? "cursor-not-allowed opacity-60"
                                              : ""
                                              }`}
                                            style={{
                                              color: isActive
                                                ? theme.primary
                                                : `${theme.primary}88`,
                                              background: isActive
                                                ? theme.tertiary
                                                : "transparent",
                                              border: isActive
                                                ? `1.5px solid ${theme.primary}`
                                                : "none",
                                              fontWeight: 600,
                                            }}
                                            disabled={isDisabled}
                                          >
                                            {tab}
                                            {isDisabled &&
                                              (tab === "Media" || tab === "Code") && (
                                                <Lock className="h-3 w-3 ml-1 inline" />
                                              )}
                                          </TabsTrigger>
                                        );
                                      }
                                    )}
                                  </TabsList>

                                  <TabsContent value="Answer">
                                    {currentQuestion.options &&
                                      Array.isArray(currentQuestion.options) &&
                                      currentQuestion.options.length > 0 ? (
                                      <RadioGroup
                                        value=""
                                        onValueChange={handleOptionSelect}
                                        className="space-y-4"
                                      >
                                        {currentQuestion.options.map((option, index) => {
                                          if (!option) return null;

                                          const currentQuestionId = currentQuestion._id;
                                          const isAnswered = currentQuestionId
                                            ? answeredQuestionIds.includes(currentQuestionId)
                                            : false;
                                          const isSelected =
                                            currentQuestionId && questionAttemptsMap.has(currentQuestionId);
                                          const correctOption = currentQuestion.rightOption;

                                          // Determine option state
                                          const isCorrect = isSelected && option === correctOption;
                                          const isIncorrect = isSelected && option !== correctOption;

                                          return (
                                            <div
                                              key={index}
                                              className={cn(
                                                "relative flex items-center group transition-all duration-200 shadow-sm hover:shadow-lg rounded-xl border-2 px-3 py-3 sm:px-4 sm:py-4 cursor-pointer",
                                                isCorrect
                                                  ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
                                                  : isIncorrect
                                                    ? "border-red-500 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30"
                                                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary/60"
                                              )}
                                              style={{
                                                boxShadow:
                                                  isCorrect || isIncorrect
                                                    ? "0 4px 24px 0 rgba(0,0,0,0.07)"
                                                    : "0 2px 8px 0 rgba(0,0,0,0.03)",
                                                transition: "box-shadow 0.2s, border-color 0.2s",
                                              }}
                                            >
                                              <RadioGroupItem
                                                value={option}
                                                id={`option-${index}`}
                                                className="peer sr-only"
                                                disabled={isAnswered}
                                              />
                                              <Label
                                                htmlFor={`option-${index}`}
                                                className={cn(
                                                  "flex-1 font-medium transition-colors duration-200 text-base sm:text-lg",
                                                  isCorrect
                                                    ? "text-green-700 dark:text-green-300"
                                                    : isIncorrect
                                                      ? "text-red-700 dark:text-red-300"
                                                      : "text-gray-900 dark:text-gray-100 group-hover:text-primary"
                                                )}
                                                style={{
                                                  letterSpacing: "0.01em",
                                                  paddingLeft: "0.5rem",
                                                }}
                                              >
                                                {option}
                                              </Label>
                                              {isAnswered && (
                                                <div className="absolute right-4 sm:right-6 flex items-center">
                                                  {option === correctOption ? (
                                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 animate-pulse" />
                                                  ) : isSelected && option !== correctOption ? (
                                                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 animate-pulse" />
                                                  ) : null}
                                                </div>
                                              )}
                                              {!isAnswered && (
                                                <span className="absolute right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary">
                                                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                                    <circle
                                                      cx="12"
                                                      cy="12"
                                                      r="9"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      className="text-primary"
                                                    />
                                                  </svg>
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </RadioGroup>
                                    ) : (
                                      <Alert className="bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-200 mt-4">
                                        <AlertDescription className="flex items-center gap-2">
                                          <Info className="h-5 w-5 text-yellow-500" />
                                          No options available for this question.
                                        </AlertDescription>
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
                                          onClick={() =>
                                            handleTextToSpeech(
                                              translatedDescription ||
                                              currentQuestion.description ||
                                              ""
                                            )
                                          }
                                        >
                                          <Volume2
                                            className={`h-4 w-4 ${isSpeaking ? "text-blue-500" : ""
                                              }`}
                                          />
                                          <span className="hidden sm:inline">
                                            Text to Speech
                                          </span>
                                        </button>

                                        <div className="relative">
                                          <button
                                            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
                                            onClick={() =>
                                              setShowTranslationOptions(true)
                                            }
                                          >
                                            <Globe className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                              Translate
                                            </span>
                                            {selectedTranslation !== "en" && (
                                              <span className="text-xs font-medium ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                                {selectedTranslation.toUpperCase()}
                                              </span>
                                            )}
                                          </button>

                                          {showTranslationOptions && (
                                            <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg p-1 border border-gray-200">
                                              {[
                                                "en",
                                                "es",
                                                "fr",
                                                "de",
                                                "zh",
                                                "ja",
                                              ].map((lang) => (
                                                <button
                                                  key={lang}
                                                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedTranslation === lang
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                  onClick={async () => {
                                                    await translateText(
                                                      currentQuestion.description ||
                                                      "",
                                                      "des",
                                                      lang
                                                    );
                                                    flushSync(() =>
                                                      setSelectedTranslation(
                                                        lang
                                                      )
                                                    );
                                                  }}
                                                >
                                                  {lang === "en"
                                                    ? "English"
                                                    : lang === "es"
                                                      ? "Spanish"
                                                      : lang === "fr"
                                                        ? "French"
                                                        : lang === "de"
                                                          ? "German"
                                                          : lang === "zh"
                                                            ? "Chinese"
                                                            : lang === "ja"
                                                              ? "Japanese"
                                                              : lang}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div
                                        className="
    w-full
    bg-white
    border border-gray-200
    rounded-xl
    p-4
    text-gray-700
    text-sm
    leading-relaxed
    shadow-sm
    hover:shadow-md
    transition-all
    duration-200
    min-h-[8rem]  // replaces min-h-32 for a cleaner look
    max-h-64
    overflow-y-auto
    resize-none
    cursor-default
  "
                                      >
                                        {translatedDescription || currentQuestion.description ? (
                                          <p className="whitespace-pre-wrap">
                                            {translatedDescription || currentQuestion.description}
                                          </p>
                                        ) : (
                                          <p className="text-gray-400 italic">
                                            No Description Provicded...
                                          </p>
                                        )}
                                      </div>

                                    </div>
                                  </TabsContent>
                                  <TabsContent value="Solution">
                                    {/* Controls */}
                                    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 mt-3 mb-3">
                                      <button
                                        className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
                                        onClick={() =>
                                          handleTextToSpeech(
                                            translatedSolution ||
                                            currentQuestion.solution ||
                                            ""
                                          )
                                        }
                                      >
                                        <Volume2
                                          className={`h-4 w-4 ${isSpeaking ? "text-blue-500" : ""
                                            }`}
                                        />
                                        <span className="hidden sm:inline">
                                          Text to Speech
                                        </span>
                                      </button>

                                      <div className="relative">
                                        <button
                                          className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1.5"
                                          onClick={() =>
                                            setShowTranslationOptions(true)
                                          }
                                        >
                                          <Globe className="h-4 w-4" />
                                          <span className="hidden sm:inline">
                                            Translate
                                          </span>
                                          {selectedTranslation !== "en" && (
                                            <span className="text-xs font-medium ml-1 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                              {selectedTranslation.toUpperCase()}
                                            </span>
                                          )}
                                        </button>

                                        {showTranslationOptions && (
                                          <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg p-1 border border-gray-200">
                                            {[
                                              "en",
                                              "es",
                                              "fr",
                                              "de",
                                              "zh",
                                              "ja",
                                            ].map((lang) => (
                                              <button
                                                key={lang}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedTranslation === lang
                                                  ? "bg-blue-50 text-blue-600"
                                                  : "text-gray-700 hover:bg-gray-50"
                                                  }`}
                                                onClick={async () => {
                                                  await translateText(
                                                    currentQuestion.solution ||
                                                    "",
                                                    "sol",
                                                    lang
                                                  );
                                                  flushSync(() =>
                                                    setSelectedTranslation(lang)
                                                  );
                                                }}
                                              >
                                                {lang === "en"
                                                  ? "English"
                                                  : lang === "es"
                                                    ? "Spanish"
                                                    : lang === "fr"
                                                      ? "French"
                                                      : lang === "de"
                                                        ? "German"
                                                        : lang === "zh"
                                                          ? "Chinese"
                                                          : lang === "ja"
                                                            ? "Japanese"
                                                            : lang}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      id="q-description"
                                      className="
    w-full
    bg-white
    border border-gray-200
    rounded-xl
    p-4
    text-sm
    text-gray-700
    leading-relaxed
    shadow-sm
    hover:shadow-md
    transition-all
    duration-200
    max-h-56
    overflow-y-auto
  "
                                    >
                                      {translatedSolution || currentQuestion.solution ? (
                                        <p className="whitespace-pre-wrap">
                                          {translatedSolution || currentQuestion.solution}
                                        </p>
                                      ) : (
                                        <p className="text-gray-400 italic">
                                          Optional description or context for the question
                                        </p>
                                      )}
                                    </div>



                                  </TabsContent>
                                  <TabsContent value="Media">
                                    <div className="space-y-2"></div>
                                    <div className="flex flex-col md:flex-row gap-3">
                                      {currentQuestion.image && (
                                        <div className="w-full relative group">
                                          <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                              onClick={() =>
                                                window.open(
                                                  currentQuestion.image,
                                                  "_blank"
                                                )
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14L21 3"></path>
                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                              </svg>
                                            </button>
                                            <button
                                              className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                              onClick={() => {
                                                const elem = document.createElement("div");
                                                elem.style.position = "fixed";
                                                elem.style.top = "0";
                                                elem.style.left = "0";
                                                elem.style.width = "100vw";
                                                elem.style.height = "100vh";
                                                elem.style.backgroundColor = "rgba(0,0,0,0.9)";
                                                elem.style.zIndex = "9999";
                                                elem.style.display = "flex";
                                                elem.style.justifyContent = "center";
                                                elem.style.alignItems = "center";
                                                elem.style.overflow = "auto";

                                                // Use Image for preview
                                                const imgWrapper = document.createElement("div");
                                                imgWrapper.style.position = "relative";
                                                imgWrapper.style.maxWidth = "95vw";
                                                imgWrapper.style.maxHeight = "95vh";
                                                imgWrapper.style.display = "flex";
                                                imgWrapper.style.alignItems = "center";
                                                imgWrapper.style.justifyContent = "center";

                                                const img = document.createElement("img");
                                                img.src = currentQuestion.image || "";
                                                img.style.maxWidth = "95vw";
                                                img.style.maxHeight = "95vh";
                                                img.style.objectFit = "contain";

                                                imgWrapper.appendChild(img);
                                                elem.appendChild(imgWrapper);

                                                elem.onclick = () => document.body.removeChild(elem);
                                                document.body.appendChild(elem);
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                              </svg>
                                            </button>
                                          </div>
                                          <Image
                                            src={currentQuestion.image}
                                            alt="Question image"
                                            width={800}
                                            height={240}
                                            className="w-full h-48 sm:h-60 rounded-md object-cover cursor-pointer"
                                            onClick={() => {
                                              const elem = document.createElement("div");
                                              elem.style.position = "fixed";
                                              elem.style.top = "0";
                                              elem.style.left = "0";
                                              elem.style.width = "100vw";
                                              elem.style.height = "100vh";
                                              elem.style.backgroundColor = "rgba(0,0,0,0.9)";
                                              elem.style.zIndex = "9999";
                                              elem.style.display = "flex";
                                              elem.style.justifyContent = "center";
                                              elem.style.alignItems = "center";
                                              elem.style.overflow = "auto";

                                              // Use Image for preview
                                              const imgWrapper = document.createElement("div");
                                              imgWrapper.style.position = "relative";
                                              imgWrapper.style.maxWidth = "95vw";
                                              imgWrapper.style.maxHeight = "95vh";
                                              imgWrapper.style.display = "flex";
                                              imgWrapper.style.alignItems = "center";
                                              imgWrapper.style.justifyContent = "center";

                                              const img = document.createElement("img");
                                              img.src = currentQuestion.image || "";
                                              img.style.maxWidth = "95vw";
                                              img.style.maxHeight = "95vh";
                                              img.style.objectFit = "contain";

                                              imgWrapper.appendChild(img);
                                              elem.appendChild(imgWrapper);

                                              elem.onclick = () => document.body.removeChild(elem);
                                              document.body.appendChild(elem);
                                            }}
                                            priority
                                          />
                                        </div>
                                      )}

                                      {currentQuestion.video && (
                                        <div className="w-full relative group">
                                          <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                              onClick={() =>
                                                window.open(
                                                  getYouTubeEmbedUrl(
                                                    currentQuestion.video
                                                  ),
                                                  "_blank"
                                                )
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <path d="M15 3h6v6"></path>
                                                <path d="M10 14L21 3"></path>
                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                              </svg>
                                            </button>
                                            <button
                                              className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                              onClick={() => {
                                                const elem = document.createElement("div");
                                                elem.style.position = "fixed";
                                                elem.style.top = "0";
                                                elem.style.left = "0";
                                                elem.style.width = "100vw";
                                                elem.style.height = "100vh";
                                                elem.style.backgroundColor = "rgba(0,0,0,0.9)";
                                                elem.style.zIndex = "9999";
                                                elem.style.display = "flex";
                                                elem.style.justifyContent = "center";
                                                elem.style.alignItems = "center";
                                                elem.style.overflow = "auto";

                                                // Detect mobile and force landscape
                                                const isMobile =
                                                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                                                    navigator.userAgent
                                                  );
                                                const iframe = document.createElement("iframe");
                                                iframe.src = getYouTubeEmbedUrl(currentQuestion.video);
                                                iframe.style.border = "none";
                                                iframe.allowFullscreen = true;
                                                if (isMobile) {
                                                  iframe.style.width = "100vw";
                                                  iframe.style.height = "56.25vw"; // 16:9 aspect ratio
                                                  iframe.style.maxWidth = "100vw";
                                                  iframe.style.maxHeight = "56.25vw";
                                                  elem.style.alignItems = "flex-start";
                                                  elem.style.justifyContent = "center";
                                                } else {
                                                  iframe.style.width = "90vw";
                                                  iframe.style.height = "50vw";
                                                  iframe.style.maxWidth = "1200px";
                                                  iframe.style.maxHeight = "80vh";
                                                }

                                                elem.appendChild(iframe);

                                                // Add close button
                                                const closeBtn = document.createElement("button");
                                                closeBtn.innerHTML = "×";
                                                closeBtn.style.position = "absolute";
                                                closeBtn.style.top = "20px";
                                                closeBtn.style.right = "20px";
                                                closeBtn.style.fontSize = "30px";
                                                closeBtn.style.color = "white";
                                                closeBtn.style.background = "none";
                                                closeBtn.style.border = "none";
                                                closeBtn.style.cursor = "pointer";
                                                closeBtn.onclick = (e) => {
                                                  e.stopPropagation();
                                                  document.body.removeChild(elem);
                                                };

                                                elem.appendChild(closeBtn);
                                                document.body.appendChild(elem);
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                              </svg>
                                            </button>
                                          </div>
                                          <div className="aspect-w-16 aspect-h-9 w-full rounded-md overflow-hidden">
                                            <iframe
                                              src={getYouTubeEmbedUrl(currentQuestion.video)}
                                              className="w-full h-48 sm:h-60 rounded-md"
                                              allowFullScreen
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              style={{ aspectRatio: "16/9" }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {currentQuestion.shorts &&
                                      currentQuestion.shorts.length > 0 && (
                                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                          {currentQuestion.shorts.map(
                                            (short, index) => (
                                              <div
                                                key={index}
                                                className="relative group"
                                              >
                                                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button
                                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                                    onClick={() =>
                                                      window.open(
                                                        getYouTubeEmbedUrl(
                                                          short
                                                        ),
                                                        "_blank"
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="12"
                                                      height="12"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <path d="M15 3h6v6"></path>
                                                      <path d="M10 14L21 3"></path>
                                                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                                                    </svg>
                                                  </button>
                                                  <button
                                                    className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
                                                    onClick={() => {
                                                      const elem = document.createElement(
                                                        "div"
                                                      );
                                                      elem.style.position = "fixed";
                                                      elem.style.top = "0";
                                                      elem.style.left = "0";
                                                      elem.style.width = "100vw";
                                                      elem.style.height = "100vh";
                                                      elem.style.backgroundColor =
                                                        "rgba(0,0,0,0.9)";
                                                      elem.style.zIndex = "9999";
                                                      elem.style.display = "flex";
                                                      elem.style.justifyContent =
                                                        "center";
                                                      elem.style.alignItems =
                                                        "center";
                                                      elem.style.overflow = "auto";

                                                      // Detect mobile and force landscape
                                                      const isMobile =
                                                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                                                          navigator.userAgent
                                                        );
                                                      const iframe = document.createElement(
                                                        "iframe"
                                                      );
                                                      iframe.src = getYouTubeEmbedUrl(
                                                        short
                                                      );
                                                      iframe.style.border = "none";
                                                      iframe.allowFullscreen = true;
                                                      if (isMobile) {
                                                        iframe.style.width = "100vw";
                                                        iframe.style.height = "56.25vw";
                                                        iframe.style.maxWidth = "100vw";
                                                        iframe.style.maxHeight = "56.25vw";
                                                        elem.style.alignItems = "flex-start";
                                                        elem.style.justifyContent = "center";
                                                      } else {
                                                        iframe.style.width = "80vw";
                                                        iframe.style.height = "45vw";
                                                        iframe.style.maxWidth = "900px";
                                                        iframe.style.maxHeight = "80vh";
                                                      }

                                                      elem.appendChild(iframe);

                                                      // Add close button
                                                      const closeBtn = document.createElement(
                                                        "button"
                                                      );
                                                      closeBtn.innerHTML = "×";
                                                      closeBtn.style.position =
                                                        "absolute";
                                                      closeBtn.style.top = "20px";
                                                      closeBtn.style.right = "20px";
                                                      closeBtn.style.fontSize =
                                                        "30px";
                                                      closeBtn.style.color = "white";
                                                      closeBtn.style.background =
                                                        "none";
                                                      closeBtn.style.border =
                                                        "none";
                                                      closeBtn.style.cursor =
                                                        "pointer";
                                                      closeBtn.onclick = (
                                                        e
                                                      ) => {
                                                        e.stopPropagation();
                                                        document.body.removeChild(
                                                          elem
                                                        );
                                                      };

                                                      elem.appendChild(closeBtn);
                                                      document.body.appendChild(
                                                        elem
                                                      );
                                                    }}
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="12"
                                                      height="12"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"></path>
                                                    </svg>
                                                  </button>
                                                </div>
                                                <div className="aspect-w-9 aspect-h-16 w-full rounded-md overflow-hidden">
                                                  <iframe
                                                    src={getYouTubeEmbedUrl(
                                                      short
                                                    )}
                                                    className="w-full h-40 rounded-md"
                                                    allowFullScreen
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    style={{ aspectRatio: "9/16" }}
                                                  />
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </TabsContent>
                                  <TabsContent value="Code">
                                    {currentQuestion.code && (
                                      <CodeRunner
                                        code={currentQuestion.code}
                                        language={
                                          currentQuestion.codeLang || ""
                                          // ? "java"
                                          // : ""
                                        }
                                      />
                                    )}
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
                  <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center space-x-2 w-full sm:w-auto font-semibold"
                        style={{
                          color: theme.primary,
                          borderColor: theme.primary,
                          fontWeight: 600,
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>

                      <Button
                        onClick={handleNext}
                        disabled={currentQuestionIndex >= questions.length - 1}
                        className="flex items-center space-x-2 w-full sm:w-auto font-semibold"
                        style={{
                          background: theme.primary,
                          color: theme.white,
                          fontWeight: 600,
                        }}
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
