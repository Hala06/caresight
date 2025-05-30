// app/components/CareSettings.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CareSettings {
  textSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high';
  voiceSpeed: 'slow' | 'normal' | 'fast';
  buttonSize: 'normal' | 'large';
  animations: boolean;
  voiceGuidance: boolean;
  screenReader: boolean;
  simplifiedUI: boolean;
}

export default function CareSettings() {
  const [settings, setSettings] = useState<CareSettings>({
    textSize: 'normal',
    contrast: 'normal',
    voiceSpeed: 'slow',
    buttonSize: 'normal',
    animations: true,
    voiceGuidance: true,
    screenReader: false,
    simplifiedUI: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('careSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load care settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('careSettings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings: CareSettings) => {
    const root = document.documentElement;
    
    // Apply text size
    switch (newSettings.textSize) {
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'extra-large':
        root.style.fontSize = '22px';
        break;
      default:
        root.style.fontSize = '16px';
    }

    // Apply contrast
    if (newSettings.contrast === 'high') {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply care mode class for simplified UI
    if (newSettings.simplifiedUI) {
      document.body.classList.add('care-mode');
    } else {
      document.body.classList.remove('care-mode');
    }

    // Apply large buttons
    if (newSettings.buttonSize === 'large') {
      document.body.classList.add('large-buttons');
    } else {
      document.body.classList.remove('large-buttons');
    }

    // Reduce animations
    if (!newSettings.animations) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  };

  const updateSetting = <K extends keyof CareSettings>(
    key: K,
    value: CareSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: CareSettings = {
      textSize: 'normal',
      contrast: 'normal',
      voiceSpeed: 'slow',
      buttonSize: 'normal',
      animations: true,
      voiceGuidance: true,
      screenReader: false,
      simplifiedUI: false
    };
    setSettings(defaultSettings);
  };

  const announceChange = (message: string) => {
    if (settings.voiceGuidance && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = settings.voiceSpeed === 'slow' ? 0.7 : settings.voiceSpeed === 'fast' ? 1.3 : 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
      {/* Header */}      <div 
        className="p-6 border-b border-gray-200 dark:border-gray-600 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-purple-400 flex items-center gap-3">
            <span>♿</span>
            Care Mode Settings
            <span className="text-sm bg-blue-100 dark:bg-purple-900/30 text-blue-800 dark:text-purple-300 px-2 py-1 rounded-full">
              Accessibility
            </span>
          </h2>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl">⬇️</span>
          </motion.div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Customize your experience for better accessibility and comfort
        </p>
      </div>

      {/* Settings Panel */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-6 space-y-6">
          {/* Visual Settings */}          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span>👁️</span>
              Visual Settings
            </h3>

            {/* Text Size */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Text Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      updateSetting('textSize', size);
                      announceChange(`Text size changed to ${size}`);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.textSize === size
                        ? 'border-blue-500 bg-blue-50 dark:bg-purple-900/20 dark:border-purple-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } ${size === 'large' ? 'text-lg' : size === 'extra-large' ? 'text-xl' : 'text-base'}`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>            {/* Contrast */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Contrast Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['normal', 'high'] as const).map((contrast) => (
                  <button
                    key={contrast}
                    onClick={() => {
                      updateSetting('contrast', contrast);
                      announceChange(`Contrast mode changed to ${contrast}`);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.contrast === contrast
                        ? 'border-blue-500 bg-blue-50 dark:bg-purple-900/20 dark:border-purple-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } ${contrast === 'high' ? 'bg-black text-white border-white' : ''}`}
                  >
                    {contrast.charAt(0).toUpperCase() + contrast.slice(1)} Contrast
                  </button>
                ))}
              </div>
            </div>            {/* Button Size */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Button Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['normal', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      updateSetting('buttonSize', size);
                      announceChange(`Button size changed to ${size}`);
                    }}
                    className={`${size === 'large' ? 'p-4 text-lg' : 'p-3'} rounded-lg border-2 transition-all ${
                      settings.buttonSize === size
                        ? 'border-blue-500 bg-blue-50 dark:bg-purple-900/20 dark:border-purple-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)} Buttons
                  </button>
                ))}
              </div>
            </div>
          </div>          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span>🔊</span>
              Audio Settings
            </h3>

            {/* Voice Speed */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Voice Reading Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      updateSetting('voiceSpeed', speed);
                      announceChange(`Voice speed changed to ${speed}`);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.voiceSpeed === speed
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>          {/* Interaction Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span>⚙️</span>
              Interaction Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Toggle Settings */}
              {[
                { key: 'animations', label: 'Smooth Animations', icon: '✨', description: 'Enable page transitions and visual effects' },
                { key: 'voiceGuidance', label: 'Voice Guidance', icon: '🗣️', description: 'Spoken feedback for actions' },
                { key: 'screenReader', label: 'Screen Reader Mode', icon: '📢', description: 'Optimized for screen readers' },
                { key: 'simplifiedUI', label: 'Simplified Interface', icon: '🎯', description: 'Cleaner, easier navigation' }
              ].map((setting) => (
                <label 
                  key={setting.key}
                  className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={settings[setting.key as keyof CareSettings] as boolean}
                    onChange={(e) => {
                      updateSetting(setting.key as keyof CareSettings, e.target.checked as any);
                      announceChange(`${setting.label} ${e.target.checked ? 'enabled' : 'disabled'}`);
                    }}
                    className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{setting.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {setting.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                resetSettings();
                announceChange('Settings have been reset to defaults');
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              Reset to Default
            </button>
            <button
              onClick={() => {
                announceChange('Your care settings have been saved successfully');
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <span>💾</span>
              Save Settings
            </button>
          </div>          {/* Current Settings Summary */}
          <div className="bg-blue-50 dark:bg-purple-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-purple-300 mb-3">
              📋 Current Settings Summary
            </h4>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="text-gray-700 dark:text-gray-200">
                <strong>Text:</strong> {settings.textSize.replace('-', ' ')}
              </div>
              <div className="text-gray-700 dark:text-gray-200">
                <strong>Contrast:</strong> {settings.contrast}
              </div>
              <div className="text-gray-700 dark:text-gray-200">
                <strong>Voice Speed:</strong> {settings.voiceSpeed}
              </div>
              <div className="text-gray-700 dark:text-gray-200">
                <strong>Buttons:</strong> {settings.buttonSize}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
