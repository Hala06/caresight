// app/records/page.tsx
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';
import VoiceAssistant from '../components/VoiceAssistant';
import Link from 'next/link';

interface HealthRecord {
  id: string;
  date: string;
  type: 'lab_result' | 'prescription' | 'visit_note' | 'vaccination';
  title: string;
  provider: string;
  summary: string;
  status: 'normal' | 'attention' | 'follow_up';
}

const mockRecords: HealthRecord[] = [
  {
    id: '1',
    date: '2024-12-15',
    type: 'lab_result',
    title: 'Complete Blood Count',
    provider: 'City Medical Lab',
    summary: 'All values within normal range. Hemoglobin: 14.2 g/dL, White blood cells: 6,800/μL',
    status: 'normal'
  },
  {
    id: '2',
    date: '2024-12-10',
    type: 'prescription',
    title: 'Metformin 500mg',
    provider: 'Dr. Sarah Johnson',
    summary: 'Take twice daily with meals for diabetes management. Refills: 5',
    status: 'normal'
  },
  {
    id: '3',
    date: '2024-12-08',
    type: 'visit_note',
    title: 'Cardiology Follow-up',
    provider: 'Dr. Michael Chen',
    summary: 'Blood pressure well controlled. Continue current medications. Schedule follow-up in 3 months.',
    status: 'follow_up'
  },
  {
    id: '4',
    date: '2024-11-22',
    type: 'vaccination',
    title: 'Annual Flu Shot',
    provider: 'City Health Clinic',
    summary: 'Influenza vaccine administered. No adverse reactions observed.',
    status: 'normal'
  },
  {
    id: '5',
    date: '2024-11-15',
    type: 'lab_result',
    title: 'Cholesterol Panel',
    provider: 'City Medical Lab',
    summary: 'Total cholesterol: 195 mg/dL. LDL slightly elevated at 135 mg/dL.',
    status: 'attention'
  }
];

export default function HealthRecords() {
  const { isSignedIn, user } = useUser();
  const [filter, setFilter] = useState<'all' | 'lab_result' | 'prescription' | 'visit_note' | 'vaccination'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'provider'>('date');

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  const getTypeIcon = (type: HealthRecord['type']) => {
    switch (type) {
      case 'lab_result': return '🧪';
      case 'prescription': return '💊';
      case 'visit_note': return '📋';
      case 'vaccination': return '💉';
    }
  };

  const getStatusColor = (status: HealthRecord['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'follow_up': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const filteredRecords = mockRecords
    .filter(record => filter === 'all' || record.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'provider') return a.provider.localeCompare(b.provider);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📋 Health Records
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your complete medical history in one place
            </p>
          </motion.div>

          {/* Filters and Sorting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Type
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Records</option>
                  <option value="lab_result">Lab Results</option>
                  <option value="prescription">Prescriptions</option>
                  <option value="visit_note">Visit Notes</option>
                  <option value="vaccination">Vaccinations</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="date">Date (Newest First)</option>
                  <option value="type">Type</option>
                  <option value="provider">Provider</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/upload"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-center"
                >
                  📤 Add Record
                </Link>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                  📊 Export All
                </button>
              </div>
            </div>
          </motion.div>

          {/* Records List */}
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                      {getTypeIcon(record.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {record.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {record.provider} • {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status === 'normal' && 'Normal'}
                    {record.status === 'attention' && 'Needs Attention'}
                    {record.status === 'follow_up' && 'Follow-up Required'}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {record.summary}
                </p>

                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
                    👁️ View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                    📋 Copy
                  </button>
                  <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all">
                    🤖 Ask AI
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRecords.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No records found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Upload your first medical document to get started.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              >
                📤 Upload Document
              </Link>
            </motion.div>
          )}        </div>
      </div>

      {/* Voice Assistant for reading records aloud */}
      <VoiceAssistant />
    </div>
  );
}
