"use client"
import { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Trophy,
  Users,
  ThumbsUp,
  BarChart2,
  Image as ImageIcon,
  CheckCircle,
  Clock3,
  Award,
  Target,
  TrendingUp,
  Sparkle,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/app/context/theme.context';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface Question {
  _id: string;
  title: string;
  description?: string;
  options: string[];
  rightOption: string;
  image?: string;
  video?: string;
  shorts?: string[];
  code?: string;
  codeLang?: string;
  solution?: string;
}

interface User {
  _id?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  profile?: string;
}

interface Test {
  _id?: string;
  title?: string;
  description?: string;
  questions?: Question[];
  totalQuestions?: number;
  answeredQuestions?: number;
  progress?: number;
  likes:[User];
  answeredQuestionIds?: string[];
  participantsCount?: number;
  likesCount?: number;
  user?: User;
  thumbnail?: string;
  category?: string;
  tags?: string[];
}

interface QuestionAttempt {
  question: {
    _id: string;
    title: string;
  };
  isRight: boolean;
}

export interface TestAttempt {
  _id: string;
  user?: User;
  testOwner?: User;
  test: Test;
  questionsAttended?: QuestionAttempt[];
  score?: number;
  completed?: boolean;
  startedAt?: string;
  completedAt?: string;
  timeSpent?: number;
  percentageScore?: number;
  answeredQuestions:number;
  progress:number;
  createdAt?:string;
  answeredQuestionIds:[string]
}




const TestDetails = ({ testData }: { testData: TestAttempt }) => {
  const { theme } = useTheme();
  const [progressValue, setProgressValue] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use only these theme keys for colors:
  // theme.primary, theme.secondary, theme.tertiary, theme.neutral, theme.white

  const testOwner = testData.testOwner || {};
  const thumbnail = testData?.test?.thumbnail || '';
  const totalQuestionsx = testData?.test?.questions?.length;

  const progressData = {
    totalQuestions: totalQuestionsx || 0,
    answeredQuestions: testData?.answeredQuestions || 0,
    progress: testData?.progress || 0,
    correctAnswers: testData?.score || 0,
    score: testData?.score || 0,
  };

  const isCompleted = testData.completed || false;

  useEffect(() => {
    setIsLoading(true);
    const loadTimer = setTimeout(() => setIsLoading(false), 500);
    const progressTimer = setTimeout(() => setProgressValue(Math.round(progressData.progress || 0)), 800);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(progressTimer);
    };
  }, [progressData.progress]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getUsername = (user: User) => user?.name || user?.email || "Unknown";
  const getUserInitial = (user: User) => (user?.name || user?.email || "U").charAt(0).toUpperCase();
  const getUserProfile = (user: User) => user?.profile || user?.profilePicture || "";

  const stats = [
    {
      icon: <Trophy className="h-4 w-4" />,
      label: "Correct Answers",
      value: progressData.correctAnswers,
      color: theme.primary,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Total Questions",
      value: progressData.totalQuestions,
      color: theme.primary,
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      label: "Answered",
      value: progressData.answeredQuestions,
      color: theme.primary,
    },
    {
      icon: <BarChart2 className="h-4 w-4" />,
      label: "Completion",
      value: `${progressValue}%`,
      color: theme.primary,
    },
  ];

  const handleImageError = () => setImageError(true);

  if (isLoading) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Enhanced loader */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200/30 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 blur-xl opacity-50 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
            Loading test details...
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200" />
            <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce animation-delay-400" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

  return (
  <div className="w-full min-h-screen p-2 sm:p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
    {/* Animated background blobs */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
    </div>

    <Card className="relative z-10 w-full max-w-7xl mx-auto shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-xl rounded-md  ">
      {/* Gradient top border */}
      <div className="absolute top-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

      <CardHeader className="p-0">
        <div className="flex flex-col lg:flex-row w-full overflow-hidden">
          {/* Enhanced Thumbnail */}
          {thumbnail && !imageError ? (
            <div className="relative w-full lg:w-2/5 h-64 sm:h-80 lg:h-auto group overflow-hidden">
              <Image
                src={thumbnail}
                alt={`${testData?.test?.title || 'Test'} Thumbnail`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={handleImageError}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Floating stats on image */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap">
                <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-sm sm:rounded-md bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-bold text-gray-800">{progressData.totalQuestions} Questions</span>
                </div>

              </div>
            </div>
          ) : (
            <div className="w-full lg:w-2/5 h-64 sm:h-80 lg:h-auto flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100">
              <div className="flex flex-col items-center text-indigo-400">
                <ImageIcon className="w-20 h-20 mb-3" />
                <p className="text-sm font-medium">No thumbnail available</p>
              </div>
            </div>
          )}

          {/* Enhanced Info Section */}
          <div className="flex flex-col gap-3 sm:gap-6 p-4 sm:p-8 flex-1 bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
            {/* Creator Info */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-12 sm:h-16 w-12 sm:w-16 ring-4 ring-indigo-200 shadow-xl">
                  <AvatarImage src={getUserProfile(testOwner)} alt={getUsername(testOwner)} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-lg">
                    {getUserInitial(testOwner)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent line-clamp-2">
                    {testData?.test?.title || "Untitled Test"}
                  </h2>
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2 flex-wrap">
                  <span>Created by</span>
                  <span className="font-semibold text-indigo-600">{getUsername(testOwner)}</span>
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </p>
                
                {/* <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {testData?.createdAt && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(testData?.createdAt)}
                    </span>
                  )}
                  {isCompleted && testData?.completedAt && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full shadow-sm font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Completed {formatDate(testData?.completedAt)}
                    </span>
                  )}
                </div> */}
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<Trophy className="h-5 w-5" />} label="Score" value={progressData?.score} gradient="from-yellow-400 to-orange-500" />
              <StatCard icon={<Target className="h-5 w-5" />} label="Accuracy" value={`${Math.floor((progressData?.score/progressData?.answeredQuestions)/100) || 0}%`} gradient="from-green-400 to-emerald-500" />
              <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Answered" value={progressData?.answeredQuestions} gradient="from-blue-400 to-cyan-500" />
              <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Progress" value={`${progressValue}%`} gradient="from-indigo-400 to-purple-500" />
            </div>

            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2">
              {testData?.test?.category && (
                <Badge className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 shadow-lg text-sm font-bold">
                  {testData?.test.category}
                </Badge>
              )}
              {testData?.test?.tags && testData?.test.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge 
                  key={index}
                  className="px-4 py-2 bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm text-sm font-semibold"
                >
                  {tag}
                </Badge>
              ))}
              {testData?.test?.tags && testData?.test.tags.length > 3 && (
                <Badge className="px-4 py-2 bg-gray-100 text-gray-600 text-sm">
                  +{testData?.test.tags.length - 3} more
                </Badge>
              )}

              <Badge className="  bg-gray-100 text-gray-600 text-sm">
                  {testData?.createdAt && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-md shadow-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(testData?.createdAt)}
                    </span>
                  )}
                </Badge>
               
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-8 space-y-3 sm:space-y-6">
        {/* Performance Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PerformanceBox 
            icon={<BookOpen className="h-4 sm:h-6 w-4 sm:w-6" />}
            label="Total Questions" 
            value={progressData.totalQuestions}
            gradient="from-indigo-500 to-blue-600"
          />
          <PerformanceBox 
            icon={<CheckCircle className="h-4 sm:h-6 w-4 sm:w-6" />}
            label="Answered" 
            value={progressData.answeredQuestions}
            gradient="from-blue-500 to-cyan-600"
          />
          <PerformanceBox 
            icon={<Trophy className="h-4 sm:h-6 w-4 sm:w-6" />}
            label="Correct Answers" 
            value={progressData.score}
            gradient="from-yellow-500 to-orange-600"
          />
          <PerformanceBox 
            icon={isCompleted ? <Award className="h-4 sm:h-6 w-4 sm:w-6" /> : <Clock3 className="h-4 sm:h-6 w-4 sm:w-6" />}
            label="Status"
            value={isCompleted ? "Completed" : "In Progress"}
            gradient={isCompleted ? "from-green-500 to-emerald-600" : "from-orange-500 to-red-600"}
          />
        </div>

        {/* Description Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-md sm:rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Test Description
          </h3>
          <p className="text-gray-700 text-sm sm:text-md leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-auto custom-scrollbar">
            {testData?.test?.description || "No description provided."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border-t border-indigo-100">
        <div className="w-full space-y-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-indigo-900">Overall Progress</span>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {progressValue}%
              </span>
            </div>
            <div className="relative w-full h-4 rounded-full bg-gray-200 overflow-hidden shadow-inner">
              <div
                className="h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${progressValue}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {isCompleted && testData?.completedAt && (
            <div className="flex items-center justify-center pt-2">
              <div className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3">
                <Award className="h-5 w-5" />
                <span className="font-bold">Test Completed on {formatDate(testData?.completedAt)}</span>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>

    <style jsx>{`
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        50% { transform: translate(30px, -30px) scale(1.1); opacity: 0.3; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
      .animate-blob { animation: blob 7s ease-in-out infinite; }
      .animate-shimmer { animation: shimmer 2s linear infinite; }
      .animation-delay-2000 { animation-delay: 2s; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #818cf8, #60a5fa); border-radius: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #6366f1, #3b82f6); }
    `}</style>
  </div>
);
};

const StatCard = ({ 
  icon, 
  label, 
  value, 
  gradient 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  gradient: string;
}) => (
  <div className={`p-4 rounded md:rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}>
    <div className="flex items-center justify-between mb-2">
      <div className="opacity-90">{icon}</div>
      <span className="text-2xl font-black">{value}</span>
    </div>
    <div className="text-xs font-semibold opacity-90">{label}</div>
  </div>
);

// Premium PerformanceBox Component
const PerformanceBox = ({ 
  icon, 
  label, 
  value, 
  gradient 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  gradient: string;
}) => (
  <div className="relative p-4 sm:p-6 rounded-md sm:rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 group overflow-hidden cursor-pointer">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
    <div className="relative">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-md sm:text-3xl font-black text-gray-900">{value}</div>
    </div>
  </div>
);

export default TestDetails;