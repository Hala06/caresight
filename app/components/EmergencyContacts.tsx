'use client';
import { useState } from 'react';
import emailjs from 'emailjs-com';

export default function EmergencyContacts() {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<Date | null>(null);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  
  const contacts = [
    { 
      name: "Dr. Sarah Smith", 
      role: "Primary Care", 
      phone: "555-0100",
      email: "doctor@caresight.demo"
    },
    { 
      name: "Emergency Services", 
      role: "24/7 Emergency", 
      phone: "911",
      email: null // Emergency services don't get emails
    },
    { 
      name: "Family (John Doe)", 
      role: "Next of Kin", 
      phone: "555-0200",
      email: "family@caresight.demo"
    }
  ];

  const sendAlert = async (contact: any, alertType: string = 'general') => {
    if (!contact.email) return; // Skip emergency services
    
    try {
      const templateParams = {
        to_name: contact.name,
        to_email: contact.email,
        patient_name: 'John Doe',
        alert_type: alertType,
        message: alertType === 'emergency' 
          ? 'URGENT: Emergency alert triggered for patient. Please check immediately.'
          : 'Medical update: Patient has uploaded new documents or needs attention.',
        timestamp: new Date().toLocaleString(),
        from_name: 'CareSight AI Assistant'
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_demo',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_demo',
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID || 'demo_user_id'
      );
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleAlert = async (alertType: string = 'general') => {
    setIsSending(true);
    
    const selectedContactObjs = contacts.filter(contact => 
      selectedContacts.includes(contact.name)
    );
    
    try {
      const promises = selectedContactObjs.map(contact => 
        sendAlert(contact, alertType)
      );
      
      await Promise.all(promises);
      
      // Simulate SMS for demo (in real app, use Twilio)
      console.log('SMS alerts sent to:', selectedContactObjs.map(c => c.phone));
      
      alert(`✅ Alerts sent successfully to ${selectedContacts.length} contact(s)!`);
      setAlertHistory(prev => [
        ...prev, 
        { 
          id: prev.length + 1, 
          type: alertType, 
          contacts: selectedContacts, 
          timestamp: new Date() 
        }
      ]);
      setSelectedContacts([]);
    } catch (error) {
      alert('❌ Failed to send some alerts. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-red-50 dark:bg-red-900 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
        🚨 Emergency Contacts
      </h2>

      <ul className="space-y-3 mb-6">
        {contacts.map((contact, index) => (
          <li 
            key={index}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
          >
            <div>
              <p className="font-semibold">{contact.name}</p>
              <p className="text-sm opacity-75">{contact.role}</p>
            </div>
              <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.name)}
                onChange={(e) => {
                  const name = contact.name;
                  setSelectedContacts(prev => 
                    e.target.checked 
                      ? [...prev, name] 
                      : prev.filter(n => n !== name)
                  );
                }}
                className="w-5 h-5 text-red-600"
              />
              <a 
                href={`tel:${contact.phone}`}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                {contact.phone}
              </a>
            </div>
          </li>
        ))}
      </ul>      <div className="space-y-3">
        <button
          onClick={() => handleAlert('emergency')}
          disabled={selectedContacts.length === 0 || isSending}
          className="w-full bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending Emergency Alert...
            </>
          ) : (
            <>
              🚨 Send Emergency Alert
              <span className="text-sm opacity-75">({selectedContacts.length} selected)</span>
            </>
          )}
        </button>
        
        <button
          onClick={() => handleAlert('general')}
          disabled={selectedContacts.length === 0 || isSending}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            flex items-center justify-center gap-2"
        >
          📤 Send Update Notification
          <span className="text-sm opacity-75">({selectedContacts.length} selected)</span>
        </button>
      </div>
    </div>
  );
}