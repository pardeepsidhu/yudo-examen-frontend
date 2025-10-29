'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, Film, Link, Wand2, FileImage, FileVideo, Save, XCircle, PlayCircle, AlertCircle, RefreshCw, Settings, Eye, PlusIcon, Loader2 } from 'lucide-react';
import { useTheme } from '../context/theme.context';
import { cn } from '@/lib/utils';


// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CodeEditor } from './components/codeEditor';
import TagSelector from './components/TagSelector';
import { createTest, getMyTest, updataMyTest, addNewQuestion, updageMyQuestion, deleteMyQuestion } from '../api/test.api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { flushSync } from 'react-dom';
import { confirmAction } from '@/components/confirmAction';
import { genereateContent } from '../api/ai.api';
import Image from 'next/image';
import { Editor } from 'primereact/editor';
// Types based on mongoose schema
export type Question = {
  _id: string;
  title: string;
  codeLang?: string;
  code?: string;
  description?: string;
  options: string[];
  rightOption: string;
  image?: string;
  video?: string;
  shorts?: string[];
  solution?: string;
};

export default function CreateTestSeries() {
  const { theme } = useTheme();
  const router = useRouter();
  const [testId, setTestId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('testId');
      setTestId(id);
    }
    else {
      router.push('/login')
    }
  }, [router]);


  // Test series state
  const [testSeriesData, setTestSeriesData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    tags: [] as string[],
    credits: '',
    _id: ''
  });

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    _id: `question_${Date.now()}`,
    title: '',
    description: '',
    options: ['', '', '', ''],
    rightOption: '',
    image: '',
    video: '',
    shorts: [],
    solution: ''
  });

  // UI state
  const [activeTab, setActiveTab] = useState('basic');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);





  // Handle test series input change
  const handleTestSeriesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTestSeriesData(prev => ({ ...prev, [name]: value }));
  };


  const handleGeneratTestDes = async () => {
    if (!testSeriesData.title) {
      toast.error('Please add title first');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await genereateContent(` Generate a concise and engaging HTML-formatted description for a test series titled "<strong style='color:#2563eb;'>${testSeriesData.title}</strong>".  
The description should highlight the <b style='color:#1e40af;'>purpose</b>, <b style='color:#047857;'>content</b>, <b style='color:#92400e;'>target audience</b>, <b style='color:#9333ea;'>objectives</b>, and <b style='color:#dc2626;'>key features</b> of the test series.  
Mention what it includes, who it is for, and the skills or knowledge it helps assess.  
You can use multiple colors for emphasis and readability.  
Keep it short (4–6 lines), clear, and motivational.  
Use clean HTML tags such as <p>, <b>, <i>, <br>, <ul>, <li>, and <strong> for structure and formatting.  
Respond exactly in HTML format — no JSON, no extra wrapping, only the HTML code block.
`);

      const formatted = res.response
        .replace(/\\n/g, "<br>")
        .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(`\"\`\`\`html`, "")
        .replace(`\`\`\`\"`, "")

      setTestSeriesData({ ...testSeriesData, description: formatted });

    } catch (error) {
      console.log(error)
      toast.error("Failed generating AI Content");
    }
    finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle question input change
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };

  // Handle options change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  // Handle right answer selection
  const handleRightAnswerChange = (value: string) => {
    setCurrentQuestion(prev => ({ ...prev, rightOption: value }));
  };

  // Add question to the list

  const addQuestion = async () => {
    if (!testId) {
      toast.error("plase save test first");
      return;
    }
    if (!currentQuestion.title.trim() || !currentQuestion.rightOption) {
      toast.error('Please provide a question title and select the right answer');
      return;
    }

    try {
      const questionData = {
        ...currentQuestion,
        testSeriesId: testSeriesData._id
      };
      if (currentQuestion._id.startsWith("question")) {
        const res = await addNewQuestion(questionData);

        if (!res.success) {
          toast.error(res.message || 'Failed to add question');
          return;
        }
        else {
          toast.success('Question added successfully!');
          await hangleGetMyTest(testId);
          setCurrentQuestion({
            _id: `question_${Date.now()}`,
            title: '',
            description: '',
            options: ['', '', '', ''],
            rightOption: '',
            image: '',
            video: '',
            shorts: [],
            solution: ''
          });
        }
      }
      else {
        const res = await updageMyQuestion(questionData);
        if (!res.success) {
          toast.error(res.message || 'Failed to add question');
          return;
        }
        else {
          toast.success('Question added successfully!');
          // getMyTest(testId)
          flushSync(() => {
            setQuestions([...questions, currentQuestion])
          })

          setCurrentQuestion({
            _id: `question_${Date.now()}`,
            title: '',
            description: '',
            options: ['', '', '', ''],
            rightOption: '',
            image: '',
            video: '',
            shorts: [],
            solution: ''
          });
        }
      }
    }
    catch (error) {
      if (error)
        toast.error('Failed to add question');
    }
  }

  // Delete question
  const deleteQuestion = async (id: string) => {
    if (!testId) {
      toast.error("Please save test first");
      return;
    }
    try {
      const confirmed = await confirmAction("Are you sure you want to delete this question? ", theme, "This action can't be undone!");
      if (!confirmed) return;

      const res = await deleteMyQuestion(testId, id);
      if (!res.success) {
        toast.error(res.message || 'Failed to delete question');
        return;
      }

      toast.success('Question deleted successfully');
      setQuestions(prev => prev.filter(q => q._id !== id));
      if (currentQuestion._id === id) {
        setCurrentQuestion({
          _id: `question_${Date.now()}`,
          title: '',
          description: '',
          options: ['', '', '', ''],
          rightOption: '',
          image: '',
          video: '',
          shorts: [],
          solution: ''
        });
      }
    } catch (error) {
      if (error)
        toast.error('Failed to delete question');
    }
  };


  // Edit question
  const editQuestion = (question: Question) => {
    if (currentQuestion.title) {
      flushSync(() => {
        setQuestions([...questions, currentQuestion])
        setQuestions(prev => prev.filter(q => q._id !== question._id));
        setCurrentQuestion(question);
      })
    }
    else {
      setQuestions(prev => prev.filter(q => q._id !== question._id));
      setCurrentQuestion(question);
    }


    setActiveTab('basic');
  };

  // AI-generated description
  const generateDescription = async () => {
    if (!currentQuestion.title) {
      toast.error('Please enter a question title first');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const res = await genereateContent(
        `Generate a concise and visually engaging theoretical description for the following question: "<strong style='color:#2563eb;'>${currentQuestion.title}</strong>".  
The description should clearly explain the <b style='color:#1e40af;'>context</b>, <b style='color:#047857;'>what is being asked</b>, and the <b style='color:#92400e;'>background knowledge</b> needed to understand the question.  
Keep it short (5–8 lines), simple, and easy to read.  
Do not include any code — write only theory.  

You can use the following HTML tags and styles:  
<b>, <strong> — Bold  
<i>, <em> — Italic  
<u> — Underline  
<s>, <strike> — Strikethrough  
<sub> — Subscript  
<p> — Paragraph  
<br> — Line break  
<blockquote> — Block quote  
<pre> — Code block (formatted text, not executable)  
<h1>, <h2>, <h3> — Headings  
<ul>, <ol>, <li> — Lists  
You can also use inline styles for:  
color — Text color  
background-color — Highlight  
font-family — Font  
font-size — Font size  

Respond only in HTML format — no JSON or extra wrapping.
`

      );



      if (res.error || !res.response) {
        toast.error("Failed generating AI Content");
      } else {
        const formatted = res.response
          .replace(/\\n/g, "<br>")
          .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
          .replace(`\"\`\`\`html`, "")
          .replace(`\`\`\`\"`, "")

        setCurrentQuestion(prev => ({ ...prev, description: formatted }));
        toast.success('Description generated successfully!');
      }

    } catch (error) {
      if (error)
        toast.error("Failed generating AI Content");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI-generated options
  const generateOptions = async (): Promise<void> => {
    if (!currentQuestion.title) {
      toast.error('Please enter a title first');
      return;
    }

    setIsGeneratingAI(true);

    try {
      const res = await genereateContent(
        `Generate 4 multiple choice options for the following question: "${currentQuestion.title}".
        Include one correct answer and three plausible distractors.
        Format the response as plain text only, exactly like this:
        Option 1: ...
        Option 2: ...
        Option 3: ...
        Option 4: ...
        Correct Option: Option X
        Do not include any extra text or object formatting.`
      );

      // Handle case where response is a string wrapped in quotes with escaped newlines
      if (!res || !res.response) {
        toast.error("Failed generating AI Content");
        return;
      }

      // Clean the response - remove any surrounding quotes and unescape newlines
      let cleanedResponse = res.response;
      if (cleanedResponse.startsWith('"') && cleanedResponse.endsWith('"')) {
        cleanedResponse = JSON.parse(cleanedResponse);
      }

      // Split into lines and process
      const lines = cleanedResponse.trim().split('\n');

      // Extract options with improved regex to handle potential formatting issues
      const options: string[] = [];
      let correctOptionNumber: number | null = null;

      for (const line of lines) {
        // Match option lines
        const optionMatch = line.match(/^Option\s*(\d+)\s*:\s*(.+)$/i);

        if (optionMatch) {
          const optionNumber = parseInt(optionMatch[1]);
          const optionText = optionMatch[2].trim();
          // Store option text at index (optionNumber - 1)
          options[optionNumber - 1] = optionText;
        }

        // Match correct option line
        const correctMatch = line.match(/^Correct\s*Option\s*:\s*Option\s*(\d+)$/i);
        if (correctMatch) {
          correctOptionNumber = parseInt(correctMatch[1]);
        }
      }

      // Validate the parsed data
      const validOptions = options.filter(option => option !== undefined);

      if (validOptions.length !== 4 || correctOptionNumber === null || correctOptionNumber < 1 || correctOptionNumber > 4) {
        console.error("Parsing failed. Response:", cleanedResponse);
        throw new Error("Invalid response format: couldn't correctly identify options or correct answer");
      }

      // Get the correct option text
      const rightOption = options[correctOptionNumber - 1];

      // Shuffle options
      const shuffledOptions = [...validOptions].sort(() => Math.random() - 0.5);

      setCurrentQuestion(prev => ({
        ...prev,
        options: shuffledOptions,
        rightOption
      }));

      toast.success("Options generated successfully!");

    } catch (error) {
      if (error)
        toast.error("Failed to generate options. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };


  // Handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsGeneratingAI(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/testUserPardeep/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.secure_url) {
        if (isThumbnail) {
          setTestSeriesData(prev => ({ ...prev, thumbnail: data.secure_url }));
        } else {
          setCurrentQuestion(prev => ({ ...prev, image: data.secure_url }));
        }
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      if (error)
        toast.error('Error uploading image');
    } finally {
      setIsGeneratingAI(false);
    }
  };
  // Handle link input
  const handleLinkSubmit = (link: string) => {
    if (!link) return;

    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      if (link.includes('youtube.com/shorts')) {
        if (currentQuestion.shorts && currentQuestion.shorts.length >= 3) {
          toast.error('Maximum 3 shorts allowed');
          return;
        }
        setCurrentQuestion(prev => ({
          ...prev,
          shorts: [...(prev.shorts || []), link].slice(0, 3)
        }));
        toast.success('Shorts link added successfully!');
      } else {
        setCurrentQuestion(prev => ({ ...prev, video: link }));
        toast.success('Video link added successfully!');
      }
    } else {
      setCurrentQuestion(prev => ({ ...prev, image: link }));
      toast.success('Image link added successfully!');
    }
  };

  // Remove media
  const removeMedia = (type: 'image' | 'video' | 'shorts', index?: number) => {
    if (type === 'image') {
      setCurrentQuestion(prev => ({ ...prev, image: '' }));
    } else if (type === 'video') {
      setCurrentQuestion(prev => ({ ...prev, video: '' }));
    } else if (type === 'shorts' && typeof index === 'number') {
      setCurrentQuestion(prev => ({
        ...prev,
        shorts: prev.shorts ? prev.shorts.filter((_, i) => i !== index) : []
      }));
    }
  };


  // Save test series
  const saveTestSeries = async () => {

    if (!testSeriesData._id) {
      const res = await createTest(testSeriesData);
      console.log("testing", res)
      if (res.error) {
        toast.error(res.message)
      }
      else {
        setTestId(res.testSeries._id)
        toast.success(res.message)
        router.push(`/createTest?testId=${res.testSeries._id}`)
      }
    }
    else {
      const res = await updataMyTest(testSeriesData)
      console.log("testing", res)
      if (!res.success) {
        toast.error(res.message)
      }
      else {
        toast.success(res.message)
        setTestSeriesData(res.testSeries);
      }
    }
  };




  const getYouTubeEmbedUrl = (url: string | undefined): string | undefined => {
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
      if (error)
        return url;
    }
  };

  const generateSolution = async (): Promise<void> => {
    if (!currentQuestion.description) {
      toast.error('Please enter a question description first');
      return;
    }

    setIsGeneratingAI(true);

    try {
      const res: { response: string; error?: boolean } = await genereateContent(
        `
  
Generate a concise and engaging HTML-formatted solution for a question titled "<strong style='color:#2563eb;'>${currentQuestion.title} ${currentQuestion.description}</strong>".  

The solution should highlight the <b style='color:#1e40af;'>key concepts</b>, <b style='color:#047857;'>approach/methodology</b>, <b style='color:#92400e;'>important points</b>, and <b style='color:#dc2626;'>final answer</b>.  

Explain what the question asks, how to solve it, and the reasoning behind the solution.  
You can use multiple colors for emphasis and readability.  
Keep it clear, well-structured, and in simple language.  

**Special formatting requirement:** If the solution contains programming code, you MUST use this exact format:  
<div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">first line of code</div><div class="ql-code-block">second line of code</div><div class="ql-code-block"><br></div></div>

Use clean HTML tags such as <p>, <b>, <i>, <br>, <ul>, <li>, and <strong> for structure and formatting.  
Respond exactly in HTML format — no JSON, no extra wrapping, only the HTML code block.
`

      );

      if (res.error || !res.response) {
        toast.error("Failed generating AI Content");
        return;
      }

      const formatted = res.response
        .replace(/\\n/g, "<br>")
        .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        .replace(`\"\`\`\`html`, "")
        .replace(`\`\`\`\"`, "")

      setCurrentQuestion(prev => ({ ...prev, solution: formatted }));
      toast.success('Solution generated successfully!');

    } catch (error) {
      if (error)
        toast.error("Failed generating AI Content");
    } finally {
      setIsGeneratingAI(false);
    }
  };


  const hangleGetMyTest = async (testId: string) => {
    try {
      const res = await getMyTest(testId)

      if (!res.success) {
        toast.error(res.message)
      }
      else {
        setTestSeriesData(res.testSeries)
        setQuestions(res.testSeries.questions)
      }
    } catch (error) {
      console.log(error)
      toast.error("some error accred while fetching test")
    }
    finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    if (testId) {
      hangleGetMyTest(testId)
    }
    else {
      setInitialLoading(false)
    }
  }, [testId])



  // Loading State
  if (initialLoading) {
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



  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <div
        className="min-h-screen p-2 sm:p-4 md:p-6"
        style={{
          background: theme.neutral,

        }}
      >
        {/* Header */}
        <header className="mb-2 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-3">
            {/* Title with icon and gradient */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Create Test Series
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 rounded-full mt-1" />
              </div>
            </div>

            {/* Description with icon */}
            <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2 ml-1">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create a new test series and add questions
            </p>
          </div>

          {/* Enhanced Refresh Button */}
          <Button
            variant="outline"
            size="lg"
            className="hidden sm:block relative h-12 px-6 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border-2 hover:scale-105"
            style={{
              borderColor: '#6366f1',
              color: '#6366f1',
              backgroundColor: 'white',
            }}
            onClick={() => {
              if (testId) {
                hangleGetMyTest(testId);
              }
              toast.success("Test refreshed successfully");
            }}
          >
            {/* Hover gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <span className="hidden sm:inline">Refresh Test</span>
              <span className="inline sm:hidden">Refresh</span>
            </div>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column - Test Series Details */}
          <div className="lg:col-span-1">
            <Card className="shadow-2xl border-0 gap-1 rounded-md sm:rounded-xl overflow-hidden bg-white/90 backdrop-blur-xl relative">
              {/* Gradient top border */}
              <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-indigo-100 py-1 pb-2! pt-2!">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                    Test Series Details
                  </CardTitle>
                </div>

              </CardHeader>

              <CardContent className="space-y-2 p-4">
                {/* Title Field */}
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter test series title"
                    value={testSeriesData.title}
                    onChange={handleTestSeriesChange}
                    className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                  />
                </div>

                {/* Description Field with React Quill */}
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </Label>
                  <div className="border-2 border-indigo-100 rounded-lg overflow-hidden focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                    {/* <ReactQuill
          theme="snow"
          value={testSeriesData.description}
          onChange={(value) => {
            setTestSeriesData(prev => ({ ...prev, description: value }));
          }}
          placeholder="Describe your test series"
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'color': [] }, { 'background': [] }],
              ['link'],
              ['clean']
            ]
          }}
          className="bg-white"
          style={{ minHeight: '150px' }}
        /> */}
                    <Editor
                      value={testSeriesData?.description || ""}
                      onTextChange={(e) => {
                        setTestSeriesData((prev) => ({
                          ...prev,
                          description: e.htmlValue || "", // ✅ correct property for HTML content
                        }));
                      }}
                      style={{ height: "250px" }}
                    />

                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="relative h-9 px-3 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                      onClick={handleGeneratTestDes}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex items-center gap-2">
                        {isGeneratingAI ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-indigo-600">Generating...</span>
                          </>
                        ) : (
                          <>
                            <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                              <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            <span className="text-indigo-600">Generate with AI</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Category Field */}
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category"
                    name="category"
                    className="w-full h-10 rounded-lg border-2 border-indigo-100 bg-white px-3 pr-6 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition-all"
                    value={testSeriesData.category}
                    onChange={handleTestSeriesChange}
                  >
                    <option value="">Select a category</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science & Nature">Science & Nature</option>
                    <option value="Science: Computers">Science: Computers</option>
                    <option value="Science: Gadgets">Science: Gadgets</option>
                    <option value="Geography">Geography</option>
                    <option value="History">History</option>
                    <option value="English Language">English Language</option>
                    <option value="Reasoning & Aptitude">Reasoning & Aptitude</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Coding & Programming">Coding & Programming</option>
                    <option value="Environmental Studies">Environmental Studies</option>
                    <option value="Economics">Economics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Tags Field */}
                <div className="space-y-1">
                  <Label htmlFor="tags" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                  </Label>
                  <TagSelector
                    category={testSeriesData.category}
                    testSeriesData={testSeriesData}
                    setTestSeriesData={setTestSeriesData}
                  />
                </div>

                {/* Credits Field */}
                <div className="space-y-1">
                  <Label htmlFor="credits" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Credits
                  </Label>
                  <Input
                    id="credits"
                    name="credits"
                    placeholder="e.g. Dr. Smith, Prof. Johnson"
                    value={testSeriesData.credits}
                    onChange={handleTestSeriesChange}
                    className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                  />
                </div>

                {/* Thumbnail Field */}
                <div className="space-y-1">
                  <Label htmlFor="thumbnail" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Thumbnail
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      placeholder="Image URL or upload"
                      value={testSeriesData.thumbnail}
                      onChange={handleTestSeriesChange}
                      className="flex-1 h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 transition-all hover:scale-105 group"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
                          handleFileUpload(event, true);
                        };
                        input.click();
                      }}
                    >
                      {isGeneratingAI ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                      ) : (
                        <Upload className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                      )}
                    </Button>
                  </div>

                  {/* Thumbnail Preview */}
                  {testSeriesData.thumbnail ? (
                    <div className="relative rounded-lg overflow-hidden shadow-xl group">
                      <Image
                        src={testSeriesData.thumbnail}
                        alt="Thumbnail preview"
                        width={800}
                        height={240}
                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-2 text-white shadow-xl transition-all hover:scale-110"
                        onClick={() => setTestSeriesData(prev => ({ ...prev, thumbnail: '' }))}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      {/* Image info overlay */}
                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Thumbnail uploaded successfully
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-60 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-all cursor-pointer group">
                      <div className="p-3 rounded-full bg-white shadow-lg mb-3 group-hover:scale-110 transition-transform">
                        <FileImage className="h-10 w-10 text-indigo-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-600 text-center mb-1">No thumbnail available</p>
                      <p className="text-xs text-gray-500 text-center">Click upload button to add an image</p>
                    </div>
                  )}
                </div>
              </CardContent>


            </Card>

            {/* Questions List */}
            <Card className="mt-6 shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl relative">
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-indigo-100 py-2 pb-2!">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                      Questions
                    </CardTitle>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-white font-bold text-sm">{questions.length}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="max-h-[425px] overflow-y-auto custom-scrollbar p-4 gap-2">
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={question._id}
                        className="group relative border-2 border-indigo-100 rounded-lg p-4 bg-gradient-to-br from-white to-indigo-50/30 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="relative overflow-hidden group/edit"
                            onClick={() => editQuestion(question)}
                          >
                            <Badge className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all font-semibold">
                              <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Badge>
                          </button>
                          <button
                            className="relative overflow-hidden"
                            onClick={() => deleteQuestion(question._id)}
                          >
                            <Badge className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-all font-semibold">
                              <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </Badge>
                          </button>
                        </div>

                        {/* Question Header */}
                        <div className="mb-3 pr-32">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs">
                              Q{index + 1}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Question {index + 1}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 truncate text-base">{question.title}</h3>
                        </div>

                        {/* Media Badges */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {question.image && (
                            <Badge className="flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 border-2 border-purple-200 hover:bg-purple-200 transition-colors font-semibold">
                              <FileImage className="h-3.5 w-3.5" /> Image
                            </Badge>
                          )}
                          {question.video && (
                            <Badge className="flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-700 border-2 border-pink-200 hover:bg-pink-200 transition-colors font-semibold">
                              <FileVideo className="h-3.5 w-3.5" /> Video
                            </Badge>
                          )}
                          {question.shorts && question.shorts.length > 0 && (
                            <Badge className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 border-2 border-orange-200 hover:bg-orange-200 transition-colors font-semibold">
                              <FileVideo className="h-3.5 w-3.5" /> {question.shorts.length} Shorts
                            </Badge>
                          )}
                          <Badge className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm font-bold">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Option {question.options.indexOf(question.rightOption) + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 mb-4">
                      <FileImage className="h-12 w-12 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No questions added yet</h3>
                    <p className="text-sm text-gray-500 mb-1">Use the form on the right to add questions</p>
                    <p className="text-xs text-gray-400">Start building your test series now!</p>
                  </div>
                )}

                {/* Save Button */}
                <Button
                  className="w-full mt-6 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] relative overflow-hidden group border-0"
                  onClick={() => saveTestSeries()}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

                  <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                    <div className="p-1 rounded-md bg-white/20">
                      <Save className="h-4 w-4" />
                    </div>
                    <span>Save Test Series</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Question Editor */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 gap-1 rounded-md sm:rounded-xl overflow-hidden bg-white/90 backdrop-blur-xl relative ">
              {/* Gradient top border */}
              <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-indigo-100 py-2 pb-2! mb-2!">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                      {currentQuestion?._id?.includes('question_')
                        ? 'Add New Question'
                        : 'Edit Question'}
                    </CardTitle>
                  </div>

                  {/* Optional Right Badge (if you want to show total or ID) */}
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {currentQuestion?._id?.includes('question_') ? 'New' : 'Edit'}
                    </span>
                  </div>
                </div>
              </CardHeader>


              <CardContent className='px-2 sm:px-6'>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 rounded-sm shadow-sm p-1 gap-2 h-auto bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100">
                    {/* Basic Tab */}
                    <TabsTrigger
                      value="basic"
                      className="relative flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold py-2.5 px-4 rounded-sm transition-all duration-300 group overflow-hidden"
                      style={{
                        color: activeTab === "basic" ? "#ffffff" : "#6366f1",
                      }}
                    >
                      {/* Active background gradient */}
                      {activeTab === "basic" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                      )}

                      {/* Hover background for inactive state */}
                      {activeTab !== "basic" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}

                      {/* Shine effect */}
                      {activeTab === "basic" && (
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${activeTab === "basic"
                          ? "bg-white/20"
                          : "bg-indigo-100 group-hover:bg-indigo-200"
                          }`}
                      >
                        <Settings className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${activeTab === "basic"
                          ? "text-white"
                          : "text-indigo-600 group-hover:scale-110"
                          }`} />
                      </div>

                      {/* Text */}
                      <span className="relative z-10 hidden xs:inline">Basic</span>

                      {/* Active dot */}
                      {activeTab === "basic" && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </TabsTrigger>

                    {/* Media Tab */}
                    <TabsTrigger
                      value="media"
                      className="relative flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold py-2.5 px-4 rounded-sm transition-all duration-300 group overflow-hidden"
                      style={{
                        color: activeTab === "media" ? "#ffffff" : "#6366f1",
                      }}
                    >
                      {activeTab === "media" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                      )}
                      {activeTab !== "media" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      {activeTab === "media" && (
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                      )}
                      <div
                        className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${activeTab === "media"
                          ? "bg-white/20"
                          : "bg-indigo-100 group-hover:bg-indigo-200"
                          }`}
                      >
                        <ImageIcon className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${activeTab === "media"
                          ? "text-white"
                          : "text-indigo-600 group-hover:scale-110"
                          }`} />
                      </div>
                      <span className="relative z-10 hidden xs:inline">Media</span>
                      {activeTab === "media" && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </TabsTrigger>

                    {/* Preview Tab */}
                    <TabsTrigger
                      value="preview"
                      className="relative flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold py-2.5 px-4 rounded-sm transition-all duration-300 group overflow-hidden"
                      style={{
                        color: activeTab === "preview" ? "#ffffff" : "#6366f1",
                      }}
                    >
                      {activeTab === "preview" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                      )}
                      {activeTab !== "preview" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                      {activeTab === "preview" && (
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                      )}
                      <div
                        className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${activeTab === "preview"
                          ? "bg-white/20"
                          : "bg-indigo-100 group-hover:bg-indigo-200"
                          }`}
                      >
                        <Eye className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${activeTab === "preview"
                          ? "text-white"
                          : "text-indigo-600 group-hover:scale-110"
                          }`} />
                      </div>
                      <span className="relative z-10 hidden xs:inline">Preview</span>
                      {activeTab === "preview" && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="basic"
                    className="space-y-6 mt-0  border border-indigo-100 rounded-sm p-2 sm:p-5 shadow-sm"
                  >
                    {/* Question Title */}
                    <div className="space-y-1">
                      <Label
                        htmlFor="q-title"
                        className="text-sm font-bold text-gray-700 flex items-center gap-2"
                      >
                        <svg
                          className="h-4 w-4 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        Question <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="q-title"
                        name="title"
                        placeholder="Enter your question"
                        value={currentQuestion.title}
                        onChange={handleQuestionChange}
                        className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="q-description"
                          className="text-sm font-bold text-gray-700 flex items-center gap-2"
                        >
                          <svg
                            className="h-4 w-4 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h7"
                            />
                          </svg>
                          Description
                        </Label>

                        <Button
                          size="sm"
                          variant="outline"
                          className="relative h-8 px-3 text-xs font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                          onClick={generateDescription}
                          disabled={isGeneratingAI}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 flex items-center gap-1">
                            {isGeneratingAI ? (
                              <>
                                <svg
                                  className="animate-spin h-3 w-3 text-indigo-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 
                     0 5.373 0 12h4zm2 5.291A7.962 
                     7.962 0 014 12H0c0 3.042 1.135 
                     5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span className="text-indigo-600">Generating...</span>
                              </>
                            ) : (
                              <>
                                <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                  <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                                <span className="text-indigo-600">Generate with AI</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </div>

                      <div className="border-2 border-indigo-100 rounded-lg overflow-hidden focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                        <Editor
                          value={currentQuestion?.description || ""}
                          onTextChange={(e) => {
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              description: e.htmlValue || "",
                            }));
                          }}
                          style={{ height: "250px" }}
                        />
                      </div>
                    </div>

                    {/* Solution */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="q-solution"
                          className="text-sm font-bold text-gray-700 flex items-center gap-2"
                        >
                          <svg
                            className="h-4 w-4 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h7"
                            />
                          </svg>
                          Solution Details
                        </Label>

                        <Button
                          size="sm"
                          variant="outline"
                          className="relative h-8 px-3 text-xs font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                          onClick={generateSolution}
                          disabled={isGeneratingAI}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 flex items-center gap-1">
                            {isGeneratingAI ? (
                              <>
                                <svg
                                  className="animate-spin h-3 w-3 text-indigo-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 
                     0 5.373 0 12h4zm2 5.291A7.962 
                     7.962 0 014 12H0c0 3.042 1.135 
                     5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span className="text-indigo-600">Generating...</span>
                              </>
                            ) : (
                              <>
                                <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                  <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                                <span className="text-indigo-600">Generate with AI</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </div>

                      <div className="border-2 border-indigo-100 rounded-lg overflow-hidden focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
                        <Editor
                          value={currentQuestion?.solution || ""}
                          onTextChange={(e) => {
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              solution: e.htmlValue || "",
                            }));
                          }}
                          style={{ height: "250px" }}
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Options */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <svg
                            className="h-4 w-4 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Options <span className="text-red-500">*</span>
                        </Label>

                        <Button
                          size="sm"
                          variant="outline"
                          className="relative h-8 px-3 text-xs font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                          onClick={generateOptions}
                          disabled={isGeneratingAI}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 flex items-center gap-1">
                            {isGeneratingAI ? (
                              <>
                                <svg
                                  className="animate-spin h-3 w-3 text-indigo-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 
                     0 5.373 0 12h4zm2 5.291A7.962 
                     7.962 0 014 12H0c0 3.042 1.135 
                     5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                <span className="text-indigo-600">Generating...</span>
                              </>
                            ) : (
                              <>
                                <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                  <Wand2 className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                                <span className="text-indigo-600">Generate with AI</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </div>

                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleRightAnswerChange(option)}
                            className={`relative mt-2 size-4 rounded-full border-2 ${currentQuestion.rightOption === option
                              ? "border-indigo-500 ring-2 ring-indigo-300"
                              : "border-indigo-200"
                              } transition-all`}
                          >
                            {currentQuestion.rightOption === option && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-indigo-500 rounded-full w-2 h-2" />
                              </span>
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            <Label htmlFor={`option-${index}`} className="text-sm font-semibold text-gray-700">
                              Option {index + 1}{" "}
                              {currentQuestion.rightOption === option && (
                                <Badge
                                  style={{
                                    backgroundColor: theme.accent,
                                    color: "black",
                                  }}
                                >
                                  Correct
                                </Badge>
                              )}
                            </Label>
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Enter option ${index + 1}`}
                              className="border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                            />
                          </div>
                        </div>
                      ))}

                      {!currentQuestion.rightOption &&
                        currentQuestion.options.some((o) => o.trim() !== "") && (
                          <Alert className="bg-amber-50 border-amber-300 mt-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                            <AlertDescription className="text-amber-600 text-sm">
                              Please select the correct answer option
                            </AlertDescription>
                          </Alert>
                        )}
                    </div>

                    <Separator className="my-4" />

                    <CodeEditor
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}
                    />
                  </TabsContent>


                  <TabsContent value="media" className="space-y-6 mt-0">
                    {/* Image Section */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-xl shadow-xl border border-indigo-100">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                              <FileImage className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="hidden sm:block text-lg font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                              Question Image
                            </h3>
                            <h3 className=" sm:hidden text-sm font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                              Image
                            </h3>
                          </div>

                          {!currentQuestion.image ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="relative h-9 px-2 sm:px-4 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
                                    handleFileUpload(event, false);
                                  };
                                  input.click();
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-center gap-2">
                                  <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                    <Upload className="h-3.5 w-3.5 text-indigo-600" />
                                  </div>
                                  <span className="text-indigo-600">Upload</span>
                                </div>
                              </Button>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="relative h-9 px-2 sm:px-4 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 flex items-center gap-2">
                                      <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                        <Link className="h-3.5 w-3.5 text-indigo-600" />
                                      </div>
                                      <span className="hidden sm:block text-indigo-600">Use Link</span>
                                      <span className="sm:hidden text-indigo-600">Link</span>
                                    </div>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                      Add Image URL
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-bold text-gray-700">Image URL</Label>
                                      <Input
                                        placeholder="https://example.com/image.jpg"
                                        id="link-input"
                                        className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        const input = document.getElementById('link-input') as HTMLInputElement;
                                        handleLinkSubmit(input.value);
                                      }}
                                      className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                    >
                                      Add Image
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => removeMedia('image')}
                              className="h-9 px-4 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </Button>

                          )}
                        </div>

                        {currentQuestion.image ? (
                          <div className="relative rounded-lg overflow-hidden shadow-xl group">
                            <Image
                              src={currentQuestion.image}
                              alt="Question image"
                              width={800}
                              height={320}
                              className="w-full h-70 sm:h-95 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                              style={{ objectFit: 'cover' }}
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Image uploaded successfully
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="relative w-full h-70 sm:h-95 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-400 transition-all border-2 border-dashed border-indigo-200"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
                                handleFileUpload(event, false);
                              };
                              input.click();
                            }}
                          >
                            <div className="p-3 rounded-full bg-white shadow-lg mb-3 group-hover:scale-110 transition-transform">
                              <FileImage className="h-10 w-10 text-indigo-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 text-center mb-1">Add Question Image</p>
                            <p className="text-xs text-gray-500 text-center">Click to upload or paste link</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Section */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-xl shadow-xl border border-indigo-100">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                              <Film className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-md  sm:text-lg font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                              YouTube Video
                            </h3>
                          </div>

                          {!currentQuestion.video ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="relative h-9 px-4 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="relative z-10 flex items-center gap-2">
                                    <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                      <Link className="h-3.5 w-3.5 text-indigo-600" />
                                    </div>
                                    <span className="hidden sm:block text-indigo-600">Add Video Link</span>
                                    <span className="sm:hidden text-indigo-600">Link</span>
                                  </div>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Add Video URL
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">Video URL</Label>
                                    <Input
                                      placeholder="https://youtube.com/watch?v=..."
                                      id="video-link-input"
                                      className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      const input = document.getElementById('video-link-input') as HTMLInputElement;
                                      if (input) {
                                        handleLinkSubmit(input.value);
                                      }
                                    }}
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                  >
                                    Add Video
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <div className="flex gap-2">



                              <Button
                                size="sm"
                                onClick={() => removeMedia('video')}
                                className="flex h-9 px-4 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 items-center gap-2"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </Button>

                            </div>
                          )}
                        </div>

                        {currentQuestion.video ? (
                          <div className="relative w-full h-70 sm:h-95 bg-gray-100 rounded-lg overflow-hidden shadow-xl">
                            <iframe
                              src={getYouTubeEmbedUrl(currentQuestion.video)}
                              className="w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-70 sm:h-95 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-all">
                            <div className="p-3 rounded-full bg-white shadow-lg mb-3">
                              <Film className="h-10 w-10 text-indigo-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 text-center mb-1">Add YouTube Video</p>
                            <p className="text-xs text-gray-500 text-center">Paste a YouTube video link</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shorts Section */}
                    <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-xl shadow-xl border border-indigo-100">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
                              <Film className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-md sm:text-lg font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                              YouTube Shorts <span className="text-sm text-gray-500">(max 3)</span>
                            </h3>
                          </div>

                          {(!currentQuestion.shorts || currentQuestion.shorts.length < 3) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="relative h-9 px-4 text-sm font-semibold border-2 border-indigo-200 hover:border-indigo-400 rounded-lg overflow-hidden group transition-all hover:scale-105"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <div className="relative z-10 flex items-center gap-2">
                                    <div className="p-1 rounded-md bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                                      <Link className="h-3.5 w-3.5 text-indigo-600" />
                                    </div>
                                    <span className="hidden sm:block text-indigo-600">Add Short</span>
                                    <span className=" sm:hidden text-indigo-600">Link</span>
                                  </div>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                    Add YouTube Short URL
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700">YouTube Short URL</Label>
                                    <Input
                                      placeholder="https://youtube.com/shorts/..."
                                      id="shorts-link-input"
                                      className="h-10 border-2 border-indigo-100 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 rounded-lg transition-all"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      const input = document.getElementById('shorts-link-input') as HTMLInputElement;
                                      if (input) {
                                        handleLinkSubmit(input.value);
                                      }
                                    }}
                                    className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                  >
                                    Add Short
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>

                        <div className="flex sm:grid  flex-wrap grid-cols-3 gap-3">
                          {currentQuestion.shorts && currentQuestion.shorts.map((short, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden shadow-xl group">
                              <iframe
                                src={getYouTubeEmbedUrl(short)}
                                className="w-full h-84 rounded-lg border-2 border-indigo-100"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              />
                              <button
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 text-white shadow-xl transition-all hover:scale-110 "
                                onClick={() => removeMedia('shorts', index)}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}

                          {(!currentQuestion.shorts || currentQuestion.shorts.length < 3) &&
                            Array.from({ length: 3 - (currentQuestion.shorts?.length || 0) }).map((_, index) => (
                              <div
                                key={`placeholder-${index}`}
                                className="relative w-full h-84 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex flex-col items-center justify-center cursor-pointer group hover:border-indigo-400 transition-all border-2 border-dashed border-indigo-200"
                              >
                                <div className="p-3 rounded-full bg-white shadow-lg mb-2 group-hover:scale-110 transition-transform">
                                  <Film className="h-8 w-8 text-indigo-400" />
                                </div>
                                <p className="text-xs font-semibold text-gray-600 text-center px-2">Add Short</p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-6 mt-6">
                    {/* Question Title */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border-2 border-indigo-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {currentQuestion.title}
                      </h3>
                    </div>

                    {/* Description Section */}
                    {currentQuestion.description && (
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          Description
                        </Label>
                        {/* <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border-2 border-indigo-100 max-h-[300px] overflow-y-auto custom-scrollbar"> */}
                        {/* <div
          className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: currentQuestion.description as TrustedHTML }}
        /> */}
                        <Editor readOnly showHeader={false} value={currentQuestion.description || ''}
                          className='bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-2 sm:p-4 border-2 border-indigo-100 max-h-[300px] overflow-y-auto custom-scrollbar'
                        />
                        {/* </div> */}
                      </div>
                    )}

                    {/* Solution Section */}
                    {currentQuestion.solution && (
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Solution
                        </Label>
                        <Editor readOnly showHeader={false} value={currentQuestion?.solution || ''}
                          className='bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-2 sm:p-4 border-2 border-indigo-100 max-h-[300px] overflow-y-auto custom-scrollbar'
                        />
                      </div>
                    )}

                    {/* Media Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentQuestion.image && (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Image
                          </Label>
                          <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 shadow-lg group">
                            <Image
                              src={currentQuestion.image}
                              alt="Question image"
                              width={800}
                              height={240}
                              className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                              style={{ objectFit: 'cover' }}
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}

                      {currentQuestion.video && (
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <svg className="h-4 w-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Video
                          </Label>
                          <div className="relative rounded-lg overflow-hidden border-2 border-pink-200 shadow-lg">
                            <iframe
                              src={getYouTubeEmbedUrl(currentQuestion.video)}
                              className="w-full h-60 rounded-lg"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shorts Section */}
                    {currentQuestion.shorts && currentQuestion.shorts.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                          Shorts ({currentQuestion.shorts.length})
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {currentQuestion.shorts.map((short, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border-2 border-orange-200 shadow-lg">
                              <iframe
                                src={getYouTubeEmbedUrl(short)}
                                className="w-full h-48 rounded-lg"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              />
                              <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-md">
                                Short {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Options Section */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Options
                      </Label>
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className={cn(
                              'relative p-4 rounded-lg border-2 transition-all duration-200 group',
                              currentQuestion.rightOption === option
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md'
                                : 'bg-white border-indigo-100 hover:border-indigo-200 hover:shadow-sm'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                                currentQuestion.rightOption === option
                                  ? 'bg-green-500 text-white'
                                  : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
                              )}>
                                {String.fromCharCode(65 + index)}
                              </div>
                              <div className="flex-1 text-sm font-medium text-gray-800">
                                {option}
                              </div>
                              {currentQuestion.rightOption === option && (
                                <div className="flex-shrink-0">
                                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>


                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button
              className="w-full mt-6 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] relative overflow-hidden group border-0"
              onClick={addQuestion}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

              <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                <div className="p-1 rounded-md bg-white/20">
                  <PlusIcon className="h-4 w-4" />
                </div>
                <span>Add Current Question</span>
              </div>
            </Button>
          </div>
        </div>



      </div>
      <style jsx global>{`
    .ql-toolbar {
      border: none !important;
      border-bottom: 1px solid #e0e7ff !important;
      background: #f8fafc !important;
    }
    .ql-container {
      border: none !important;
      font-size: 14px !important;
      min-height: 150px !important;
    }
    .ql-editor {
      min-height: 150px !important;
    }
    .ql-editor.ql-blank::before {
      color: #9ca3af !important;
      font-style: normal !important;
    }


    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, #818cf8, #60a5fa);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #6366f1, #3b82f6);
    }

      .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, #818cf8, #60a5fa);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #6366f1, #3b82f6);
    }
    .prose h1, .prose h2, .prose h3, .prose h4 {
      color: #1f2937;
      font-weight: 700;
    }
    .prose p {
      color: #374151;
    }
    .prose ul, .prose ol {
      color: #374151;
    }
    .prose code {
      background: #e0e7ff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    .prose pre {
      background: #1f2937;
      border-radius: 8px;
      padding: 1rem;
    }
  `}</style>
    </Suspense>
  );
}