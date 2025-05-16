import React from 'react';
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, Code, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social media links with hover animations
  const socialLinks = [
    { icon: <Github size={18} />, href: "https://github.com/pardeepsidhu", label: "GitHub" },
    { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/pardeep-singh-85848a2b1", label: "LinkedIn" },
    { icon: <Instagram size={18} />, href: "https://www.instagram.com/es6_boy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Top section with logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-8 border-b border-gray-800">
          <div className="flex items-center mb-6 md:mb-0">
            <Image src={'/Logo.png'} alt='Yudo Examen' height={145} width={145} />
          </div>
          <div className="flex space-x-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="text-gray-400 hover:text-indigo-400 transform hover:-translate-y-1 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Main links section - more organized in columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Developer column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Developer</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Code size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">Pardeep Singh</span>
              </li>
              <li className="flex items-center">
                <GraduationCap size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <span className="text-gray-400">B.C.A</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <a href="tel:+918284012817" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                  +91 8284012817
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <a href="mailto:Sidhupardeep618@@yahoo.com" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                  Sidhupardeep618@@yahoo.com
                </a>
              </li>
            </ul>
          </div>
          
          {/* About column */}
          <div>
            <h3 className="text-white font-medium text-lg mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              {['Overview', 'Features', 'AI-Powered', 'Media Support'].map((item) => (
                <li key={item}>
                  <Link href={`/about/#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services column */}
          <div>
            <h3 className="text-white font-medium text-lg mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              {['Create Tests', 'Attend Series', 'Analytics', 'Multi-Language'].map((item) => (
                <li key={item}>
                  <span className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">Fazilka, Punjab, 152132</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <a href="tel:+918284012817" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                  +91 8284012817
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-indigo-400 mr-2 flex-shrink-0" />
                <a href="mailto:yudo.examen@gmail.com" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">
                 yudo.examen@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Yudo Examen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

