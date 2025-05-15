'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/theme.context';
import { getAllTestSeries } from '../api/test.api';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Filter, ChevronDown, X, Heart, Eye, Clock } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
  };
  createdAt: string;
  likes: string[];
  views: number;
}

export default function ExplorePage() {
  const { theme } = useTheme();
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [likedSeries, setLikedSeries] = useState<Set<string>>(new Set());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset state when filters change
  useEffect(() => {
    setTestSeries([]);
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
  }, [debouncedSearch, selectedCategory]);

  // Initial load
  useEffect(() => {
    if (isInitialLoad) {
      fetchTestSeries();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Handle like/unlike
  const handleLike = async (seriesId: string) => {
    try {
      const isLiked = likedSeries.has(seriesId);
      setTestSeries(prev => prev.map(series => {
        if (series._id === seriesId) {
          return {
            ...series,
            likes: isLiked 
              ? series.likes.filter(id => id !== 'user_id')
              : [...series.likes, 'user_id']
          };
        }
        return series;
      }));

      setLikedSeries(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(seriesId);
        } else {
          newSet.add(seriesId);
        }
        return newSet;
      });

      toast.success(isLiked ? 'Unliked successfully' : 'Liked successfully');
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  // Fix: Only fetch more if we haven't reached totalPages, and always show one row max (3 cards per row on xl)
  const fetchTestSeries = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getAllTestSeries(page, 10, selectedCategory, debouncedSearch);
      if (response.success) {
        const newTestSeries = response.testSeries || [];
        // Prevent fetching more if we've reached the total count
        setTestSeries(prev => {
          const combined = [...prev, ...newTestSeries];
          // Only keep up to totalCount if provided, else just combine
          if (response.totalCount && combined.length > response.totalCount) {
            return combined.slice(0, response.totalCount);
          }
          return combined;
        });
        setHasMore(page < response.totalPages && newTestSeries.length > 0);
        setPage(prev => prev + 1);
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
  }, [page, selectedCategory, debouncedSearch, loading, hasMore]);

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
    'Other'
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(135deg, ${theme.neutral} 0%, ${theme.white} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-6 sm:py-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Explore Test Series
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                Discover and learn from our curated collection of test series
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search test series..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-sm"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm"
                  style={{
                    color: theme.primary,
                    borderColor: theme.primary + "55",
                  }}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 border border-gray-100 dark:border-gray-700"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium" style={{ color: theme.primary }}>Categories</h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                          <button
                            onClick={() => {
                              setSelectedCategory('');
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                              selectedCategory === '' 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'hover:bg-gray-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200'
                            }`}
                          >
                            All Categories
                          </button>
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md mb-1 transition-colors ${
                                selectedCategory === category 
                                  ? 'bg-blue-50 text-blue-600 font-medium' 
                                  : 'hover:bg-gray-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-200'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || debouncedSearch) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-300">Active filters:</span>
              {selectedCategory && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                  style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                >
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {debouncedSearch && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                  style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}
                >
                  Search: {debouncedSearch}
                  <button
                    onClick={() => setSearch('')}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Test Series Grid */}
          <InfiniteScroll
            dataLength={testSeries.length}
            next={fetchTestSeries}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-8">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
                  style={{
                    background: theme.white,
                    border: `1px solid ${theme.primary}22`,
                  }}
                >
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: theme.primary }} />
                  <span className="text-gray-600 dark:text-gray-300">Loading more...</span>
                </div>
              </div>
            }
            endMessage={
              <div className="text-center py-8">
                {testSeries.length > 0 ? (
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: theme.neutral,
                      color: theme.primary,
                    }}
                  >
                    <span>No more test series to load</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-gray-400">
                      <Search className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-200">No test series found</p>
                      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
                    </div>
                  </div>
                )}
              </div>
            }
            scrollThreshold="90%"
          >
            {/* Only one row: show up to 3 cards per row, and only one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {testSeries.slice(0, 3).map((series, index) => (
                  <motion.div
                    key={series._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.07 }}
                  >
                    <Link href={`/test/${series._id}`}>
                      <Card
                        className="h-full hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border-0"
                        style={{
                          background: theme.white,
                          border: `1.5px solid ${theme.primary}22`,
                          borderRadius: "1.25rem",
                        }}
                      >
                        <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-t-xl">
                          <Image
                            src={series.thumbnail || '/placeholder.webp'}
                            alt={series.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 pointer-events-none" />
                          {/* Stats Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-4 text-white text-xs sm:text-sm z-10">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{series.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(series.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle
                            className="line-clamp-2 text-lg"
                            style={{ color: theme.primary }}
                          >
                            {series.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                            {series.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge 
                              variant="outline" 
                              className="border-0"
                              style={{
                                color: theme.primary,
                                background: theme.primary + "10",
                              }}
                            >
                              {series.category}
                            </Badge>
                            {series.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-blue-50 text-blue-600"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {series.tags.length > 2 && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                +{series.tags.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.primary + "22" }}>
                            <div className="flex items-center gap-3">
                              <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white">
                                <Image 
                                  src={series?.user.profile || '/avatar_paceholder.jpeg'}
                                  alt={series.user.name}
                                  fill
                                  className="object-cover h-full w-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium" style={{ color: theme.primary }}>{series.user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(series.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleLike(series._id);
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 text-sm ${
                                likedSeries.has(series._id)
                                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 transition-transform duration-200 ${
                                  likedSeries.has(series._id) ? 'fill-current' : ''
                                }`}
                              />
                              <span className="font-medium">{series.likes.length}</span>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
}
