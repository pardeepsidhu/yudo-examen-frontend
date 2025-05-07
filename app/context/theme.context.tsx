"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types
export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  neutral: string;
  white: string;
}

interface ThemeContextType {
  theme: ColorPalette;
  updateTheme: (themeName: string) => void;
  colorPalettes: ColorPalette[];
}

// Color Palettes
const colorPalettes = [
    {
      name: "Sunset Vibes",
      primary: "#E36255",
      secondary: "#EC9A86",
      tertiary: "#A2C5C9",
      accent: "#F3C262",
      neutral: "#F1E0CE",
      white: "#FFFFFF",
    },
    {
      name: "Ocean Breeze",
      primary: "#1C6E8C",
      secondary: "#71A9F7",
      tertiary: "#A6E1FA",
      accent: "#FFCF99",
      neutral: "#F1F6F9",
      white: "#FFFFFF",
    },
    {
      name: "Forest Hike",
      primary: "#2F3E46",
      secondary: "#52796F",
      tertiary: "#84A98C",
      accent: "#CAD2C5",
      neutral: "#EDF6F9",
      white: "#FFFFFF",
    },
    {
      name: "Royal Bloom",
      primary: "#6A0572",
      secondary: "#AB83A1",
      tertiary: "#F5C7F7",
      accent: "#FFE156",
      neutral: "#F6F6F6",
      white: "#FFFFFF",
    },
    {
      name: "Mint Candy",
      primary: "#7FFFD4",
      secondary: "#00CED1",
      tertiary: "#AFEEEE",
      accent: "#FF6F61",
      neutral: "#F0FFFF",
      white: "#FFFFFF",
    },
    {
      name: "Peach Garden",
      primary: "#FF6B6B",
      secondary: "#FFE66D",
      tertiary: "#4ECDC4",
      accent: "#1A535C",
      neutral: "#F7FFF7",
      white: "#FFFFFF",
    },
    {
      name: "Desert Gold",
      primary: "#C08457",
      secondary: "#D9BF77",
      tertiary: "#F2E3D5",
      accent: "#B8A29E",
      neutral: "#F8F4F0",
      white: "#FFFFFF",
    },
    {
      name: "Aurora Light",
      primary: "#495867",
      secondary: "#577399",
      tertiary: "#BDD5EA",
      accent: "#F7F7FF",
      neutral: "#EFEFEF",
      white: "#FFFFFF",
    },
    {
      name: "Lemon Sorbet",
      primary: "#FFE066",
      secondary: "#FFB677",
      tertiary: "#FF8364",
      accent: "#C4FFF9",
      neutral: "#FDFCDC",
      white: "#FFFFFF",
    },
    {
      name: "Cyber Neon",
      primary: "#0F0F0F",
      secondary: "#1A1A40",
      tertiary: "#FF2E63",
      accent: "#08D9D6",
      neutral: "#EAEAEA",
      white: "#FFFFFF",
    },
    {
        name:"base",
        primary: '#E36255',
        secondary: '#EC9A86',
        tertiary: '#A2C5C9',
        accent: '#F3C262',
        neutral: '#F1E0CE',
        white: '#FFFFFF',}
  ];
  
  // Define our color palette

    
  

// Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorPalette>(colorPalettes[3]);

  // On mount, check localStorage
  useEffect(() => {
    const storedThemeName = localStorage.getItem("themeName");
    const storedTheme = colorPalettes.find(p => p.name === storedThemeName);
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const updateTheme = (themeName: string) => {
    const selected = colorPalettes.find(p => p.name === themeName);
    if (selected) {
      setTheme(selected);
      localStorage.setItem("themeName", selected.name);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, colorPalettes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
