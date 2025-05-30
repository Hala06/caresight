// app/dashboard/page.tsx
'use client';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HealthMonitoring from '../components/HealthMonitoring';
import HealthOverview from '../components/HealthOverview';
import EmergencyContacts from '../components/EmergencyContacts';
import EmailReminder from '../components/EmailReminder';
import AdvancedHealthMonitoring from '../components/AdvancedHealthMonitoring';
import VoiceAssistant from '../components/VoiceAssistant';
import CareSettings from '../components/CareSettings';
import PersonalizedWelcome from '../components/PersonalizedWelcome';
import BackgroundAnimations from '../components/BackgroundAnimations';
import Link from 'next/link';

export default function Dashboard() {
  // Handle Clerk authentication safely for build time
  let isSignedIn = false;
  let user = null;
  
  try {
    const clerkData = useUser();
    isSignedIn = clerkData.isSignedIn ?? false;
    user = clerkData.user;
    
    if (!isSignedIn) {
      redirect('/sign-in');
    }
  } catch (error) {
    // Clerk is not available during build, continue without authentication
    console.log('Clerk not available, skipping authentication');
  }

  // Check if user has completed onboarding
  const checkOnboardingStatus = () => {
    if (typeof window !== 'undefined') {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      const isDemo = localStorage.getItem('isDemo') === 'true';
      
      // If not demo user and hasn't completed onboarding, redirect
      if (!isDemo && !onboardingCompleted && isSignedIn) {
        redirect('/onboarding');
      }
      
      return { onboardingCompleted: !!onboardingCompleted, isDemo };
    }
    return { onboardingCompleted: false, isDemo: false };
  };

  const { onboardingCompleted, isDemo } = checkOnboardingStatus();

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Scan and analyze medical documents',
      icon: '📄',
      href: '/upload',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Ask AI Assistant',
      description: 'Get medical questions answered',
      icon: '🤖',
      href: '/chat',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Care Mode',
      description: 'Emergency contacts and alerts',
      icon: '🚨',
      href: '/care-mode',
      gradient: 'from-red-500 to-red-600'
    },
    {
      title: 'Health Records',
      description: 'View your medical history',
      icon: '📋',
      href: '/records',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  const upcomingAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: 'Today, 2:30 PM',
      type: 'Follow-up',
      status: 'confirmed'
    },
    {
      doctor: 'Dr. Michael Chen',
      specialty: 'Primary Care',
      date: 'Tomorrow, 10:00 AM',
      type: 'Routine Checkup',
      status: 'confirmed'
    },
    {
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'Endocrinologist',
      date: 'Friday, 3:00 PM',
      type: 'Diabetes Management',
      status: 'pending'
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Calm Background Animations */}
      <BackgroundAnimations />
      
      <Navbar />
      
      <div className="pt-20 pb-8 relative z-10">
        <div className="container mx-auto px-6">{/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {isDemo ? `Welcome to the CareSight Demo! 👋` : 
                     onboardingCompleted ? `Welcome back, ${user?.firstName || 'User'}! 👋` :
                     `Hi ${user?.firstName || 'User'}! Let's get started 🚀`}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    {isDemo ? 'Explore our demo features and see how CareSight can help with healthcare management' :
                     onboardingCompleted ? `Here's your health overview for ${new Date().toLocaleDateString('en-US', { 
                       weekday: 'long', 
                       year: 'numeric', 
                       month: 'long', 
                       day: 'numeric' 
                     })}` :
                     'Complete your setup to unlock personalized health assistance'}
                  </p>
                  
                  {/* Show onboarding reminder for new users */}
                  {!isDemo && !onboardingCompleted && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">✨</div>
                        <div>
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200">Quick Setup Required</h3>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            Complete your profile to get personalized health insights and connect with caregivers
                          </p>
                        </div>
                        <Link 
                          href="/onboarding"
                          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                        >
                          Complete Setup
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Demo disclaimer */}
                  {isDemo && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Demo Mode</h3>
                          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            This is a demonstration with sample data. Do not enter real medical information.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-1 shadow-lg">
                      ❤️
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Health Score</span>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">85%</div>
                  </motion.div>
                </div>
              </div>            </div>
          </motion.div>

          {/* Personalized Welcome Component */}
          <PersonalizedWelcome 
            isDemo={isDemo} 
            onboardingCompleted={onboardingCompleted} 
          />

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                whileTap={{ scale: 0.98 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link
                  href={action.href}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Health Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Documents Processed</h3>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-blue-100 text-sm">This month</p>
                </div>
                <div className="text-4xl opacity-80">📄</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Questions Asked</h3>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-green-100 text-sm">Total queries</p>
                </div>
                <div className="text-4xl opacity-80">💬</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Next Appointment</h3>
                  <p className="text-xl font-bold">Today 2:30 PM</p>
                  <p className="text-purple-100 text-sm">Dr. Sarah Johnson</p>
                </div>
                <div className="text-4xl opacity-80">🩺</div>
              </div>
            </div>
          </motion.div>          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Health Overview & Monitoring */}
            <div className="lg:col-span-2 space-y-8">
              {/* Health Overview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-25"></div>
                <div className="relative">
                  <HealthOverview />
                </div>
              </motion.div>

              {/* Health Monitoring */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-25"></div>
                <div className="relative">
                  <HealthMonitoring />
                </div>
              </motion.div>

              {/* Advanced Health Monitoring */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25"></div>
                <div className="relative">
                  <AdvancedHealthMonitoring />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Appointments & Emergency */}
            <div className="space-y-8">              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  Upcoming Appointments
                  <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
                    {upcomingAppointments.length}
                  </span>
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {appointment.doctor}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
                        <span>🩺</span>
                        {appointment.specialty}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <span>🕐</span>
                        {appointment.date}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <span>📋</span>
                        {appointment.type}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <Link
                  href="/appointments"
                  className="mt-4 block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900 text-blue-600 dark:text-blue-300 rounded-xl hover:from-blue-100 hover:to-teal-100 dark:hover:from-blue-800 dark:hover:to-teal-800 transition-all font-medium"
                >
                  View All Appointments →
                </Link>
              </motion.div>              {/* Emergency Contacts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-25"></div>
                <div className="relative">
                  <EmergencyContacts />
                </div>
              </motion.div>              {/* Email Reminder System */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25"></div>
                <div className="relative">
                  <EmailReminder />
                </div>
              </motion.div>            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant - Floating component */}
      <VoiceAssistant />

      {/* Care Settings - Available from care mode or accessibility menu */}
      <div className="fixed bottom-4 left-4 z-50">
        <CareSettings />
      </div>
    </div>
  );
}
