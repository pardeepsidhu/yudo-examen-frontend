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
      <div className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: `${theme.primary}40`, borderTopColor: 'transparent' }}></div>
          <p className="text-lg font-medium" style={{ color: theme.primary }}>Loading test details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen p-2 sm:p-4 md:p-8"
      style={{
        background: `linear-gradient(135deg, ${theme.neutral} 0%, ${theme.tertiary} 100%)`,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Card className="w-full h-full shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
        <CardHeader className="p-0">
          <div className="flex flex-col lg:flex-row w-full overflow-hidden">
            {/* Thumbnail */}
            {thumbnail && !imageError ? (
              <div className="w-full lg:w-1/3 h-48 sm:h-64 lg:h-auto relative overflow-hidden cursor-pointer">
                <Image
                  src={thumbnail}
                  alt={`${testData?.test?.title || 'Test'} Thumbnail`}
                  fill
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={handleImageError}
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ) : (
              <div 
                className="w-full lg:w-1/3 h-48 sm:h-64 lg:h-auto flex items-center justify-center"
                style={{ background: `${theme.neutral}15` }}
              >
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2" />
                  <p className="text-sm">No thumbnail available</p>
                </div>
              </div>
            )}
            {/* Info */}
            <div
              className="flex flex-col gap-4 p-4 sm:p-6 flex-1"
              style={{ background: `linear-gradient(to right, ${theme.tertiary}15, ${theme.neutral}30)` }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-14 w-14 border-2 shadow-md">
                  <AvatarImage src={getUserProfile(testOwner)} alt={getUsername(testOwner)} />
                  <AvatarFallback style={{ background: `${theme.secondary}40`, color: theme.primary }} className="font-semibold">
                    {getUserInitial(testOwner)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col">
                  <h2 
                    className="text-xl sm:text-2xl md:text-3xl font-bold break-words line-clamp-2"
                    style={{ color: theme.primary }}
                  >
                    <BookOpen className="inline-block w-5 h-5 md:w-6 md:h-6 mr-1" style={{ color: theme.primary }} />
                    {testData?.test?.title || "Untitled Test"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Created by {getUsername(testOwner)}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {testData?.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(testData?.createdAt)}
                      </span>
                    )}
                    {isCompleted && testData?.completedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" style={{ color: theme.secondary }} />
                        Completed on {formatDate(testData?.completedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.map((stat, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 py-1 px-3 text-xs sm:text-sm transition-all hover:shadow-md"
                          style={{
                            borderColor: `${theme.neutral}80`,
                            background: `${theme.white}`,
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ color: stat.color }}>{stat.icon}</span>
                          <span className="ml-1 font-medium">{stat.value}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom"
                        className="px-3 py-1.5 text-xs font-medium"
                        style={{ background: theme.primary, color: theme.white }}
                      >
                        {stat.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              {/* Category & Tags and Likes */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full">
                {(testData?.test?.category || (testData?.test?.tags && testData?.test?.tags.length > 0)) && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium block mb-2" style={{ color: theme.primary }}>Category & Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {testData?.test?.category && (
                        <Badge 
                          className="py-1 px-3 text-xs sm:text-sm"
                          style={{ background: theme.primary, color: theme.white }}
                        >
                          {testData?.test.category}
                        </Badge>
                      )}
                      {testData?.test?.tags && testData?.test.tags.map((tag:string, index:number) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="py-1 px-3 text-xs sm:text-sm"
                          style={{ borderColor: `${theme.secondary}80`, color: theme.secondary }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <ThumbsUp className="h-4 w-4" style={{ color: theme.secondary }} />
                    <span className="text-xs sm:text-sm">{testData?.test?.likes?.length} Likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatBox 
              label="Total Questions" 
              value={progressData.totalQuestions} 
              color={theme.primary} 
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatBox 
              label="Answered" 
              value={progressData.answeredQuestions} 
              color={theme.primary}
              icon={<CheckCircle className="h-5 w-5" />}
            />
            <StatBox 
              label="Score" 
              value={progressData.score} 
              color={theme.primary}
              icon={<Trophy className="h-5 w-5" />}
            />
            <StatBox 
              label="Status"
              value={isCompleted ? "Completed" : "In Progress"}
              color={isCompleted ? theme.secondary : theme.primary}
              icon={isCompleted ? <CheckCircle className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium block mb-2" style={{ color: theme.primary }}>Test Description</label>
            <div
              className="w-full min-h-24 sm:min-h-36 p-3 sm:p-4 rounded-md border overflow-auto whitespace-pre-wrap text-xs sm:text-sm"
              style={{
                background: `${theme.neutral}10`,
                borderColor: `${theme.neutral}40`,
                color: 'inherit',
                maxHeight: '300px'
              }}
            >
              {testData?.test?.description || "No description provided."}
            </div>
          </div>
        </CardContent>

        <CardFooter
          className="p-4 sm:p-6 border-t"
          style={{ borderColor: `${theme.neutral}40`, background: `${theme.neutral}10` }}
        >
          <div className="w-full">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className="font-medium" style={{ color: theme.primary }}>Progress</span>
              <span className="font-medium" style={{ color: theme.primary }}>{progressValue}%</span>
            </div>
            <div className="w-full h-2 sm:h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-2 sm:h-3 rounded-full transition-all duration-1000 ease-in-out"
                style={{
                  width: `${progressValue}%`,
                  background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`,
                  boxShadow: `0 0 8px ${theme.primary}60`
                }}
              ></div>
            </div>
            {isCompleted && testData?.completedAt && (
              <div className="mt-4 flex items-center justify-center">
                <Badge 
                  className="py-2 px-4 text-xs sm:text-sm font-medium"
                  style={{ background: theme.secondary, color: theme.white }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Test Completed on {formatDate(testData?.completedAt)}
                </Badge>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

const StatBox = ({ 
  label, 
  value, 
  color, 
  icon 
}: { 
  label: string; 
  value: string | number; 
  color: string;
  icon: React.ReactNode;
}) => (
  <div
    className="p-3 sm:p-4 rounded-lg shadow-sm transition-all hover:shadow-md"
    style={{ background: `${color}15` }}
  >
    <div className="flex justify-between items-center mb-1 sm:mb-2">
      <div className="text-xs sm:text-sm font-medium" style={{ color }}>{label}</div>
      <div style={{ color }} className="opacity-80">{icon}</div>
    </div>
    <div className="text-lg sm:text-2xl font-bold" style={{ color }}>{value}</div>
  </div>
);

export default TestDetails;