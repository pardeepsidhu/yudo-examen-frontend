'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsLoggedIn(typeof window !== 'undefined' && !!localStorage.getItem('user'));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('resize', close);
      return () => window.removeEventListener('resize', close);
    }
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/test', label: 'Tests' },
    { href: '/createTest', label: 'Create Test' },
    isLoggedIn
      ? { href: '/profile', label: 'Profile' }
      : { href: '/login', label: 'Login' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 `}
      >
        {/* Glass morphism container */}
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
            scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl' : 'bg-white/70 backdrop-blur-md shadow-lg'
          } border border-indigo-100/50`}
        >
          <div className="flex items-center justify-between h-14 sm:h-18">
            {/* Animated gradient line on top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden rounded-t-2xl">
              <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 animate-shimmer" />
            </div>

            {/* Logo */}
            <Link href="/" className="relative flex items-center gap-3 select-none group z-10">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                
                {/* Logo container */}
                <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-200/50 group-hover:ring-4 group-hover:ring-indigo-300/70 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600" />
                  <Image
                    src="/fav.png"
                    alt="Yudo Examen"
                    fill
                    className="object-contain p-1.5 relative z-10"
                    priority
                    sizes="48px"
                  />
                  {/* Shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Sparkle effect */}
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </div>

              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-blue-500 group-hover:to-sky-400 transition-all duration-500">
                  Yudo Examen
                </span>
                <span className="hidden sm:block text-[9px] font-bold text-indigo-500/70 -mt-1 tracking-[0.2em] uppercase">
                  AI Learning
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-semibold text-sm lg:text-base px-4 py-2.5 rounded-xl transition-all duration-300 group"
                  style={{
                    color: '#4f46e5',
                  }}
                >
                  {/* Hover background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl scale-95 group-hover:scale-100" />
                  
                  {/* Text */}
                  <span className="relative z-10 group-hover:text-indigo-700 transition-colors duration-200">
                    {link.label}
                  </span>
                  
                  {/* Animated underline */}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
                </Link>
              ))}
              
              {/* Premium CTA Button */}
              <Link
                href="/createTest"
                className="ml-3 relative px-6 py-2.5 rounded-xl font-bold text-sm lg:text-base text-white overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-200/50"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
                
                <span className="relative z-10 flex items-center gap-2">
                  Create Test
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 group"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {menuOpen ? (
                <X className="h-6 w-6 text-indigo-600 transition-all duration-300 rotate-90 relative z-10" />
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-600 relative z-10">
                  <path d="M4 8h16M4 16h16" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 mt-0 sm:mt-3 mx-2 sm:mx-4 transition-all duration-500 ${
            menuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-sm shadow-2xl border border-indigo-100/50 overflow-hidden">
            {/* Decorative gradient top */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />
            
            <div className="py-4 rouned-sm!">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-semibold text-base px-6 py-3.5 mx-3 mb-2 rounded-xl flex items-center justify-between transition-all duration-300 group overflow-hidden"
                  style={{
                    color: '#4f46e5',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <span className="relative z-10 group-hover:text-indigo-700 transition-colors duration-200">{link.label}</span>
                  <ChevronRight className="relative z-10 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <Link
                href="/createTest"
                className="mx-3 mt-4 relative px-6 py-3.5 rounded-xl font-bold text-base text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Create Test</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer */}
      <div className={`transition-all duration-500 ${scrolled ? 'h-20' : 'h-17'}`} />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}