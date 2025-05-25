// app/care-mode/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import VoiceAssistant from '../components/VoiceAssistant';

const quickActions = [
  {
    title: 'Read My Document',
    description: 'Upload and listen to medical forms',
    icon: '📄',
    color: 'from-blue-500 to-blue-600',
    href: '/upload'
  },
  {
    title: 'Ask Health Questions',
    description: 'Chat with our medical assistant',
    icon: '💬',
    color: 'from-teal-500 to-teal-600',
    href: '/chat'
  },
  {
    title: 'Call Emergency',
    description: 'Quick access to emergency contacts',
    icon: '🚨',
    color: 'from-red-500 to-red-600',
    href: '/emergency'
  },
  {
    title: 'Family Alerts',
    description: 'Send updates to your caregiver',
    icon: '👥',
    color: 'from-purple-500 to-purple-600',
    href: '/family'
  }
];

const helpTopics = [
  { title: 'How to upload a document', icon: '📤' },
  { title: 'Understanding my test results', icon: '📊' },
  { title: 'Managing my medications', icon: '💊' },
  { title: 'Contacting my doctor', icon: '👨‍⚕️' },
  { title: 'Emergency procedures', icon: '🆘' },
  { title: 'Family notification settings', icon: '👪' }
];

export default function CareMode() {
  const [textSize, setTextSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className={`min-h-screen ${
      highContrast 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-teal-50'
    } ${
      textSize === 'large' ? 'text-xl' : textSize === 'extra-large' ? 'text-2xl' : 'text-lg'
    }`}>
      {/* Navigation - Simplified */}
      <nav className={`${
        highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white shadow-sm border-gray-200'
      } border-b`}>
        <div className="container mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              CareSight Care Mode
            </span>
          </Link>
          
          {/* Accessibility Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setTextSize(textSize === 'normal' ? 'large' : textSize === 'large' ? 'extra-large' : 'normal')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                highContrast 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              🔍 Text Size
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                highContrast 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              🎨 High Contrast
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="py-16">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-6xl font-bold mb-8 ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}>
              Welcome to Care Mode
            </h1>
            <p className={`text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              highContrast ? 'text-gray-300' : 'text-gray-600'
            }`}>
              A simpler, clearer way to manage your health. Large buttons, easy navigation, 
              and gentle guidance designed especially for you.
            </p>
            
            <div className="text-8xl mb-8">👩‍⚕️</div>
            
            <p className={`text-xl ${
              highContrast ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Everything you need is just one click away
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions - Large Buttons */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`text-4xl font-bold text-center mb-12 ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}
          >
            What would you like to do?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={action.href}
                  className={`block p-8 rounded-3xl border-4 transition-all hover:scale-105 ${
                    highContrast 
                      ? 'bg-gray-800 border-white hover:bg-gray-700' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-2xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-6">{action.icon}</div>
                    <h3 className={`text-3xl font-bold mb-4 ${
                      highContrast ? 'text-white' : 'text-gray-800'
                    }`}>
                      {action.title}
                    </h3>
                    <p className={`text-xl ${
                      highContrast ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className={`py-16 ${
        highContrast ? 'bg-gray-900' : 'bg-blue-50'
      }`}>
        <div className="container mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-bold mb-6 ${
              highContrast ? 'text-white' : 'text-gray-800'
            }`}>
              Need Help?
            </h2>
            <p className={`text-xl ${
              highContrast ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Common questions and helpful guides
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {helpTopics.map((topic, index) => (
              <motion.button
                key={topic.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  highContrast 
                    ? 'bg-gray-800 border-gray-600 hover:border-white text-white' 
                    : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="text-4xl mb-4">{topic.icon}</div>
                <div className={`text-lg font-medium ${
                  highContrast ? 'text-white' : 'text-gray-800'
                }`}>
                  {topic.title}
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/help"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-12 py-6 rounded-2xl text-2xl font-semibold hover:shadow-xl transition-all"
            >
              <span>📞</span>
              Call for Help
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className={`py-16 ${
        highContrast ? 'bg-red-900' : 'bg-red-50'
      }`}>
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-8xl mb-6">🚨</div>
            <h2 className={`text-4xl font-bold mb-6 ${
              highContrast ? 'text-white' : 'text-red-800'
            }`}>
              Emergency Help
            </h2>
            <p className={`text-xl mb-8 ${
              highContrast ? 'text-red-200' : 'text-red-700'
            }`}>
              Quick access to emergency contacts and medical information
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="tel:911"
                className="bg-red-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-red-700 transition-all"
              >
                🚑 Call 911
              </Link>
              <Link
                href="/emergency-contacts"
                className={`px-12 py-6 rounded-2xl text-2xl font-bold transition-all ${
                  highContrast 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white'
                }`}
              >
                👥 Family Contacts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className={`py-12 ${
        highContrast ? 'bg-black border-gray-700' : 'bg-gray-900'
      } text-white border-t`}>
        <div className="container mx-auto px-8 text-center">
          <div className="text-3xl font-bold mb-4">CareSight Care Mode</div>
          <p className="text-xl opacity-80 mb-8">
            Compassionate healthcare technology designed for everyone
          </p>
          
          <div className="flex justify-center gap-8">
            <Link href="/help" className="text-xl hover:text-blue-400 transition-colors">
              📞 Help Center
            </Link>
            <Link href="/settings" className="text-xl hover:text-blue-400 transition-colors">
              ⚙️ Settings
            </Link>
            <Link href="/" className="text-xl hover:text-blue-400 transition-colors">
              🏠 Home
            </Link>
          </div>        </div>
      </footer>

      {/* Voice Assistant - Essential for care mode */}
      <VoiceAssistant />
    </div>
  );
}
