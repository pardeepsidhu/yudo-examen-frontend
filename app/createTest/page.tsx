'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { Plus, Trash2, Upload, Film, Link, Wand2, FileImage, FileVideo, Save, XCircle, PlayCircle, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState('');




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
      const res = await genereateContent(
        `Generate a concise and well-written description for a test series titled "${testSeriesData.title}". 
        The description should briefly cover the purpose, content, target audience, and key features. 
        Explain what the test series includes, who it's for, its objectives, test structure, and the skills or knowledge assessed. 
        Keep it short and engaging. Use \\n for new lines and \\t for indentation where needed. 
        Respond with plain text only — no objects, keys, or extra formatting.`
      );

      const formatted = res.response
        .replace(/\\\\n/g, '\n')  // Handle escaped backslashes (\\n)
        .replace(/\\n/g, '\n')    // Handle \n
        .replace(/\\\\t/g, '\t')  // Handle \\t
        .replace(/\\t/g, '\t');   // Handle \t

      setTestSeriesData({ ...testSeriesData, description: formatted });

    } catch (error) {
      if (error)
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
        `Generate a clear and helpful theoretical description for the following question: "${currentQuestion.title}". 
      try to write in little short don't write too much content. The description should explain the context, what is being asked, and any background knowledge a student would need to understand the question. 
      Do not include code, even if it is a coding question—write only theory. 
      Use \\n and \\t where appropriate for formatting. 
      Respond with plain text only — do not wrap the response in any object or extra formatting.`
      );



      if (res.error || !res.response) {
        toast.error("Failed generating AI Content");
      } else {
        const formatted = res.response
          .replace(/\\\\n/g, '\n')  // Escaped backslashes
          .replace(/\\n/g, '\n')
          .replace(/\\\\t/g, '\t')
          .replace(/\\t/g, '\t');

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

  // Preview video
  const handleVideoPreview = (url: string) => {
    setPreviewVideo(url);
    setIsVideoPreviewOpen(true);
  };

  // Save test series
  const saveTestSeries = async () => {

    if (!testSeriesData._id) {
      const res = await createTest(testSeriesData);
      if (res.error) {
        toast.error(res.message)
      }
      else {
        toast.success(res.message)
        router.push(`/createTest?testId=${res.testSeries._id}`)
      }
    }
    else {
      const res = await updataMyTest(testSeriesData)
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
    if (!currentQuestion.title) {
      toast.error('Please enter a question title first');
      return;
    }

    setIsGeneratingAI(true);

    try {
      const res: { response: string; error?: boolean } = await genereateContent(
        `Generate a clear, detailed, and step-by-step solution for the following question: "${currentQuestion.title}". 
        The solution should explain the reasoning, steps, and final answer. 
        Use \\n for new lines and \\t for indentation where needed. 
        Respond with plain text only. Do not wrap the response in any object or formatting.`
      );

      if (res.error || !res.response) {
        toast.error("Failed generating AI Content");
        return;
      }

      const formatted = res.response
        .replace(/\\\\n/g, '\n')  // Handle escaped backslashes
        .replace(/\\n/g, '\n')
        .replace(/\\\\t/g, '\t')
        .replace(/\\t/g, '\t');

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
      if (error)
        toast.error("some error accred while fetching test")
    }
  }
  useEffect(() => {
    if (testId) {
      hangleGetMyTest(testId)
    }
  }, [testId])

  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <div
        className="min-h-screen p-2 sm:p-4 md:p-6"
        style={{
          background: theme.neutral,

        }}
      >
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
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
    className="relative h-12 px-6 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border-2 hover:scale-105"
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
           <Card className="shadow-2xl border-0 gap-1 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl relative">
  {/* Gradient top border */}
  <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
  
  <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-indigo-100 py-1">
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
        className="w-full h-10 rounded-lg border-2 border-indigo-100 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none transition-all"
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
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium" style={{ color: theme.primary }}>
                  Questions ({questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className='max-h-100 overflow-y-scroll'>
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question._id} className="border rounded-md p-3 relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => editQuestion(question)}
                          >
                            <Badge
                              className="cursor-pointer"
                              style={{ backgroundColor: theme.tertiary, color: 'black' }}
                            >
                              Edit
                            </Badge>
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteQuestion(question._id)}
                          >
                            <Badge
                              variant="destructive"
                              className="cursor-pointer"
                            >
                              Delete
                            </Badge>
                          </button>
                        </div>

                        <div className="mb-3 pr-16">
                          <span className="font-medium text-sm text-gray-500">Question {index + 1}</span>
                          <h3 className="font-medium truncate">{question.title}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {question.image && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileImage className="h-3 w-3" /> Image
                            </Badge>
                          )}
                          {question.video && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileVideo className="h-3 w-3" /> Video
                            </Badge>
                          )}
                          {question.shorts && question.shorts.length > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileVideo className="h-3 w-3" /> {question.shorts.length} Shorts
                            </Badge>
                          )}
                          <Badge
                            className="flex items-center gap-1"
                            style={{ backgroundColor: theme.accent, color: 'black' }}
                          >
                            {question.options.indexOf(question.rightOption) + 1} ✓
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No questions added yet</p>
                    <p className="text-sm mt-1">Use the form on the right to add questions</p>
                  </div>
                )}

                <Button
                  className="w-full mt-4"
                  variant="outline"
                  style={{ borderColor: theme.primary, color: theme.primary }}
                  onClick={() => saveTestSeries()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Test Series
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Question Editor */}
          <div className="lg:col-span-2">
            <Card
              className="shadow-lg"
              style={{
                background: theme.white,
                borderColor: theme.primary + "30",
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium" style={{ color: theme.primary }}>
                  {currentQuestion?._id?.includes('question_') ? 'Add New Question' : 'Edit Question'}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="q-title">Question <span className="text-red-500">*</span></Label>
                      <Input
                        id="q-title"
                        name="title"
                        placeholder="Enter your question"
                        value={currentQuestion.title}
                        onChange={handleQuestionChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="q-description">Description</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center gap-1 h-8"
                          onClick={generateDescription}
                          disabled={isGeneratingAI}
                        >
                          {isGeneratingAI ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </span>
                          ) : (
                            <>
                              <Wand2 className="h-3 w-3" /> Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id="q-description"
                        name="description"
                        placeholder="Optional description or context for the question"
                        value={currentQuestion.description}
                        onChange={handleQuestionChange}
                        rows={5}
                        className='max-h-100'
                      />
                    </div>

                    {/* <Separator className="my-4" /> */}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="q-solution">Solution Details</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center gap-1 h-8"
                          onClick={generateSolution}
                          disabled={isGeneratingAI}
                        >
                          {isGeneratingAI ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </span>
                          ) : (
                            <>
                              <Wand2 className="h-3 w-3" /> Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id="q-solution"
                        name="solution"
                        placeholder="Enter detailed solution for this question"
                        value={currentQuestion.solution || ''}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, solution: e.target.value }))}
                        rows={8}
                        className="font-mono text-sm max-h-100"

                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Options <span className="text-red-500">*</span></Label>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center gap-1 h-8"
                          onClick={generateOptions}
                          disabled={isGeneratingAI}
                        >
                          {isGeneratingAI ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </span>
                          ) : (
                            <>
                              <Wand2 className="h-3 w-3" /> Generate with AI
                            </>
                          )}
                        </Button>
                      </div>

                      <RadioGroup value={currentQuestion.rightOption} onValueChange={handleRightAnswerChange}>
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 space-y-2">
                            <RadioGroupItem value={option} id={`option-${index}`} className="self-start mt-3" />
                            <div className="flex-1 space-y-1">
                              <Label htmlFor={`option-${index}`} className="text-sm">
                                Option {index + 1} {currentQuestion.rightOption === option &&
                                  <Badge style={{ backgroundColor: theme.accent, color: 'black' }}>Correct</Badge>
                                }
                              </Label>
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Enter option ${index + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      {(!currentQuestion.rightOption && currentQuestion.options.some(o => o.trim() !== '')) && (
                        <Alert className="bg-amber-50 border-amber-300 mt-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                          <AlertDescription className="text-amber-600 text-sm">
                            Please select the correct answer option
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <Separator className='my-2' />
                    <CodeEditor currentQuestion={currentQuestion} setCurrentQuestion={setCurrentQuestion} />
                  </TabsContent>

                  <TabsContent value="media" className="space-y-6 mt-0">
                    {/* Image Section */}
                    <div className="space-y-3 pb-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Image</Label>

                        {!currentQuestion.image ? (
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs flex items-center gap-1 h-8 px-2"
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
                                    <Upload className="h-3 w-3" /> Upload
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Upload an image for this question</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs flex items-center gap-1 h-8 px-2"
                                >
                                  <Link className="h-3 w-3" /> Use Link
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Add Image URL</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Image URL</Label>
                                    <Input
                                      placeholder="https://example.com/image.jpg"
                                      id="link-input"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      const input = document.getElementById('link-input') as HTMLInputElement;
                                      handleLinkSubmit(input.value);
                                    }}
                                    style={{ backgroundColor: theme.primary }}
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
                            variant="destructive"
                            className="text-xs h-8"
                            onClick={() => removeMedia('image')}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Remove
                          </Button>
                        )}
                      </div>

                      {currentQuestion.image ? (
                        <div className="mt-2">
                          <Image
                            src={currentQuestion.image}
                            alt="Question image"
                            width={800}
                            height={320}
                            className="w-full h-70 sm:h-95 rounded-md object-cover"
                            style={{ objectFit: 'cover' }}
                            priority
                          />
                        </div>
                      ) : (
                        <div
                          className="relative w-full h-70 sm:h-95 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-200 border border-dashed border-gray-300"
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
                          <FileImage className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Add Image</p>
                          <p className="text-xs text-gray-400 mt-1">Click to upload or paste link</p>
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-blue-600 flex items-center justify-center">
                            <p className="text-white text-xs font-medium">Image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Section */}
                    <div className="space-y-3 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Video</Label>

                        {!currentQuestion.video ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs flex items-center gap-1 h-8 px-2"
                              >
                                <Link className="h-3 w-3" /> Add Video Link
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Add Video URL</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Video URL</Label>
                                  <Input
                                    placeholder="https://youtube.com/watch?v=..."
                                    id="video-link-input"
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
                                  style={{ backgroundColor: theme.primary }}
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
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => handleVideoPreview(currentQuestion.video || '')}
                            >
                              <PlayCircle className="h-3 w-3 mr-1" /> Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs h-8"
                              onClick={() => removeMedia('video')}
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> Remove
                            </Button>
                          </div>
                        )}
                      </div>

                      {currentQuestion.video ? (
                        <div className="relative w-full h-70 sm:h-95 bg-gray-100 rounded-md overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(currentQuestion.video)}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-70 sm:h-95 bg-gray-100 rounded-md flex flex-col items-center justify-center border border-dashed border-gray-300">
                          <Film className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Add Video</p>
                          <p className="text-xs text-gray-400 mt-1">Add a YouTube video link</p>
                          <div className="absolute bottom-0 left-0 right-0 h-6 bg-red-600 flex items-center justify-center">
                            <p className="text-white text-xs font-medium">YouTube Video</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shorts Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base font-medium">Shorts (max 3)</Label>

                        {(!currentQuestion.shorts || currentQuestion.shorts.length < 3) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs flex items-center gap-1 h-8 px-2"
                              >
                                <Link className="h-3 w-3" /> Add Short
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Add YouTube Short URL</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>YouTube Short URL</Label>
                                  <Input
                                    placeholder="https://youtube.com/shorts/..."
                                    id="shorts-link-input"
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
                                  style={{ backgroundColor: theme.primary }}
                                >
                                  Add Short
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>

                      {/* Shorts display section */}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {/* Existing shorts */}
                        {currentQuestion.shorts && currentQuestion.shorts.map((short, index) => (
                          <div key={index} className="relative">
                            <iframe
                              src={getYouTubeEmbedUrl(short)}
                              className="w-full h-84 rounded-md object-cover border border-gray-200"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                            <button
                              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                              onClick={() => removeMedia('shorts', index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {/* Empty placeholder slots */}
                        {(!currentQuestion.shorts || currentQuestion.shorts.length < 3) &&
                          Array.from({ length: 3 - (currentQuestion.shorts?.length || 0) }).map((_, index) => (
                            <div
                              key={`placeholder-${index}`}
                              className="relative w-full h-84 bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-200 border border-dashed border-gray-300"
                              onClick={() => {
                                const input = document.getElementById('shorts-link-input');
                                if (input) {
                                  input.focus();
                                }
                              }}
                            >
                              <Film className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">Add YouTube Short</p>
                              <p className="text-xs text-gray-400 mt-1">Click to paste link</p>
                              <div className="absolute bottom-0 left-0 right-0 h-6 bg-red-600 flex items-center justify-center">
                                <p className="text-white text-xs font-medium">YouTube Shorts</p>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>


                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-700">{currentQuestion.title}</h3>
                      <h4 className='text-gray-600' >Description :</h4>
                      {currentQuestion.description && (
                        <Textarea
                          id="q-solution"
                          name="solution"
                          disabled={true}
                          placeholder="Enter detailed solution for this question"
                          value={currentQuestion.description || ''}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, solution: e.target.value }))}
                          rows={8}
                          className="font-mono text-sm !cursor-pointer"

                        />
                        // <p className="text-sm text-gray-600"><span className='text-md text-gray-700'>Description : </span> {currentQuestion.description}</p>
                      )}
                      <h4 className='text-gray-600'>Solution :</h4>
                      {currentQuestion.solution && (

                        <Textarea
                          id="q-solution"
                          name="solution"
                          disabled={true}
                          placeholder="Enter detailed solution for this question"
                          value={currentQuestion.solution || ''}
                          onChange={(e) => setCurrentQuestion(prev => ({ ...prev, solution: e.target.value }))}
                          rows={8}
                          className="font-mono text-sm !cursor-pointer"

                        />
                      )}
                    </div>
                    <div className='flex  gap-3'>
                      {currentQuestion.image && (
                        <div className="w-full">
                          <Image
                            src={currentQuestion.image}
                            alt="Question image"
                            width={800}
                            height={240}
                            className="w-full h-60 rounded-md object-cover"
                            style={{ objectFit: 'cover' }}
                            priority
                          />
                        </div>
                      )}

                      {currentQuestion.video && (
                        <div className="w-full">
                          <iframe
                            src={getYouTubeEmbedUrl(currentQuestion.video)}
                            className="w-full h-60  rounded-md"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      )}
                    </div>

                    {currentQuestion.shorts && currentQuestion.shorts.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {currentQuestion.shorts.map((short, index) => (
                          <div key={index} className="relative">
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

                    <div className="space-y-2 mt-4">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={cn(
                            'p-2 rounded border',
                            currentQuestion.rightOption === option ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                          )}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button
              className="w-full mt-4"
              style={{ backgroundColor: theme.primary, color: theme.white }}
              onClick={addQuestion}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Video Preview Dialog */}
        <Dialog open={isVideoPreviewOpen} onOpenChange={setIsVideoPreviewOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Video Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <video
                src={previewVideo}
                className="w-full rounded-md"
                controls
                autoPlay
              />
            </div>
          </DialogContent>
        </Dialog>
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
  `}</style>
    </Suspense>
  );
}