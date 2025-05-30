// app/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  // Handle Clerk authentication safely for build time
  let isSignedIn = false;
  let user = null;
  
  try {
    const clerkData = useUser();
    isSignedIn = clerkData.isSignedIn ?? false;
    user = clerkData.user;
  } catch (error) {
    // Clerk is not available during build, use defaults
    console.log('Clerk not available in Navbar, using defaults');
  }
  return (    <nav className={`fixed top-0 w-full z-50 border-b transition-all ${
      transparent 
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-600' 
        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-theme-accent-blue dark:from-theme-accent-purple dark:to-theme-accent-ash-purple rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-theme-accent-blue dark:from-theme-accent-purple dark:to-theme-accent-ash-purple bg-clip-text text-transparent">
            CareSight
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/chat" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Ask AI
              </Link>
              <Link href="/upload" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Upload
              </Link>
              <Link href="/care-mode" className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
                Care Mode
              </Link>
            </>
          ) : (
            <>
              <Link href="/demo" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Demo
              </Link>
              <Link href="/sign-in" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>        {/* Right Side - Theme Toggle & User */}
        <div className="flex items-center gap-3">
          <ThemeToggle />          
          {isSignedIn && (
            <div suppressHydrationWarning>
              <UserButton 
                signInUrl="/sign-in"
                userProfileUrl="/dashboard"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>    </nav>
  );
}