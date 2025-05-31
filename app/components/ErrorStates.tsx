import React from 'react';

export const OnboardingError = () => (
  <div className="p-4 rounded-lg bg-red-50 text-red-600">
    <h3 className="font-semibold mb-2">Unable to load onboarding settings</h3>
    <p className="text-sm">Please refresh the page or try again later.</p>
  </div>
);

export const HeroError = () => (
  <div className="p-4 rounded-lg bg-red-50 text-red-600">
    <h3 className="font-semibold mb-2">Unable to load welcome section</h3>
    <p className="text-sm">The main content is temporarily unavailable.</p>
  </div>
);

export const FeatureShowcaseError = () => (
  <div className="p-4 rounded-lg bg-red-50 text-red-600">
    <h3 className="font-semibold mb-2">Features section unavailable</h3>
    <p className="text-sm">We&apos;re having trouble loading the features showcase.</p>
  </div>
);

export const HealthOverviewError = () => (
  <div className="p-4 rounded-lg bg-red-50 text-red-600">
    <h3 className="font-semibold mb-2">Health overview unavailable</h3>
    <p className="text-sm">Unable to load health monitoring data.</p>
  </div>
);
