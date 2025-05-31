// app/components/ScreenReader.tsx
'use client';
import { useState } from 'react';

export default function ScreenReader() {
  const [isReading, setIsReading] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [text, setText] = useState('');

  const startReading = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
    setSpeech(utterance);
    setIsReading(true);
  };

  const pauseReading = () => {
    speechSynthesis.pause();
    setIsReading(false);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
        📢 Screen Reader
      </h2>

      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to read aloud..."
          className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg h-32"
        />

        <div className="flex gap-2">
          <button
            onClick={isReading ? pauseReading : startReading}
            className={`flex-1 py-3 rounded-lg ${
              isReading 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white transition-all`}
          >
            {isReading ? '⏸ Pause' : '▶️ Start Reading'}
          </button>
          <button
            onClick={stopReading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all"
          >
            ⏹ Stop
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <label className="block mb-2">Reading Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            defaultValue="1"
            onChange={(e) => {
              if (speech) speech.rate = parseFloat(e.target.value);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}