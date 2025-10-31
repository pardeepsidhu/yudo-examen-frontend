'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/20 to-sky-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" style={{ transform: 'translate(-50%, -50%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Badge */}
        <motion.div 
          className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          Error 404
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-8 sm:mb-12">
          {/* Image Section */}
          <motion.div 
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <Image
              src="/not-found.jpg"
              alt="Not Found Illustration"
              width={420}
              height={320}
              className="relative w-[280px] sm:w-[360px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
              style={{ boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.25)' }}
              priority
            />
            
            {/* 404 Badge */}
            <motion.div 
              className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl font-black text-white">404</span>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full opacity-60 blur-xl animate-pulse" />
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-tight">
              <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                Oops!
              </span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-gray-800">
                Page Not Found
              </span>
            </h1>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 rounded-full mb-6 mx-auto lg:mx-0" />
            
            <p className="text-base sm:text-lg text-gray-600 mb-1  sm:mb-3 max-w-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved to a new location.
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-8 max-w-lg">
              Don't worry though, you can find plenty of other things on our homepage or use the search below.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-row gap-2 sm:gap-4 justify-center lg:justify-start">
              <Link href="/" passHref>
                <Button
                  className="relative h-12 sm:h-14 px-6 sm:px-8 rounded-2xl text-base font-bold shadow-2xl overflow-hidden group transition-all hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                  
                  <div className="relative z-10 flex items-center gap-3 text-white">
                    <Home className="h-5 w-5" />
                    <span>Back to Home</span>
                  </div>
                </Button>
              </Link>

              <Link href="/test" passHref>
                <Button
                  className="h-12 sm:h-14 px-8 rounded-2xl text-base font-bold border-2 border-indigo-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explore Tests
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div 
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-indigo-100 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">Here are some helpful links instead:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/" className="group">
                <div className="p-4 rounded-xl flex gap-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div>
                  <h4 className="font-bold text-gray-900 mb-1">Homepage</h4>
                  <p className="text-xs text-gray-600">Return to main page</p>
                  </div>
                </div>
              </Link>

              <Link href="/test" className="group">
                <div className="p-4 rounded-xl flex gap-5 bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-100 hover:border-blue-300 transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Browse Tests</h4>
                  <p className="text-xs text-gray-600">Explore test series</p>
                  </div>
                </div>
              </Link>

              <Link href="/about" className="group">
                <div className="p-4 flex gap-5  rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:border-purple-300 transition-all hover:scale-105">
                  <div className="w-12 flex h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                  <h4 className="font-bold text-gray-900 mb-1">About Us</h4>
                  <p className="text-xs text-gray-600">Learn more about us</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          33% { transform: translate(30px, -50px) scale(1.1); opacity: 0.4; }
          66% { transform: translate(-20px, 30px) scale(0.9); opacity: 0.35; }
        }
        .animate-blob { animation: blob 7s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}