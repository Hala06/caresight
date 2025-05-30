// app/components/Footer.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-teal-800 dark:from-gray-900 dark:to-blue-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h3 className="text-2xl font-bold">CareSight</h3>
              </div>
              <p className="text-blue-100 dark:text-gray-300 mb-4 max-w-md">
                Advanced healthcare monitoring and care coordination platform. 
                Empowering patients and healthcare providers with AI-driven insights and comprehensive health management tools.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-sm">📧</span>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-sm">🐦</span>
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <span className="text-sm">💼</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-100">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-blue-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-blue-200 hover:text-white transition-colors">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-blue-200 hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-blue-200 hover:text-white transition-colors">
                  Upload Documents
                </Link>
              </li>
              <li>
                <Link href="/care-mode" className="text-blue-200 hover:text-white transition-colors">
                  Care Mode
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-blue-100">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/getting-started" className="text-blue-200 hover:text-white transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-blue-700 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-blue-200 dark:text-gray-400 text-sm">
            © 2025 CareSight. All rights reserved. Built with ❤️ for better healthcare.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-blue-200 text-sm">Powered by AI</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200 text-sm">Secure & HIPAA Compliant</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
