import React from 'react';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Youtube,
  FileAudio,
  Sparkles,
} from 'lucide-react';



interface FeatureCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  delay?: number;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0, gradient }) => {
  return (
    <motion.div
      className="group relative bg-white p-5 rounded-2xl shadow-lg border-2 border-indigo-100 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        borderColor: '#818cf8'
      }}
    >
      {/* Hover gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className={`rounded-xl p-3 flex-shrink-0 bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export function LoginStaticSide() {
  const features = [
    {
      icon: FileQuestion,
      title: "Custom Question Design",
      description: "Create questions with titles, images, descriptions, and multiple choice options.",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: Youtube,
      title: "Video Solutions",
      description: "Add detailed video explanations and tutorial clips for comprehensive learning.",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: FileAudio,
      title: "AI-Powered Features",
      description: "Utilize text-to-speech and AI-based answer evaluation for enhanced experiences.",
      gradient: "from-purple-500 to-indigo-600"
    },
  ];

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-lg mx-auto relative z-10"
      >
        {/* Badge */}
        <motion.div 
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Sparkles className="h-4 w-4" />
          Yudo Examen
        </motion.div>
        
        {/* Main Title */}
        <h2 className="text-2xl lg:text-3xl font-black mb-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent leading-tight">
          Create Custom Test Series
        </h2>
        
        
        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 gap-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={0.1 * index}
            />
          ))}
        </motion.div>
        
        

        {/* Trust Badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% Free
          </div>
          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI-Powered
          </div>
          <div className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure
          </div>
        </motion.div>
      </motion.div>

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