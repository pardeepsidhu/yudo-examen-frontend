'use client';

import { Code2, TerminalSquare, Sparkles, Languages, Wand2 } from 'lucide-react';

export default function HomeThirdSection() {
  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-2 sm:px-6 md:px-20 py-12 sm:py-20 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-52 sm:w-72 md:w-[28rem] h-52 sm:h-72 md:h-[28rem] bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute top-1/2 left-1/2 w-[16rem] sm:w-[22rem] md:w-[32rem] h-[16rem] sm:h-[22rem] md:h-[32rem] rounded-full opacity-10 pointer-events-none" style={{
        background: `radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(28px)',
        zIndex: 0
      }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up text-center">
          Built-in <span className="text-blue-600">Code Editor</span> for Every Test
        </h2>
        <p className="text-base sm:text-lg md:text-2xl text-gray-700 max-w-2xl animate-fade-in-up delay-100 text-center mt-4">
          Practice coding directly in your browser! <span className="text-blue-500 font-semibold">Multiple languages</span>, instant feedback, and <span className="text-indigo-500 font-semibold">AI-powered code suggestions</span> based on your test questions.
        </p>

        {/* Central Code Editor Illustration */}
        <div className="relative flex items-center justify-center mt-10 mb-8 w-full min-h-[260px] sm:min-h-[340px]">
          {/* Central Main Image (Code Editor Illustration) */}
          <img
            src="/home/four.jpg"
            alt="Code Editor Illustration"
            className="w-[160px] xs:w-[200px] sm:w-[260px] md:w-[340px] lg:w-[400px] rounded-3xl shadow-2xl z-10 animate-fade-in-up hover:scale-105 transition-transform duration-300"
            // style={{ mixBlendMode: 'multiply' }}
          />

          {/* Floating Feature Cards - Responsive positions */}
          {/* Top Left */}
          <div className="absolute -top-6 -left-2 xs:-top-8 xs:-left-4 sm:-top-10 sm:-left-10 animate-float-corner hover:z-21">
            <FeatureCard
              icon={<Languages className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />}
              bg="bg-blue-100"
              title="Multiple Languages"
              desc="Code in Python, Java, C++, JavaScript, and more—switch instantly as you need."
            />
          </div>
          {/* Top Right */}
          <div className="absolute -top-6 -right-2 xs:-top-8 xs:-right-4 sm:-top-10 sm:-right-10 animate-float-corner2 hover:z-21">
            <FeatureCard
              icon={<Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-500" />}
              bg="bg-indigo-100"
              title="AI Code Suggestions"
              desc="Get smart code completions and hints tailored to your test questions."
            />
          </div>
          {/* Bottom Left */}
          <div className="absolute -bottom-6 -left-2 xs:-bottom-8 xs:-left-4 sm:-bottom-10 sm:-left-10 animate-float-corner3 hover:z-21">
            <FeatureCard
              icon={<TerminalSquare className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />}
              bg="bg-green-100"
              title="Instant Output"
              desc="Run your code and see results instantly—no setup required."
            />
          </div>
          {/* Bottom Right */}
          <div className="absolute -bottom-6 -right-2 xs:-bottom-8 xs:-right-4 sm:-bottom-10 sm:-right-10 animate-float-corner4 hover:z-21">
            <FeatureCard
              icon={<Wand2 className="h-7 w-7 sm:h-8 sm:w-8 text-pink-500" />}
              bg="bg-pink-100"
              title="AI Solution Generator"
              desc="Stuck? Let AI generate a sample solution for your coding question."
            />
          </div>
          {/* Center Floating Badge */}
          <div className="absolute hidden sm:flex top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-6 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 sm:px-5 py-2 rounded-full shadow-lg items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer z-20"
               style={{ minWidth: 140, fontSize: '1rem' }}
               >
            <Code2 className="h-5 w-5" />
            <span className="font-semibold">Code. Test. Learn.</span>
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
        @keyframes pulse-slow {
          0%, 100% { opacity: .2; }
          50% { opacity: .35; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: .2; }
          50% { opacity: .4; }
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
        @keyframes float-corner {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-float-corner {
          animation: float-corner 3.5s infinite;
        }
        @keyframes float-corner2 {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(10px);}
        }
        .animate-float-corner2 {
          animation: float-corner2 3.8s infinite;
        }
        @keyframes float-corner3 {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(8px);}
        }
        .animate-float-corner3 {
          animation: float-corner3 3.2s infinite;
        }
        @keyframes float-corner4 {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .animate-float-corner4 {
          animation: float-corner4 3.7s infinite;
        }
      `}</style>
    </section>
  );
}

// Improved Responsive Floating Feature Card
function FeatureCard({ icon, bg, title, desc }: { icon: React.ReactNode, bg: string, title: string, desc: string }) {
  return (
    <div
      className={`
        flex flex-col items-center text-center
        ${bg} 
        rounded-2xl shadow-xl
        p-3 sm:p-4
        min-w-[120px] xs:min-w-[150px] sm:min-w-[170px] max-w-[210px]
        border border-blue-100
        hover:scale-105 hover:shadow-2xl hover:border-blue-300
        transition-all duration-200
        backdrop-blur-md
       
      `}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        background: 'rgba(255,255,255,0.85)',
      }}
    >
      <span className="inline-flex items-center justify-center rounded-full bg-white shadow-lg mb-2 sm:mb-3 p-2 sm:p-3 border border-gray-100">
        {icon}
      </span>
      <div className="font-bold text-gray-900 mb-1 text-xs xs:text-sm sm:text-base">{title}</div>
      <div className="text-gray-600 text-[11px] xs:text-xs sm:text-sm">{desc}</div>
    </div>
  );
}