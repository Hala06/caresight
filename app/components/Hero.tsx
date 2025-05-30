// app/components/Hero.tsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-20">
      {/* Background with DNA pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/DNA.jpg"
          alt="Medical background"
          fill
          className="object-cover opacity-30 dark:opacity-20 img-responsive"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-blue-50/80 to-teal-50/90 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95"></div>
      </div>

      <div className="container-responsive relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left mobile-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 sm:px-4 py-2 rounded-full text-responsive-sm font-medium mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></span>
              AI-Powered Healthcare Assistant
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-responsive-4xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-blue-600 via-theme-accent-gold to-theme-accent-blue dark:from-theme-accent-purple dark:via-theme-accent-ash-purple dark:to-blue-400 bg-clip-text text-transparent">
                CareSight
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Your Compassionate Health Companion
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-xl"
            >
              An AI-powered assistant that reads and simplifies medical forms for elderly, disabled, 
              and neurodiverse users, with caregiver alerts and medical Q&A support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/sign-up"
                className="group bg-gradient-to-r from-blue-500 to-theme-accent-blue dark:from-theme-accent-purple dark:to-theme-accent-ash-purple text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <span>🚀</span>
                Get Started Free
                <motion.span
                  className="group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.span>
              </Link>
                <Link
                href="/demo"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-purple-400 dark:hover:text-purple-300 transition-all flex items-center justify-center gap-3"
              >
                <span>▶️</span>
                Watch Demo
              </Link>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: '🔍', label: 'Smart Document Reading' },
                { icon: '👥', label: 'Caregiver Alerts' },
                { icon: '💬', label: 'Medical Q&A Chat' },
                { icon: '♿', label: 'Full Accessibility' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - AI Assistant Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">              <Image
                src="/care.jpg"
                alt="AI assistant helping elderly person with medical documents"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
                style={{ width: "auto", height: "auto" }}
                priority
              />
              
              {/* Floating medical icons */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-lg"
              >
                <span className="text-2xl">❤️</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-full shadow-lg"
              >
                <span className="text-2xl">🏥</span>
              </motion.div>
              
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-8 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-3 rounded-full shadow-lg"
              >
                <span className="text-xl">💊</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '10K+', label: 'Users Helped' },
              { number: '50K+', label: 'Documents Processed' },
              { number: '99.8%', label: 'Accuracy Rate' },
              { number: '24/7', label: 'Available Support' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}