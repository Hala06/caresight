'use client';

import React, { Suspense } from 'react';
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
import UserSetupPrompt from './UserSetupPrompt';
import VoiceReader from './VoiceReader';
import dynamic from 'next/dynamic';

// Dynamic import for ThreeScene to avoid SSR issues
const ThreeScene = dynamic(() => import('./ThreeScene'), { 
  ssr: false,
  loading: () => <ComponentLoading />
});

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
      {/* User Setup Prompt for new users */}
      <UserSetupPrompt />
      
      {/* Navigation with Voice Reader */}
      <VoiceReader>
        <Navbar />
      </VoiceReader>
      
      {/* Main Content */}
      <main className="pt-20">        <ErrorBoundary fallback={<OnboardingError />}>
          <OnboardingProvider />
        </ErrorBoundary>

        <VoiceReader autoRead>
          <ErrorBoundary fallback={<HeroError />}>
            <Hero />
          </ErrorBoundary>
        </VoiceReader>        {/* 3D Interactive Health Model */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-blue-900">
          <div className="container mx-auto px-6">
            <VoiceReader>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Interactive Health Visualization
                </h2>              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Explore your health data through our interactive 3D model. Click on different organs to learn more about your health metrics.
                </p>
              </div>
            </VoiceReader>
            
            <div className="h-96 rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 relative">
              <ErrorBoundary 
                fallback={
                  <div className="w-full h-full flex items-center justify-center">                    <div className="text-center p-6">
                      <div className="text-6xl mb-4">🏥</div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        3D Visualization Unavailable
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Interactive health model couldn&apos;t load
                      </p>
                    </div>
                  </div>
                }
              >
                <Suspense fallback={<ComponentLoading />}>
                  <ThreeScene />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </section><VoiceReader>
          <ErrorBoundary fallback={<FeatureShowcaseError />}>
            <FeatureShowcase />
          </ErrorBoundary>
        </VoiceReader>

        <VoiceReader>
          <ErrorBoundary fallback={<HealthOverviewError />}>
            <HealthOverview />
          </ErrorBoundary>
        </VoiceReader>
      </main>

      {/* Footer with Voice Reader */}
      <VoiceReader>
        <Footer />
      </VoiceReader>
    </div>
  );
}
