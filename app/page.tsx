// app/page.tsx
'use client';
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ThreeScene from './components/ThreeScene'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <Navbar transparent={true} />

      {/* Hero Section */}
      <Hero />
      
      {/* 3D Heart Scene */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10"></div>
        <ThreeScene />
      </section>{/* Feature Showcase - Inline */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
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
          </div>

          {/* Medical Icons Background */}
          <div className="relative mb-16">
            <div className="absolute inset-0 flex justify-center items-center">
              <Image
                src="/medic.jpg"
                alt="Medical icons"
                width={800}
                height={200}
                className="opacity-10"
              />
            </div>
          </div>          {/* Features Grid */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            {[
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
            ].map((feature, index) => (
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
                  <Link href={
                    feature.title === 'Smart Document Reader' ? '/upload' :
                    feature.title === 'Medical Q&A Assistant' ? '/chat' :
                    feature.title === 'Care Coordination' ? '/dashboard' :
                    '/dashboard'
                  }>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${feature.color} text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all`}
                    >
                      Learn More
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Care Mode Highlight */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white text-center">
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
                <div
                  key={item.title}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-6"
                >
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who trust CareSight for accessible, compassionate healthcare support.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/getting-started"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all"
            >
              Get Started Free
            </Link>
            <Link 
              href="/demo"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CareSight</h3>
              <p className="text-gray-400">Compassionate AI for accessible healthcare</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Document Scanner</li>
                <li>Health Alerts</li>
                <li>Care Coordination</li>
                <li>Accessibility Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Care Mode Guide</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Privacy</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>HIPAA Compliance</li>
              </ul>
            </div>
          </div>
        </div>      </footer>
    </div>
  )
}