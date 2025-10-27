'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAllTestSeries } from '../api/test.api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Filter, ChevronDown, X, Clock, TrendingUp, Award, Users, Sparkles } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TestSeries {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  user: {
    name: string;
    profile?: string;
    _id: string;
  };
  createdAt: string;
  likes: string[];
  views: number;
}

export default function ExplorePage() {
 
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.push('/login');
    }
  }, [router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setTestSeries([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
  }, [debouncedSearch, selectedCategory]);

  const fetchTestSeries = useCallback(
    async (fetchPage = 1) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await getAllTestSeries(fetchPage, 10, selectedCategory, debouncedSearch);
        if (response.success) {
          const newTestSeries = response.testSeries || [];
          setTestSeries((prev) => {
            const ids = new Set(prev.map((ts) => ts._id));
            const filtered: TestSeries[] = newTestSeries.filter((ts: TestSeries) => !ids.has(ts._id));
            return [...prev, ...filtered];
          });
          setHasMore(fetchPage < response.totalPages && newTestSeries.length > 0);
          setPage(fetchPage + 1);
        } else {
          toast.error(response.message || 'Failed to fetch test series');
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching test series:', error);
        toast.error('Failed to fetch test series');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, debouncedSearch, loading, hasMore]
  );

  useEffect(() => {
    if (isInitialLoad) {
      fetchTestSeries(1);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, fetchTestSeries]);

  const categories = [
    'General Knowledge',
    'Mathematics',
    'Science & Nature',
    'Science: Computers',
    'Science: Gadgets',
    'Geography',
    'History',
    'English Language',
    'Reasoning & Aptitude',
    'Cybersecurity',
    'Coding & Programming',
    'Environmental Studies',
    'Economics',
    'Physics',
    'Chemistry',
    'Biology',
    'Other',
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
        <div className="space-y-4 sm:space-y-8">
          {/* Enhanced Header with Stats */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-1 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Animated Icon Badge */}
                  <motion.div
                    className="relative p-3 rounded-md sm:rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-500 shadow-2xl"
                    animate={{
                      boxShadow: [
                        "0 10px 40px rgba(99, 102, 241, 0.3)",
                        "0 15px 50px rgba(59, 130, 246, 0.4)",
                        "0 10px 40px rgba(99, 102, 241, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="h-5 sm:h-7 w-5 sm:w-7 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
                  </motion.div>

                  <div>
                    <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent leading-tight">
                      Explore Test Series
                    </h1>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 rounded-full mt-2" />
                  </div>
                </div>

                <p className="text-gray-600 text-sm lg:text-xl flex items-center gap-2 font-medium">
                  <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
                  Discover curated collections designed to accelerate your learning
                </p>

                {/* Enhanced Stats Pills */}
                <div className="hidden sm:flex flex-wrap gap-1 sm:gap-3 mt-4 sm:mt-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group hidden sm:flex items-center gap-2.5 px-5 py-3 rounded-md  bg-white shadow-lg hover:shadow-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all">
                      <Award className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Available Tests</p>
                      <p className="text-base font-bold text-gray-800">{testSeries.length}+</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group flex items-center gap-2.5 px-5 py-3 rounded-md  bg-white shadow-lg hover:shadow-xl border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Community</p>
                      <p className="text-base font-bold text-gray-800">Active</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group flex items-center gap-2.5 px-5 py-1 rounded-md  bg-white shadow-lg hover:shadow-xl border border-sky-100 hover:border-sky-300 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-sky-200 group-hover:from-sky-200 group-hover:to-sky-300 transition-all">
                      <Sparkles className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Technology</p>
                      <p className="text-base font-bold text-gray-800">AI-Powered</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Enhanced Search and Filter Section */}
              <div className="flex flex-row sm:flex-row gap-1 sm:gap-2 sm:gap-4 w-full lg:w-auto lg:min-w-[400px]">
                {/* Search Input */}
                <div className="relative flex-5 sm:flex-1 w-full">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Search test series..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-12 h-12 sm:h-14 bg-white shadow-xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 rounded-md sm:rounded-2xl text-sm sm:text-base font-medium placeholder:text-gray-400 hover:shadow-2xl w-full"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:rotate-90"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  {/* Search suggestions indicator */}
                  {search && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-40"
                    >
                      <p className="text-xs text-gray-500 px-3 py-1">
                        Searching for: <span className="font-semibold text-indigo-600">{search}</span>
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Filter Button */}
                <div className="relative w-full flex-1 sm:w-auto">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="relative flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-7 h-12 sm:h-14 w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white rounded-md sm:rounded-2xl shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-blue-700 hover:to-sky-600 transition-all duration-300 font-bold text-sm sm:text-base group overflow-hidden"
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <Filter className="h-5 w-5 relative z-10" />
                    <span className="relative z-10 ">Filters</span>
                    {selectedCategory && (
                      <span className="relative z-10 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">1</span>
                    )}
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 relative z-10 ${isFilterOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="absolute right-0  mt-3 w-full sm:w-96 bg-white rounded-md sm:rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                      >
                        {/* Gradient Header */}
                        <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 px-4 sm:px-6 py-4 sm:py-5 overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                          </div>
                          <div className="relative flex items-center justify-between">
                            <h3 className="font-black text-white text-lg sm:text-xl flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Filter className="h-5 w-5" />
                              </div>
                              Filter Categories
                            </h3>
                            <button
                              onClick={() => setIsFilterOpen(false)}
                              className="text-white/80 hover:text-white transition-all duration-200 hover:rotate-90 hover:scale-110"
                            >
                              <X className="h-5 sm:h-6 w-5 sm:w-6" />
                            </button>
                          </div>
                        </div>

                        {/* Categories List */}
                        <div className="p-4 sm:p-5 max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar">
                          <button
                            onClick={() => {
                              setSelectedCategory('');
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-md sm:rounded-2xl mb-2 sm:mb-3 transition-all duration-300 font-semibold flex items-center justify-between group ${selectedCategory === ''
                                ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 text-white shadow-lg scale-[1.02]'
                                : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 text-gray-700 hover:scale-[1.02]'
                              }`}
                          >
                            <span className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${selectedCategory === '' ? 'bg-white' : 'bg-indigo-400'
                                  }`}
                              />
                              All Categories
                            </span>
                            {selectedCategory === '' && (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>

                          {categories.map((category, index) => (
                            <motion.button
                              key={category}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-md sm:rounded-2xl mb-2 sm:mb-3 transition-all duration-300 font-semibold flex items-center justify-between group ${selectedCategory === category
                                  ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 text-white shadow-lg scale-[1.02]'
                                  : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 text-gray-700 hover:scale-[1.02]'
                                }`}
                            >
                              <span className="flex items-center gap-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${selectedCategory === category ? 'bg-white rounded-md' : 'bg-indigo-400'
                                    }`}
                                />
                                {category}
                              </span>
                              {selectedCategory === category && (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>

            {/* Enhanced Active Filters */}
            {(selectedCategory || debouncedSearch) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-4 p-5 bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 rounded-md sm:rounded-2xl border border-indigo-100"
              >
                <span className="text-gray-700 font-bold flex items-center gap-2 text-base">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <Filter className="h-4 w-4 text-indigo-600" />
                  </div>
                  Active Filters:
                </span>

                {selectedCategory && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl text-sm font-bold rounded-xl">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="hover:text-red-200 transition-all duration-200 hover:scale-125 hover:rotate-90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Badge>
                  </motion.div>
                )}

                {debouncedSearch && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white border-0 hover:from-blue-600 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl text-sm font-bold rounded-xl">
                      <Search className="w-4 h-4" />
                      Search: {debouncedSearch}
                      <button
                        onClick={() => setSearch('')}
                        className="hover:text-red-200 transition-all duration-200 hover:scale-125 hover:rotate-90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Test Series Grid */}
          <InfiniteScroll
            dataLength={testSeries.length}
            next={() => fetchTestSeries(page)}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-4 sm:py-12">
                <div className="flex items-center gap-3 px-6 py-4 rounded-md sm:rounded-2xl bg-white shadow-lg border border-indigo-100">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  <span className="text-gray-700 font-medium">Loading more amazing tests...</span>
                </div>
              </div>
            }
            endMessage={
              <div className="text-center py-4 sm:py-12">
                {testSeries.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-md sm:rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200"
                  >
                    <Award className="h-6 w-6 text-indigo-600" />
                    <span className="text-gray-700 font-semibold">You&lsquo;ve seen all available test series!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 py-4 sm:py-12"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <Search className="h-10 w-10 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">No test series found</p>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  </motion.div>
                )}
              </div>
            }
            scrollThreshold="90%"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              <AnimatePresence>
                {testSeries.map((series, index) => (
                  <motion.div
                    key={series._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Card className="group relative rounded-md  h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-white sm:rounded-2xl overflow-hidden gap-0 sm:gap-3">
                      {/* Animated gradient border on hover */}
                      <div className="absolute inset-0 rounded-md sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl" />

                      <Link href={`/test/${series._id}`} className="block">
                        <div className="relative h-56 w-full overflow-hidden">
                          {/* Image with parallax-like zoom */}
                          <Image
                            src={series.thumbnail || '/placeholder.webp'}
                            alt={series.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-125"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3}
                          />

                          {/* Sophisticated gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                          {/* Animated shimmer effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          </div>

                          {/* Floating Views Badge - Top Right */}
                          <motion.div
                            className="absolute top-4 right-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                         
                          </motion.div>

                          {/* Category Badge - Top Left */}
                          <motion.div
                            className="absolute top-4 left-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            <Badge className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white border-0 px-4 py-1.5 shadow-xl text-xs font-bold tracking-wide uppercase group-hover:scale-105 transition-transform duration-300">
                              {series.category}
                            </Badge>
                          </motion.div>

                          {/* Trending Indicator - if recently created */}
                          {new Date().getTime() - new Date(series.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                            <motion.div
                              className="absolute top-4 left-1/2 -translate-x-1/2"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                            >
                              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                NEW
                              </div>
                            </motion.div>
                          )}

                          {/* Date Badge - Bottom Right */}
                          <motion.div
                            className="absolute bottom-4 right-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                          >
                            <div className="flex items-center gap-2 text-white text-sm font-semibold bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
                              <Clock className="h-4 w-4" />
                              <span>
                                {new Date(series.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: new Date(series.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                })}
                              </span>
                            </div>
                          </motion.div>

                          {/* Popularity Indicator */}
                          {series.views > 1000 && (
                            <motion.div
                              className="absolute bottom-4 left-4"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.6, type: "spring" }}
                            >
                              <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-xl flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                                TRENDING
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <CardHeader className="s pt-3 sm:pt-6 px-6">
                          <CardTitle className="line-clamp-2 text-xl font-extrabold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300 leading-tight">
                            {series.title}
                          </CardTitle>
                        </CardHeader>
                      </Link>

                      <CardContent className="space-y-3 sm:space-y-4  px-6 pb-6">
                        <Link href={`/test/${series._id}`}>
                         <div
  className="text-sm text-gray-600  leading-relaxed group-hover:text-gray-700 transition-colors h-50 overflow-hidden"
  dangerouslySetInnerHTML={{ __html: series.description }}
/>

                          {/* Tags Section */}
                          <div className="flex flex-wrap gap-2 pt-3 pb-2">
                            {series.tags.slice(0, 3).map((tag, tagIndex) => (
                              <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 + tagIndex * 0.1 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200 hover:from-indigo-100 hover:to-blue-100 hover:border-indigo-300 transition-all duration-200 px-3 py-1 font-medium"
                                >
                                  {tag}
                                </Badge>
                              </motion.div>
                            ))}
                            {series.tags.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 px-3 py-1 font-medium"
                              >
                                +{series.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </Link>

                        {/* Enhanced Author Section */}
                        <Link href={`/profile/${series?.user?._id}` || '/test'}>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 group/author">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {/* Avatar with animated ring */}
                                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-indigo-200 group-hover/author:ring-4 group-hover/author:ring-indigo-400 transition-all duration-300 shadow-lg">
                                  <Image
                                    src={series?.user.profile || '/avatar_paceholder.jpeg'}
                                    alt={series.user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                {/* Active status indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                              </div>

                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 group-hover/author:text-indigo-600 transition-colors duration-200 flex items-center gap-1.5">
                                  {series.user.name}
                                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </p>
                                <p className="text-xs text-gray-500 font-medium">Test Creator</p>
                              </div>
                            </div>

                            {/* View Test Arrow */}
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Engagement Metrics Bar */}
                        <div className="flex items-center gap-4 pt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {/* <span className="font-semibold">{series.likes?.length || 0}</span> */}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                            <span className="font-semibold">Discuss</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <style jsx global>{`
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
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}