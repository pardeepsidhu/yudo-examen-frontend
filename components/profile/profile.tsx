'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getMyProfile, sendResetPassLink, updateProfile, getUserProfileAndTests } from '@/app/api/user.api';
import { getMyAllTestSeries, getMyAllTestAttended, deleteMyTest } from '@/app/api/test.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Eye, Edit, CheckCircle, AlertCircle, Mail, LogOut, PlusCircle, Calendar, BookOpen, Trophy, FileText, BarChart3, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmAction } from '@/components/confirmAction';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function ProfilePage({ profileId }: { profileId?: string }) {
  const router = useRouter();


  const [profile, setProfile] = useState<any>(null);
  const [myTests, setMyTests] = useState<any[]>([]);
  const [attendedTests, setAttendedTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'created' | 'attended'>('created');
  const [resetLoading, setResetLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState<{ name: string; profile: string }>({ name: '', profile: '' });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if viewing own profile or another user's profile
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && !profileId) {
      router.push('/login');
      return;
    }

    const loggedInUser = user ? JSON.parse(user) : null;
    const isOwn = !profileId || (loggedInUser && loggedInUser._id === profileId);
    setIsOwnProfile(isOwn);

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isOwn) {
          // Fetch own profile
          const [profileRes, myTestsRes, attendedRes] = await Promise.all([
            getMyProfile(),
            getMyAllTestSeries(),
            getMyAllTestAttended()
          ]);
          if (profileRes?.success) setProfile(profileRes.user);
          if (myTestsRes?.success) setMyTests(myTestsRes.testSeries || []);
          if (attendedRes?.success) setAttendedTests(attendedRes.testSeries || []);
        } else {
          // Fetch other user's profile
          const res = await getUserProfileAndTests(profileId);
          if (res?.success) {
            setProfile(res.user);
            setMyTests(res.testSeries || []);
            setAttendedTests(res.attendedTests || []);
          } else {
            toast.error(res?.error || "Failed to load profile");
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      }
      setLoading(false);
    };
    fetchData();
  }, [profileId, router]);

  // Update userData when profile is loaded
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        profile: profile.profile || '',
      });
    }
  }, [profile]);

  // Delete test handler (only for own profile)
  const handleDeleteTest = async (id: string) => {
    const confirmed = await confirmAction(
      "Are you sure you want to delete this test series?",
      // { primary: '#3b82f6', secondary: '#8b5cf6' },
      "This action cannot be undone."
    );
    if (!confirmed) return;
    setDeletingId(id);
    try {
      const res = await deleteMyTest(id);
      if (res.success) {
        toast.success("Test series deleted successfully");
        setMyTests(prev => prev.filter(test => test?._id !== id));
      } else {
        toast.error(res.error || "Failed to delete test series");
      }
    } catch (error) {
      toast.error("Failed to delete test series");
    }
    setDeletingId(null);
  };

  // Forgot password handler (only for own profile)
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

  // Logout handler (only for own profile)
  const handleLogout = async () => {
    const confirmed = await confirmAction(
      "Are you sure you want to logout?",
      // { primary: '#3b82f6', secondary: '#8b5cf6' },
      "You will be logged out from this device."
    );
    if (!confirmed) return;
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  // Handle file upload (only for own profile)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await fetch('https://api.cloudinary.com/v1_1/testUserPardeep/image/upload', {
        method: 'post',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setUserData((prev) => ({ ...prev, profile: data.url }));

      const res = await updateProfile({ profile: data.url, name: userData.name });
      if (res.success) {
        setProfile(res.user);
        toast.success('Profile photo updated!');
      } else {
        toast.error(res.error || 'Failed to update profile photo');
      }
    } catch (error) {
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle profile update (only for own profile)
  const handleProfileUpdate = async () => {
    const res = await updateProfile({
      name: userData.name,
      profile: userData.profile,
    });
    if (res.success) {
      toast.success('Profile updated!');
      setEditMode(false);
      setProfile(res.user);
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  const statsCards = [
    {
      title: "Created Tests",
      value: myTests.length,
      icon: <BookOpen className="h-6 w-6" />,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Attended Tests",
      value: attendedTests.length,
      icon: <CheckCircle className="h-6 w-6" />,
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-1 sm:px-4 py-1 sm:py-8 relative z-10 max-w-7xl">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-8 mb-0 sm:mb-8">
          {/* Profile Card */}
          <Card className="lg:col-span-8 border-2 border-blue-200 dark:border-gray-700 gap-0 sm:gap-6 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-sm sm:rounded-md pb-0">
            <div className="relative flex items-center">
              {/* Top Gradient Banner */}
              <div className="absolute inset-0 h-42 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-90" />

              <div className="flex w-full flex-col sm:flex-row items-center justify-between pt-14 sm:pt-10 pb-6 sm:pb-8 px-1 sm:px-6 relative">
                {/* Profile Image */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 sm:top-8 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-2xl -mt-12 z-10 bg-white">
                  <Image
                    src={userData.profile || '/avatar_placeholder.jpeg'}
                    alt={userData.name || "User"}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Edit Photo Button */}
                  {editMode && isOwnProfile && (
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 bg-white/90 hover:bg-blue-50 border border-blue-200 dark:border-gray-600 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all"
                      onClick={() => fileInputRef.current?.click()}
                      title="Change photo"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-full backdrop-blur-sm">
                      <Loader2 className="animate-spin text-blue-600 h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Name & Email Section */}
                <div className="flex-1 items-center sm:items-start mt-5 sm:mt-0 sm:ml-6 flex flex-col gap-2">
                  {editMode && isOwnProfile ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="text-3xl font-extrabold text-gray-900 dark:text-white outline-none border-b-2 border-blue-300 focus:border-blue-500 transition-colors bg-transparent tracking-tight"
                    />
                  ) : (
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {userData.name || "User"}
                    </h2>
                  )}

                  <div className="flex items-center gap-2 mt-1 text-gray-700 dark:text-gray-300">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-base sm:text-lg font-medium truncate">{profile?.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isOwnProfile && (
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-2 sm:mt-5 sm:mt-0 sm:self-end">
                    {editMode ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                          onClick={handleProfileUpdate}
                          disabled={isUploadingPhoto}
                        >
                          {isUploadingPhoto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-blue-300 hover:border-blue-500 text-blue-600 font-semibold transition-all"
                          onClick={() => {
                            setEditMode(false);
                            setUserData({
                              name: profile?.name || '',
                              profile: profile?.profile || '',
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-blue-300 hover:border-blue-500 text-blue-600 font-semibold transition-all"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-blue-300 hover:border-blue-500 text-blue-600 font-semibold transition-all"
                          disabled={resetLoading}
                          onClick={handleForgotPassword}
                        >
                          {resetLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <LogOut className="hidden" />
                          )}
                          {resetLoading ? "Loading..." : "Reset Password"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-1" /> Logout
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>


            </div>


            {/* Stats Cards */}
            <div className="px-1 sm:px-4 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 mt-2">
                {statsCards.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`rounded-md p-4 flex items-center gap-4 shadow-lg border-2 border-blue-100 dark:border-gray-700 bg-gradient-to-br ${stat.gradient} text-white`}
                  >
                    <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">{stat.title}</p>
                      <p className="text-3xl font-black">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-4 gap-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-t-4 border-blue-500 dark:border-cyan-500  rounded-3xl p-10 w-full text-center relative overflow-hidden rounded-b-none!">

              {/* Decorative glow or pulse background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,#60a5fa,#3b82f6,transparent)] dark:bg-[radial-gradient(circle_at_70%_70%,#06b6d4,#3b82f6,transparent)]"></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-blue-600 dark:text-cyan-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l6-6 4 4 8-8" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-blue-600 dark:text-cyan-400 counter">12k+</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Tests Created</p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-green-600 dark:text-green-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5 4a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 counter">99%</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">User Satisfaction</p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-yellow-600 dark:text-yellow-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 counter">20+</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Coding Languages</p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-purple-600 dark:text-purple-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400 counter">50k+</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Active Learners</p>
              </div>

            </div>

          </Card>

          {/* Create Test Card - Only for own profile */}
          {/* {isOwnProfile && ( */}
            <Card className="lg:col-span-4 relative overflow-hidden border border-blue-100/60 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-b from-white/95 to-blue-50/60 dark:from-gray-900/95 dark:to-gray-800/90 backdrop-blur-xl rounded-xl min-h-[24rem] flex flex-col justify-between">

              {/* Decorative gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent opacity-60 blur-2xl pointer-events-none" />

              <CardHeader className="relative text-center pb-3">
                <CardTitle className="font-extrabold text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  Create Your Next Test
                </CardTitle>
                <p className="text-base text-gray-600 dark:text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
                  Build engaging and insightful tests to evaluate your students’ skills effectively.
                </p>
              </CardHeader>

              <CardContent className="relative z-10 flex flex-col items-center space-y-6 pb-8">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-4 text-center w-full">
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/80 shadow-inner">
                    <FileText className="mx-auto text-blue-600 dark:text-blue-400 h-6 w-6 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Tests</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">42</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/80 shadow-inner">
                    <Users className="mx-auto text-blue-600 dark:text-blue-400 h-6 w-6 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Participants</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">1,256</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-800/80 shadow-inner">
                    <BarChart3 className="mx-auto text-blue-600 dark:text-blue-400 h-6 w-6 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg. Score</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">78%</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all duration-500 transform hover:scale-105">
                    <PlusCircle className="h-10 w-10" />
                  </div>

                  <Link href="/createTest" className="w-full mt-6">
                    <Button
                      className="flex items-center justify-center gap-2 w-full font-semibold tracking-wide 
              bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
              text-white rounded-lg text-lg py-5 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <PlusCircle className="h-5 w-5" /> Create New Test
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Empower your students with interactive, data-driven learning experiences.
                </p>
              </CardContent>
            </Card>
          {/* )} */}
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center justify-center sm:justify-between mb-2 sm:mb-8 flex-wrap gap-4 pt-2 sm:pt-0">
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-md p-1.5 shadow-lg border-2 border-blue-200 dark:border-gray-700">
            <button
              className={`px-6 py-2.5 rounded-sm font-bold transition-all text-base flex items-center gap-2 ${activeTab === 'created'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              onClick={() => setActiveTab('created')}
            >
              <BookOpen className="h-5 w-5" /> {isOwnProfile ? 'My Tests' : 'Tests'}
            </button>
            <button
              className={`px-6 py-2.5 rounded-sm font-bold transition-all text-base flex items-center gap-2 ${activeTab === 'attended'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              onClick={() => setActiveTab('attended')}
            >
              <CheckCircle className="h-5 w-5" /> Attended Tests
            </button>
          </div>

          <div className="hidden sm:block">
            <Link href="/test">
              <Button
                variant="outline"
                className="flex items-center gap-2 font-semibold border-2 border-blue-300 hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                Explore More Tests
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="h-[35vh] w-[100%] flex items-center justify-center  relative overflow-hidden">
                          {/* Animated background blobs */}
                          
          
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
                                Loading tests...
                              </p>
                              <div className="flex items-center justify-center gap-1">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200" />
                                <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce animation-delay-400" />
                              </div>
                            </div>
                          </div>
          
                        </div>
        ) : (
          <>
            {/* Created Tests */}
            {activeTab === 'created' && (
              <>
                {myTests.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-md shadow-xl p-10 text-center border-2 border-blue-100 dark:border-gray-700">
                    <div className="mb-4">
                      <AlertCircle className="h-16 w-16 mx-auto text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No tests created yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {isOwnProfile ? "Start creating your first test series to challenge students." : "This user hasn't created any test series yet."}
                    </p>
                    {isOwnProfile && (
                      <Link href="/createTest">
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg">
                          <PlusCircle className="h-4 w-4 mr-2" /> Create First Test
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
                    {myTests.map((test, index) => (
                      <Card
                        key={test?._id}
                        className="group relative rounded-md h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-white sm:rounded-2xl overflow-hidden"
                      >
                        {/* Animated gradient border on hover */}
                        <div className="absolute inset-0 rounded-md sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl" />

                        <div className="relative h-56 w-full overflow-hidden">
                          {/* Image with parallax-like zoom */}
                          <Image
                            src={test?.thumbnail || '/placeholder.webp'}
                            alt={test?.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-125"
                          />

                          {/* Sophisticated gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                          {/* Animated shimmer effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>

                          {/* Category Badge - Top Left */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white border-0 px-4 py-1.5 shadow-xl text-xs font-bold tracking-wide uppercase group-hover:scale-105 transition-transform duration-300">
                              {test?.category}
                            </Badge>
                          </div>

                          {/* Trending Indicator - if recently created */}
                          {new Date().getTime() - new Date(test?.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                            <div className="absolute top-4 right-0 -translate-x-1/2">
                              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                NEW
                              </div>
                            </div>
                          )}

                          {/* Date Badge - Bottom Right */}
                          <div className="absolute bottom-4 right-4">
                            <div className="flex items-center gap-2 text-white text-sm font-semibold bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(test?.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: new Date(test?.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pt-3 sm:pt-6 px-6">
                          <CardTitle className="line-clamp-2 text-xl font-extrabold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300 leading-tight">
                            {test?.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-2 sm:pb-4">
                          <div
                            className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors h-30 overflow-hidden overflow-y-scroll"
                            dangerouslySetInnerHTML={{ __html: test?.description }}
                          />

                          {/* Tags Section */}
                          <div className="flex flex-wrap gap-2 pt-1 sm:pt-3 pb-1 sm:pb-2">
                            {test?.tags?.slice(0, 3).map((tag:any) => (
                              <Badge
                                key={tag}
                                className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 transition-all duration-200 px-3 py-1 font-medium"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {test?.tags?.length > 3 && (
                              <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 px-3 py-1 font-medium">
                                +{test?.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          {isOwnProfile && (
                            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                              <Link href={`/createTest?testId=${test?._id}`} className="flex-1">
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:via-blue-700 hover:to-sky-600 text-white"
                                >
                                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                                  Edit
                                </Button>
                              </Link>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white"
                                disabled={deletingId === test?._id}
                                onClick={() => handleDeleteTest(test?._id)}
                              >
                                {deletingId === test?._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    Delete
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Attended Tests */}
            {activeTab === 'attended' && (
              <>
             {attendedTests.length === 0 ? (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center border-0 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-sky-500/10 opacity-50" />
    <div className="relative z-10">
      <div className="mb-6">
        <Trophy className="h-20 w-20 mx-auto text-purple-500" />
      </div>
      <h3 className="text-2xl font-extrabold mb-3 text-gray-900 dark:text-white">No tests attended yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        {isOwnProfile ? "Explore available tests and challenge yourself." : "This user hasn't attended any tests yet."}
      </p>
      {isOwnProfile && (
        <Link href="/test">
          <Button className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:via-blue-700 hover:to-sky-600 text-white font-bold shadow-xl px-8 py-3 rounded-full transform hover:-translate-y-1 transition-all duration-300">
            Explore Tests
          </Button>
        </Link>
      )}
    </div>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {attendedTests.map((attended, index) => {
      const test = attended.test;
      const isCompleted = attended.completed;
      const passStatus = attended.percentageScore >= 70;

      return (
        <Card
          key={attended._id}
          className="group relative rounded-md h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-white dark:bg-gray-800 sm:rounded-2xl overflow-hidden"
        >
          {/* Animated gradient border on hover */}
          <div className="absolute inset-0 rounded-md sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl" />
          
          <div className="relative h-56 w-full overflow-hidden">
            {/* Image with parallax-like zoom */}
            <Image
              src={test?.thumbnail || '/placeholder.webp'}
              alt={test?.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-125"
            />
            
            {/* Sophisticated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
            
            {/* Animated shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
            
            {/* Status Badge - Top Right */}
            <div className="absolute top-4 right-4">
              <Badge
                className={`font-bold shadow-xl text-xs px-4 py-1.5 border-0 tracking-wide uppercase group-hover:scale-105 transition-transform duration-300 ${
                  isCompleted
                    ? passStatus
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                }`}
              >
                {isCompleted ? "Completed" : 'In Progress'}
              </Badge>
            </div>
            
            {/* Category Badge - Top Left */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white border-0 px-4 py-1.5 shadow-xl text-xs font-bold tracking-wide uppercase group-hover:scale-105 transition-transform duration-300">
                {test?.category}
              </Badge>
            </div>
            
            {/* Date Badge - Bottom Left */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 text-white text-sm font-semibold bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(test?.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: new Date(test?.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                  })}
                </span>
              </div>
            </div>
          </div>

          <CardHeader className="pt-3 sm:pt-6 px-4 sm:px-6">
            <CardTitle className="line-clamp-2 text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300 leading-tight">
              {test?.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-2 sm:pb-6">
            {/* Score Section with Gradient Background */}
            <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-sm border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 block">
                    Score: {attended.score}/{test?.questions?.length || 0}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Questions answered</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {attended.percentageScore || 0}%
                </span>
              </div>
            </div>

            <div 
              className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors h-25 overflow-hidden overflow-y-scroll"
              dangerouslySetInnerHTML={{ __html: test?.description }}
            />

            {/* Tags Section */}
            <div className="flex flex-wrap gap-2 pt-2 sm:pt-3 pb-1 sm:pb-2">
              {test?.tags?.slice(0, 2).map((tag:any) => (
                <Badge
                  key={tag}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 hover:from-indigo-100 hover:to-blue-100 transition-all duration-200 px-3 py-1 font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {test?.tags?.length > 2 && (
                <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 px-3 py-1 font-medium">
                  +{test?.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <Link href={`/test/${test?._id}`} className="w-full block">
                <Button className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 hover:from-indigo-700 hover:via-blue-700 hover:to-sky-600 text-white font-bold shadow-xl rounded-sm transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 py-3">
                  <Eye className="h-4 w-4" />
                  {isCompleted ? 'Review Test' : 'Continue Test'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
)}
              </>
            )}
          </>
        )}

        {/* Mobile Action Button - Only for own profile */}
        {isOwnProfile && (
          <div className="sm:hidden fixed bottom-6 right-6 z-20">
            <Link href="/test">
              <Button className="rounded-full h-14 w-14 flex items-center justify-center shadow-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                <PlusCircle className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}