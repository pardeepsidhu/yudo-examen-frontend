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
  console.log("child")
console.log({...testData})
  // Safe data extraction with fallbacks


  const testOwner = testData.testOwner || {};
  const thumbnail = testData?.test?.thumbnail || '';
  const totalQuestionsx =testData?.test?.questions?.length
  
  // Combine progress data from all possible sources


  const progressData = {
    totalQuestions: totalQuestionsx || 0,
    answeredQuestions: testData?.answeredQuestions|| 0,
    progress: testData?.progress  || 0,
    correctAnswers: testData?.score || 0,
    score: testData?.score  || 0,
  };
  
  // Combine completion status from all possible sources
  const isCompleted = testData.completed || false;

  useEffect(() => {
    // Add simulated loading state
    setIsLoading(true);
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Animate progress bar
    const progressTimer = setTimeout(() => {
      setProgressValue(Math.round(progressData.progress || 0));
    }, 800);
    
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
    } catch (e) {
      if(e)
      return "Invalid Date";
    }
  };



  // Get user name with fallbacks
  const getUsername = (user: User) => {
    if (!user) return "Unknown";
    return user.name || user.email || "Unknown";
  };

  // Get user avatar initial with fallbacks
  const getUserInitial = (user: User) => {
    if (!user) return "U";
    const name = user.name || user.email || "U";
    return name.charAt(0).toUpperCase();
  };

  // Get user profile image with fallbacks
  const getUserProfile = (user: User) => {
    if (!user) return "";
    return user.profile || user.profilePicture || "";
  };

  const stats = [
    {
      icon: <Trophy className="h-4 w-4" />,
      label: "Correct Answers",
      value: progressData.correctAnswers,
      color: theme.accent,
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Total Questions",
      value: progressData.totalQuestions,
      color: theme.tertiary,
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      label: "Answered",
      value: progressData.answeredQuestions,
      color: theme.secondary,
    },
    {
      icon: <BarChart2 className="h-4 w-4" />,
      label: "Completion",
      value: `${progressValue}%`,
      color: theme.primary,
    },
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-4 md:p-8 bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: `${theme.primary}40`, borderTopColor: 'transparent' }}></div>
          <p className="text-lg font-medium" style={{ color: theme.primary }}>Loading test details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-white dark:bg-black">
      <Card className="w-full h-full shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardHeader className="p-0">
          <div className="flex flex-col lg:flex-row w-full overflow-hidden">
            {thumbnail && !imageError ? (
              <div className="w-full lg:w-1/3 h-64 lg:h-auto relative overflow-hidden  lg:ml-6 cursor-pointer lg:rounded-tl-xl">
                <img
                  src={thumbnail}
                  alt={`${testData?.test?.title || 'Test'} Thumbnail`}
                  className=" w-full h-full hover:scale-115 ease-in-out duration-600"
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div 
                className="w-full lg:w-1/3 h-64 lg:h-auto flex items-center justify-center"
                style={{ background: `${theme.neutral}15` }}
              >
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2" />
                  <p className="text-sm">No thumbnail available</p>
                </div>
              </div>
            )}
            <div
              className="flex flex-col gap-4 p-6 flex-1"
              style={{ background: `linear-gradient(to right, ${theme.tertiary}15, ${theme.neutral}30)` }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 shadow-md" >
                  <AvatarImage src={getUserProfile(testOwner)} alt={getUsername(testOwner)} />
                  <AvatarFallback style={{ background: `${theme.secondary}40`, color: theme.primary }} className="font-semibold">
                    {getUserInitial(testOwner)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h2 
                    className="text-2xl md:text-3xl font-bold text-wrap break-words line-clamp-2"
                    style={{ color: theme.primary }}
                  >
                    <BookOpen className="inline-block w-5 h-5 md:w-6 md:h-6 mr-1" style={{ color: theme.primary }} />
                    {testData?.test?.title || "Untitled Test"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Created by {getUsername(testOwner)}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
              <div className="flex flex-wrap gap-2 mt-2">
                {stats.map((stat, idx) => (
                  <TooltipProvider key={idx}>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 py-1 px-3 text-sm transition-all hover:shadow-md"
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
              <div className='flex gap-4  items-end'>


 {(testData?.test?.category || (testData?.test?.tags && testData?.test?.tags.length > 0)) && (
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2" style={{ color: theme.primary }}>Category & Tags</label>
              <div className="flex flex-wrap gap-2">
                {testData?.test?.category && (
                  <Badge 
                    className="py-1 px-3"
                    style={{ background: theme.primary, color: theme.white }}
                  >
                    {testData?.test.category}
                  </Badge>
                )}
                {testData?.test?.tags && testData?.test.tags.map((tag:string, index:number) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="py-1 px-3"
                    style={{ borderColor: `${theme.secondary}80`, color: theme.secondary }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

            <div className="mb-6">
              {/* <label className="text-sm font-medium block mb-2" style={{ color: theme.primary }}>Test Statistics</label> */}
              <div className="flex flex-wrap gap-4">
      
                
                  <div className="flex items-center gap-2">
                   <ThumbsUp className="h-4 w-4" style={{ color: theme.secondary }} />
                    <span className="text-sm">{testData?.test?.likes?.length} Likes</span>
                  </div>
             
              </div>
            </div>
              </div>
              
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatBox 
              label="Total Questions" 
              value={progressData.totalQuestions} 
              color={theme.tertiary} 
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
              color={theme.accent}
              icon={<Trophy className="h-5 w-5" />}
            />
            <StatBox 
              label="Status"
              value={isCompleted ? "Completed" : "In Progress"}
              color={isCompleted ? theme.secondary : theme.accent}
              icon={isCompleted ? <CheckCircle className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
            />
          </div>

  

         
          

          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: theme.primary }}>Test Description</label>
            <div
              className="w-full min-h-36 p-4 rounded-md border overflow-auto whitespace-pre-wrap"
              style={{
                background: `${theme.neutral}10`,
                borderColor: `${theme.neutral}40`,
                color: 'inherit',
                maxHeight: '500px'
              }}
            >
              {testData?.test?.description || "No description provided."}
            </div>
          </div>
        </CardContent>

        <CardFooter
          className="p-6 border-t"
          style={{ borderColor: `${theme.neutral}40`, background: `${theme.neutral}10` }}
        >
          <div className="w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium" style={{ color: theme.primary }}>Progress</span>
              <span className="font-medium" style={{ color: theme.primary }}>{progressValue}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-1000 ease-in-out"
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
                  className="py-2 px-4 text-sm font-medium"
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
    className="p-4 rounded-lg shadow-sm transition-all hover:shadow-md"
    style={{ background: `${color}15` }}
  >
    <div className="flex justify-between items-center mb-2">
      <div className="text-xs font-medium" style={{ color }}>{label}</div>
      <div style={{ color }} className="opacity-80">{icon}</div>
    </div>
    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
  </div>
);

export default TestDetails;