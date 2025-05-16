'use client';

import { Youtube, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function HomeForthSection() {
  return (
    <section className="relative min-h-[65vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-52 sm:w-72 md:w-[28rem] h-52 sm:h-72 md:h-[28rem] bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute top-1/2 left-1/2 w-[16rem] sm:w-[22rem] md:w-[32rem] h-[16rem] sm:h-[22rem] md:h-[32rem] rounded-full opacity-10 pointer-events-none" style={{
        background: `radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(28px)',
        zIndex: 0
      }} />

      {/* Left: Main Content */}
      <div className="relative z-10 flex-1 flex flex-col gap-8 items-center md:items-start">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <Sparkles className="h-8 w-8 text-blue-400 animate-spin-slow" />
          <span className="uppercase tracking-widest text-blue-600 font-semibold text-sm bg-blue-50 px-3 py-1 rounded-full shadow-sm">
            Media-Rich Questions
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up">
          Visual Learning, <span className="text-indigo-500">Enhanced</span>
        </h2>
        <p className="text-lg md:text-2xl text-gray-700 max-w-xl animate-fade-in-up delay-100">
          Every question supports <span className="font-semibold text-red-500">1 long YouTube video</span>, <span className="font-semibold text-yellow-500">3 YouTube Shorts</span>, and <span className="font-semibold text-blue-500">an image</span>—making your learning journey more <span className="font-semibold text-indigo-500">interactive</span>, <span className="font-semibold text-blue-600">visual</span>, and <span className="font-semibold text-blue-400">engaging</span>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full animate-fade-in-up delay-200 mt-2">
          <MediaCard
            icon={<Youtube className="h-9 w-9 text-red-500 drop-shadow-md" />}
            title="Long YouTube Video"
            desc="Attach a detailed video explanation to any question for deep understanding."
            bg="from-blue-100 to-white"
          />
          <MediaCard
            icon={
              <div className="flex gap-1">
                <Film className="h-8 w-8 text-yellow-500 drop-shadow-md" />
                <Film className="h-8 w-8 text-yellow-400 drop-shadow-md" />
                <Film className="h-8 w-8 text-yellow-300 drop-shadow-md" />
              </div>
            }
            title="3 YouTube Shorts"
            desc="Add up to 3 short, focused videos for quick tips and visual learning."
            bg="from-indigo-100 to-white"
          />
          <MediaCard
            icon={<ImageIcon className="h-9 w-9 text-blue-500 drop-shadow-md" />}
            title="Image Support"
            desc="Attach an image to clarify concepts or provide visual cues for each question."
            bg="from-blue-50 to-white"
          />
          <MediaCard
            icon={
              <div className="flex flex-col items-center gap-1">
                <Youtube className="h-6 w-6 text-red-400" />
                <Film className="h-6 w-6 text-yellow-400" />
                <ImageIcon className="h-6 w-6 text-blue-400" />
              </div>
            }
            title="All-in-One"
            desc="Combine videos and images for a richer, more engaging learning experience."
            bg="from-indigo-50 to-blue-50"
          />
        </div>
      </div>

      {/* Right: Illustration with two images for lg: screens */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center mt-12 md:mt-0 animate-fade-in-up delay-300">
        <div className="hidden lg:flex flex-col gap-10 items-center">
          {/* Top Image */}
          <div className="relative group">
            <img
              src="/home/five.avif"
              alt="Media Learning Illustration Top"
              className="w-[320px] md:w-[400px] rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105 "
              style={{ mixBlendMode: 'multiply' }}
            />
            {/* Floating badges for top image */}
            <div className="absolute top-8 left-8 bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
              <span className="text-blue-600 font-bold">+Media</span>
              <span className="text-gray-700">per Question</span>
            </div>
            <div className="absolute bottom-8 right-8 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slower hover:scale-110 transition-transform duration-200 cursor-pointer">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Visual Power</span>
            </div>
          </div>
          {/* Bottom Image */}
          <div className="relative group">
            <img
              src="/home/six.jpg"
              alt="Media Learning Illustration Bottom"
              className="w-[320px] md:w-[400px] rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
              style={{ mixBlendMode: 'multiply' }}
            />
            {/* Floating badges for bottom image */}
            <div className="absolute top-8 left-8 bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
              <span className="text-blue-600 font-bold">+Media</span>
              <span className="text-gray-700">per Question</span>
            </div>
            <div className="absolute bottom-8 right-8 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slower hover:scale-110 transition-transform duration-200 cursor-pointer">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Visual Power</span>
            </div>
          </div>
        </div>
        {/* Single image for small/medium screens */}
        <div className="lg:hidden relative group">
          <img
            src="/home/five.avif"
            alt="Media Learning Illustration"
            className="w-[300px] md:w-[400px] rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
          {/* Animated floating badge */}
          <div className="absolute top-8 left-8 bg-white/90 px-4 py-2 rounded-full shadow-md flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
            <span className="text-blue-600 font-bold">+Media</span>
            <span className="text-gray-700">per Question</span>
          </div>
          {/* Animated floating badge 2 */}
          <div className="absolute bottom-8 right-8 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slower hover:scale-110 transition-transform duration-200 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">Visual Power</span>
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

// MediaCard component
function MediaCard({
  icon,
  title,
  desc,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
}) {
  return (
    <div
      className={`
        flex flex-col items-center text-center
        bg-gradient-to-br ${bg} 
        rounded-2xl shadow-xl
        p-5 border border-blue-100
        hover:scale-105 hover:shadow-2xl hover:border-indigo-200
        transition-all duration-200
        backdrop-blur-md
      `}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        background: 'rgba(255,255,255,0.92)',
      }}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-white shadow-lg mb-3 p-3 border border-gray-100">
        {icon}
      </span>
      <div className="font-bold text-gray-900 mb-1 text-base sm:text-lg">{title}</div>
      <div className="text-gray-600 text-xs sm:text-sm">{desc}</div>
    </div>
  );
}