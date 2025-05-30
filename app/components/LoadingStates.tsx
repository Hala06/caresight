import React from 'react';

export const ComponentLoading = () => (
  <div className="animate-pulse bg-gray-100 rounded-lg h-32" />
);

export const FullScreenLoading = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
    <div className="animate-pulse bg-gray-100 rounded-lg h-32 w-full max-w-2xl mx-4" />
  </div>
);
