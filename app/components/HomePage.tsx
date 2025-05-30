'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ComponentLoading, FullScreenLoading } from './LoadingStates';
import { ErrorBoundary } from './ErrorBoundary';
import {
  OnboardingError,
  HeroError,
  FeatureShowcaseError,
  HealthOverviewError,
} from './ErrorStates';
import Navbar from './Navbar';
import Footer from './Footer';

const OnboardingProvider = dynamic(() => import('./OnboardingProvider'), { ssr: false });
const Hero = dynamic(() => import('./Hero'), { ssr: false });
const FeatureShowcase = dynamic(() => import('./FeatureShowcase'), { ssr: false });
const HealthOverview = dynamic(() => import('./HealthOverview'), { ssr: false });
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-20">
        <ErrorBoundary fallback={<OnboardingError />}>
          <Suspense fallback={<ComponentLoading />}>
            <OnboardingProvider />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<HeroError />}>
          <Suspense fallback={<ComponentLoading />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>

        {/* Quick Access to All Features */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                🚀 Your Complete Healthcare Arsenal
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Access all CareSight features instantly - AI Chat, Demo, 3D Models, and more!
              </p>
            </motion.div>            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "🤖 AI Health Assistant",
                  description: "Chat with our advanced AI for medical Q&A, symptom analysis, and health advice",
                  href: "/chat",
                  gradient: "from-blue-500 to-purple-600",
                  features: ["Real-time responses", "Medical knowledge base", "24/7 availability"]
                },
                {
                  title: "🎮 Interactive Demo",
                  description: "Try all features with sample data - perfect for exploring CareSight's capabilities",
                  href: "/demo",
                  gradient: "from-green-500 to-teal-600",
                  features: ["Live preview", "Sample data", "No signup required"]
                },
                {
                  title: "🏥 Care Mode",
                  description: "Dedicated interface for caregivers and family members to monitor loved ones",
                  href: "/care-mode",
                  gradient: "from-pink-500 to-rose-600",
                  features: ["Family alerts", "Emergency contacts", "Health monitoring"]
                },
                {
                  title: "📊 Dashboard",
                  description: "Complete health overview with analytics, trends, and personalized insights",
                  href: "/dashboard",
                  gradient: "from-indigo-500 to-blue-600",
                  features: ["Health metrics", "Progress tracking", "Custom reports"]
                },
                {
                  title: "📄 Document Scanner",
                  description: "Upload and analyze medical documents with AI-powered OCR and insights",
                  href: "/upload",
                  gradient: "from-orange-500 to-red-600",
                  features: ["OCR scanning", "AI analysis", "Secure storage"]
                },
                {
                  title: "📱 Health Records",
                  description: "Comprehensive digital health records with easy sharing and backup",
                  href: "/records",
                  gradient: "from-cyan-500 to-blue-600",
                  features: ["Digital records", "Easy sharing", "HIPAA compliant"]
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Link href={feature.href}>
                    <div className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-white/90 mb-4 text-sm leading-relaxed">{feature.description}</p>
                      <ul className="space-y-1 mb-4">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="text-white/80 text-xs flex items-center">
                            <span className="w-1.5 h-1.5 bg-white/60 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-white/80 text-sm group-hover:text-white transition-colors">
                        <span>Explore →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"            >
              {[
                { number: "100+", label: "AI Health Topics" },
                { number: "24/7", label: "Available Support" },
                { number: "99.9%", label: "Uptime Guarantee" },
                { number: "HIPAA", label: "Compliant & Secure" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
                >
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3D Model Section */}
        <ErrorBoundary fallback={<div className="text-center p-8">3D model temporarily unavailable</div>}>
          <Suspense fallback={<ComponentLoading />}>
            <div className="py-12 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-blue-900">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                  Interactive 3D Health Visualization
                </h2>
                <div className="h-96 rounded-lg overflow-hidden shadow-lg">
                  <ThreeScene />
                </div>
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<FeatureShowcaseError />}>
          <Suspense fallback={<ComponentLoading />}>
            <FeatureShowcase />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<HealthOverviewError />}>
          <Suspense fallback={<ComponentLoading />}>
            <HealthOverview />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
