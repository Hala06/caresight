// app/components/EmailReminder.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

interface ReminderTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  type: 'medication' | 'appointment' | 'health_check' | 'general';
  icon: string;
}

interface ScheduledReminder {
  id: string;
  templateId: string;
  recipientEmail: string;
  recipientName: string;
  scheduledTime: Date;
  status: 'scheduled' | 'sent' | 'failed';
  lastSent?: Date;
}

const reminderTemplates: ReminderTemplate[] = [
  {
    id: 'medication',
    name: 'Medication Reminder',
    subject: 'Time for your medication - CareSight',
    message: 'Hello {patient_name}, this is a friendly reminder to take your prescribed medication: {medication_name}. Remember to take it {dosage} as prescribed by your doctor.',
    type: 'medication',
    icon: '💊'
  },
  {
    id: 'appointment',
    name: 'Appointment Reminder',
    subject: 'Upcoming medical appointment - CareSight',
    message: 'Hello {patient_name}, you have an upcoming appointment with {doctor_name} on {appointment_date} at {appointment_time}. Location: {location}. Please arrive 15 minutes early.',
    type: 'appointment',
    icon: '📅'
  },
  {
    id: 'health_check',
    name: 'Health Check Reminder',
    subject: 'Time for your health check - CareSight',
    message: 'Hello {patient_name}, it\'s time for your regular health check. Please remember to monitor your {health_metric} and update your health records.',
    type: 'health_check',
    icon: '🩺'
  },
  {
    id: 'general',
    name: 'General Health Reminder',
    subject: 'Health reminder from CareSight',
    message: 'Hello {patient_name}, this is a gentle reminder from your CareSight assistant: {custom_message}',
    type: 'general',
    icon: '💙'
  }
];

export default function EmailReminder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReminderTemplate | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);

  // Load scheduled reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('scheduledReminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScheduledReminders(parsed.map((r: any) => ({
          ...r,
          scheduledTime: new Date(r.scheduledTime),
          lastSent: r.lastSent ? new Date(r.lastSent) : undefined
        })));
      } catch (error) {
        console.error('Failed to load scheduled reminders:', error);
      }
    }
  }, []);

  // Save scheduled reminders to localStorage
  useEffect(() => {
    localStorage.setItem('scheduledReminders', JSON.stringify(scheduledReminders));
  }, [scheduledReminders]);

  const sendEmailReminder = async (template: ReminderTemplate, immediate: boolean = false) => {
    if (!recipientEmail || !recipientName) {
      alert('Please fill in recipient details');
      return;
    }

    setIsSending(true);

    try {
      const templateParams = {
        to_name: recipientName,
        to_email: recipientEmail,
        patient_name: recipientName,
        subject: template.subject,
        message: template.message.replace('{patient_name}', recipientName)
          .replace('{custom_message}', customMessage)
          .replace('{medication_name}', 'Your prescribed medication')
          .replace('{dosage}', 'as prescribed')
          .replace('{doctor_name}', 'your healthcare provider')
          .replace('{appointment_date}', 'the scheduled date')
          .replace('{appointment_time}', 'the scheduled time')
          .replace('{location}', 'your healthcare facility')
          .replace('{health_metric}', 'vital signs'),
        from_name: 'CareSight AI Assistant',
        timestamp: new Date().toLocaleString()
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_demo',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_demo',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'demo_public_key'
      );

      if (immediate) {
        alert('✅ Email reminder sent successfully!');
      } else {
        // Schedule the reminder
        const newReminder: ScheduledReminder = {
          id: Date.now().toString(),
          templateId: template.id,
          recipientEmail,
          recipientName,
          scheduledTime: new Date(scheduleTime),
          status: 'scheduled'
        };

        setScheduledReminders(prev => [...prev, newReminder]);
        alert('✅ Email reminder scheduled successfully!');
      }

      // Reset form
      setRecipientEmail('');
      setRecipientName('');
      setCustomMessage('');
      setScheduleTime('');
      setSelectedTemplate(null);

    } catch (error) {
      console.error('Failed to send email:', error);
      alert('❌ Failed to send email reminder. Please check your configuration.');
    } finally {
      setIsSending(false);
    }
  };

  const deleteReminder = (id: string) => {
    setScheduledReminders(prev => prev.filter(r => r.id !== id));
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📧</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Email Reminder System
        </h2>
      </div>

      {/* Template Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Choose Reminder Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reminderTemplates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {template.subject}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Form */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-6"
        >
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Preview Message
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {selectedTemplate.message}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Patient or caregiver name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {selectedTemplate.id === 'general' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom message here..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Schedule Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => sendEmailReminder(selectedTemplate, true)}
              disabled={isSending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? '⏳ Sending...' : '📧 Send Now'}
            </button>
            {scheduleTime && (
              <button
                onClick={() => sendEmailReminder(selectedTemplate, false)}
                disabled={isSending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⏰ Schedule
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Scheduled Reminders */}
      {scheduledReminders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Scheduled Reminders ({scheduledReminders.length})
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {scheduledReminders.map((reminder) => {
              const template = reminderTemplates.find(t => t.id === reminder.templateId);
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{template?.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {template?.name} for {reminder.recipientName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(reminder.scheduledTime)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete reminder"
                  >
                    🗑️
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Configuration Notice */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
          <div className="text-sm">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              EmailJS Configuration Required
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1">
              To use email reminders, configure your EmailJS service ID, template ID, and public key in the environment variables.
              The current configuration uses demo values for testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
