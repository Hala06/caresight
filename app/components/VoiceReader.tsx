'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VoiceReaderProps {
  text?: string;
  className?: string;
  autoRead?: boolean;
  children?: React.ReactNode;
}

interface UserPreferences {
  textToSpeech?: boolean;
  voiceSpeed?: number;
  [key: string]: unknown;
}

export default function VoiceReader({ text, className = '', autoRead = false, children }: VoiceReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window);
    
    // Load user preferences
    if (typeof window !== 'undefined') {
      const prefs = localStorage.getItem('userPreferences');
      if (prefs) {
        setUserPreferences(JSON.parse(prefs));
      }
    }  }, []);

  const extractTextFromChildren = useCallback((childNodes: React.ReactNode): string => {
    if (typeof childNodes === 'string') return childNodes;
    if (typeof childNodes === 'number') return childNodes.toString();
    if (Array.isArray(childNodes)) {
      return childNodes.map(child => extractTextFromChildren(child)).join(' ');
    }
    if (childNodes && typeof childNodes === 'object' && 'props' in childNodes) {
      return extractTextFromChildren((childNodes as React.ReactElement).props.children);
    }
    return '';
  }, []);

  const readText = useCallback(() => {
    if (!isSupported) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Stop any current reading
    window.speechSynthesis.cancel();

    if (isReading) {
      setIsReading(false);
      return;
    }

    const textToRead = text || (children ? extractTextFromChildren(children) : '');
    
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Configure voice settings for elderly/accessibility users
    utterance.rate = userPreferences?.voiceSpeed || 0.8; // Slower speed
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use a clear, friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Susan')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, isReading, text, children, userPreferences, extractTextFromChildren]);

  useEffect(() => {
    // Auto-read if enabled and user has text-to-speech preference
    if (autoRead && text && userPreferences?.textToSpeech && isSupported) {
      const timer = setTimeout(() => {
        readText();
      }, 1000); // Delay to avoid overlapping with page load
      
      return () => clearTimeout(timer);
    }
  }, [autoRead, text, userPreferences, isSupported, readText]);  // This function should be a useCallback to prevent infinite dependency loops

  if (!isSupported) return null;

  return (
    <div className={`relative group ${className}`}>
      {children}
      
      {/* Voice Reader Button */}
      <motion.button
        onClick={readText}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`
          absolute top-2 right-2 w-10 h-10 rounded-full
          bg-blue-500 hover:bg-blue-600 text-white
          flex items-center justify-center shadow-lg
          transition-all duration-200 z-10
          ${isReading ? 'bg-red-500 hover:bg-red-600' : ''}
          ${userPreferences?.textToSpeech ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
        title={isReading ? "Stop reading" : "Read aloud"}
        aria-label={isReading ? "Stop reading" : "Read aloud"}
      >
        {isReading ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🔇
          </motion.div>
        ) : (
          '🔊'
        )}
      </motion.button>
    </div>
  );
}

// Global voice reader hook for any component
export function useVoiceReader() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.8;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha')
    ) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stop, isSupported };
}
