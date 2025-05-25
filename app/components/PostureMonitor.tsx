// app/components/PostureMonitor.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PostureMonitor() {
  const [postureStatus, setPostureStatus] = useState<'good' | 'fair' | 'poor'>('good');
  const [screenTime, setScreenTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime(prev => prev + 1);
      setPostureStatus(
        Math.random() > 0.8 ? 'poor' :
        Math.random() > 0.6 ? 'fair' : 'good'
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">
        🪑 Posture Monitor
      </h2>

      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            scale: postureStatus === 'poor' ? 1.1 : 1,
            color: postureStatus === 'good' ? '#10B981' :
                   postureStatus === 'fair' ? '#F59E0B' : '#EF4444'
          }}
          className="text-6xl"
        >
          {postureStatus === 'good' ? '😊' :
           postureStatus === 'fair' ? '😐' : '😣'}
        </motion.div>

        <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Screen Time:</span>
            <span>{Math.floor(screenTime / 60)}h {screenTime % 60}m</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full ${
                postureStatus === 'good' ? 'bg-green-500' :
                postureStatus === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
              } rounded-full transition-all`}
              style={{ width: `${Math.min(screenTime * 2, 100)}%` }}
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all">
          🧘 Start Posture Exercise
        </button>
      </div>
    </div>
  );
}