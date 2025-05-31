// app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

interface OnboardingData {
  medicalHistory: string[];
  reasonForSignup: string;
  primaryHealthConcerns: string[];
  emergencyContacts: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  }[];
  caregiverEmails: string[];
  age: string;
  accessibilityNeeds: string[];
}

export default function OnboardingPage() {
  // Handle Clerk authentication safely for build time
  let isSignedIn = false;
  let user = null;
  
  try {
    const clerkData = useUser();
    isSignedIn = clerkData.isSignedIn ?? false;
    user = clerkData.user;
    
    if (!isSignedIn) {
      redirect('/sign-in');
    }  } catch (error) {
    console.log('Clerk not available, skipping authentication:', error);
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    medicalHistory: [],
    reasonForSignup: '',
    primaryHealthConcerns: [],
    emergencyContacts: [{ name: '', relationship: '', email: '', phone: '' }],
    caregiverEmails: [],
    age: '',
    accessibilityNeeds: []
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleSubmit = async () => {
    try {
      // Create comprehensive user preferences object
      const userPreferences = {
        // Basic info
        age: onboardingData.age,
        reasonForSignup: onboardingData.reasonForSignup,
        
        // Medical conditions (for personalization)
        medicalConditions: onboardingData.medicalHistory,
        hasBloodPressure: onboardingData.medicalHistory.includes('Hypertension'),
        hasDiabetes: onboardingData.medicalHistory.includes('Diabetes'),
        hasHeartCondition: onboardingData.medicalHistory.includes('Heart Disease'),
        hasAsthma: onboardingData.medicalHistory.includes('Asthma'),
        hasArthritis: onboardingData.medicalHistory.includes('Arthritis'),
        
        // Contacts and support
        emergencyContacts: onboardingData.emergencyContacts,
        caregiverEmails: onboardingData.caregiverEmails,
        
        // Accessibility preferences
        accessibilityNeeds: onboardingData.accessibilityNeeds,
        textToSpeech: onboardingData.accessibilityNeeds.includes('Text-to-speech'),
        largeText: onboardingData.accessibilityNeeds.includes('Large text'),
        highContrast: onboardingData.accessibilityNeeds.includes('High contrast'),
        screenReader: onboardingData.accessibilityNeeds.includes('Screen reader'),
        voiceNavigation: onboardingData.accessibilityNeeds.includes('Voice navigation'),
        
        // Setup completion
        onboardingCompletedAt: new Date().toISOString(),
        setupVersion: '1.0'
      };
      
      // Save comprehensive data to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      localStorage.setItem('onboardingCompleted', 'true');
      
      // Clear any demo flags
      localStorage.removeItem('isDemo');
      
      // Send welcome email (mock API call)
      await sendWelcomeEmail();
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  const sendWelcomeEmail = async () => {
    try {
      const response = await fetch('/api/welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user?.emailAddresses[0]?.emailAddress,
          userName: user?.firstName || 'User',
          caregiverEmails: onboardingData.caregiverEmails.filter(email => email.trim() !== ''),
          onboardingData: onboardingData
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('Welcome emails sent successfully');
      } else {
        console.error('Failed to send welcome emails:', result.error);
      }
    } catch (error) {
      console.error('Error sending welcome emails:', error);
    }
  };

  const addEmergencyContact = () => {
    setOnboardingData({
      ...onboardingData,
      emergencyContacts: [...onboardingData.emergencyContacts, { name: '', relationship: '', email: '', phone: '' }]
    });
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const updatedContacts = [...onboardingData.emergencyContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setOnboardingData({ ...onboardingData, emergencyContacts: updatedContacts });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to CareSight! 👋
              </h2>              <p className="text-xl text-gray-600 dark:text-gray-300">
                Let&apos;s get to know you better to provide personalized care
              </p>
            </div>

            <div className="space-y-4">
              <div>                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What&apos;s your age range?
                </label>
                <select
                  value={onboardingData.age}
                  onChange={(e) => setOnboardingData({ ...onboardingData, age: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select age range</option>
                  <option value="under-18">Under 18</option>
                  <option value="18-30">18-30</option>
                  <option value="31-50">31-50</option>
                  <option value="51-65">51-65</option>
                  <option value="over-65">Over 65</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What brought you to CareSight?
                </label>
                <textarea
                  value={onboardingData.reasonForSignup}
                  onChange={(e) => setOnboardingData({ ...onboardingData, reasonForSignup: e.target.value })}
                  placeholder="Tell us why you&apos;re interested in using CareSight..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white h-32"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Medical History 🏥
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Help us understand your health background
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Do you have any chronic conditions? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis', 'Other'].map((condition) => (
                    <label key={condition} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingData.medicalHistory.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingData({
                              ...onboardingData,
                              medicalHistory: [...onboardingData.medicalHistory, condition]
                            });
                          } else {
                            setOnboardingData({
                              ...onboardingData,
                              medicalHistory: onboardingData.medicalHistory.filter(h => h !== condition)
                            });
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary health concerns you&apos;d like help with:
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Understanding medical documents',
                    'Medication management',
                    'Appointment scheduling',
                    'Health monitoring',
                    'Care coordination',
                    'Emergency preparedness'
                  ].map((concern) => (
                    <label key={concern} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingData.primaryHealthConcerns.includes(concern)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingData({
                              ...onboardingData,
                              primaryHealthConcerns: [...onboardingData.primaryHealthConcerns, concern]
                            });
                          } else {
                            setOnboardingData({
                              ...onboardingData,
                              primaryHealthConcerns: onboardingData.primaryHealthConcerns.filter(c => c !== concern)
                            });
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Emergency Contacts 🚨
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Who should we contact in case of emergency?
              </p>
            </div>

            <div className="space-y-6">
              {onboardingData.emergencyContacts.map((contact, index) => (
                <div key={index} className="p-6 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Emergency Contact {index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Relationship (e.g., Spouse, Child)"
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contact.email}
                      onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addEmergencyContact}
                className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                + Add Another Emergency Contact
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Caregiver Network 👥
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Who helps take care of you? We&apos;ll keep them informed (optional)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caregiver/Family Member Email Addresses
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  These people will receive updates about your health activities and reminders to check on you
                </p>
                
                {onboardingData.caregiverEmails.map((email, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="email"
                      placeholder="caregiver@email.com"
                      value={email}
                      onChange={(e) => {
                        const updatedEmails = [...onboardingData.caregiverEmails];
                        updatedEmails[index] = e.target.value;
                        setOnboardingData({ ...onboardingData, caregiverEmails: updatedEmails });
                      }}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        const updatedEmails = onboardingData.caregiverEmails.filter((_, i) => i !== index);
                        setOnboardingData({ ...onboardingData, caregiverEmails: updatedEmails });
                      }}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setOnboardingData({
                      ...onboardingData,
                      caregiverEmails: [...onboardingData.caregiverEmails, '']
                    });
                  }}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all"
                >
                  + Add Caregiver Email
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Accessibility Preferences ♿
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                How can we make CareSight work better for you?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select any accessibility features you need:
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Large text',
                    'High contrast mode',
                    'Voice commands',
                    'Screen reader support',
                    'Simplified interface (Care Mode)',
                    'Slower animations',
                    'Audio descriptions'
                  ].map((feature) => (
                    <label key={feature} className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onboardingData.accessibilityNeeds.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOnboardingData({
                              ...onboardingData,
                              accessibilityNeeds: [...onboardingData.accessibilityNeeds, feature]
                            });
                          } else {
                            setOnboardingData({
                              ...onboardingData,
                              accessibilityNeeds: onboardingData.accessibilityNeeds.filter(f => f !== feature)
                            });
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="text-gray-900 dark:text-white">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Important Disclaimer */}
              <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Important: Demo Application Notice
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
                      CareSight is currently a demonstration application created for hackathon purposes. 
                      <strong> Please do not share sensitive medical information, real personal data, or actual health records.</strong> 
                      This app is for showcase and testing purposes only. Any data you enter should be fictional or non-sensitive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Step {currentStep} of {totalSteps}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {currentStep === totalSteps ? 'Complete Setup' : 'Next →'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
