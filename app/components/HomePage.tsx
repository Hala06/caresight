'use client';

import React, { Suspense } from 'react';
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
import OnboardingProvider from './OnboardingProvider';
import Hero from './Hero';
import FeatureShowcase from './FeatureShowcase';
import HealthOverview from './HealthOverview';

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
      <main className="pt-20">        <ErrorBoundary fallback={<OnboardingError />}>
          <OnboardingProvider />
        </ErrorBoundary>

        <ErrorBoundary fallback={<HeroError />}>
          <Hero />
        </ErrorBoundary>{/* 3D Model Section - Temporarily Disabled */}
        <div className="py-12 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-blue-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Interactive Health Visualization
            </h2>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex items-center justify-center">
              <p className="text-gray-600 dark:text-gray-300">3D visualization temporarily disabled for stability</p>
            </div>
          </div>
        </div>        <ErrorBoundary fallback={<FeatureShowcaseError />}>
          <FeatureShowcase />
        </ErrorBoundary>

        <ErrorBoundary fallback={<HealthOverviewError />}>
          <HealthOverview />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
