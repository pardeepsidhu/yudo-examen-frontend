
import React from 'react';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  Youtube,
  FileAudio,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from '../context/theme.context';
import { AvatarCircles } from '@/components/magicui/avatar-circles';

// Define our color palette

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://github.com/safethecode",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "https://github.com/sanjay-mali",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];
// Feature card interface
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) =>{
  const {theme} = useTheme()
  return(
  <motion.div
    className="bg-white p-4 rounded-lg shadow-md border border-gray-100 cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ 
      y: -5, 
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      borderColor: theme.tertiary
    }}
  >
    <div className="flex items-start gap-3">
      <div 
        className="rounded-md p-2 flex-shrink-0" 
        style={{ backgroundColor: `${theme.primary}10` }} // 10% opacity version of primary color
      >
        <Icon size={20} style={{ color: theme.primary }} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-md">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  </motion.div>
) };

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export function LoginStaticSide(){
  const features = [
    {
      icon: FileQuestion,
      title: "Custom Question Design",
      description: "Create questions with titles, images, descriptions, and multiple choice options."
    },
    {
      icon: Youtube,
      title: "Video Solutions",
      description: "Add detailed video explanations and tutorial clips for comprehensive learning."
    },
    {
      icon: FileAudio,
      title: "AI-Powered Features",
      description: "Utilize text-to-speech and AI-based answer evaluation for enhanced experiences."
    },

  
  ];
  const {theme} = useTheme()
  return (
    <div
      className="w-full md:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative overflow-hidden"
      style={{ backgroundColor: theme.white }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: theme.tertiary, transform: 'translate(30%, -30%)' }}></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: theme.accent, transform: 'translate(-30%, 30%)' }}></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-lg mx-auto relative z-10"
      >
        <div className="mb-2 inline-block rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
          Yudo-Examen
        </div>
        
        <h2 className="text-3xl font-bold mb-3" style={{ color: theme.primary }}>
          Create Custom Test Series
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          Empower your learning journey with our intuitive test series creation platform. Design personalized assessments with advanced features to enhance understanding and retention.
        </p>
        
        <motion.div 
          className="grid grid-cols-1 gap-4 mb-8"
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
              delay={0.1 * index}
            />
          ))}
        </motion.div>
        
        <div className="flex items-center justify-center mt-10 space-x-4">
          <div className="flex -space-x-2">
            <AvatarCircles avatarUrls={avatars} />
          </div>
          <span className="text-sm text-gray-600">
            <span className="font-semibold">1,200+</span> educators joined this month
          </span>
        </div>
      </motion.div>
    </div>
  );
}