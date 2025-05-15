'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/theme.context';
import { getMyProfile, sendResetPassLink } from '../api/user.api';
import { getMyAllTestSeries, getMyAllTestAttended, deleteMyTest } from '../api/test.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Eye, Clock, Edit, CheckCircle, AlertCircle, User as UserIcon, Mail, LogOut, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmAction } from '@/components/confirmAction';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// You can import your static side or feature component here if you want
// import { LoginStaticSide } from '../login/staticSide';

export default function ProfilePage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [myTests, setMyTests] = useState<any[]>([]);
  const [attendedTests, setAttendedTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'created' | 'attended'>('created');
  const [resetLoading, setResetLoading] = useState(false);

  // Fetch profile and tests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, myTestsRes, attendedRes] = await Promise.all([
          getMyProfile(),
          getMyAllTestSeries(),
          getMyAllTestAttended()
        ]);
        if (profileRes?.success) setProfile(profileRes.user);
        else toast.error(profileRes?.error || "Failed to load profile");

        if (myTestsRes?.success) setMyTests(myTestsRes.testSeries || []);
        else toast.error(myTestsRes?.error || "Failed to load your test series");

        if (attendedRes?.success) setAttendedTests(attendedRes.testSeries || []);
        else toast.error(attendedRes?.error || "Failed to load attended tests");
      } catch (error) {
        toast.error("Failed to load profile data");
      }
      // console.log(attendedRes)
      setLoading(false);
    };
    fetchData();
  }, []);

  // Delete test handler
  const handleDeleteTest = async (id: string) => {
    console.log(attendedTests)
    const confirmed = await confirmAction(
      "Are you sure you want to delete this test series?",
      theme,
      "This action cannot be undone."
    );
    if (!confirmed) return;
    setDeletingId(id);
    try {
      const res = await deleteMyTest(id);
      if (res.success) {
        toast.success("Test series deleted successfully");
        setMyTests(prev => prev.filter(test => test._id !== id));
      } else {
        toast.error(res.error || "Failed to delete test series");
      }
    } catch (error) {
      toast.error("Failed to delete test series");
    }
    setDeletingId(null);
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!profile?.email) {
      toast.error("No email found for this user.");
      return;
    }
    setResetLoading(true);
    try {
      const res = await sendResetPassLink(profile.email);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message || "Reset password link sent!");
      }
    } catch (error) {
      toast.error("Failed to send reset password link.");
    }
    setResetLoading(false);
  };

  // Logout handler with confirmation
  const handleLogout = async () => {
    const confirmed = await confirmAction(
      "Are you sure you want to logout?",
      theme,
      "You will be logged out from this device."
    );
    if (!confirmed) return;
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row relative overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${theme.neutral} 60%, ${theme.primary}22 100%)`,
      }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none z-0"
        style={{
          backgroundColor: theme.tertiary,
          filter: 'blur(16px)',
          transform: 'translate(40%, -40%)',
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-30 pointer-events-none z-0"
        style={{
          backgroundColor: theme.accent,
          filter: 'blur(16px)',
          transform: 'translate(-30%, 30%)',
        }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-[32rem] h-[32rem] rounded-full opacity-10 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${theme.primary} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(24px)',
        }}
      ></div>
      {/* End Decorative background blobs */}

      {/* Left: Profile and tabs */}
      <div className="w-full md:w-2/3 mx-auto py-8 px-2 sm:px-4 md:px-8 flex flex-col gap-10 relative z-10">
        {/* Profile Card */}
        <Card
          className="shadow-2xl border-0"
          style={{
            background: `linear-gradient(120deg,${theme.white} 80%,${theme.primary}11 100%)`,
            borderRadius: "1.5rem",
          }}
        >
          <CardHeader className="flex flex-col sm:flex-row items-center gap-8 py-10">
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: theme.primary }}>
              <Image
                src={profile?.profile || '/avatar_paceholder.jpeg'}
                alt={profile?.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3 items-center sm:items-start">
              <div className="flex items-center gap-3">
                <UserIcon className="h-6 w-6 text-gray-400" />
                <span className="text-3xl font-extrabold tracking-tight" style={{ color: theme.primary }}>
                  {profile?.name || "User"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 text-lg">{profile?.email}</span>
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                <Badge style={{ background: theme.primary + "15", color: theme.primary, fontWeight: 600 }}>
                  {myTests.length} Created
                </Badge>
                <Badge style={{ background: theme.secondary + "15", color: theme.secondary, fontWeight: 600 }}>
                  {attendedTests.length} Attended
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  style={{ color: theme.primary, borderColor: theme.primary }}
                  disabled={resetLoading}
                  onClick={handleForgotPassword}
                >
                  {resetLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Forgot Password?"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="ml-2 flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs + Create Test Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
          <div className="flex gap-4">
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-all text-base ${
                activeTab === 'created'
                  ? 'shadow text-white'
                  : 'text-gray-600'
              }`}
              style={{
                background: activeTab === 'created' ? theme.primary : theme.white,
                border: `2px solid ${theme.primary}`,
              }}
              onClick={() => setActiveTab('created')}
            >
              My Test Series
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-all text-base ${
                activeTab === 'attended'
                  ? 'shadow text-white'
                  : 'text-gray-600'
              }`}
              style={{
                background: activeTab === 'attended' ? theme.secondary : theme.white,
                border: `2px solid ${theme.secondary}`,
              }}
              onClick={() => setActiveTab('attended')}
            >
              Attended Tests
            </button>
          </div>
          <Link href="/createTest">
            <Button
              className="flex items-center gap-2 font-semibold shadow-md"
              style={{
                background: `linear-gradient(90deg, ${theme.primary} 60%, ${theme.secondary} 100%)`,
                color: "#fff",
                borderRadius: "2rem",
                paddingLeft: "1.5rem",
                paddingRight: "1.5rem",
                fontSize: "1.1rem"
              }}
            >
              <PlusCircle className="h-5 w-5" /> Create Test
            </Button>
          </Link>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'created' && (
            <Card
              className="shadow-lg border-0"
              style={{
                background: `linear-gradient(120deg,${theme.white} 80%,${theme.primary}11 100%)`,
                borderRadius: "1.25rem",
              }}
            >
              <CardContent className="py-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
                  </div>
                ) : myTests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No test series created yet.</p>
                    <Link href="/createTest">
                      <Button className="mt-3" style={{ background: theme.primary, color: theme.white }}>
                        <PlusCircle className="h-5 w-5 mr-1" /> Create New Test Series
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {myTests.map(test => (
                      <Card
                        key={test._id}
                        className="relative group border-0 shadow-md hover:shadow-xl transition-all duration-200"
                        style={{
                          background: `linear-gradient(120deg,${theme.white} 80%,${theme.primary}11 100%)`,
                          border: `1.5px solid ${theme.primary}22`,
                          borderRadius: "1.25rem",
                        }}
                      >
                        <div className="relative h-36 w-full overflow-hidden ">
                          <Image
                            src={test.thumbnail || '/placeholder.webp'}
                            alt={test.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center gap-3 text-white text-xs z-10">
                            <Clock className="h-4 w-4 ml-3" />
                            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="line-clamp-2 text-lg" style={{ color: theme.primary }}>
                            {test.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{test.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge style={{ color: theme.primary, background: theme.primary + "10" }}>
                              {test.category}
                            </Badge>
                            {test.tags?.slice(0, 2).map(tag => (
                              <Badge key={tag} className="bg-blue-50 text-blue-600">{tag}</Badge>
                            ))}
                            {test.tags?.length > 2 && (
                              <Badge className="bg-gray-100 text-gray-600">+{test.tags.length - 2}</Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.primary + "22" }}>
                            <Link href={`/createTest?testId=${test._id}`}>
                              <Button size="sm" variant="outline" className="flex items-center gap-1" style={{ color: theme.primary, borderColor: theme.primary }}>
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex items-center gap-1"
                              disabled={deletingId === test._id}
                              onClick={() => handleDeleteTest(test._id)}
                            >
                              {deletingId === test._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'attended' && (
            <Card
              className="shadow-lg border-0"
              style={{
                background: `linear-gradient(120deg,${theme.white} 80%,${theme.secondary}11 100%)`,
                borderRadius: "1.25rem",
              }}
            >
              <CardContent className="py-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.secondary }} />
                  </div>
                ) : attendedTests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No test series attended yet.</p>
                    <Link href="/test">
                      <Button className="mt-3" style={{ background: theme.secondary, color: theme.white }}>
                        Explore Test Series
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {attendedTests.map((attended) => {
                      const test = attended.test;
                      return (
                        <Card
                          key={attended._id}
                          className="relative border-0 shadow-md transition-all duration-200 hover:shadow-2xl hover:scale-[1.025] group"
                          style={{
                            background: `linear-gradient(120deg,${theme.white} 80%,${theme.secondary}11 100%)`,
                            border: `1.5px solid ${theme.secondary}22`,
                            borderRadius: "1.25rem",
                          }}
                        >
                          <div className="relative h-36 w-full overflow-hidden ">
                            <Image
                              src={test.thumbnail || '/placeholder.webp'}
                              alt={test.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 pointer-events-none group-hover:opacity-90 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center gap-3 text-white text-xs z-10">
                              <Clock className="h-4 w-4 ml-3" />
                              <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="line-clamp-2 text-lg" style={{ color: theme.secondary }}>
                              {test.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{test.description}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge style={{ color: theme.secondary, background: theme.secondary + "10" }}>
                                {test.category}
                              </Badge>
                              {test.tags?.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} className="bg-blue-50 text-blue-600">{tag}</Badge>
                              ))}
                              {test.tags?.length > 2 && (
                                <Badge className="bg-gray-100 text-gray-600">+{test.tags.length - 2}</Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.secondary + "22" }}>
                              <Link href={`/test/${test._id}`}>
                                <Button size="sm" variant="outline" className="flex items-center gap-1" style={{ color: theme.secondary, borderColor: theme.secondary }}>
                                  <Eye className="h-4 w-4" /> View
                                </Button>
                              </Link>
                              <div className="flex flex-col items-end">
                                <Badge className="bg-green-100 text-green-700 mb-1">
                                  Attended
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Score: {attended.score}/{test.questions?.length || 0} ({attended.percentageScore || 0}%)
                                </span>
                                <span className="text-xs text-gray-500">
                                  {attended.completed ? "Completed" : "In Progress"}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Right: Feature/Static Side */}
      <div className="hidden md:flex flex-col items-center w-1/3 px-8 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-100 shadow-2xl rounded-l-3xl relative z-10">
        <div className="mb-8">
          <img
            src="https://img.freepik.com/premium-vector/students-immerse-themselves-books-sharing-insights-ideas-colorful-learning-environment-education-learning-concept-likes-read-people-read-students-study_538213-157433.jpg"
            alt="Profile Illustration"
            width={280}
            height={180}
            style={{ mixBlendMode: "multiply", borderRadius: "1.5rem" }}
          />
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: theme.primary }}>Your Profile</h3>
        <p className="text-gray-600 text-center mb-6 text-base">
          Manage your test series, see your progress, and explore new challenges.
        </p>
        <ul className="space-y-3 text-gray-700 text-base">
          <li>🌟 <span style={{ color: theme.primary }}>Create</span> and edit your own test series</li>
          <li>📝 <span style={{ color: theme.secondary }}>Attempt</span> tests and track your results</li>
          <li>🔒 Secure your account with password reset</li>
          <li>🚀 Explore more tests and grow your skills</li>
        </ul>
      </div>
    </div>
  );
}