// app/components/VoiceAssistant.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCommand {
  command: string;
  description: string;
  action: () => void;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Voice commands for elderly users
  const voiceCommands: VoiceCommand[] = [
    {
      command: 'read document',
      description: 'Navigate to document scanner',
      action: () => window.location.href = '/upload'
    },
    {
      command: 'ask question',
      description: 'Open AI chat assistant',
      action: () => window.location.href = '/chat'
    },
    {
      command: 'emergency help',
      description: 'Go to emergency contacts',
      action: () => window.location.href = '/care-mode'
    },
    {
      command: 'dashboard',
      description: 'Return to main dashboard',
      action: () => window.location.href = '/dashboard'
    },
    {
      command: 'stop listening',
      description: 'Deactivate voice assistant',
      action: () => deactivateVoiceAssistant()
    },
    {
      command: 'help',
      description: 'List available voice commands',
      action: () => speakCommands()
    }
  ];

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      initializeSpeechRecognition();
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
          setConfidence(confidence);
          processCommand(transcriptPart.toLowerCase().trim());
        } else {
          interimTranscript += transcriptPart;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isActivated) {
        // Restart listening if still activated
        setTimeout(() => {
          if (isActivated) {
            recognition.start();
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
  };

  const processCommand = (command: string) => {
    setLastCommand(command);
    
    // Find matching voice command
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      cmd.command.split(' ').every(word => command.includes(word))
    );

    if (matchedCommand) {
      speak(`Executing: ${matchedCommand.description}`);
      setTimeout(() => {
        matchedCommand.action();
      }, 1000);
    } else {
      speak(`Sorry, I didn't understand "${command}". Say "help" to hear available commands.`);
    }
  };

  const speak = (text: string, rate: number = 0.8) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Use a more gentle voice for elderly users
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || voice.name.includes('Karen') || voice.name.includes('Samantha')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const activateVoiceAssistant = () => {
    if (!isSupported) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }
    
    setIsActivated(true);
    speak('Voice assistant activated. I\'m listening for your commands.');
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const deactivateVoiceAssistant = () => {
    setIsActivated(false);
    setIsListening(false);
    setTranscript('');
    setLastCommand(null);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    speak('Voice assistant deactivated. Thank you!');
  };

  const speakCommands = () => {
    const commandList = voiceCommands
      .filter(cmd => cmd.command !== 'help' && cmd.command !== 'stop listening')
      .map(cmd => `Say "${cmd.command}" to ${cmd.description}`)
      .join('. ');
    
    speak(`Available voice commands: ${commandList}. Say "stop listening" when you're done.`);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <span>⚠️</span>
          <span className="font-medium">Voice Assistant Unavailable</span>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari for voice features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-3">
        <span>🎤</span>
        Voice Assistant
        <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
          Elderly-Friendly
        </span>
      </h2>

      {/* Activation Button */}
      <div className="text-center mb-6">
        {!isActivated ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={activateVoiceAssistant}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-2xl mr-2">🎤</span>
            Activate Voice Assistant
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={deactivateVoiceAssistant}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-2xl mr-2">⏹️</span>
            Stop Voice Assistant
          </motion.button>
        )}
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6"
          >
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
              isListening 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
            }`}>
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-3 h-3 rounded-full ${
                  isListening ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              <span className="font-medium">
                {isListening ? 'Listening...' : 'Ready to listen'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4"
        >
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">You said:</h4>
          <p className="text-gray-700 dark:text-gray-300 italic">"{transcript}"</p>
          {confidence > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Confidence: {Math.round(confidence * 100)}%
            </div>
          )}
        </motion.div>
      )}

      {/* Last Command */}
      {lastCommand && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4"
        >
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Last Command:</h4>
          <p className="text-blue-700 dark:text-blue-300">"{lastCommand}"</p>
        </motion.div>
      )}

      {/* Voice Commands Reference */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
          🗣️ Available Voice Commands
        </h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {voiceCommands.map((command, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-purple-500 mt-0.5">•</span>
              <div>
                <span className="font-medium">"{command.command}"</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {command.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>💡 Tip:</strong> Speak clearly and naturally. Say "help" anytime to hear all commands again.
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Privacy-first - Voice processing stays on your device
        </div>
      </div>
    </div>
  );
}
