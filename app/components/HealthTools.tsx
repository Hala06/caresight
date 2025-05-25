// app/components/HealthTools.tsx
'use client';
import { useState } from 'react';

const tools = [
  { id: 1, icon: '💊', name: 'Medication Tracker', action: () => alert('Open medication tracker') },
  { id: 2, icon: '📅', name: 'Appointment Scheduler', action: () => alert('Schedule appointment') },
  { id: 3, icon: '🤒', name: 'Symptom Checker', action: () => alert('Start symptom check') },
  { id: 4, icon: '📋', name: 'Health Journal', action: () => alert('Open journal') },
];

export default function HealthTools() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
          🧰 Health Tools
        </h2>
        <button
          onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {viewMode === 'grid' ? '☷ List' : '☰ Grid'}
        </button>
      </div>

      <div className={`gap-4 ${viewMode === 'grid' ? 'grid grid-cols-2' : 'space-y-4'}`}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={tool.action}
            className={`w-full ${
              viewMode === 'grid' ? 
              'aspect-square flex flex-col items-center justify-center' : 
              'flex items-center gap-4 px-4 py-3'
            } bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all`}
          >
            <span className="text-3xl">{tool.icon}</span>
            <span className="mt-2">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}