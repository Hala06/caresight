import React, { useState } from "react";

export default function ScreenReader() {
  const [screenReaderActive, setScreenReaderActive] = useState(false);

  return (
    <>
      {/* Screen Reader */}
      <div className="bg-white p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Screen Reader</h2>
        <p className="mb-2">Reading screen content aloud</p>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full"
            onClick={() => setScreenReaderActive(true)}
          >
            Start
          </button>
          <button className="bg-yellow-400 px-4 py-2 rounded-full">
            Pause
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-full"
            onClick={() => setScreenReaderActive(false)}
          >
            Stop
          </button>
        </div>
      </div>
    </>
  );
}
