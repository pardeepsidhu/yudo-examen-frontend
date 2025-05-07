import React from 'react';
import { 
  Mail, Phone, Calendar, GraduationCap, 
  Code, Database, GitBranch, Briefcase,
  Globe, Link as LinkIcon, Github, Linkedin,
  Clock, BarChart2, Bell, User, Key,
  Cloud, MessageSquare, Brain, Server,
  ArrowRight, Award, BookOpen, Cpu, 
  FileText, Layers, Terminal, Zap,
  Target, Shield, Rocket,
  BarChart3, LineChart, PieChart,
  Settings, Users, Lock, ShieldCheck,
  CloudCog, DatabaseBackup, Network,
  GitPullRequest, GitCommit
} from 'lucide-react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <div className="flex flex-col items-center sm:items-start md:flex-row md:items-center justify-between gap-6 sm:gap-8">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
                  Pardeep Singh
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 font-medium">Full Stack Developer (MERN Stack)</p>
              </div>
              <div className="flex space-x-4">
                <div className="p-3 sm:p-4 rounded-xl bg-gray-50 text-gray-600 border border-gray-100">
                  <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-gray-50 text-gray-600 border border-gray-100">
                  <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">sidhupardeep618@yahoo.com</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">+91 8284012817</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">January 15, 2005</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">BCA Student (2022-2025)</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-blue-600 font-medium">https://www.linkedin.com/in/pardeep-singh-85848a2b1</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100">
                <Github className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-sm sm:text-base text-blue-600 font-medium">https://github.com/pardeepsidhu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 flex items-center">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
              Education
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 sm:py-6 bg-gray-50 rounded-r-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Bachelor of Computer Applications (BCA)</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Abhishek Group of Institutions</p>
                <p className="text-sm sm:text-base text-gray-600">Maharaja Ranjit Singh Punjab Technical University, Bathinda</p>
                <p className="text-sm sm:text-base text-gray-600 mt-3">2022-2025 | University Roll Number: 220232171</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Skills Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 flex items-center">
              <Code className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Cpu className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Frontend Development
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['HTML', 'CSS', 'JavaScript', 'React.js', 'Next.js', 'TypeScript'].map((skill) => (
                    <span key={skill} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Server className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Backend & Databases
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL'].map((skill) => (
                    <span key={skill} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <GitBranch className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Version Control & Tools
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['Git/GitHub', 'MERN Stack'].map((skill) => (
                    <span key={skill} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 flex items-center">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
              Professional Experience
            </h2>
            <div className="space-y-6 sm:space-y-10">
              <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 sm:py-6 bg-gray-50 rounded-r-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">OutThink Global Communication (Kolkata)</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Intern (Remote) | One month</p>
                <p className="text-sm sm:text-base text-gray-600 mt-3">Worked as a MERN stack developer</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 sm:py-6 bg-gray-50 rounded-r-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">CodersBoutique (San Francisco, California)</h3>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Intern (Remote) | 1.5/3 months</p>
                <p className="text-sm sm:text-base text-gray-600 mt-2">Worked as next.js developer</p>
                <p className="text-sm sm:text-base text-gray-600 mt-3">Note: Internship was discontinued due to personal issues..</p>
              </div>
            </div>
          </div>
        </div>

        {/* Career Focus */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 flex items-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
              Career Focus
            </h2>
            <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 sm:py-6 bg-gray-50 rounded-r-xl">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Focusing on full-stack web development with the MERN technology stack, building on a solid foundation of both frontend and backend technologies. Proficient in developing dynamic and responsive user interfaces using React.js, coupled with efficient state management through Redux or Context API. On the backend, skilled in building scalable RESTful APIs with Node.js and Express.js, and managing complex data structures using MongoDB. Experienced in integrating third-party APIs, implementing authentication systems (JWT, OAuth, Google One Tap), and deploying applications on platforms like Vercel, Render, and Railway. Continuously learning and implementing best practices in performance optimization, security, and responsive design to deliver modern, user-friendly web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Project Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8 sm:mb-12">
          <div className="p-6 sm:p-10 md:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-10 flex items-center">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 mr-3 sm:mr-4 text-blue-600" />
              Project: Yudo-Scheduler
            </h2>
            
            {/* Project Overview */}
            <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 sm:py-6 bg-gray-50 rounded-r-xl mb-6 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Project Overview</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Yudo-Scheduler is a comprehensive task and time management web application that enables users to create, track, and analyze their tasks with advanced time-tracking capabilities. The application provides detailed analytics, multiple authentication methods, and AI-powered features.
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <a href="https://yudo-scheduler.vercel.app" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium">
                     <a className='text-blue-700'>https://yudo-scheduler.vercel.app</a>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5  text-blue-600" />
                  <a   href="https://github.com/pardeepsidhu/yudo-scheduler" className="text-sm sm:text-base text-blue-700 font-medium">
                  https://github.com/pardeepsidhu
                  </a>
                </div>
              </div>
            </div>

            {/* UI Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-10">
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Layers className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  UI Components
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Responsive navigation with sidebar and mobile menu
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Modern landing page with hero section and features
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Interactive dashboard with real-time updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Custom form components and modals
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Loading states and animations
                  </li>
                </ul>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Analytics Dashboard
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Task completion trends with line charts
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Time distribution analysis with pie charts
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Weekly and monthly productivity metrics
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Custom date range selection
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Exportable reports in CSV format
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Task Management
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Create, edit, and delete tasks
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Task status tracking (To Do, Pending, In Process, Done)
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Time tracking with timestamps
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Dashboard for overview of upcoming tasks and reminders
                  </li>
                </ul>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Time Tracking & Analytics
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Detailed timesheet generation (weekly and monthly)
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Export reports in CSV format
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Analytics with visual charts for weekly and monthly task analysis
                  </li>
                </ul>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  Authentication & Notifications
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Email-based authentication with OTP verification
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Direct login links via email
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Telegram integration for reminders and notifications
                  </li>
                </ul>
              </div>
              <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                  AI Integration
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    Google Gemini integration
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    AI-powered content generation for reminders and task descriptions
                  </li>
                </ul>
              </div>
            </div>

            {/* Technical Architecture */}
            <div className="mt-12 sm:mt-16">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8 sm:mb-12">Technical Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Cpu className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                    Frontend
                  </h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      React.js, Next.js
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      TypeScript
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      shadcn/ui
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Tailwind CSS
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Deployment: Vercel
                    </li>
                  </ul>
                </div>
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Server className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                    Backend
                  </h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Node.js, Express.js
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      JWT Authentication
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Nodemailer with Gmail
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Deployment: Render
                    </li>
                  </ul>
                </div>
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Database className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                    Database & Services
                  </h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      MongoDB Atlas
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Cloudinary
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Telegram API
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Google Gemini API
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Development Workflow */}
            <div className="mt-12 sm:mt-16">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8 sm:mb-12">Development Workflow</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <GitPullRequest className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                    Version Control
                  </h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Git/GitHub for version control
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      CI/CD through GitHub integration
                    </li>
                  </ul>
                </div>
                <div className="p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mr-3 text-blue-600" />
                    Deployment Architecture
                  </h4>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Frontend hosted on Vercel
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      Backend services on Render
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3">•</span>
                      MongoDB Atlas for database
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 