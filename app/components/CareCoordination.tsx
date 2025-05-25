// app/components/CareCoordination.tsx
'use client';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function CareCoordination() {
  const [isSending, setIsSending] = useState(false);
  
  const handleShare = async () => {
    setIsSending(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          patient_name: "John Doe",
          summary: "Latest medical report summary...",
          to_email: "caregiver@example.com"
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      alert('Medical summary shared successfully!');
    } catch (error) {
      alert('Sharing failed. Please try again.');
    }
    setIsSending(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        🏥 Care Team Coordination
      </h2>
      
      <div className="space-y-4">
        <button 
          onClick={handleShare}
          disabled={isSending}
          className="w-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 
            p-4 rounded-xl flex items-center justify-center gap-2 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            '🔄 Sending...'
          ) : (
            <>
              📤 Send to Caregiver
              <span className="text-sm opacity-75">(Email/SMS)</span>
            </>
          )}
        </button>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Upcoming Appointments</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Cardiology Checkup</span>
              <button className="text-blue-600 dark:text-blue-400 hover:underline">
                Remind Me
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}