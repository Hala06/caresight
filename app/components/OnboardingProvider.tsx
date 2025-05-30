'use client';
import React, { useEffect, useState } from 'react';
import PersonalizedWelcome from './PersonalizedWelcome';

export default function OnboardingProvider() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted') === 'true';
    setOnboardingCompleted(completed);
  }, []);

  return <PersonalizedWelcome isDemo={false} onboardingCompleted={onboardingCompleted} />;
}
