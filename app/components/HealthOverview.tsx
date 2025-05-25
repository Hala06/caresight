// app/components/HealthOverview.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const vitalSigns = [
  { id: 1, name: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
  { id: 2, name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal' },
  { id: 3, name: 'Blood Oxygen', value: '98', unit: '%', status: 'good' },
  { id: 4, name: 'Glucose', value: '110', unit: 'mg/dL', status: 'elevated' },
];

export default function HealthOverview() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
        📊 Health Overview
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {vitalSigns.map((vital) => (
          <motion.div
            key={vital.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              vital.status === 'normal' ? 'bg-green-100 dark:bg-green-900' :
              vital.status === 'good' ? 'bg-blue-100 dark:bg-blue-900' :
              'bg-yellow-100 dark:bg-yellow-900'
            }`}
          >
            <div className="text-sm opacity-75">{vital.name}</div>
            <div className="text-2xl font-bold">
              {vital.value}
              <span className="text-sm ml-1">{vital.unit}</span>
            </div>
            <div className="text-sm mt-1">
              {vital.status === 'normal' && '✅ Normal'}
              {vital.status === 'good' && '👍 Good'}
              {vital.status === 'elevated' && '⚠️ Elevated'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold mb-2">📈 Weekly Trend</h3>
        <div className="h-32 bg-white dark:bg-gray-800 rounded-md p-2">
          <svg viewBox="0 0 300 100" className="w-full h-full">
            <polyline
              points="0,80 50,60 100,70 150,40 200,50 250,30 300,60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}