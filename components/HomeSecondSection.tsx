'use client';

import { Sparkles, BrainCircuit, FileText, Lightbulb, Wand2 } from 'lucide-react';
import Image from 'next/image';

export default function HomeSecondSection() {
  return (
    <section className="relative min-h-[70vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-100">
      {/* Decorative animated blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute top-1/2 left-1/2 w-[32rem] h-[32rem] rounded-full opacity-10 pointer-events-none" style={{
        background: `radial-gradient(circle at 60% 40%, #a78bfa 0%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        filter: 'blur(28px)',
        zIndex: 0
      }} />

      {/* Images for large screens */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative z-10 gap-12">
        {/* Top Image */}
        <div className="relative group">
          <Image
            src="/home/two.jpg"
            alt="AI Exam Illustration Top"
            width={400}
            height={300}
            className="w-[320px] md:w-[400px] rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
          <div className="absolute top-8 left-8 bg-gradient-to-r from-indigo-500 to-purple-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">AI Powered</span>
          </div>
        </div>
        {/* Bottom Image */}
        <div className="relative group">
          <Image
            src="/home/three.jpg"
            alt="AI Exam Illustration Bottom"
            width={400}
            height={300}
            className="w-[320px] md:w-[400px] rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
          <div className="absolute top-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Single image for small/medium screens */}
      <div className="relative z-10 flex-1 flex justify-center items-center mb-12 md:mb-0 animate-fade-in-up delay-200 lg:hidden">
        <div className="relative group">
          <Image
            src="/home/two.jpg"
            alt="AI Exam Illustration"
            width={400}
            height={300}
            className="w-[320px] md:w-[400px] rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
          <div className="absolute top-8 left-8 bg-gradient-to-r from-indigo-500 to-purple-400 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow hover:scale-110 transition-transform duration-200 cursor-pointer">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="relative z-10 flex-1 flex flex-col gap-8 items-center lg:items-start">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up text-center lg:text-left">
          Why <span className="text-purple-600">AI</span> for Your Tests?
        </h2>
        <p className="text-lg md:text-2xl text-gray-700 max-w-xl animate-fade-in-up delay-100 text-center lg:text-left">
          <span className="text-purple-500 font-semibold">AI</span> makes test creation smarter, faster, and more creative.<br />
          Let our <span className="text-indigo-500 font-semibold">AI engine</span> help you write test descriptions, generate questions, solutions, and even explanations—instantly!
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in-up delay-200">
          <li className="flex items-start gap-5 bg-white/80 rounded-xl shadow-md p-5 hover:scale-105 hover:shadow-xl transition-all duration-200">
            <span className="inline-flex items-center justify-center rounded-full bg-purple-100 p-3 shadow-sm">
              <BrainCircuit className="h-10 w-10 text-purple-500" />
            </span>
            <div>
              <div className="font-bold text-gray-900 mb-1">AI-Powered Test Descriptions</div>
              <div className="text-gray-600 text-base">Describe your test in seconds—just give a topic, and our AI writes a professional, engaging description for you.</div>
            </div>
          </li>
          <li className="flex items-start gap-5 bg-white/80 rounded-xl shadow-md p-5 hover:scale-105 hover:shadow-xl transition-all duration-200">
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-3 shadow-sm">
              <Wand2 className="h-10 w-10 text-indigo-500" />
            </span>
            <div>
              <div className="font-bold text-gray-900 mb-1">AI-Based Question Generation</div>
              <div className="text-gray-600 text-base">Generate high-quality, relevant questions for any subject or level—instantly and effortlessly.</div>
            </div>
          </li>
          <li className="flex items-start gap-5 bg-white/80 rounded-xl shadow-md p-5 hover:scale-105 hover:shadow-xl transition-all duration-200">
            <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-3 shadow-sm">
              <Lightbulb className="h-10 w-10 text-yellow-500" />
            </span>
            <div>
              <div className="font-bold text-gray-900 mb-1">Instant Solutions & Explanations</div>
              <div className="text-gray-600 text-base">Get detailed solutions and explanations for every question, generated by AI for clarity and depth.</div>
            </div>
          </li>
          <li className="flex items-start gap-5 bg-white/80 rounded-xl shadow-md p-5 hover:scale-105 hover:shadow-xl transition-all duration-200">
            <span className="inline-flex items-center justify-center rounded-full bg-pink-100 p-3 shadow-sm">
              <FileText className="h-10 w-10 text-pink-500" />
            </span>
            <div>
              <div className="font-bold text-gray-900 mb-1">Unique Test Options</div>
              <div className="text-gray-600 text-base">AI creates diverse question types and options, making every test unique and challenging.</div>
            </div>
          </li>
        </ul>
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
      `}</style>
    </section>
  );
}