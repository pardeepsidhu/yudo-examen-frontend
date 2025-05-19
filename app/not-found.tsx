'use client';

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./context/theme.context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 80% 10%, ${theme.primary}10 0%, transparent 60%), radial-gradient(circle at 20% 90%, ${theme.secondary}15 0%, transparent 50%)`,
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 sm:w-56 sm:h-56 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse-slow pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-pulse-slower pointer-events-none z-0" />
      <div
        className="absolute top-1/2 left-1/2 w-[20rem] h-[20rem] sm:w-[32rem] sm:h-[32rem] rounded-full opacity-10 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${theme.primary} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(32px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <Image
              src="/not-found.jpg"
              alt="Not Found Illustration"
              width={420}
              height={320}
              className="w-[220px] sm:w-[320px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
              style={{ mixBlendMode: 'multiply', boxShadow: '0 12px 40px 0 rgba(236,72,153,0.13)' }}
              priority
            />
            <span className="absolute -top-6 -left-6 bg-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg animate-bounce group-hover:bg-pink-600 transition-colors duration-200">
              404
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-blue-500 to-sky-400 bg-clip-text text-transparent mb-2"
            style={{ letterSpacing: "-0.04em" }}
          >
            Page Not Found
          </h1>
        </div>
        <div className="text-center">
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.<br />
            <span className="text-pink-500 font-semibold">But don&apos;t worry, you can always start fresh!</span>
          </p>
          <Link href="/" passHref>
            <Button
              className="px-7 py-3 rounded-full text-lg font-semibold flex items-center gap-2 shadow-xl hover:scale-110 hover:shadow-pink-200/60 hover:-translate-y-1 transition-all duration-200"
              style={{
                background: `linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                color: theme.white,
              }}
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
              Go to Home
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