'use client';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'health-check';
  title: string;
  description: string;
  scheduledTime: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  recipients: {
    patient: { email: string };
    caregivers: { name: string; email: string }[];
  };
  isActive: boolean;
}

export default function ReminderSystem() {  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      type: 'medication',
      title: 'Blood Pressure Medication',
      description: 'Take 1 tablet of Lisinopril (10mg)',
      scheduledTime: '08:00',
      frequency: 'daily',
      recipients: {
        patient: { email: 'patient@example.com' },
        caregivers: [
          { name: 'John Caregiver', email: 'john@example.com' }
        ]
      },
      isActive: true
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendReminder = async (reminder: Reminder) => {
    setIsSending(true);
    try {
      // Initialize EmailJS if not already done
      if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
      }

      // Send email to patient
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'demo_service',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'demo_template',
        {
          to_email: reminder.recipients.patient.email,
          patient_name: 'Patient',
          reminder_type: reminder.type,
          reminder_title: reminder.title,
          reminder_description: reminder.description,
          scheduled_time: reminder.scheduledTime,
        }
      );      // Send notifications to caregivers
      for (const caregiver of reminder.recipients.caregivers) {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'demo_service',
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'demo_template',
          {
            to_email: caregiver.email,
            caregiver_name: caregiver.name,
            patient_name: 'Patient',
            reminder_type: reminder.type,
            reminder_title: reminder.title,
            reminder_description: reminder.description,
            scheduled_time: reminder.scheduledTime,
          }
        );
      }

      alert('✅ Email reminders sent successfully!');
    } catch (error) {
      console.error('Failed to send reminders:', error);
      alert('❌ Failed to send some reminders. Using demo mode.');
    } finally {
      setIsSending(false);
    }
  };

  const reminderTypes = [
    { value: 'medication', icon: '💊', label: 'Medication' },
    { value: 'appointment', icon: '🏥', label: 'Appointment' },
    { value: 'health-check', icon: '🩺', label: 'Health Check' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <span>🔔</span>
        Health Reminders & Alerts
      </h2>

      {/* Active Reminders */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Active Reminders
        </h3>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {reminderTypes.find(t => t.value === reminder.type)?.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {reminder.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {reminder.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {reminder.scheduledTime}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {reminder.frequency}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Recipients: Patient + {reminder.recipients.caregivers.length} caregiver(s)
                </div>
                <button
                  onClick={() => sendReminder(reminder)}
                  disabled={isSending}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  {isSending ? '🔄 Sending...' : '📤 Send Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Send Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Quick Send Options
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🚨', label: 'Emergency Alert', type: 'emergency' },
            { icon: '💊', label: 'Medication Reminder', type: 'medication' },
            { icon: '🏥', label: 'Appointment Reminder', type: 'appointment' },
            { icon: '📋', label: 'Health Update', type: 'update' }
          ].map((option) => (
            <motion.button
              key={option.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendReminder(reminders[0])} // Demo with first reminder
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4 rounded-xl text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
          ⚙️ Reminder Settings
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
            <button className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
            <button className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">Caregiver Alerts</span>
            <button className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Reminder System Active
        </div>
      </div>
    </div>
  );
}
