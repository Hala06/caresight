'use client';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't render anything until the theme is mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2 rounded-full border border-gray-300 bg-white w-9 h-9">
        <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (    <motion.button
      onClick={toggleTheme}
      className={`p-3 rounded-full border-2 transition-all duration-300 ${
        theme === 'light' 
          ? 'border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-300' 
          : 'border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </motion.button>
  );
}
