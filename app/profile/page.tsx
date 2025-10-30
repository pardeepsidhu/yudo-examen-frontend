'use client';

import React, { useEffect, useState, useRef } from 'react';

import { getMyProfile, sendResetPassLink, updateProfile } from '../api/user.api';
import { getMyAllTestSeries, getMyAllTestAttended, deleteMyTest } from '../api/test.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Eye, Edit, CheckCircle, AlertCircle,  Mail, LogOut, PlusCircle, Calendar, BookOpen, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmAction } from '@/components/confirmAction';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {

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
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  // Fetch profile and tests
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
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
        if(error)
        toast.error("Failed to load profile data" );
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update userData when profile is loaded
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        profile: profile.profile || '',
      });
    }
  }, [profile]);

  // Delete test handler
  const handleDeleteTest = async (id: string) => {
    const confirmed = await confirmAction(
      "Are you sure you want to delete this test series?",
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
      if(error)
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
      if(error)
      toast.error("Failed to send reset password link.");
    }
    setResetLoading(false);
  };

  // Logout handler with confirmation
  const handleLogout = async () => {
    const confirmed = await confirmAction(
      "Are you sure you want to logout?",
      "You will be logged out from this device."
    );
    if (!confirmed) return;
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  // ...existing code...

// Handle file upload to Cloudinary, update preview, and update backend
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploadingPhoto(true);
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Your Cloudinary upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/testUserPardeep/image/upload', {
      method: 'post',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    // Update preview immediately
    setUserData((prev) => ({ ...prev, profile: data.url }));

    // Update backend with new profile image
    const res = await updateProfile({ profile: data.url, name: userData.name });
    if (res.success) {
      setProfile(res.user); // update local profile state
      toast.success('Profile photo updated!');
    } else {
      toast.error(res.error || 'Failed to update profile photo');
    }
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    toast.error('Failed to upload profile photo');
  } finally {
    setIsUploadingPhoto(false);
  }
};

  // Handle profile update (name and/or profile photo)
  const handleProfileUpdate = async () => {
    const res = await updateProfile({
      name: userData.name,
      profile: userData.profile,
    });
    if (res.success) {
      toast.success('Profile updated!');
      setEditMode(false);
      setProfile(res.user); // update local profile state
    } else {
      toast.error(res.error || 'Failed to update profile');
    }
  };

  // Generate stats cards
  const statsCards = [
    {
      title: "Created Tests",
      value: myTests.length,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'red'
    },
    {
      title: "Attended Tests",
      value: attendedTests.length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'yellow'
    }
  ];

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: `radial-gradient(circle at 80% 10%, red10 0%, transparent 60%),
                     radial-gradient(circle at 20% 90%, whiteyellow15 0%, transparent 50%)`,
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
                  background: `linear-gradient(120deg, red, whiteyellow)`,
                  opacity: 0.8,
                }}
              />
              <div className="flex flex-col sm:flex-row items-start pt-12 pb-6 px-6 relative">
                <div 
                  className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 shadow-lg -mt-12 z-10 bg-white group"
                  style={{ borderColor: 'white' }}
                >
                  <Image
                    src={userData.profile || '/avatar_paceholder.jpeg'}
                    alt={userData.name || "User"}
                    fill
                    className="object-cover"
                  />
                  {editMode && (
                    <button
                      type="button"
                      className="absolute bottom-1 right-1 bg-white/80 rounded-full p-1 shadow hover:bg-indigo-100 transition"
                      onClick={() => fileInputRef.current?.click()}
                      title="Change photo"
                    >
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
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
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                      <Loader2 className="animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 flex flex-col gap-2">
                  {editMode ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={e => setUserData({ ...userData, name: e.target.value })}
                      className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent outline-none border-b-2 border-indigo-200 focus:border-indigo-500 transition"
                    />
                  ) : (
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent">
                      {userData.name || "User"}
                    </h2>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-lg text-gray-700">{profile?.email}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:self-end">
                  {editMode ? (
                    <>
                      <Button
                        size="sm"
                        className="text-xs"
                        style={{ background: 'red', color: "#fff" }}
                        onClick={handleProfileUpdate}
                        disabled={isUploadingPhoto}
                      >
                        {isUploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        style={{ color: 'red', borderColor: 'red' }}
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

                    // ...inside your profile card, after the email and before the edit/save buttons...

<div className="flex items-center gap-2 mt-2">
  <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      style={{ color: 'red', borderColor: 'red' }}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
  <Button
    size="sm"
    variant="outline"
    className="text-xs"
    style={{ color: 'red', borderColor: 'red' }}
    disabled={resetLoading}
    onClick={handleForgotPassword}
  >
    {resetLoading ? (
      <Loader2 className="h-4 w-4 animate-spin mr-1" />
    ) : (
      "Reset Password"
    )}
  </Button>
  <Button
    size="sm"
    variant="destructive"
    className="text-xs flex items-center gap-1"
    onClick={handleLogout}
  >
    <LogOut className="h-4 w-4" /> Logout
  </Button>

                    
                    </div>
                  )}
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
              <CardTitle className="font-bold text-2xl" style={{ color: 'red' }}>
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
                    background: `linear-gradient(90deg, red 60%, whiteyellow 100%)`,
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
              className={`px-6 py-2 text-sm sm:test-md rounded-full font-semibold transition-all text-base flex items-center gap-2`}
              style={{
                background: activeTab === 'created' ? 'red' : 'transparent',
                color: activeTab === 'created' ? 'white' : 'gray',
              }}
              onClick={() => setActiveTab('created')}
            >
              <BookOpen className="h-5 w-5" /> My Tests
            </button>
            <button
              className={`px-6 py-2 text-sm sm:test-md  rounded-full font-semibold transition-all text-base flex items-center gap-2`}
              style={{
                background: activeTab === 'attended' ? 'yellow' : 'transparent',
                color: activeTab === 'attended' ? 'white' : 'gray',
              }}
              onClick={() => setActiveTab('attended')}
            >
              <CheckCircle className="h-5 w-5" /> Attended Tests
            </button>
          </div>
          
          <div className="hidden sm:block">
            <Link href="/test">
              <Button
                variant="outline"
                className="flex items-center gap-2 font-medium"
                style={{
                  color: 'red',
                  borderColor: `red40`,
                }}
              >
                Explore More Tests
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'red' }} />
          </div>
        ) : (
          <>
            {/* Created Tests */}
            {activeTab === 'created' && (
              <>
                {myTests.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <div className="mb-4">
                      <AlertCircle className="h-12 w-12 mx-auto" style={{ color: `red60` }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">No tests created yet</h3>
                    <p className="text-gray-600 mb-6">Start creating your first test series to challenge students.</p>
                    <Link className='flex justify-center' href="/createTest">
                      <Button
                        className="flex items-center gap-2 font-medium"
                        style={{
                          background: 'red',
                          color: "#fff",
                        }}
                      >
                        <PlusCircle className="h-4 w-4" /> Create First Test
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myTests.map(test => (
                      <Card
                        key={test._id}
                        className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.025]"
                        style={{
                          borderRadius: "1.25rem",
                          background: `linear-gradient(120deg,'white' 80%,red11 100%)`,
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
                                background: 'white',
                                color: 'red'
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
                            style={{ color: 'red' }}
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
                                  background: `whiteyellow15`,
                                  color: 'yellow'
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {test.tags?.length > 3 && (
                              <Badge className="text-xs bg-gray-100 text-gray-600">+{test.tags.length - 3}</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: `red15` }}>
                            <Link href={`/createTest?testId=${test._id}`} className="flex-1">
                              <Button 
                                size="sm" 
                                className="w-full flex items-center justify-center gap-1"
                                style={{ 
                                  background: 'red',
                                  color: 'white'
                                }}
                              >
                                <Edit className="h-3 w-3" /> Edit
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
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                              Delete
                            </Button>
                          </div>
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
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <div className="mb-4">
                      <Trophy className="h-12 w-12 mx-auto" style={{ color: `whiteyellow60` }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">No tests attended yet</h3>
                    <p className="text-gray-600 mb-6">Explore available tests and challenge yourself.</p>
                    <Link href="/test">
                      <Button
                        className="flex items-center gap-2 font-medium"
                        style={{
                          background: 'yellow',
                          color: "#fff",
                        }}
                      >
                        Explore Tests
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {attendedTests.map((attended) => {
                      const test = attended.test;
                      const isCompleted = attended.completed;
                      const passStatus = attended.percentageScore >= 70;
                      
                      return (
                        <Card
                          key={attended._id}
                          className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.025]"
                          style={{
                            borderRadius: "1.25rem",
                            background: `linear-gradient(120deg,white 80%,whiteyellow11 100%)`,
                            border: `1.5px solid whiteyellow22`,
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
                                style={{ background: 'white', color: 'yellow' }}
                              >
                                {test.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <CardContent className="pt-4">
                            <h3 
                              className="font-bold text-lg mb-1 line-clamp-1"
                              style={{ color: 'yellow' }}
                            >
                              {test.title}
                            </h3>
                            
                            <div className="flex justify-between items-center mb-3">
                              <div 
                                className="text-sm font-medium rounded-md px-2 py-0.5"
                                style={{
                                  background: `whiteyellow10`,
                                  color: 'yellow'
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
                                    color: 'red'
                                  }}
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {test.tags?.length > 2 && (
                                <Badge className="text-xs bg-gray-100 text-gray-600">+{test.tags.length - 2}</Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: `whiteyellow15` }}>
                              <Link href={`/test/${test._id}`} className="w-full">
                                <Button 
                                  size="sm" 
                                  className="w-full flex items-center justify-center gap-1"
                                  style={{ 
                                    background: 'yellow',
                                    color: 'white'
                                  }}
                                >
                                  <Eye className="h-3 w-3" /> {isCompleted ? 'Review Test' : 'Continue Test'}
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
        
        {/* Mobile Action Button */}
        <div className="sm:hidden fixed bottom-6 right-6 z-20">
          <Link href="/test">
            <Button
              className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, red, whiteyellow)`,
              }}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </Link>
        </div>
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