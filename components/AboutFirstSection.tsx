'use client';

import Link from "next/link";

export function AboutFirstSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-center px-4 sm:px-10 md:px-20 py-16 sm:py-28 overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-blue-200">
      {/* About Us Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400 text-white font-semibold text-lg shadow-lg tracking-wide border-2 border-white/70 animate-bounce-slow hover:scale-105 transition-transform duration-200 select-none">
          About Us
        </span>
      </div>

      {/* Animated, interactive background blobs and gradients */}
<div className="absolute top-0 left-0 w-60 h-60 bg-blue-400 rounded-full opacity-30 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
<div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
<div
  className="absolute top-1/2 left-1/2 w-[32rem] h-[32rem] rounded-full opacity-10 pointer-events-none"
  style={{
    background: `radial-gradient(circle at 60% 40%, #7c3aed 0%, transparent 70%)`,
    transform: 'translate(-50%, -50%)',
    filter: 'blur(40px)',
    zIndex: 0
  }}
/>

{/* Extra animated gradient overlays */}
<div className="absolute inset-0 pointer-events-none z-0">
  <div className="absolute left-1/4 top-0 w-1/2 h-32 bg-gradient-to-r from-indigo-300 via-blue-200 to-transparent opacity-40 blur-2xl rounded-full animate-gradient-x" />
  <div className="absolute right-0 bottom-1/4 w-1/3 h-24 bg-gradient-to-l from-blue-300 via-indigo-200 to-transparent opacity-30 blur-2xl rounded-full animate-gradient-y" />
  <div className="absolute left-0 bottom-0 w-1/3 h-24 bg-gradient-to-tr from-purple-300 via-indigo-200 to-transparent opacity-20 blur-2xl rounded-full animate-gradient-x" />
</div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 w-full max-w-7xl">
        {/* Left: Text and Cards */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent drop-shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-sky-500">
            Yudo Examen
          </h1>
          <p className="mt-2 text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl transition-colors duration-300 hover:text-indigo-600">
            <span className="font-semibold text-indigo-600">Yudo Examen</span> is a modern learning platform where you can create and attend test series, practice with AI-powered questions, and get instant solutions and explanations. Enhance your learning with images, one long video, and up to 3 YouTube Shorts per question.
          </p>
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mt-4">
            <AboutCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-indigo-500">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Create & Attend Tests"
              desc="Build your own test series or join others. Practice anytime, anywhere, on any device."
              gradient="from-indigo-100 to-blue-50"
            />
            <AboutCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-500">
                  <path d="M9 17v-2a4 4 0 018 0v2M12 7a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="AI-Powered Questions"
              desc="Let AI write options, solutions, and explanations for every question—instantly and accurately."
              gradient="from-blue-100 to-sky-50"
            />
           
          </div>
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full  justify-between ">
            <Link
              href="/"
              className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-sky-400 shadow-lg hover:from-indigo-600 hover:to-sky-500 transition-all  focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:scale-105 ease-in-out duration-200"
            >
              Go to Home
            </Link>
            <span className="inline-flex items-center justify-center rounded-full bg-white shadow-lg  p-2 border border-gray-100 group-hover:bg-indigo-50 transition-colors hover:scale-105 ease-in-out cursor-pointer duration-200">
       <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-500" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 14L3 9l9-5 9 5-9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  <path d="M12 14v7m0-7l6.16-3.422A12.083 12.083 0 0121 13c0 2.5-2.5 4-9 4s-9-1.5-9-4c0-.756.265-1.486.84-2.422L12 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>

      </span>
            <Link
              href="/test"
              className="px-8 py-3 rounded-xl font-semibold text-indigo-600 bg-white/90 border border-blue-200 shadow-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:scale-105 ease-in-out duration-200"
            >
              Explore More
            </Link>
          </div>
        </div>
        {/* Right: Hero/Concept Image with interactive badge and hover animation */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="relative group">
            <img
              src="/about/one.jpeg"
              alt="About Yudo Examen Illustration"
              className="w-[320px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-200"
              style={{ mixBlendMode: 'multiply', boxShadow: '0 12px 40px 0 rgba(99,102,241,0.13)' }}
            />
            {/* Interactive floating badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-400 to-sky-400 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-md flex items-center gap-1.5 sm:gap-2 animate-bounce-slow hover:scale-105 hover:bg-gradient-to-l hover:from-sky-400 hover:to-indigo-400 transition-all duration-200 cursor-pointer text-xs sm:text-sm">
  <span className="font-semibold">AI Powered Learning</span>
</div>

            {/* Decorative animated ring */}
            <div className="absolute -inset-4 rounded-3xl border-4 border-indigo-200 opacity-40 group-hover:opacity-70 transition-all duration-300 pointer-events-none  z-20"></div>
          </div>
           <AboutCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-pink-500">
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
              title="Rich Media Support"
              desc="Attach images, one long YouTube video, and up to 3 Shorts to any question for visual learning."
              gradient="from-pink-100 to-indigo-50"
            />
            <AboutCard
              icon={
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-yellow-500">
                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
                </svg>
              }
              title="Instant Feedback"
              desc="Get real-time analytics, progress tracking, and personalized insights to boost your learning."
              gradient="from-yellow-100 to-white"
            />
          {/* Decorative animated gradient bar */}
          <div className="w-64 h-3 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400 opacity-70 blur-sm animate-gradient-x" />
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

// AboutCard component
function AboutCard({
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
        hover:scale-105 hover:shadow-2xl hover:border-indigo-200
        transition-all duration-200
        backdrop-blur-md
        group
        relative
        z-10      `}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        background: 'rgba(255,255,255,0.92)',
      }}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-white shadow-lg mb-3 p-3 border border-gray-100 group-hover:bg-indigo-50 transition-colors duration-200">
        {icon}
      </span>
      <div className="font-bold text-gray-900 mb-1 text-base sm:text-lg group-hover:text-indigo-600 transition-colors duration-200">{title}</div>
      <div className="text-gray-600 text-xs sm:text-sm">{desc}</div>
    </div>
  );
}
