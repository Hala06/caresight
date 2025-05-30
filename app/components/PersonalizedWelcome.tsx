// app/components/PersonalizedWelcome.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

interface UserPreferences {
  textToSpeech: boolean;
  age: string;
  medicalConditions: string[];
  emergencyContacts: any[];
  caregiverEmails: string[];
  accessibilityNeeds: string[];
  hasBloodPressure: boolean;
  hasDiabetes: boolean;
  hasHeartCondition: boolean;
  hasAsthma: boolean;
}

interface PersonalizedWelcomeProps {
  isDemo: boolean;
  onboardingCompleted: boolean;
}

export default function PersonalizedWelcome({ isDemo, onboardingCompleted }: PersonalizedWelcomeProps) {
  const { user } = useUser();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [showTour, setShowTour] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && onboardingCompleted && !isDemo) {
      // Load user preferences from localStorage
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        const prefs = JSON.parse(storedPrefs);
        setPreferences(prefs);
        
        // Check if this is the first time visiting after onboarding
        const hasWelcomed = localStorage.getItem('hasWelcomed');
        if (!hasWelcomed && prefs.textToSpeech && !hasSpoken) {
          // Inline the speech functionality to avoid dependency issues
          if ('speechSynthesis' in window && prefs.textToSpeech) {
            const name = user?.firstName || 'there';
            let message = `Hello ${name}, welcome to CareSight! I'm your personal health assistant, and I'm here to help you manage your healthcare journey.`;
            
            // Personalize based on medical conditions
            const conditions = [];
            if (prefs.hasBloodPressure) conditions.push('blood pressure monitoring');
            if (prefs.hasDiabetes) conditions.push('diabetes management');
            if (prefs.hasHeartCondition) conditions.push('heart health tracking');
            if (prefs.hasAsthma) conditions.push('respiratory health monitoring');
            
            if (conditions.length > 0) {
              message += ` I see you'd like help with ${conditions.join(', ')}. I'll make sure to highlight features that can help you with these areas.`;
            }
            
            if (prefs.caregiverEmails?.length > 0) {
              message += ` I've noted that you have caregivers who will receive important updates about your health.`;
            }
            
            message += ` Let me give you a quick tour of what I can do for you. You can always change your preferences in the settings if you need to adjust anything.`;
            
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Use a gentle, caring voice if available
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
              voice.name.includes('Microsoft Zira') || 
              voice.name.includes('Google US English') ||
              voice.lang.includes('en-US')
            );
            if (preferredVoice) {
              utterance.voice = preferredVoice;
            }
            
            speechSynthesis.speak(utterance);
            setHasSpoken(true);
          }
          setShowTour(true);
          localStorage.setItem('hasWelcomed', 'true');
        }
      }
    }
  }, [onboardingCompleted, isDemo, hasSpoken, user?.firstName]);
  const speakWelcomeMessage = (prefs: UserPreferences) => {
    if ('speechSynthesis' in window && prefs.textToSpeech) {
      const message = generateWelcomeMessage(prefs);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a gentle, caring voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Microsoft Zira') || 
        voice.name.includes('Google US English') ||
        voice.lang.includes('en-US')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
      setHasSpoken(true);
    }
  };
  const generateWelcomeMessage = (prefs: UserPreferences): string => {
    const name = user?.firstName || 'there';
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    let message = `Good ${timeOfDay}, ${name}! Welcome back to CareSight. I'm your personal health assistant, and I'm here to help you manage your healthcare journey.`;
    
    // Personalize based on medical conditions with more specific guidance
    const conditions = [];
    const conditionAdvice = [];
    
    if (prefs.hasBloodPressure) {
      conditions.push('blood pressure monitoring');
      conditionAdvice.push('Remember to check your blood pressure regularly and track any patterns');
    }
    if (prefs.hasDiabetes) {
      conditions.push('diabetes management');
      conditionAdvice.push('Keep monitoring your blood sugar levels and maintain your medication schedule');
    }
    if (prefs.hasHeartCondition) {
      conditions.push('heart health tracking');
      conditionAdvice.push('Stay mindful of your cardiovascular health and any symptoms');
    }
    if (prefs.hasAsthma) {
      conditions.push('respiratory health monitoring');
      conditionAdvice.push('Keep your rescue inhaler accessible and monitor air quality');
    }
    
    if (conditions.length > 0) {
      message += ` I see you're focusing on ${conditions.join(', ')}. `;
      if (conditionAdvice.length > 0) {
        message += conditionAdvice.join('. ') + '. ';
      }
      message += `I'll make sure to highlight features that can help you with these areas.`;
    }
    
    if (prefs.caregiverEmails?.length > 0) {
      message += ` I've noted that you have caregivers who will receive important updates about your health.`;
    }
    
    // Add age-specific advice
    if (prefs.age && (prefs.age.includes('65') || prefs.age.includes('75') || prefs.age.includes('85+'))) {
      message += ` I've also configured the interface to be more accessible for you with larger text and clearer navigation.`;
    }
    
    message += ` Feel free to ask me any health questions, upload documents for analysis, or take the guided tour to explore all features. I'm here to help make healthcare easier for you.`;
    
    return message;
  };

  const startPersonalizedTour = () => {
    setShowTour(true);
  };

  const dismissTour = () => {
    setShowTour(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  if (!preferences || isDemo) {
    return null;
  }

  return (
    <>
      {/* Personalized Health Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🎯</span>
                Your Personalized Health Focus
              </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Show relevant health areas based on user input */}
                {preferences.hasBloodPressure && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer border-l-4 border-red-500"
                    onClick={() => window.location.href = '/dashboard?focus=blood-pressure'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400">💓</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Blood Pressure</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Track and monitor your readings</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                          <span>📊</span>
                          <span>View Dashboard</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {preferences.hasDiabetes && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer border-l-4 border-blue-500"
                    onClick={() => window.location.href = '/dashboard?focus=diabetes'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400">🩺</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Diabetes Management</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Blood sugar tracking and insights</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                          <span>📈</span>
                          <span>View Trends</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {preferences.hasHeartCondition && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer border-l-4 border-red-600"
                    onClick={() => window.location.href = '/dashboard?focus=heart-health'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <span className="text-red-600 dark:text-red-400">❤️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Heart Health</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cardiovascular monitoring</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                          <span>💗</span>
                          <span>Monitor Health</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {preferences.hasAsthma && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm cursor-pointer border-l-4 border-green-500"
                    onClick={() => window.location.href = '/dashboard?focus=respiratory'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400">🫁</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">Respiratory Health</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Asthma and breathing support</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                          <span>🌬️</span>
                          <span>Breathing Tips</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* If no conditions selected, show general wellness */}
                {!preferences.hasBloodPressure && !preferences.hasDiabetes && !preferences.hasHeartCondition && !preferences.hasAsthma && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm col-span-full cursor-pointer border-l-4 border-purple-500"
                    onClick={() => window.location.href = '/onboarding'}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400">✨</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">General Wellness</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Overall health tracking and preventive care</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                          <span>⚙️</span>
                          <span>Customize Health Focus</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Quick settings reminder */}
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>💡</span>
                <span>You can always update your health focus areas in</span>
                <button 
                  onClick={() => window.location.href = '/onboarding'}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Settings
                </button>
              </div>
            </div>
            
            {/* Tour button */}
            <button
              onClick={startPersonalizedTour}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🚀</span>
              Tour
            </button>
          </div>
        </div>
      </motion.div>

      {/* Personalized Tour Modal */}
      {showTour && (
        <PersonalizedTourModal 
          preferences={preferences} 
          onDismiss={dismissTour}
          userName={user?.firstName || 'User'}
        />
      )}
    </>
  );
}

// Tour Modal Component
function PersonalizedTourModal({ 
  preferences, 
  onDismiss, 
  userName 
}: { 
  preferences: UserPreferences; 
  onDismiss: () => void;
  userName: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);  const tourSteps = [
    {
      title: `Welcome to CareSight, ${userName}! 🎉`,
      content: "I'm here to help you manage your health journey with AI-powered assistance. Let me show you the features that are most relevant to your specific health needs and goals.",
      icon: "👋"
    },
    {
      title: "Your Personalized Dashboard 📊",
      content: "This dashboard is customized for your health conditions. You'll see relevant metrics, reminders, and tools based on what you told us during setup. Everything here is designed to help you stay on top of your health.",
      icon: "📊"
    },
    {
      title: "AI Medical Assistant 🤖",
      content: "Ask me anything about health topics! I can explain medical terms, describe conditions, and help you understand what to expect. I'm trained specifically for healthcare education and use simple, clear language.",
      icon: "🤖"
    },
    {
      title: "Document Scanner & Analysis 📄",
      content: "Upload photos of prescriptions, lab results, or medical forms. I'll extract the text and explain everything in simple terms. This helps you understand your medical documents better.",
      icon: "📄"
    }
  ];
  // Detailed tour for users who want comprehensive overview (currently not used but available for future expansion)
  const detailedTourSteps = [
    ...tourSteps,
    {
      title: "Emergency & Care Coordination 🚨",
      content: "Set up emergency contacts and caregivers. They'll receive automatic notifications when needed. You can also send quick alerts if you need help or have concerns.",
      icon: "🚨"
    },
    {
      title: "Care Mode - Extra Accessibility ♿",
      content: "Switch to Care Mode for larger text, simpler navigation, and more patient interactions. Perfect for elderly users or anyone who needs extra support.",
      icon: "♿"
    },
    {
      title: "Voice Features & Text-to-Speech 🗣️",
      content: "I can read everything aloud to you. Use voice commands to navigate, and I'll speak responses in a clear, caring voice. Great for accessibility or when you can't look at the screen.",
      icon: "🗣️"
    }
  ];

  // Add condition-specific steps
  if (preferences.hasBloodPressure) {
    tourSteps.push({
      title: "Blood Pressure Tracking 💓",
      content: "Since you're monitoring blood pressure, I've highlighted tools to track your readings and get insights about your cardiovascular health.",
      icon: "💓"
    });
  }

  if (preferences.caregiverEmails?.length > 0) {
    tourSteps.push({
      title: "Caregiver Notifications 👥",
      content: "Your caregivers will receive important health updates. This helps keep your support network informed about your wellbeing.",
      icon: "👥"
    });
  }

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onDismiss();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{tourSteps[currentStep].icon}</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {tourSteps[currentStep].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {tourSteps[currentStep].content}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                      ? 'bg-blue-400' 
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-3 justify-center">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
          
          <button
            onClick={onDismiss}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Skip tour
          </button>
        </div>
      </motion.div>
    </div>
  );
}
