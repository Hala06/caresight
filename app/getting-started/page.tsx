// app/getting-started/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Upload Your Document',
    description: 'Take a photo or upload a medical form, prescription, or lab result. Our OCR technology instantly extracts the text.',
    features: ['Supports PDF, JPG, PNG', 'Works with handwritten notes', 'Instant text extraction'],
    icon: '📄',
    color: 'from-blue-500 to-blue-600'
  },
  {
    number: '02',
    title: 'AI Simplification',
    description: 'Our AI reads the medical terminology and converts it into simple, easy-to-understand language.',
    features: ['Plain English explanations', 'Medical term definitions', 'Context-aware translation'],
    icon: '🤖',
    color: 'from-teal-500 to-teal-600'
  },
  {
    number: '03',
    title: 'Listen & Understand',
    description: 'Use text-to-speech to have your documents read aloud with adjustable speed and voice options.',
    features: ['Natural voice synthesis', 'Adjustable reading speed', 'Pause and replay controls'],
    icon: '🔊',
    color: 'from-purple-500 to-purple-600'
  },
  {
    number: '04',
    title: 'Ask Questions',
    description: 'Chat with our medical AI assistant to get clarifications about your health information.',
    features: ['24/7 availability', 'Non-diagnostic explanations', 'Educational responses'],
    icon: '💬',
    color: 'from-green-500 to-green-600'
  }
];

const careFeatures = [
  {
    title: 'Larger Text & Buttons',
    description: 'Everything is sized for easy reading and interaction',
    icon: '🔍'
  },
  {
    title: 'Simplified Interface',
    description: 'Clean, uncluttered design with only essential features',
    icon: '✨'
  },
  {
    title: 'Voice Guidance',
    description: 'Slower, patient speech with optional pauses',
    icon: '🗣️'
  },
  {
    title: 'High Contrast',
    description: 'Better visibility with enhanced color contrast',
    icon: '🎨'
  },
  {
    title: 'Emergency Access',
    description: 'Quick access to emergency contacts and information',
    icon: '🚨'
  },
  {
    title: 'Caregiver Alerts',
    description: 'Automatic notifications to family members',
    icon: '👥'
  }
];

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              CareSight
            </span>
          </Link>
          <Link 
            href="/"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Getting Started
              </span>
              <br />
              <span className="text-gray-800">with CareSight</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Learn how to use CareSight's powerful features to simplify your healthcare journey. 
              From document scanning to AI assistance, we'll guide you through every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              How CareSight Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to transform complex medical information into clear, understandable insights.
            </p>
          </motion.div>

          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Step {step.number}</div>
                      <h3 className="text-3xl font-bold text-gray-800">{step.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} relative`}>
                  <div className={`aspect-square bg-gradient-to-br ${step.color} rounded-3xl p-8 flex items-center justify-center`}>
                    <div className="text-8xl text-white opacity-20">{step.icon}</div>
                    <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="text-6xl font-bold opacity-30">{step.number}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Mode Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ✨ Care Mode Features
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Specially designed for elderly users and those who need extra support. 
              Care Mode provides a gentler, more accessible experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/care-mode"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
            >
              <span>👵</span>
              Try Care Mode
              <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Start CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Begin your journey with CareSight today. Upload your first document and experience 
              the power of AI-assisted healthcare.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <span>📄</span>
                Upload Document
                <span>→</span>
              </Link>
              
              <Link
                href="/demo"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-3"
              >
                <span>▶️</span>
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
