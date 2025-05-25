// app/components/LanguageAccessibility.tsx
'use client';
import { useState } from 'react';

export default function LanguageAccessibility() {
  const [language, setLanguage] = useState('en');
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    textSize: 'medium',
    screenReader: false,
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
        🌍 Language & Accessibility
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold mb-2">Select Language</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg flex items-center gap-2 justify-center ${
                  language === lang.code 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Accessibility Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => setAccessibility(prev => ({
                  ...prev,
                  highContrast: e.target.checked
                }))}
                className="w-5 h-5"
              />
              High Contrast Mode
            </label>

            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <label className="block mb-2">Text Size</label>
              <div className="flex gap-2">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => setAccessibility(prev => ({
                      ...prev,
                      textSize: size
                    }))}
                    className={`px-4 py-2 rounded ${
                      accessibility.textSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <input
                type="checkbox"
                checked={accessibility.screenReader}
                onChange={(e) => setAccessibility(prev => ({
                  ...prev,
                  screenReader: e.target.checked
                }))}
                className="w-5 h-5"
              />
              Screen Reader Mode
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}