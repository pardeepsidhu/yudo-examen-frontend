'use client';

import { Languages } from "lucide-react";

export function AboutSecondSection() {
  return (
    <section className="relative min-h-[60vh] flex flex-col md:flex-row items-center justify-center px-4 sm:px-10 md:px-20 py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100">
      {/* Section Badge */}
     <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-400 text-xs sm:text-sm md:text-lg shadow-lg tracking-wide border-2 border-white/70 animate-bounce-slow hover:scale-105 transition-transform duration-200 select-none text-white">
    Multilingual & Accessibility
  </span>
</div>

      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-52 h-52 bg-sky-200 rounded-full opacity-30 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div
        className="absolute top-1/2 left-1/2 w-[24rem] h-[24rem] rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 60% 40%, #0ea5e9 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(32px)',
          zIndex: 0
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 w-full max-w-6xl">
        {/* Left: Text and Cards */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Global Learning, Accessible to All
          </h2>
          <p className="mt-2 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl">
            <span className="font-semibold text-sky-600">Yudo Examen</span> supports multiple languages for every question, description, and solution. Instantly translate content and listen to questions and answers with integrated text-to-speech for a truly accessible learning experience.
          </p>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mt-4">
            <FeatureCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-sky-500">
                  <path d="M4 7h16M4 12h8m-8 5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Multi-Language Support"
              desc="Translate questions, descriptions, and solutions into your preferred language instantly."
              gradient="from-sky-100 to-indigo-50"
            />
            <FeatureCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-indigo-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
              title="Text-to-Speech"
              desc="Listen to questions and solutions with a single click for better accessibility and comprehension."
              gradient="from-indigo-100 to-sky-50"
            />
            <FeatureCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-500">
                  <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Inclusive Learning"
              desc="Designed for all learners, including those with visual or reading challenges."
              gradient="from-blue-100 to-white"
            />
            <FeatureCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-pink-500">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v10l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Instant Accessibility"
              desc="Switch languages and enable speech on any device, anytime, anywhere."
              gradient="from-pink-100 to-indigo-50"
            />
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="relative group">
            <img
              src="/about/two.jpg"
              alt="Multilingual and Accessibility Illustration"
              className="w-[320px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sky-200"
              style={{ mixBlendMode: 'multiply', boxShadow: '0 12px 40px 0 rgba(14,165,233,0.13)' }}
            />
            {/* Floating badge */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
  <span className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-400 text-xs sm:text-sm md:text-lg shadow-lg tracking-wide border-2 border-white/70 animate-bounce-slow hover:scale-105 transition-transform duration-200 select-none text-white">
 <Languages />   Translate & Listen
  </span>
</div>

            {/* Decorative animated ring */}
            <div className="absolute -inset-4 rounded-3xl border-4 border-sky-200 opacity-40 group-hover:opacity-70 transition-all duration-300 pointer-events-none animate-spin-slow"></div>
          </div>
          {/* Decorative animated gradient bar */}
          <div className="w-64 h-3 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-400 opacity-70 blur-sm animate-gradient-x" />
        </div>
      </div>
      {/* Animations */}
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slow {
          animation: spin-slow 16s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { transform: translateX(0);}
          50% { transform: translateX(30px);}
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease-in-out infinite;
        }
        @keyframes gradient-y {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-20px);}
        }
        .animate-gradient-y {
          animation: gradient-y 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

// FeatureCard component for AboutSecondSection
function FeatureCard({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <div
      className={`
        flex flex-col items-center text-center
        bg-gradient-to-br ${gradient}
        rounded-2xl shadow-xl
        p-5 border border-blue-100
        hover:scale-105 hover:shadow-2xl hover:border-sky-200
        transition-all duration-200
        backdrop-blur-md
        group
      `}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        background: 'rgba(255,255,255,0.92)',
      }}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-white shadow-lg mb-3 p-3 border border-gray-100 group-hover:bg-sky-50 transition-colors duration-200">
        {icon}
      </span>
      <div className="font-bold text-gray-900 mb-1 text-base sm:text-lg group-hover:text-sky-600 transition-colors duration-200">{title}</div>
      <div className="text-gray-600 text-xs sm:text-sm">{desc}</div>
    </div>
  );
}