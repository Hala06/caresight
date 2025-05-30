'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import PersonalizedWelcome from '../components/PersonalizedWelcome';
import BackgroundAnimations from '../components/BackgroundAnimations';

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

export default function TestFeatures() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    textToSpeech: false,
    age: '25-34',
    medicalConditions: [],
    emergencyContacts: [],
    caregiverEmails: [],
    accessibilityNeeds: [],
    hasBloodPressure: false,
    hasDiabetes: false,
    hasHeartCondition: false,
    hasAsthma: false,
  });

  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  useEffect(() => {
    // Load existing preferences if any
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userPreferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.removeItem('hasWelcomed'); // Reset to trigger welcome again
    addTestResult('✅ Preferences saved successfully');
  };

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testAIChat = async () => {
    setCurrentTest('Testing AI Chat...');
    const questions = [
      'What is hypertension?',
      'What does positive nodes mean?',
      'What are the symptoms of diabetes?'
    ];

    try {
      for (const question of questions) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question })
        });

        if (response.ok) {
          const data = await response.json();
          addTestResult(`✅ AI Chat: "${question}" - Got response (${data.response.length} chars)`);
        } else {
          addTestResult(`❌ AI Chat: "${question}" - Failed with status ${response.status}`);
        }
      }
    } catch (error) {
      addTestResult(`❌ AI Chat Error: ${error}`);
    }
    setCurrentTest('');
  };

  const testTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const message = 'Hello! This is a test of CareSight text-to-speech functionality.';
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onend = () => addTestResult('✅ Text-to-Speech test completed');
      utterance.onerror = (error) => addTestResult(`❌ TTS Error: ${error.error}`);

      speechSynthesis.speak(utterance);
      addTestResult('🔊 Text-to-Speech test started');
    } else {
      addTestResult('❌ Text-to-Speech not supported in this browser');
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      
      // Update boolean flags based on medical conditions
      if (key === 'medicalConditions') {
        updated.hasBloodPressure = value.includes('Blood Pressure');
        updated.hasDiabetes = value.includes('Diabetes');
        updated.hasHeartCondition = value.includes('Heart Condition');
        updated.hasAsthma = value.includes('Asthma');
      }
      
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      <BackgroundAnimations />
      <Navbar />
      
      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧪 CareSight Feature Testing Lab
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Test and validate all enhanced features in a controlled environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🔧 User Preferences Configuration
              </h2>
              
              {/* Text-to-Speech Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.textToSpeech}
                    onChange={(e) => updatePreference('textToSpeech', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-gray-900 dark:text-white font-medium">
                    Enable Text-to-Speech
                  </span>
                </label>
              </div>

              {/* Age Selection */}
              <div className="mb-6">
                <label className="block text-gray-900 dark:text-white font-medium mb-2">
                  Age Range
                </label>
                <select
                  value={preferences.age}
                  onChange={(e) => updatePreference('age', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              {/* Medical Conditions */}
              <div className="mb-6">
                <label className="block text-gray-900 dark:text-white font-medium mb-2">
                  Medical Conditions
                </label>
                <div className="space-y-2">
                  {['Blood Pressure', 'Diabetes', 'Heart Condition', 'Asthma'].map(condition => (
                    <label key={condition} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={preferences.medicalConditions.includes(condition)}
                        onChange={(e) => {
                          const conditions = e.target.checked
                            ? [...preferences.medicalConditions, condition]
                            : preferences.medicalConditions.filter(c => c !== condition);
                          updatePreference('medicalConditions', conditions);
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={savePreferences}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                💾 Save Preferences & Trigger Welcome
              </button>
            </motion.div>

            {/* Testing Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🚀 Feature Tests
              </h2>

              <div className="space-y-4 mb-6">
                <button
                  onClick={testAIChat}
                  disabled={!!currentTest}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  🤖 Test AI Chat API
                </button>
                
                <button
                  onClick={testTextToSpeech}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  🔊 Test Text-to-Speech
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300"
                >
                  🔄 Reload to Test PersonalizedWelcome
                </button>
              </div>

              {/* Test Results */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Test Results</h3>
                  <button
                    onClick={clearResults}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear
                  </button>
                </div>
                
                {currentTest && (
                  <div className="text-blue-600 dark:text-blue-400 mb-2 animate-pulse">
                    {currentTest}
                  </div>
                )}
                
                <div className="space-y-1 text-sm font-mono">
                  {testResults.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No test results yet. Run some tests!
                    </div>
                  ) : (
                    testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          result.includes('✅') 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : result.includes('❌')
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        }`}
                      >
                        {result}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* PersonalizedWelcome Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <PersonalizedWelcome 
              isDemo={false} 
              onboardingCompleted={true} 
            />
          </motion.div>

          {/* Current Preferences Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📊 Current Configuration
            </h3>
            <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(preferences, null, 2)}
            </pre>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
