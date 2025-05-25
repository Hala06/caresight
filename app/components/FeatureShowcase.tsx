// app/components/FeatureShowcase.tsx
'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: '📄',
    title: 'Smart Document Reader',
    description: 'Upload medical forms, prescriptions, or lab results. Our AI instantly extracts and simplifies complex medical language.',
    benefits: ['OCR text extraction', 'Medical term translation', 'Voice reading support'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: '🤖',
    title: 'Medical Q&A Assistant',
    description: 'Ask questions about your health conditions, medications, or treatment plans. Get clear, non-diagnostic explanations.',
    benefits: ['24/7 availability', 'Plain language responses', 'Educational content'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    icon: '👥',
    title: 'Care Coordination',
    description: 'Automatically notify family members or caregivers about important health updates, appointments, or concerns.',
    benefits: ['Email & SMS alerts', 'Emergency contacts', 'Progress sharing'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: '♿',
    title: 'Accessibility First',
    description: 'Designed for elderly, disabled, and neurodiverse users with adjustable text, voice controls, and Care Mode.',
    benefits: ['Large text options', 'Voice commands', 'High contrast mode'],
    color: 'from-green-500 to-green-600'
  }
];

export default function FeatureShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
            <br />
            <span className="text-gray-800">Built for Everyone</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CareSight combines cutting-edge AI with compassionate design to make healthcare 
            accessible and understandable for all users.
          </p>
        </motion.div>

        {/* Medical Icons Background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <Image
              src="/medic.jpg"
              alt="Medical icons"
              width={800}
              height={200}
              className="opacity-10"
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{feature.title}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Learn More Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${feature.color} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all`}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Care Mode Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            ✨ Introducing Care Mode
          </h3>
          <p className="text-xl mb-8 opacity-95 max-w-3xl mx-auto">
            A special interface designed for elderly users and those who need extra support. 
            Larger buttons, simpler navigation, and calmer interactions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Larger Text & Buttons', description: 'Easy to read and interact with' },
              { title: 'Simplified Navigation', description: 'Focus on essential features only' },
              { title: 'Gentle Voice Guidance', description: 'Slower, more patient speech' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6"
              >
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <Link
            href="/care-mode"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
          >
            <span>👵</span>
            Try Care Mode
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
