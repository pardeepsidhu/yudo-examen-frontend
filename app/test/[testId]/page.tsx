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

import { CodeRunner } from "./codeRunner";
import { TestAttempt as TestAttempt2 } from "./testDetails";
import { flushSync } from "react-dom";
import { Editor } from "primereact/editor";

export default function TestPage() {
  const params = useParams();
  const [testData, setTestData] = useState<TestAttempt2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState("es");
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const [translatedDescription, setTranslatedDesctription] = useState("");
  const [translatedSolution, setTranslatedSolution] = useState("");
  const [isAnswering, setIsAnswring] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false)
  const [isFullScreenEditor, setIsFullScreenEditor] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices(); // Try once immediately
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // On unmount, cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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
    setIsAnswring(true)
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
      console.log(error)
      const errorMessage =
        error instanceof Error ? error.message : "Error recording answer";
      toast.error(errorMessage);
    }
    finally {
      setIsAnswring(false)
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

  // Put this inside your React component (assumes `selectedTranslation` and `isSpeaking` state exist,
  // and setIsSpeaking is available from useState).
  const handleTextToSpeech = (textToRead: string) => {

    if (voices.length === 0) {
      alert("Voices are still loading, please try again in a second.");
      window.speechSynthesis.getVoices(); // trigger load
      return;
    }


    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.error("Speech synthesis is not supported in this browser.");
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    // Cancel currently speaking & toggle off
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = textToRead?.trim() || "No text available to speak";

    // Map short codes (en, hi, etc.) to common BCP-47 tags
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      es: "es-ES",
      fr: "fr-FR",
      de: "de-DE",
      zh: "zh-CN",
      ja: "ja-JP",
    };

    // fallback: if selectedTranslation is already a full tag (en-GB etc.) use it
    const rawLang = (selectedTranslation || "en").toString();
    const lang = langMap[rawLang] ?? (rawLang.includes("-") ? rawLang : `${rawLang}-US`);

    // Helper that actually picks a voice and speaks
    const speakWithVoices = (voices: SpeechSynthesisVoice[]) => {
      // Choose voice that matches language first
      let chosen: SpeechSynthesisVoice | undefined = voices.find((v) =>
        v.lang && v.lang.toLowerCase().startsWith(lang.split("-")[0].toLowerCase())
      );

      // Try to prefer a female-sounding voice by name heuristics
      const femaleRegex = /female|woman|girl|samantha|karen|zira|alexa|google.*female/i;
      const femaleMatching = voices.find((v) => femaleRegex.test(v.name));
      if (femaleMatching) chosen = femaleMatching;

      // Fallback to first voice if none matched
      chosen = chosen ?? voices[0];

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang;
      if (chosen) utterance.voice = chosen;

      // Optional tuning — remove or adjust as you like:
      utterance.rate = 1;    // 0.1 - 10
      utterance.pitch = 1;   // 0 - 2
      utterance.volume = 1;  // 0 - 1

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (err) => {
        console.error("Speech synthesis error:", err);
        setIsSpeaking(false);
      };

      // Mark speaking and start
      setIsSpeaking(true);
      // Ensure any existing utterances are cancelled
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        /* ignore */
      }
      window.speechSynthesis.speak(utterance);
    };

    // If voices are already present, use them, otherwise wait for voiceschanged
    const existingVoices = window.speechSynthesis.getVoices();
    if (existingVoices.length > 0) {
      speakWithVoices(existingVoices);
      return;
    }

    // Some browsers (Chrome) load voices asynchronously. Listen cleanly and remove listener after.
    const onVoicesChanged = () => {
      const vs = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      if (vs.length > 0) {
        speakWithVoices(vs);
      } else {
        // fallback: try a small delay then attempt again
        setTimeout(() => {
          const retry = window.speechSynthesis.getVoices();
          if (retry.length > 0) speakWithVoices(retry);
          else {
            console.error("No voices available for speechSynthesis.");
            alert("No speech voices available on this device/browser.");
          }
        }, 250);
      }
    };

    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Some platforms may never fire voiceschanged — attempt a quick fallback
    setTimeout(() => {
      const vs = window.speechSynthesis.getVoices();
      if (vs.length > 0) {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        speakWithVoices(vs);
      }
    }, 350);
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
      setIsTranslating(true)
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
    finally {
      setIsTranslating(false)
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
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden flex justify-center flex justify-center">
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
                className="w-full px-6 py-3 rounded-sm font-bold text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
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
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden flex justify-center">
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
                  className="flex-1 px-6 py-3 rounded-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:scale-[1.02]"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 rounded-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
          <Alert className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-sm overflow-hidden flex justify-center">
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
                <div className="p-3 rounded-sm bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                  <p className="text-xs text-gray-500 font-medium">Test Status</p>
                  <p className="text-sm font-bold text-indigo-600">Empty</p>
                </div>
                <div className="p-3 rounded-sm bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
                  <p className="text-xs text-gray-500 font-medium">Questions</p>
                  <p className="text-sm font-bold text-orange-600">0</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-6 py-3 rounded-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all duration-300 hover:scale-[1.02]"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.href = '/test'}
                  className="flex-1 px-6 py-3 rounded-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
      className="min-h-screen w-full flex flex-col bg-gradient-to-br py-2"
      style={{
        background: ``,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full gap-0.5"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-sm shadow-xl p-1 gap-2 h-auto bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100">
              <TabsTrigger
                value="details"
                className="relative flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold py-2.5 px-4 rounded-sm transition-all duration-300 group overflow-hidden"
                style={{
                  color: activeTab === "details" ? "#ffffff" : "#6366f1",
                }}
              >
                {/* Active background gradient */}
                {activeTab === "details" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                )}

                {/* Hover background for inactive state */}
                {activeTab !== "details" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Shine effect on active */}
                {activeTab === "details" && (
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                )}

                {/* Icon container with animation */}
                <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${activeTab === "details"
                  ? "bg-white/20"
                  : "bg-indigo-100 group-hover:bg-indigo-200"
                  }`}>
                  <Info className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${activeTab === "details"
                    ? "text-white"
                    : "text-indigo-600 group-hover:scale-110"
                    }`} />
                </div>

                {/* Text */}
                <span className="relative z-10 hidden xs:inline">Test Details</span>
                <span className="relative z-10 inline xs:hidden">Details</span>

                {/* Active indicator dot */}
                {activeTab === "details" && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </TabsTrigger>

              <TabsTrigger
                value="attend"
                className="relative flex items-center justify-center gap-2.5 text-sm sm:text-base font-bold py-2.5 px-4 rounded-sm transition-all duration-300 group overflow-hidden"
                style={{
                  color: activeTab === "attend" ? "#ffffff" : "#6366f1",
                }}
              >
                {/* Active background gradient */}
                {activeTab === "attend" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                )}

                {/* Hover background for inactive state */}
                {activeTab !== "attend" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Shine effect on active */}
                {activeTab === "attend" && (
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                )}

                {/* Icon container with animation */}
                <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-300 ${activeTab === "attend"
                  ? "bg-white/20"
                  : "bg-indigo-100 group-hover:bg-indigo-200"
                  }`}>
                  <PlayCircle className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${activeTab === "attend"
                    ? "text-white"
                    : "text-indigo-600 group-hover:scale-110"
                    }`} />
                </div>

                {/* Text */}
                <span className="relative z-10 hidden xs:inline">Attend Test</span>
                <span className="relative z-10 inline xs:hidden">Attend</span>

                {/* Active indicator dot */}
                {activeTab === "attend" && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="m-0 mt-1 sm:mt-3">
              <TestDetails testData={testData} />
            </TabsContent>

            <TabsContent value="attend" className="mt-1 sm:mt-3">
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-0 sm:gap-1">
                {/* Question Navigation */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r-0 p-3 sm:p-4 mb-3 md:mb-0 relative bg-white/90 backdrop-blur-xl rounded-lg md:rounded-r-none shadow-lg">
                  {/* Gradient top border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-lg" />

                  {/* Header */}
                  <div className="mb-4 pt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">
                        Questions
                      </h3>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-green-500 shadow-md" />
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Correct</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500 shadow-md" />
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Wrong</span>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-8 md:grid-cols-4 gap-2 py-4 px-4">
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
                              "h-10 w-10 p-0 rounded-sm text-sm font-bold transition-all hover:scale-105 shadow-md hover:shadow-xl",
                              isAnswered &&
                              isCorrect &&
                              "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0",
                              isAnswered &&
                              !isCorrect &&
                              "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0",
                              !isAnswered && currentQuestionIndex !== index && "border-2 border-gray-200 hover:border-blue-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                              currentQuestionIndex === index &&
                              !isAnswered &&
                              "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 ring-2 ring-blue-300 ring-offset-2 shadow-2xl"
                            )}
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
                  <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 gap-1 font-semibold">
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{Math.round(progress as number)}% Complete</span>
                    </div>
                    <div className="relative w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-inner">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
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
                                className="p-0 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl  rounded-sm sm:rounded-sm border-blue-200 dark:border-gray-700 border-0! shadow-none sm:border-2!"
                              >
                                {/* Question Title */}
                                <div className="mb-0">
                                  <h2
                                    className="text-base sm:text-lg md:text-xl font-black text-blue-600 dark:text-blue-400"
                                    style={{
                                      fontFamily: "Inter, system-ui, sans-serif",
                                    }}
                                  >
                                    {currentQuestion.title}
                                  </h2>
                                </div>
                                <Tabs defaultValue="Answer" className="">
                                  <TabsList
                                    className="grid w-full grid-cols-5 mb-2 sm:mb-3 gap-1 p-1 rounded-sm shadow-md h-auto bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-gray-700"
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
                                            className={cn(
                                              "rounded-sm text-[11px] xs:text-xs sm:text-sm font-bold py-2 px-2 transition-all focus-visible:ring-2",
                                              isDisabled && "cursor-not-allowed opacity-50",
                                              isActive && "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-400",
                                              !isActive && !isDisabled && "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-blue-600"
                                            )}
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
                                        className="space-y-3"
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

                                          const isCorrect = isSelected && option === correctOption;
                                          const isIncorrect = isSelected && option !== correctOption;

                                          return (
                                            <div
                                              key={index}
                                              className={cn(
                                                "relative px-2 sm:px-4  sm:px-5 py-2 rounded-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden group flex items-center m-0!",
                                                isCorrect
                                                  ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-green-800/30  shadow-green-500/20"
                                                  : isIncorrect
                                                    ? "border-red-400 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-red-800/30  shadow-red-500/20"
                                                    : "border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:border-blue-300  hover:scale-[1.01] backdrop-blur-sm",
                                                isAnswering && "opacity-60 cursor-not-allowed pointer-events-none"
                                              )}
                                            >
                                              {/* Subtle hover gradient */}
                                              {!isAnswered && !isAnswering && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                              )}

                                              {/* Hidden Radio */}
                                              <RadioGroupItem
                                                value={option}
                                                id={`option-${index}`}

                                                className="peer sr-only"
                                                disabled={isAnswered || isAnswering}
                                              />

                                              {/* Option label */}
                                              <Label
                                                htmlFor={`option-${index}`}
                                                className={cn(
                                                  "relative z-10 flex-1 flex items-center font-semibold text-base sm:text-lg transition-all duration-300 cursor-pointer",
                                                  isCorrect
                                                    ? "text-green-700 dark:text-green-300"
                                                    : isIncorrect
                                                      ? "text-red-700 dark:text-red-300"
                                                      : "text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                                                  isAnswering && "text-gray-500"
                                                )}
                                              >
                                                {/* Letter circle */}
                                                <span
                                                  className={cn(
                                                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold  transition-all",
                                                    isCorrect
                                                      ? "bg-green-500 text-white"
                                                      : isIncorrect
                                                        ? "bg-red-500 text-white"
                                                        : "bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-gray-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                                  )}
                                                >
                                                  {String.fromCharCode(65 + index)}
                                                </span>

                                                {/* Option text */}
                                                <span className="flex-1 text-xs sm:text-md mr-6">{option}</span>
                                              </Label>

                                              {/* Spinner when answering */}
                                              {isAnswering && (
                                                <div className="absolute right-4 sm:right-6 flex items-center">
                                                  <svg
                                                    className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-blue-500"
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
                0 5.373 0 12h4zm2 
                5.291A7.962 7.962 0 014 12H0c0 
                3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                  </svg>
                                                </div>
                                              )}

                                              {/* Icons after answering */}
                                              {isAnswered && !isAnswering && (
                                                <div className="absolute right-2 sm:right-4 flex items-center">
                                                  {option === correctOption ? (
                                                    <div className="relative">
                                                      <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-green-500 animate-pulse" />
                                                      <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30 animate-pulse" />
                                                    </div>
                                                  ) : isSelected && option !== correctOption ? (
                                                    <div className="relative">
                                                      <XCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 animate-pulse" />
                                                      <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-30 animate-pulse" />
                                                    </div>
                                                  ) : null}
                                                </div>
                                              )}

                                              {/* Hover indicator */}
                                              {!isAnswered && !isAnswering && (
                                                <div className="absolute right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </RadioGroup>

                                    ) : (
                                      <Alert className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 dark:bg-gradient-to-br dark:from-yellow-900/30 dark:to-orange-900/30 dark:border-yellow-600 mt-4 rounded-sm shadow-lg">
                                        <AlertDescription className="flex items-center gap-3">
                                          <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                                            <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                          </div>
                                          <span className="text-yellow-800 dark:text-yellow-200 font-semibold">
                                            No options available for this question.
                                          </span>
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </TabsContent>
                                  <TabsContent value="Description">
                                    <div className="w-full max-w-4xl mx-auto space-y-4">
                                      {/* Controls */}
                                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 p-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-sm border border-gray-200 dark:border-gray-700">
                                        <h3 className="hidden sm:flex text-sm font-bold text-gray-700 dark:text-gray-300  items-center gap-2">
                                          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                          </svg>
                                          Question Description
                                        </h3>
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex sm:hidden items-center gap-2">
                                          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                          </svg>
                                          Description
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2">
                                          <button
                                            className="px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
                                            onClick={() =>
                                              handleTextToSpeech(
                                                translatedDescription ||
                                                currentQuestion.description ||
                                                ""
                                              )
                                            }
                                          >
                                            <Volume2
                                              className={`h-4 w-4 ${isSpeaking ? "text-blue-500 animate-pulse" : ""
                                                }`}
                                            />
                                            <span className="hidden sm:inline">
                                              Text to Speech
                                            </span>
                                          </button>

                                          <div className="relative">
                                            <button
                                              className="px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
                                              onClick={() =>
                                                setShowTranslationOptions(!showTranslationOptions)
                                              }
                                              disabled={isTranslating}
                                            >
                                              {isTranslating ? (
                                                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                              ) : (
                                                <Globe className="h-4 w-4" />
                                              )}
                                              <span className="hidden sm:inline">
                                                {isTranslating ? "Translating..." : "Translate"}
                                              </span>
                                              {selectedTranslation !== "en" && !isTranslating && (
                                                <span className="text-xs font-bold ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-sm shadow-sm">
                                                  {selectedTranslation.toUpperCase()}
                                                </span>
                                              )}
                                            </button>

                                            {showTranslationOptions && !isTranslating && (
                                              <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-sm shadow-2xl p-2 border-2 border-blue-200 dark:border-gray-700 h-75 overflow-y-scroll">
                                                <div className="mb-2 px-2 py-1 border-b border-gray-200 dark:border-gray-700">
                                                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Select Language</p>
                                                </div>
                                                {[
                                                  { code: "en", name: "English", flag: "🇬🇧" },
                                                  { code: "es", name: "Spanish", flag: "🇪🇸" },
                                                  { code: "fr", name: "French", flag: "🇫🇷" },
                                                  { code: "de", name: "German", flag: "🇩🇪" },
                                                  { code: "zh", name: "Chinese", flag: "🇨🇳" },
                                                  { code: "ja", name: "Japanese", flag: "🇯🇵" },
                                                  { code: "hi", name: "Hindi", flag: "🇮🇳" },
                                                ].map((lang) => (
                                                  <button
                                                    key={lang.code}
                                                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-sm flex items-center gap-3 transition-all ${selectedTranslation === lang.code
                                                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                      }`}
                                                    onClick={async () => {
                                                      await translateText(
                                                        currentQuestion.description || "",
                                                        "des",
                                                        lang.code
                                                      );
                                                      flushSync(() =>
                                                        setSelectedTranslation(lang.code)
                                                      );
                                                      setShowTranslationOptions(false);
                                                    }}
                                                  >
                                                    <span className="text-xl">{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                    {selectedTranslation === lang.code && (
                                                      <CheckCircle2 className="h-4 w-4 ml-auto" />
                                                    )}
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Editor Container */}
                                      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-sm border-2 border-blue-200 dark:border-gray-700 shadow-xl overflow-hidden">
                                        {isTranslating && (
                                          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                              <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                              </svg>
                                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Translating description...</p>
                                            </div>
                                          </div>
                                        )}

                                        {translatedDescription || currentQuestion.description ? (
                                          <Editor
                                            readOnly
                                            showHeader={false}
                                            value={translatedDescription || currentQuestion?.description || ''}
                                            style={{ height: "300px" }}
                                          />
                                        ) : (
                                          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                              </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 italic font-medium">
                                              No description provided for this question.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="Solution">
                                    <div className="w-full max-w-4xl mx-auto space-y-4 overflow-hidden">
                                      {/* Controls */}
                                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 p-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-sm border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Solution Explanation
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-2">
                                          <button
                                            className="px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
                                            onClick={() =>
                                              handleTextToSpeech(
                                                translatedSolution ||
                                                currentQuestion.solution ||
                                                ""
                                              )
                                            }
                                          >
                                            <Volume2
                                              className={`h-4 w-4 ${isSpeaking ? "text-blue-500 animate-pulse" : ""
                                                }`}
                                            />
                                            <span className="hidden sm:inline">
                                              Text to Speech
                                            </span>
                                          </button>

                                          <div className="relative">
                                            <button
                                              className="px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
                                              onClick={() =>
                                                setShowTranslationOptions(!showTranslationOptions)
                                              }
                                              disabled={isTranslating}
                                            >
                                              {isTranslating ? (
                                                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                              ) : (
                                                <Globe className="h-4 w-4" />
                                              )}
                                              <span className="hidden sm:inline">
                                                {isTranslating ? "Translating..." : "Translate"}
                                              </span>
                                              {selectedTranslation !== "en" && !isTranslating && (
                                                <span className="text-xs font-bold ml-1 bg-blue-500 text-white px-2 py-0.5 rounded-sm shadow-sm">
                                                  {selectedTranslation.toUpperCase()}
                                                </span>
                                              )}
                                            </button>

                                            {showTranslationOptions && !isTranslating && (
                                              <div className="absolute right-0 z-50 mt-2 w-56 bg-white dark:bg-gray-800 rounded-sm shadow-2xl p-2 border-2 border-blue-200 dark:border-gray-700 h-75 overflow-y-scroll">

                                                <div className="mb-2 px-2 py-1 border-b border-gray-200 dark:border-gray-700">
                                                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Select Language</p>
                                                </div>
                                                {[
                                                  { code: "en", name: "English", flag: "🇬🇧" },
                                                  { code: "es", name: "Spanish", flag: "🇪🇸" },
                                                  { code: "fr", name: "French", flag: "🇫🇷" },
                                                  { code: "de", name: "German", flag: "🇩🇪" },
                                                  { code: "zh", name: "Chinese", flag: "🇨🇳" },
                                                  { code: "ja", name: "Japanese", flag: "🇯🇵" },
                                                  { code: "hi", name: "Hindi", flag: "🇮🇳" },
                                                ].map((lang) => (
                                                  <button
                                                    key={lang.code}
                                                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold rounded-sm flex items-center gap-3 transition-all ${selectedTranslation === lang.code
                                                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                      }`}
                                                    onClick={async () => {
                                                      await translateText(
                                                        currentQuestion.solution || "",
                                                        "sol",
                                                        lang.code
                                                      );
                                                      flushSync(() =>
                                                        setSelectedTranslation(lang.code)
                                                      );
                                                      setShowTranslationOptions(false);
                                                    }}
                                                  >
                                                    <span className="text-xl">{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                    {selectedTranslation === lang.code && (
                                                      <CheckCircle2 className="h-4 w-4 ml-auto" />
                                                    )}
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Editor Container */}
                                      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-sm border-2 border-blue-200 dark:border-gray-700 shadow-xl overflow-hidden">

                                        {isTranslating && (
                                          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                              <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                              </svg>
                                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Translating solution...</p>
                                            </div>
                                          </div>
                                        )}

                                        {translatedSolution || currentQuestion.solution ? (
                                          <Editor
                                            readOnly
                                            showHeader={false}
                                            value={translatedSolution || currentQuestion?.solution || ''}
                                            style={{ height: "300px" }}
                                          />

                                        ) : (
                                          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                              </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 italic font-medium">
                                              No solution provided for this question.
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="Media">
                                    <div className="w-full max-w-4xl mx-auto space-y-4">
                                      {/* Header */}
                                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-sm border border-gray-200 dark:border-gray-700">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-gray-100">
                                          Media Content
                                        </h3>
                                      </div>

                                      {/* Main Image and Video */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.image && (
                                          <div className="relative group overflow-hidden rounded-sm border-2 border-blue-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all">
                                            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                              <button
                                                className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all hover:scale-110"
                                                onClick={() =>
                                                  window.open(currentQuestion.image, "_blank")
                                                }
                                                title="Open in new tab"
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
                                                className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white hover:from-green-600 hover:to-green-700 shadow-lg transition-all hover:scale-110"
                                                onClick={() => {
                                                  const elem = document.createElement("div");
                                                  elem.style.position = "fixed";
                                                  elem.style.top = "0";
                                                  elem.style.left = "0";
                                                  elem.style.width = "100vw";
                                                  elem.style.height = "100vh";
                                                  elem.style.backgroundColor = "rgba(0,0,0,0.95)";
                                                  elem.style.zIndex = "9999";
                                                  elem.style.display = "flex";
                                                  elem.style.justifyContent = "center";
                                                  elem.style.alignItems = "center";
                                                  elem.style.overflow = "auto";
                                                  elem.style.backdropFilter = "blur(10px)";

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
                                                  img.style.borderRadius = "0px";
                                                  img.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";

                                                  imgWrapper.appendChild(img);
                                                  elem.appendChild(imgWrapper);

                                                  // Close button
                                                  const closeBtn = document.createElement("button");
                                                  closeBtn.innerHTML = "✕";
                                                  closeBtn.style.position = "absolute";
                                                  closeBtn.style.top = "20px";
                                                  closeBtn.style.right = "20px";
                                                  closeBtn.style.fontSize = "32px";
                                                  closeBtn.style.fontWeight = "bold";
                                                  closeBtn.style.color = "white";
                                                  closeBtn.style.background = "rgba(239, 68, 68, 0.9)";
                                                  closeBtn.style.border = "none";
                                                  closeBtn.style.borderRadius = "50%";
                                                  closeBtn.style.width = "48px";
                                                  closeBtn.style.height = "48px";
                                                  closeBtn.style.cursor = "pointer";
                                                  closeBtn.style.display = "flex";
                                                  closeBtn.style.alignItems = "center";
                                                  closeBtn.style.justifyContent = "center";
                                                  closeBtn.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
                                                  closeBtn.onclick = (e) => {
                                                    e.stopPropagation();
                                                    document.body.removeChild(elem);
                                                  };

                                                  elem.appendChild(closeBtn);
                                                  elem.onclick = () => document.body.removeChild(elem);
                                                  document.body.appendChild(elem);
                                                }}
                                                title="Fullscreen preview"
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

                                            {/* Image badge */}
                                            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              </svg>
                                              Image
                                            </div>

                                            <Image
                                              src={currentQuestion.image}
                                              alt="Question image"
                                              width={800}
                                              height={400}
                                              className="w-full h-64 sm:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                                              onClick={() => {
                                                const elem = document.createElement("div");
                                                elem.style.position = "fixed";
                                                elem.style.top = "0";
                                                elem.style.left = "0";
                                                elem.style.width = "100vw";
                                                elem.style.height = "100vh";
                                                elem.style.backgroundColor = "rgba(0,0,0,0.95)";
                                                elem.style.zIndex = "9999";
                                                elem.style.display = "flex";
                                                elem.style.justifyContent = "center";
                                                elem.style.alignItems = "center";
                                                elem.style.overflow = "auto";
                                                elem.style.backdropFilter = "blur(10px)";

                                                const imgWrapper = document.createElement("div");
                                                imgWrapper.style.position = "relative";
                                                imgWrapper.style.maxWidth = "100vw";
                                                imgWrapper.style.maxHeight = "100vh";
                                                imgWrapper.style.display = "flex";
                                                imgWrapper.style.alignItems = "center";
                                                imgWrapper.style.justifyContent = "center";

                                                const img = document.createElement("img");
                                                img.src = currentQuestion.image || "";
                                                img.style.maxWidth = "95vw";
                                                img.style.maxHeight = "95vh";
                                                img.style.objectFit = "contain";
                                                img.style.borderRadius = "0px";
                                                img.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";

                                                imgWrapper.appendChild(img);
                                                elem.appendChild(imgWrapper);

                                                const closeBtn = document.createElement("button");
                                                closeBtn.innerHTML = "✕";
                                                closeBtn.style.position = "absolute";
                                                closeBtn.style.top = "20px";
                                                closeBtn.style.right = "20px";
                                                closeBtn.style.fontSize = "32px";
                                                closeBtn.style.fontWeight = "bold";
                                                closeBtn.style.color = "white";
                                                closeBtn.style.background = "rgba(239, 68, 68, 0.9)";
                                                closeBtn.style.border = "none";
                                                closeBtn.style.borderRadius = "50%";
                                                closeBtn.style.width = "48px";
                                                closeBtn.style.height = "48px";
                                                closeBtn.style.cursor = "pointer";
                                                closeBtn.style.display = "flex";
                                                closeBtn.style.alignItems = "center";
                                                closeBtn.style.justifyContent = "center";
                                                closeBtn.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
                                                closeBtn.onclick = (e) => {
                                                  e.stopPropagation();
                                                  document.body.removeChild(elem);
                                                };

                                                elem.appendChild(closeBtn);
                                                elem.onclick = () => document.body.removeChild(elem);
                                                document.body.appendChild(elem);
                                              }}
                                              priority
                                            />
                                          </div>
                                        )}

                                        {currentQuestion.video && (
                                          <div className="relative group overflow-hidden rounded-sm border-2 border-blue-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all">
                                            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                              <button
                                                className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all hover:scale-110"
                                                onClick={() =>
                                                  window.open(
                                                    getYouTubeEmbedUrl(currentQuestion.video),
                                                    "_blank"
                                                  )
                                                }
                                                title="Open in YouTube"
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
                                                className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white hover:from-red-600 hover:to-red-700 shadow-lg transition-all hover:scale-110"
                                                onClick={() => {
                                                  const elem = document.createElement("div");
                                                  Object.assign(elem.style, {
                                                    position: "fixed",
                                                    top: "0",
                                                    left: "0",
                                                    width: "100vw",
                                                    height: "100vh",
                                                    backgroundColor: "rgba(0,0,0,0.95)",
                                                    zIndex: "9999",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    overflow: "hidden",
                                                    backdropFilter: "blur(10px)",
                                                  });

                                                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                                                    navigator.userAgent
                                                  );

                                                  // ✅ Full-feature embed URL with all control options
                                                  const videoUrl = `${getYouTubeEmbedUrl(currentQuestion.video)}?controls=1&fs=1&enablejsapi=1&rel=0&iv_load_policy=1&showinfo=1`;

                                                  const iframe = document.createElement("iframe");
                                                  iframe.src = videoUrl;
                                                  iframe.style.border = "none";
                                                  iframe.allowFullscreen = true;
                                                  iframe.setAttribute(
                                                    "allow",
                                                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                                  );

                                                  if (isMobile) {
                                                    // Landscape fullscreen simulation for mobile
                                                    Object.assign(iframe.style, {
                                                      width: "100vh",
                                                      height: "100vw",
                                                      transform: "rotate(90deg)",
                                                      transformOrigin: "center center",
                                                      position: "absolute",
                                                      top: "50%",
                                                      left: "50%",
                                                      translate: "-50% -50%",
                                                    });
                                                  } else {
                                                    Object.assign(iframe.style, {
                                                      width: "100vw",
                                                      height: "100vh",
                                                      maxWidth: "1400px",
                                                      maxHeight: "100vh",
                                                    });
                                                  }

                                                  elem.appendChild(iframe);

                                                  // Close button
                                                  const closeBtn = document.createElement("button");
                                                  closeBtn.innerHTML = "✕";
                                                  Object.assign(closeBtn.style, {
                                                    position: "absolute",
                                                    top: "20px",
                                                    right: "20px",
                                                    fontSize: "32px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    background: "rgba(239, 68, 68, 0.9)",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "48px",
                                                    height: "48px",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                                                  });
                                                  closeBtn.onclick = (e) => {
                                                    e.stopPropagation();
                                                    document.body.removeChild(elem);
                                                    if (screen.orientation?.unlock) screen.orientation.unlock();
                                                  };

                                                  elem.appendChild(closeBtn);
                                                  document.body.appendChild(elem);

                                                  // Try locking to landscape mode (Android Chrome supports)
                                                  if (isMobile && (screen.orientation as any)?.lock) {
                                                    (screen.orientation as any)
                                                      .lock("landscape")
                                                      .catch(() => { });
                                                  }
                                                }}



                                                title="Fullscreen video"
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

                                            {/* Video badge */}
                                            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                              </svg>
                                              Video
                                            </div>

                                            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-black">
                                              <iframe
                                                src={getYouTubeEmbedUrl(`${getYouTubeEmbedUrl(currentQuestion.video)}`)}
                                                className="w-full h-64 sm:h-80 "
                                                allowFullScreen

                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                style={{ aspectRatio: "16/9" }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Shorts Section */}
                                      {currentQuestion.shorts && currentQuestion.shorts.length > 0 && (
                                        <div className="space-y-3">
                                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M10 9.333L15 12l-5 2.667V9.333M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                            </svg>
                                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                              YouTube Shorts ({currentQuestion.shorts.length})
                                            </h4>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
                                            {currentQuestion.shorts.map((short, index) => (
                                              <div
                                                key={index}
                                                className="relative group overflow-hidden rounded-sm border-2 border-blue-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all"
                                              >
                                                <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-100  sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                  <button
                                                    className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all hover:scale-110"
                                                    onClick={() =>
                                                      window.open(getYouTubeEmbedUrl(short), "_blank")
                                                    }
                                                    title="Open in YouTube"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="14"
                                                      height="14"
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
                                                    className="p-1.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white hover:from-red-600 hover:to-red-700 shadow-lg transition-all hover:scale-110"
                                                    onClick={() => {
                                                      const elem = document.createElement("div");
                                                      elem.style.position = "fixed";
                                                      elem.style.top = "0";
                                                      elem.style.left = "0";
                                                      elem.style.width = "100vw";
                                                      elem.style.height = "100vh";
                                                      elem.style.backgroundColor = "rgba(0,0,0,0.95)";
                                                      elem.style.zIndex = "9999";
                                                      elem.style.display = "flex";
                                                      elem.style.justifyContent = "center";
                                                      elem.style.alignItems = "center";
                                                      elem.style.overflow = "auto";
                                                      elem.style.backdropFilter = "blur(10px)";

                                                      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                                                      const iframe = document.createElement("iframe");
                                                      iframe.src = getYouTubeEmbedUrl(short);
                                                      iframe.style.border = "none";
                                                      iframe.style.borderRadius = "0px";
                                                      iframe.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";
                                                      iframe.allowFullscreen = true;
                                                      if (isMobile) {
                                                        iframe.style.width = "100vw";
                                                        iframe.style.height = "177.78vw";
                                                        iframe.style.maxWidth = "100vw";
                                                        iframe.style.maxHeight = "177.78vw";
                                                        elem.style.alignItems = "flex-start";
                                                        elem.style.justifyContent = "center";
                                                      } else {
                                                        iframe.style.width = "50vh";
                                                        iframe.style.height = "100vh";
                                                        iframe.style.maxWidth = "500px";
                                                        iframe.style.maxHeight = "100vh";
                                                      }

                                                      elem.appendChild(iframe);

                                                      const closeBtn = document.createElement("button");
                                                      closeBtn.innerHTML = "✕";
                                                      closeBtn.style.position = "absolute";
                                                      closeBtn.style.top = "20px";
                                                      closeBtn.style.right = "20px";
                                                      closeBtn.style.fontSize = "32px";
                                                      closeBtn.style.fontWeight = "bold";
                                                      closeBtn.style.color = "white";
                                                      closeBtn.style.background = "rgba(239, 68, 68, 0.9)";
                                                      closeBtn.style.border = "none";
                                                      closeBtn.style.borderRadius = "50%";
                                                      closeBtn.style.width = "48px";
                                                      closeBtn.style.height = "48px";
                                                      closeBtn.style.cursor = "pointer";
                                                      closeBtn.style.display = "flex";
                                                      closeBtn.style.alignItems = "center";
                                                      closeBtn.style.justifyContent = "center";
                                                      closeBtn.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
                                                      closeBtn.onclick = (e) => {
                                                        e.stopPropagation();
                                                        document.body.removeChild(elem);
                                                      };

                                                      elem.appendChild(closeBtn);
                                                      document.body.appendChild(elem);
                                                    }}
                                                    title="Fullscreen short"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="14"
                                                      height="14"
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

                                                {/* Short badge */}
                                                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-sm shadow-lg">
                                                  #{index + 1}
                                                </div>

                                                <div className="aspect-w-9 aspect-h-16 w-full overflow-hidden bg-black">
                                                  <iframe
                                                    src={getYouTubeEmbedUrl(short)}
                                                    className="w-full h-70"
                                                    allowFullScreen
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    style={{ aspectRatio: "9/16" }}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>
                                  <>
                                    <TabsContent className="border-none" value="Code">
                                      {currentQuestion.code && (
                                        <CodeRunner
                                          code={currentQuestion.code}
                                          language={currentQuestion.codeLang || ""}
                                        // isFullScreenEditor={isFullScreenEditor}
                                        // setIsFullScreenEditor={setIsFullScreenEditor}
                                        />
                                      )}
                                    </TabsContent>

                                    {/* Fullscreen Portal - renders outside the tab */}
                                    {isFullScreenEditor && currentQuestion.code && (
                                      <div className="fixed  inset-0 z-[9999] bg-white dark:bg-gray-900">
                                        <CodeRunner
                                          code={currentQuestion.code}
                                          language={currentQuestion.codeLang || ""}
                                        // isFullScreenEditor={isFullScreenEditor}
                                        // setIsFullScreenEditor={setIsFullScreenEditor}
                                        />
                                      </div>
                                    )}
                                  </>
                                </Tabs>
                              </Card>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="p-3 sm:p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="flex flex-row justify-between items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 w-auto font-bold px-6 py-2.5 rounded-lg border-2 border-blue-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>

                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                          {currentQuestionIndex + 1} / {questions.length}
                        </span>
                      </div>

                      <Button
                        onClick={handleNext}
                        disabled={currentQuestionIndex >= questions.length - 1}
                        className="flex items-center gap-2 w-auto font-bold px-6 py-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span className="">Next</span>
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
      <style jsx global>{`
  .ql-editor, .editor-content {
    white-space: pre-wrap !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  .ql-container {
    max-width: 100% !important;
  }
`}</style>

    </div>
  );
}
