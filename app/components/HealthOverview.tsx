// app/components/HealthOverview.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const vitalSigns = [
  { 
    id: 1, 
    name: 'Heart Rate', 
    value: '72', 
    unit: 'bpm', 
    status: 'normal', 
    trend: 'stable',
    icon: '💓',
    lastUpdated: '2 min ago',
    range: 'Normal: 60-100 bpm'
  },
  { 
    id: 2, 
    name: 'Blood Pressure', 
    value: '118/76', 
    unit: 'mmHg', 
    status: 'excellent', 
    trend: 'improving',
    icon: '🩺',
    lastUpdated: '5 min ago',
    range: 'Excellent: <120/80'
  },
  { 
    id: 3, 
    name: 'Blood Oxygen', 
    value: '99', 
    unit: '%', 
    status: 'excellent', 
    trend: 'stable',
    icon: '🫁',
    lastUpdated: '1 min ago',
    range: 'Excellent: 95-100%'
  },
  { 
    id: 4, 
    name: 'Blood Sugar', 
    value: '95', 
    unit: 'mg/dL', 
    status: 'normal', 
    trend: 'stable',
    icon: '🩸',
    lastUpdated: '1 hour ago',
    range: 'Normal: 70-140 mg/dL'
  },
  { 
    id: 5, 
    name: 'Sleep Quality', 
    value: '8.2', 
    unit: '/10', 
    status: 'excellent', 
    trend: 'improving',
    icon: '😴',
    lastUpdated: 'Last night',
    range: 'Great: 7.5-10'
  },
  { 
    id: 6, 
    name: 'Activity Level', 
    value: '8,547', 
    unit: 'steps', 
    status: 'active', 
    trend: 'increasing',
    icon: '🚶‍♀️',
    lastUpdated: 'Today',
    range: 'Goal: 8,000 steps'
  },
];

const healthInsights = [
  {
    type: 'positive',
    icon: '🎉',
    title: 'Great Progress!',
    message: 'Your blood pressure has improved by 5% this week. Keep up the excellent work!'
  },
  {
    type: 'tip',
    icon: '💡',
    title: 'Health Tip',
    message: 'Consider taking a 10-minute walk after meals to help regulate blood sugar levels.'
  },
  {
    type: 'reminder',
    icon: '⏰',
    title: 'Reminder',
    message: 'Don\'t forget your evening medication at 8:00 PM.'
  }
];

export default function HealthOverview() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-400 to-emerald-500';
      case 'normal': return 'from-blue-400 to-cyan-500';
      case 'active': return 'from-purple-400 to-violet-500';
      case 'elevated': return 'from-yellow-400 to-orange-500';
      case 'warning': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🌟';
      case 'normal': return '✅';
      case 'active': return '🔥';
      case 'elevated': return '⚠️';
      case 'warning': return '🚨';
      default: return '📊';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➖';
      case 'increasing': return '⬆️';
      case 'decreasing': return '⬇️';
      default: return '📊';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 Your Health Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real-time health monitoring with AI-powered insights and personalized recommendations
          </p>
        </motion.div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {vitalSigns.map((vital, index) => (
            <motion.div
              key={vital.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => setSelectedMetric(selectedMetric === vital.id ? null : vital.id)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(vital.status)} rounded-full flex items-center justify-center text-white text-xl`}>
                      {vital.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{vital.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{vital.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{getTrendIcon(vital.trend)}</span>
                      <span className="text-xs">{getStatusIcon(vital.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">{vital.value}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{vital.unit}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{vital.range}</p>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(vital.status)}`}>
                  {vital.status.charAt(0).toUpperCase() + vital.status.slice(1)}
                </div>

                {selectedMetric === vital.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="h-20 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                      <svg viewBox="0 0 200 60" className="w-full h-full">
                        <polyline
                          points="0,45 25,35 50,40 75,25 100,30 125,20 150,25 175,15 200,20"
                          fill="none"
                          stroke={vital.status === 'excellent' ? '#10B981' : vital.status === 'normal' ? '#3B82F6' : '#F59E0B'}
                          strokeWidth="2"
                          className="drop-shadow-sm"
                        />
                        <circle cx="200" cy="20" r="3" fill={vital.status === 'excellent' ? '#10B981' : vital.status === 'normal' ? '#3B82F6' : '#F59E0B'} />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">7-day trend</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <span>🤖</span>
            AI Health Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`p-4 rounded-xl border-l-4 ${
                  insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                  insight.type === 'tip' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                  'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{insight.icon}</span>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{insight.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{insight.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}