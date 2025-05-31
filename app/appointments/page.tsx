// app/appointments/page.tsx
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Navbar from '../components/Navbar';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  type: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-12-20',
    time: '2:30 PM',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    type: 'Follow-up Visit',
    location: 'Heart Care Center, Room 205',
    status: 'confirmed',
    notes: 'Bring recent blood pressure readings'
  },
  {
    id: '2',
    date: '2024-12-21',
    time: '10:00 AM',
    doctor: 'Dr. Michael Chen',
    specialty: 'Primary Care',
    type: 'Annual Physical',
    location: 'Main Medical Building, Room 102',
    status: 'confirmed'
  },
  {
    id: '3',
    date: '2024-12-23',
    time: '3:00 PM',
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Endocrinologist',
    type: 'Diabetes Management',
    location: 'Diabetes Center, Room 310',
    status: 'pending',
    notes: 'Fasting required - no food 12 hours before'
  },
  {
    id: '4',
    date: '2024-12-15',
    time: '11:30 AM',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedist',
    type: 'Knee Consultation',
    location: 'Orthopedic Clinic, Room 150',
    status: 'completed'
  },
  {
    id: '5',
    date: '2025-01-05',
    time: '9:00 AM',
    doctor: 'Dr. Lisa Park',
    specialty: 'Ophthalmologist',
    type: 'Eye Exam',
    location: 'Vision Center, Room 45',
    status: 'confirmed'
  }
];

export default function Appointments() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    // Handle Clerk authentication safely for build time
  let isSignedIn = false;
  
  try {
    const clerkData = useUser();
    isSignedIn = clerkData.isSignedIn ?? false;
    
    if (!isSignedIn) {
      redirect('/sign-in');
    }
  } catch {
    // Clerk is not available during build, continue without authentication
    console.log('Clerk not available, skipping authentication');
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiologist': return '❤️';
      case 'primary care': return '👨‍⚕️';
      case 'endocrinologist': return '🧬';
      case 'orthopedist': return '🦴';
      case 'ophthalmologist': return '👁️';
      default: return '🏥';
    }
  };

  const now = new Date();
  const filteredAppointments = mockAppointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    
    if (filter === 'upcoming') {
      return appointmentDate > now && appointment.status !== 'completed' && appointment.status !== 'cancelled';
    } else if (filter === 'past') {
      return appointmentDate < now || appointment.status === 'completed';
    }
    return true;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return filter === 'past' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
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
              📅 Appointments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your healthcare appointments
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockAppointments.filter(a => {
                      const appointmentDate = new Date(`${a.date} ${a.time}`);
                      return appointmentDate > now && a.status !== 'cancelled';
                    }).length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Upcoming</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockAppointments.filter(a => a.status === 'pending').length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockAppointments.filter(a => a.status === 'completed').length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">Completed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Filter Tabs */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                {(['upcoming', 'all', 'past'] as const).map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      filter === filterOption
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  📞 Schedule New
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                  🔔 Set Reminders
                </button>
              </div>
            </div>
          </motion.div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-3xl">
                      {getSpecialtyIcon(appointment.specialty)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {appointment.doctor}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
                        {appointment.specialty} • {appointment.type}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        📅 {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        📍 {appointment.location}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mt-2">
                          💡 {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {appointment.status === 'confirmed' ? (
                      <>
                        <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
                          🔔 Remind Me
                        </button>
                        <button className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all">
                          📝 Reschedule
                        </button>
                        <button className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-all">
                          ❌ Cancel
                        </button>
                      </>
                    ) : appointment.status === 'completed' ? (
                      <>
                        <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all">
                          📋 View Summary
                        </button>
                        <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all">
                          🔄 Book Follow-up
                        </button>
                      </>
                    ) : (
                      <button className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-all">
                        ✅ Confirm
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No {filter} appointments
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {filter === 'upcoming' 
                  ? 'You have no upcoming appointments scheduled.'
                  : filter === 'past'
                  ? 'No past appointments to display.'
                  : 'No appointments found.'
                }
              </p>
              <button className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                📞 Schedule Appointment
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
