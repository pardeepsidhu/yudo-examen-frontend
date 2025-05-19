'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/app/context/theme.context';
import { ChevronDown, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function NavBar() {
  const { theme, updateTheme, colorPalettes } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenu, setThemeMenu] = useState(false);
  const [desktopThemeMenu, setDesktopThemeMenu] = useState(false);
  const [mobileThemeMenu, setMobileThemeMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const desktopThemeMenuRef = useRef<HTMLDivElement>(null);
  const mobileThemeMenuRef = useRef<HTMLDivElement>(null);

  // Check login status on mount
  useEffect(() => {
    setIsLoggedIn(typeof window !== 'undefined' && !!localStorage.getItem('user'));
  }, []);

  // Close menus on window resize
  useEffect(() => {
    if (menuOpen || themeMenu) {
      const close = () => {
        setMenuOpen(false);
        setThemeMenu(false);
      };
      window.addEventListener('resize', close);
      return () => window.removeEventListener('resize', close);
    }
  }, [menuOpen, themeMenu]);

  // Hide theme menu if click outside
  useEffect(() => {
    if (!themeMenu) return;
    function handleClick(e: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(e.target as Node)
      ) {
        setThemeMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [themeMenu]);

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/test', label: 'Tests' },
    { href: '/createTest', label: 'Create Test' },
    isLoggedIn
      ? { href: '/profile', label: 'Profile' }
      : { href: '/login', label: 'Login' },
  ];

  // Handler for theme change
  const handleThemeChange = (paletteName: string) => {
    updateTheme(paletteName);
    setThemeMenu(false);
    setMenuOpen(false);
  };

  return (
    <nav
      className="relative z-30 w-full flex items-center justify-between px-4 sm:px-10 py-2 shadow-md"
      style={{
        background: `linear-gradient(90deg, ${theme.primary}11 0%, ${theme.secondary}11 100%)`,
        borderBottom: `2px solid ${theme.primary}22`,
        minHeight: 56,
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 select-none group">
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-200">
          <Image
            src="/Logo.png"
            alt="Yudo Examen"
            fill
            className="object-contain"
            priority
            sizes="56px"
          />
        </div>

        
        <span
          className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 bg-clip-text text-transparent transition-all duration-200 group-hover:drop-shadow-lg"
          style={{
            letterSpacing: '0.03em',
          }}
        >
          Yudo Examen
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2 lg:gap-5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative font-semibold px-3 py-1.5 rounded-xl transition-all duration-200"
            style={{
              color: theme.primary,
              background: 'transparent',
              border: `1.5px solid transparent`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = `${theme.primary}11`;
              (e.currentTarget as HTMLElement).style.borderColor = theme.primary + '33';
              (e.currentTarget as HTMLElement).style.color = theme.secondary;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = theme.primary;
            }}
          >
            {link.label}
            <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full transition-all duration-300 group-hover:w-3/4" />
          </Link>
        ))}
        {/* Theme Palette Dropdown */}
        <div className="relative ml-2" ref={desktopThemeMenuRef}>
          <button
            aria-label="Change Theme"
            onClick={() => setDesktopThemeMenu((v) => !v)}
            className="px-3 py-1.5 rounded-xl shadow border transition-all flex items-center gap-2 font-semibold"
            style={{
              background: theme.white,
              color: theme.primary,
              borderColor: theme.primary + '33',
            }}
          >
            Theme
            <ChevronDown className="h-4 w-4" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transition-all duration-200 ${
              desktopThemeMenu ? 'opacity-100 scale-100 pointer-events-auto animate-fade-in' : 'opacity-0 scale-95 pointer-events-none'
            }`}
            style={{ transformOrigin: 'top right' }}
          >
            <ul className="py-2">
              {colorPalettes.map((palette) => (
                <li key={palette.name}>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    style={{
                      color: palette.primary,
                      fontWeight: palette.name === theme.name ? 700 : 500,
                      background: palette.name === theme.name ? `${palette.primary}11` : undefined,
                    }}
                    onClick={() => {
                      handleThemeChange(palette.name);
                      setDesktopThemeMenu(false);
                    }}
                  >
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{
                        background: palette.primary,
                        borderColor: palette.secondary,
                      }}
                    ></span>
                    {palette.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-indigo-50 transition"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        style={{
          color: theme.primary,
        }}
      >
        {menuOpen ? (
          <X className="h-8 w-8 transition-transform duration-200 rotate-90" />
        ) : (
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 10h20M6 16h20M6 22h20" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-lg rounded-b-2xl flex flex-col items-center py-3 gap-2 md:hidden z-40 border-t border-blue-100 transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        style={{ minHeight: menuOpen ? 180 : 0 }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-semibold text-base px-4 py-2 rounded-xl w-4/5 text-center transition-all"
            style={{
              color: theme.primary,
              background: `${theme.primary}08`,
            }}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {/* Theme Palette Dropdown for Mobile */}
        <div className="relative w-full flex flex-col items-center" ref={mobileThemeMenuRef}>
          <button
            aria-label="Change Theme"
            onClick={() => setMobileThemeMenu((v) => !v)}
            className="mt-2 px-4 py-2 rounded-xl shadow border transition-all flex items-center gap-2 font-semibold"
            style={{
              background: theme.white,
              color: theme.primary,
              borderColor: theme.primary + '33',
            }}
          >
            Theme
            <ChevronDown className="h-4 w-4" />
          </button>
          <div
            className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transition-all duration-200 ${
              mobileThemeMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
            }`}
            style={{ transformOrigin: 'top center' }}
          >
            <ul className="py-2">
              {colorPalettes.map((palette) => (
                <li key={palette.name}>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                    style={{
                      color: palette.primary,
                      fontWeight: palette.name === theme.name ? 700 : 500,
                      background: palette.name === theme.name ? `${palette.primary}11` : undefined,
                    }}
                    onClick={() => handleThemeChange(palette.name)}
                  >
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{
                        background: palette.primary,
                        borderColor: palette.secondary,
                      }}
                    ></span>
                    {palette.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </nav>
  );
}