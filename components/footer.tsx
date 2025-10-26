"use client"
import React from 'react';
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, Code, GraduationCap, Sparkles, Zap, Trophy, Target } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social media links with hover animations
  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com/pardeepsidhu", label: "GitHub", color: "hover:bg-gray-800 hover:text-white" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/pardeep-singh-85848a2b1", label: "LinkedIn", color: "hover:bg-blue-600 hover:text-white" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/es6_boy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram", color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white" },
  ];

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: "AI-Powered Questions" },
    { icon: <Trophy className="w-5 h-5" />, text: "Instant Analytics" },
    { icon: <Target className="w-5 h-5" />, text: "Multi-Language Support" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-100/50 to-sky-100/50 rounded-full blur-3xl" />
      </div>

      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 animate-gradient-x" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Top section with logo, tagline and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-10 border-b border-indigo-200/50">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-3 group">
              <div className="relative h-14 w-14 rounded-full overflow-hidden shadow-xl border-3 border-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600" />
                <Image
                  src="/fav.png"
                  alt="Yudo Examen"
                  fill
                  className="object-contain p-2 relative z-10"
                  sizes="56px"
                />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Yudo Examen
                </span>
                <span className="text-xs text-indigo-600 font-medium tracking-wider">
                  AI-POWERED LEARNING PLATFORM
                </span>
              </div>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-300/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200 shadow-sm"
                >
                  <span className="text-indigo-600">{feature.icon}</span>
                  <span className="text-xs text-indigo-700 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-gray-600 mb-3 font-medium">Connect With Us</p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className={`p-3 rounded-xl bg-white border border-indigo-200 text-indigo-600 ${link.color} hover:border-transparent transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200/50 transition-all duration-300`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main links section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Developer column */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100/50">
            <h3 className="text-indigo-900 font-bold text-lg mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              Developer
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                  <GraduationCap size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-indigo-900 font-semibold">Pardeep Singh</p>
                  <p className="text-gray-600 text-xs">B.C.A Graduate</p>
                </div>
              </li>
              <li className="flex items-center group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                  <Phone size={14} className="text-indigo-600" />
                </div>
                <a href="tel:+918284012817" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 text-sm">
                  +91 8284012817
                </a>
              </li>
              <li className="flex items-center group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                  <Mail size={14} className="text-indigo-600" />
                </div>
                <a href="mailto:Sidhupardeep618@yahoo.com" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 text-xs break-all">
                  Sidhupardeep618@yahoo.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* About column */}
          <div>
            <h3 className="text-indigo-900 font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              About
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Overview', 'Features', 'AI-Powered', 'Media Support'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/about/#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 group-hover:bg-indigo-600 transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Platform column */}
          <div>
            <h3 className="text-indigo-900 font-bold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-600" />
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Create Tests', 'Attend Series', 'Analytics', 'Multi-Language'].map((item) => (
                <li key={item}>
                  <span className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 cursor-pointer flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 group-hover:bg-blue-600 transition-colors" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact column */}
          <div>
            <h3 className="text-indigo-900 font-bold text-lg mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start group">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <MapPin size={14} className="text-indigo-600" />
                </div>
                <span className="text-gray-700">Fazilka, Punjab, 152132</span>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <Phone size={14} className="text-indigo-600" />
                </div>
                <a href="tel:+918284012817" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300">
                  +91 8284012817
                </a>
              </li>
              <li className="flex items-center group">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors flex-shrink-0">
                  <Mail size={14} className="text-indigo-600" />
                </div>
                <a href="mailto:yudo.examen@gmail.com" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 text-xs break-all">
                  yudo.examen@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section with gradient border */}
        <div className="pt-8 border-t border-indigo-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 animate-pulse" />
              © {currentYear} Yudo Examen. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slower {
          animation: pulse-slower 6s infinite;
        }
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};