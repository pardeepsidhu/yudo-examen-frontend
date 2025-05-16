'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';

export function HomeFirstSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-10 pb-20 sm:pt-20 overflow-hidden bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-300 rounded-full opacity-25 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-300 rounded-full opacity-25 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] rounded-full opacity-10 pointer-events-none" style={{
        background: `radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(32px)',
        zIndex: 0
      }} />

      {/* Left: Main Content */}
      <div className="relative z-10 flex-1 flex flex-col gap-8 items-center md:items-start">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Sparkles className="h-8 w-8 text-indigo-400 animate-spin-slow" />
          <span className="uppercase tracking-widest text-indigo-600 font-semibold text-sm bg-indigo-50 px-2 sm:px-3 py-1 rounded-full shadow-sm">
            Next-Gen Learning Platform
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up">
          Welcome to <span className="text-indigo-600 hover:text-purple-600 transition-colors duration-300 cursor-pointer underline decoration-wavy decoration-2 underline-offset-4">Yudo Examen</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 max-w-xl animate-fade-in-up delay-100">
          The smartest way to <span className="text-indigo-500 font-semibold">create</span>, <span className="text-purple-500 font-semibold">share</span>, and <span className="text-pink-500 font-semibold">attempt</span> online tests.<br />
          <span className="text-indigo-500 font-semibold">Empower your learning</span> with interactive tests, media, and more.
        </p>
        <div className="flex gap-4 mt-2 animate-fade-in-up delay-200">
          <Link href="/createTest">
            <Button
              size="lg"
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              <ArrowRight className="h-5 w-5" /> Get Started
            </Button>
          </Link>
          <Link href="/test">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 px-8 py-4 text-lg font-semibold border-indigo-400 text-indigo-600 bg-white rounded-full hover:bg-indigo-50 hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              <PlayCircle className="h-5 w-5" /> Try a Test
            </Button>
          </Link>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="relative z-10 flex-1 flex justify-center items-center mt-12 md:mt-0 animate-fade-in-up delay-300">
        <div className="relative group">
          <img
            src="/home/one.jpg"
            alt="Online Exam Illustration"
            className="w-[350px] md:w-[420px] rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Animated floating badge */}
          <div className="absolute top-8 left-8 bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
            <span className="text-indigo-600 font-bold">1000+</span>
            <span className="text-gray-700">Tests Created</span>
          </div>
          {/* Animated floating badge 2 */}
          <div className="absolute bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slower hover:scale-110 transition-transform duration-200 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-100 { animation-delay: .1s; }
        .delay-200 { animation-delay: .2s; }
        .delay-300 { animation-delay: .3s; }
        @keyframes pulse-slow {
          0%, 100% { opacity: .25; }
          50% { opacity: .4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: .25; }
          50% { opacity: .5; }
        }
        .animate-pulse-slower {
          animation: pulse-slower 7s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-12px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        @keyframes bounce-slower {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .animate-bounce-slower {
          animation: bounce-slower 3.5s infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}