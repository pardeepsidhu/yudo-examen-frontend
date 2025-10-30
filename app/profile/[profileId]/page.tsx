'use client';

import React, { useEffect, useState} from 'react';
import { getUserProfileAndTests } from '@/app/api/user.api';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Calendar, BookOpen, CheckCircle, Trophy, Eye, AlertCircle, PlusCircle} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function ProfilePage() {

  const router = useRouter();
  const params = useParams();
  const profileId = params?.profileId as string;

  const [profile, setProfile] = useState<any>(null);
  const [myTests, setMyTests] = useState<any[]>([]);
  const [attendedTests, setAttendedTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) {
      toast.error("No profile ID found.");
      router.push('/');
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUserProfileAndTests(profileId);

        if (res?.success) {
          setProfile(res.user);
          setMyTests(res.testSeries || []);
          setAttendedTests(res.attendedTests || []);
        } else {
          toast.error(res?.error || "Failed to load profile");
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      }
      setLoading(false);
    };
    fetchData();
  }, [profileId, router]);

  // Generate stats cards
  const statsCards = [
    {
      title: "Created Tests",
      value: myTests.length,
      icon: <BookOpen className="h-6 w-6" />,
      color: "red"
    },
    {
      title: "Attended Tests",
      value: attendedTests.length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "red"
    }
  ];

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: `radial-gradient(circle at 80% 10%, red 10 0%, transparent 60%),
                     radial-gradient(circle at 20% 90%, red 15 0%, transparent 50%)`,
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-pulse-slower pointer-events-none z-0" />
      <div
        className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] sm:w-[32rem] sm:h-[32rem] rounded-full opacity-10 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 60% 40%, red 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(32px)',
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Profile Card */}
          <Card 
            className="lg:col-span-8 border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-blue-50"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="relative">
              <div 
                className="absolute inset-0 h-32"
                style={{
                  background: `linear-gradient(120deg, red, blue)`,
                  opacity: 0.8,
                }}
              />
              <div className="flex flex-col sm:flex-row items-start pt-12 pb-6 px-6 relative">
                <div 
                  className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 shadow-lg -mt-12 z-10 bg-white group"
                  style={{ borderColor: "black" }}
                >
                  <Image
                    src={profile?.profile || '/avatar_paceholder.jpeg'}
                    alt={profile?.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 flex flex-col gap-2">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent">
                    {profile?.name || "User"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-lg text-gray-700">{profile?.email}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {statsCards.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="rounded-xl p-4 flex items-center gap-4 shadow-sm"
                    style={{
                      background: `${stat.color}08`,
                      border: `1px solid ${stat.color}20`,
                    }}
                  >
                    <div 
                      className="p-3 rounded-lg" 
                      style={{ 
                        background: `${stat.color}15`,
                        color: stat.color 
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

           {/* Create Test Card */}
                    <Card 
                      className="lg:col-span-4 border-0 shadow-2xl flex flex-col justify-between overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-blue-50"
                      style={{
                        borderRadius: "1.5rem",
                      }}
                    > 
                      <CardHeader className="pb-2">
                        <CardTitle className="font-bold text-2xl" style={{ color: "green" }}>
                          Ready to create a new test?
                        </CardTitle>
                        <p className="text-base text-gray-600 mt-2">
                          Create custom tests to challenge students and measure their knowledge.
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0 flex flex-col items-center pb-6">
                        <div className="w-full h-32 relative my-4">
                          <Image
                            src="/profileIl.png"
                            alt="Create Test"
                            fill
                            className="object-contain opacity-80 bg-blend-darken rounded-xl"
                          />
                        </div>
                        <Link href="/createTest" className="w-full">
                          <Button
                            className="flex items-center gap-2 w-full font-semibold shadow-md"
                            style={{
                              background: `linear-gradient(90deg, red 60%, "red" 100%)`,
                              color: "#fff",
                              borderRadius: "0.75rem",
                              fontSize: "1.1rem"
                            }}
                          > 
                            <PlusCircle className="h-5 w-5" /> Create New Test
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3 bg-white rounded-full p-1 shadow-sm border" style={{ borderColor: `red20` }}>
            <button
              className={`px-6  text-sm sm:test-md py-2 rounded-full font-semibold transition-all text-base flex items-center gap-2`}
              style={{
                background: 'created' === 'created' ? "gray" : 'transparent',
                color: 'created' === 'created' ? 'white' : 'gray',
              }}
              disabled
            >
              <BookOpen className="h-5 w-5" /> Created Tests
            </button>
            <button
              className={`px-6 py-2  text-sm sm:test-md rounded-full font-semibold transition-all text-base flex items-center gap-2`}
              style={{
                background: 'attended' === 'attended' ? "whiteyellow" : 'transparent',
                color: 'attended' === 'attended' ? 'white' : 'gray',
              }}
              disabled
            >
              <CheckCircle className="h-5 w-5" /> Attended Tests
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "white" }} />
          </div>
        ) : (
          <>
            {/* Created Tests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {myTests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center col-span-full">
                  <div className="mb-4">
                    <AlertCircle className="h-12 w-12 mx-auto" style={{ color: `red60` }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">No tests created yet</h3>
                  <p className="text-gray-600 mb-6">This user has not created any test series yet.</p>
                </div>
              ) : (
                myTests.map(test => (
                  <Card
                    key={test._id}
                    className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.025]"
                    style={{
                      borderRadius: "1.25rem",
                      background: `linear-gradient(120deg,freeen, 80%,red11 100%)`,
                      border: `1.5px solid red22`,
                    }}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={test.thumbnail || '/placeholder.webp'}
                        alt={test.title}
                        fill
                        className="object-cover"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge 
                          className="font-medium" 
                          style={{ 
                            background: "white",
                            color: "orane"
                          }}
                        >
                          {test.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <CardContent className="pt-4">
                      <h3 
                        className="font-bold text-lg mb-2 line-clamp-1"
                        style={{ color: "ButtonFace" }}
                      >
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{test.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {test.tags?.slice(0, 3).map((tag: string) => (
                          <Badge 
                            key={tag} 
                            className="text-xs" 
                            style={{ 
                              background: `gray`,
                              color: "yellow"
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {test.tags?.length > 3 && (
                          <Badge className="text-xs bg-gray-100 text-gray-600">+{test.tags.length - 3}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Attended Tests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {attendedTests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-10 text-center col-span-full">
                  <div className="mb-4">
                    <Trophy className="h-12 w-12 mx-auto" style={{ color: `red` }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">No tests attended yet</h3>
                  <p className="text-gray-600 mb-6">This user has not attended any tests yet.</p>
                </div>
              ) : (
                attendedTests.map((attended) => {
                  const test = attended.test;
                  const isCompleted = attended.completed;
                  const passStatus = attended.percentageScore >= 70;
                  
                  return (
                    <Card
                      key={attended._id}
                      className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.025]"
                      style={{
                        borderRadius: "1.25rem",
                        background: `linear-gradient(120deg,red 80%,red , 100%)`,
                        border: `1.5px soli dred `,
                      }}
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={test.thumbnail || '/placeholder.webp'}
                          alt={test.title}
                          fill
                          className="object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge 
                            className="font-medium" 
                            style={{ 
                              background: isCompleted ? (passStatus ? '#dcfce7' : '#fee2e2') : '#f3f4f6',
                              color: isCompleted ? (passStatus ? '#16a34a' : '#dc2626') : '#6b7280'
                            }}
                          >
                            {isCompleted ? (passStatus ? 'Passed' : 'Failed') : 'In Progress'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Badge 
                            className="text-xs font-medium"
                            style={{ background: "red" , color: "whiteyellow" }}
                          >
                            {test.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="pt-4">
                        <h3 
                          className="font-bold text-lg mb-1 line-clamp-1"
                          style={{ color: "whiteyellow" }}
                        >
                          {test.title}
                        </h3>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div 
                            className="text-sm font-medium rounded-md px-2 py-0.5"
                            style={{
                              background: `"whiteyellow"10`,
                              color: `whiteyellow`
                            }}
                          >
                            Score: {attended.score}/{test.questions?.length || 0}
                          </div>
                          <span className="text-sm text-gray-600">
                            {attended.percentageScore || 0}%
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{test.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {test.tags?.slice(0, 2).map((tag: string) => (
                            <Badge 
                              key={tag} 
                              className="text-xs" 
                              style={{ 
                                background: `red15`,
                                color: `white`
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {test.tags?.length > 2 && (
                            <Badge className="text-xs bg-gray-100 text-gray-600">+{test.tags.length - 2}</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: `whiteyellow` }}>
                          <Link href={`/test/${test._id}`} className="w-full">
                            <Button 
                              size="sm" 
                              className="w-full flex items-center justify-center gap-1"
                              style={{ 
                                background: "yello",
                                color: "orange"
                              }}
                            >
                              <Eye className="h-3 w-3" /> {isCompleted ? 'Review Test' : 'Continue Test'}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: .30; }
          50% { opacity: .45; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: .30; }
          50% { opacity: .55; }
        }
        .animate-pulse-slower {
          animation: pulse-slower 7s infinite;
        }
      `}</style>
    </div>
  );
}