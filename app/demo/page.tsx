'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function DemoPage() {
  const handleExploreDemo = () => {
    // Set demo flag in localStorage
    localStorage.setItem('isDemo', 'true');
    localStorage.setItem('onboardingCompleted', 'true'); // Skip onboarding for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Coming Soon Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl animate-pulse">🎬</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Demo Videos
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                Coming Soon!
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We're creating comprehensive video demonstrations of CareSight's features to help you understand how our AI-powered healthcare assistant can simplify your medical experience.
              </p>
              
              {/* Call to Action */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  🚀 Try CareSight Today!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  While our demo videos are in production, you can explore CareSight's features right now through our interactive dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/sign-up"
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Get Started Free
                  </Link>                  <Link
                    href="/dashboard"
                    onClick={handleExploreDemo}
                    className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    Explore Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
