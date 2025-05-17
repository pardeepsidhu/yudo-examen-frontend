import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/theme.context";
import { Toaster } from 'react-hot-toast';
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Yudo Examen | AI Powered Learning Platform",
  description: "Yudo Examen is an AI-powered online exam and quiz platform. Create, attend, and analyze tests with instant feedback, rich media, multilingual support, and smart analytics for students and educators.",
  keywords: [
    "online test",
    "quiz platform",
    "AI Based",
    "test series",
    "education",
    "multilingual",
  
    "Yudo Examen"
  ],
  authors: [{ name: "Yudo Examen Team", url: "https://yudoexamen.com" }],
  creator: "Yudo Examen",
  openGraph: {
    title: "Yudo Examen | AI Powered Online Exam Platform",
    description: "Create, attend, and analyze tests with instant feedback, rich media, multilingual support, and smart analytics.",
    url: "https://yudoexamen.com",
    siteName: "Yudo Examen",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Yudo Examen – AI Powered Online Learning Platform",
      },
    ],
    locale: "in",
    type: "website",
  },
 
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       
      >
        <Toaster />
        <ThemeProvider>
          <NavBar />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
