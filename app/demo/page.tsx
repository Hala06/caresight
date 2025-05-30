'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const demos = [
    {
      id: 'ai-chat',
      title: '🤖 AI Medical Assistant',
      description: 'See how our AI explains medical terms in simple language',
      features: ['Answers health questions', 'Explains medical terms', 'Provides guidance'],
      demoText: 'Try asking: "What is hypertension?" or "When should I call my doctor?"'
    },
    {
      id: 'document-scanner',
      title: '📄 Document Scanner',
      description: 'Upload medical documents and get AI-powered analysis',
      features: ['OCR text extraction', 'Medical term identification', 'AI summarization'],
      demoText: 'Upload prescriptions, lab results, or medical forms for instant analysis.'
    },
    {
      id: 'personalization',
      title: '🎯 Personalized Experience',
      description: 'Customized health dashboard based on your conditions',
      features: ['Health condition tracking', 'Personalized reminders', 'Custom insights'],
      demoText: 'Dashboard adapts to your specific health needs and preferences.'
    },
    {
      id: 'accessibility',
      title: '♿ Accessibility Features',
      description: 'Built for elderly users and those needing extra support',
      features: ['Text-to-speech', 'Large text mode', 'Voice navigation'],
      demoText: 'Care Mode provides larger buttons, simpler navigation, and audio support.'
    }
  ];

  const handleStartDemo = (demoId: string) => {
    setCurrentDemo(demoId);
    setIsPlaying(true);
    
    // Set up demo environment
    localStorage.setItem('isDemo', 'true');
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Navigate to appropriate page based on demo
    setTimeout(() => {
      switch (demoId) {
        case 'ai-chat':
          window.location.href = '/chat';
          break;
        case 'document-scanner':
          window.location.href = '/upload';
          break;
        case 'personalization':
          // Set up demo preferences
          const demoPrefs = {
            hasBloodPressure: true,
            hasDiabetes: true,
            textToSpeech: true,
            age: '65-74',
            medicalConditions: ['Blood Pressure', 'Diabetes']
          };
          localStorage.setItem('userPreferences', JSON.stringify(demoPrefs));
          window.location.href = '/dashboard';
          break;
        case 'accessibility':
          window.location.href = '/care-mode';
          break;
      }
    }, 1000);
  };

  const handleExploreDemo = () => {
    localStorage.setItem('isDemo', 'true');
    localStorage.setItem('onboardingCompleted', 'true');
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
            className="text-center max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🎯</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Interactive Demo
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-200 mb-6">
                Experience CareSight's Features Live
              </h2>
            </motion.div>

            {/* Demo Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {demos.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                  onClick={() => handleStartDemo(demo.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {demo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {demo.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {demo.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 italic">
                        {demo.demoText}
                      </p>
                    </div>
                    
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all"
                      disabled={isPlaying && currentDemo === demo.id}
                    >
                      {isPlaying && currentDemo === demo.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Loading Demo...
                        </span>
                      ) : (
                        '🚀 Try This Feature'
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                🎯 Full Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready to explore everything? Get the complete CareSight experience with all features enabled.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/dashboard"
                  onClick={handleExploreDemo}
                  className="border-2 border-blue-500 text-blue-500 dark:text-blue-400 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  Explore Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
