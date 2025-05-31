'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import VoiceReader, { useVoiceReader } from './VoiceReader';
import Link from 'next/link';

interface UserSetupPromptProps {
  onSetupComplete?: () => void;
}

export default function UserSetupPrompt({ onSetupComplete }: UserSetupPromptProps) {
  const { user } = useUser();
  const { speak } = useVoiceReader();
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const userName = user?.firstName || user?.username || 'User';

  useEffect(() => {
    // Check if user needs setup
    if (typeof window !== 'undefined') {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      const isDemo = localStorage.getItem('isDemo') === 'true';
      
      if (!onboardingCompleted && !isDemo && user) {
        setShowSetup(true);
        
        // Auto-speak welcome message
        if (!hasSpoken) {
          setTimeout(() => {
            speak(`Welcome to CareSight, ${userName}! It looks like you're new here. Would you like to set up your health information to get personalized assistance?`);
            setHasSpoken(true);
          }, 1500);
        }
      }
    }
  }, [user, userName, speak, hasSpoken]);

  const handleSetupLater = () => {
    // Set up demo mode temporarily
    localStorage.setItem('isDemo', 'true');
    setShowSetup(false);
    speak(`No problem, ${userName}. You can explore CareSight and set up your information anytime from your profile.`);
    if (onSetupComplete) onSetupComplete();
  };

  const handleStartSetup = () => {
    speak(`Great choice, ${userName}! Let's get your health information set up.`);
    // Redirect to onboarding after a short delay
    setTimeout(() => {
      window.location.href = '/onboarding';
    }, 2000);
  };

  if (!showSetup) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <VoiceReader className="w-full max-w-2xl">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 relative"
        >
          {/* Greeting Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center"
            >
              <span className="text-4xl">👋</span>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to CareSight, {userName}!
            </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              I&apos;m your AI healthcare assistant. To provide you with personalized care and assistance, 
              I&apos;d love to learn about your health needs and preferences.
            </p>
          </div>

          {/* Setup Benefits */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                icon: '🎯',
                title: 'Personalized Dashboard',
                description: 'Get health insights tailored to your specific conditions and goals'
              },
              {
                icon: '💊',
                title: 'Smart Reminders',
                description: 'Medication and appointment reminders customized for your schedule'
              },
              {
                icon: '👥',
                title: 'Caregiver Alerts',
                description: 'Keep your family and caregivers informed about your health'
              },
              {
                icon: '♿',
                title: 'Accessibility Features',
                description: 'Voice commands, large text, and other features based on your needs'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Would you like to set up your health information now? It only takes 3-5 minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleStartSetup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <span>🚀</span>
                Yes, Let&apos;s Set Up My Profile
              </motion.button>
              
              <motion.button
                onClick={handleSetupLater}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-all flex items-center justify-center gap-3"
              >
                <span>👀</span>
                I&apos;ll Explore First
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              You can always set up your information later from your{' '}
              <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                dashboard
              </Link>
              {' '}or{' '}
              <Link href="/onboarding" className="text-blue-600 dark:text-blue-400 hover:underline">
                profile settings
              </Link>
              .
            </p>
          </div>

          {/* Coming Soon Features Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚧</span>
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Coming Soon Features
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Email notifications and AI document summarization features are currently in development. 
                  For now, you can explore our voice assistant, health monitoring, and accessibility features!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </VoiceReader>
    </motion.div>
  );
}
