'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timesDue: string[];
  lastTaken?: Date;
  isOverdue: boolean;
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  range: { min: number; max: number };
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export default function HealthMonitoring() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timesDue: ['08:00'],
      isOverdue: false
    },
    {
      id: '2', 
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timesDue: ['08:00', '20:00'],
      isOverdue: true
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Blood Pressure',
      value: 125,
      unit: 'mmHg',
      range: { min: 90, max: 120 },
      timestamp: new Date(),
      status: 'warning'
    },
    {
      id: '2',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      range: { min: 60, max: 100 },
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: '3',
      name: 'Blood Sugar',
      value: 110,
      unit: 'mg/dL',
      range: { min: 70, max: 100 },
      timestamp: new Date(),
      status: 'warning'
    }
  ]);

  const [showReminders, setShowReminders] = useState(true);

  const markMedicationTaken = (medId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medId 
        ? { ...med, lastTaken: new Date(), isOverdue: false }
        : med
    ));
    
    // Speak confirmation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Medication marked as taken. Great job staying on track with your health!");
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const overdueMeds = medications.filter(med => med.isOverdue);

  return (
    <div className="space-y-6">
      {/* Medication Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-2xl border border-blue-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span>💊</span>
            Medication Reminders
          </h3>
          {overdueMeds.length > 0 && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {overdueMeds.length} overdue
            </span>
          )}
        </div>

        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                med.isOverdue 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{med.name}</h4>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-gray-500">
                    Due: {med.timesDue.join(', ')}
                    {med.lastTaken && (
                      <span className="ml-2">
                        (Last taken: {med.lastTaken.toLocaleTimeString()})
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => markMedicationTaken(med.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    med.isOverdue
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {med.isOverdue ? '⚠️ Take Now' : '✅ Mark Taken'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Health Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>📊</span>
          Health Metrics
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {healthMetrics.map((metric) => (
            <div
              key={metric.id}
              className={`p-4 rounded-xl border ${getMetricStatusColor(metric.status)}`}
            >
              <h4 className="font-semibold mb-2">{metric.name}</h4>
              <div className="text-2xl font-bold mb-1">
                {metric.value} <span className="text-sm font-normal">{metric.unit}</span>
              </div>
              <div className="text-xs opacity-75">
                Normal: {metric.range.min}-{metric.range.max} {metric.unit}
              </div>
              <div className="text-xs opacity-60 mt-1">
                {metric.timestamp.toLocaleTimeString()}
              </div>
              {metric.status !== 'normal' && (
                <div className="mt-2 text-xs font-medium">
                  {metric.status === 'warning' ? '⚠️ Monitor closely' : '🚨 Contact doctor'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Regular monitoring helps you and your healthcare team make better decisions about your care.
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <button className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h4 className="font-semibold text-purple-800">Schedule Checkup</h4>
              <p className="text-sm text-purple-600">Book your next appointment</p>
            </div>
          </div>
        </button>

        <button className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <h4 className="font-semibold text-teal-800">Connect Device</h4>
              <p className="text-sm text-teal-600">Sync health monitoring devices</p>
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
