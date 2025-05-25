'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import DocumentScanner from '../components/DocumentScanner';
import VoiceAssistant from '../components/VoiceAssistant';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Document Scanner & AI Analysis
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your medical documents, prescriptions, or lab results. Our advanced OCR technology and AI will extract, analyze, and simplify the information for you.
            </p>
          </div>

          {/* Enhanced Document Scanner Component */}
          <DocumentScanner />

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              { 
                icon: '🏥', 
                title: 'Medical Forms', 
                desc: 'Appointment forms, intake questionnaires, referral letters',
                features: ['Smart field extraction', 'Date recognition', 'Auto-categorization']
              },
              { 
                icon: '💊', 
                title: 'Prescriptions', 
                desc: 'Medication instructions, dosages, and pharmacy information',
                features: ['Medication detection', 'Dosage extraction', 'Drug interaction alerts']
              },
              { 
                icon: '📊', 
                title: 'Lab Results', 
                desc: 'Blood tests, imaging reports, diagnostic summaries',
                features: ['Value extraction', 'Normal range comparison', 'Trend analysis']
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{item.icon}</div>
                <h3 className="font-semibold mb-2 text-center text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 text-center mb-4">{item.desc}</p>
                <div className="space-y-1">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-500">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Advanced OCR & AI Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🔍', title: 'High Accuracy OCR', desc: 'Tesseract.js powered text recognition' },
                { icon: '🧠', title: 'Smart Classification', desc: 'AI-powered document type detection' },
                { icon: '📋', title: 'Data Extraction', desc: 'Automatic extraction of key medical information' },
                { icon: '🗣️', title: 'Text-to-Speech', desc: 'Audio readback for accessibility' },
                { icon: '📱', title: 'Mobile Friendly', desc: 'Works on all devices and screen sizes' },
                { icon: '🔒', title: 'Privacy First', desc: 'Local processing, your data stays secure' },
                { icon: '⚡', title: 'Real-time Processing', desc: 'Fast OCR with progress tracking' },
                { icon: '📤', title: 'Easy Export', desc: 'Copy text and summaries instantly' }
              ].map((feature, index) => (
                <div key={feature.title} className="text-center">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/chat"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>💬</span>
              Ask AI Questions
            </Link>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>📊</span>
              View Dashboard
            </Link>
            <Link
              href="/records"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>📋</span>
              Health Records
            </Link>          </motion.div>
        </motion.div>
      </div>

      {/* Voice Assistant for accessibility */}
      <VoiceAssistant />
    </div>
  );
}
