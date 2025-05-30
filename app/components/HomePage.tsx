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
        </ErrorBoundary>        <ErrorBoundary fallback={<HeroError />}>
          <Suspense fallback={<ComponentLoading />}>
            <Hero />
          </Suspense>
        </ErrorBoundary>

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
