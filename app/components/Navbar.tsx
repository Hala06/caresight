"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark") {
        setIsDark(true);
      }
    }
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-md p-4 mx-4 my-4">
      <div className="flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-4">
          <img src="/next.svg" alt="Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">Hackathon</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About Us
          </Link>
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="hover:text-blue-600"
            >
              Language ▾
            </button>
            {languageOpen && (
              <ul className="absolute bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg mt-2 w-32">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  English
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Hindi
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Tamil
                </li>
              </ul>
            )}
          </div>
          <Link href="/emergency" className="hover:text-red-500 font-semibold">
            Emergency
          </Link>
          {/* Dark Mode Toggle */}
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <Link href="/" className="block hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="block hover:text-blue-600">
            About Us
          </Link>
          <div>
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="hover:text-blue-600 w-full text-left"
            >
              Language ▾
            </button>
            {languageOpen && (
              <ul className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md mt-2 w-full">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  English
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Hindi
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Tamil
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/emergency"
            className="block hover:text-red-500 font-semibold"
          >
            Emergency
          </Link>
        </div>
      )}
    </nav>
  );
}
