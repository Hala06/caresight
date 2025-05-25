// app/components/HealthAlerts.tsx
'use client';
import { useState, useEffect } from 'react';

export default function HealthAlerts() {
  const [alerts] = useState([
    {
      id: 1,
      type: 'medication',
      time: '8:00 AM',
      name: 'Metformin 500mg',
      status: 'pending'
    },
    {
      id: 2,
      type: 'appointment',
      date: 'Tomorrow 2:00 PM',
      doctor: 'Dr. Emily Johnson',
      location: 'City Cardiology Clinic'
    }
  ]);

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">
        ⏰ Health Alerts
      </h2>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 
              border-yellow-500 animate-pulse"
          >
            {alert.type === 'medication' ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💊</span>
                  <div>
                    <p className="font-semibold">{alert.name}</p>
                    <p className="text-sm opacity-75">Due at {alert.time}</p>
                  </div>
                </div>
                <button className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline">
                  Mark as Taken
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold">{alert.doctor}</p>
                    <p className="text-sm opacity-75">{alert.date}</p>
                    <p className="text-sm">{alert.location}</p>
                  </div>
                </div>
                <button className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline">
                  Add to Calendar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}