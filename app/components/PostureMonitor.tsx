import React, { useState } from "react";
export default function PostureMonitor() {
  const [postureAlert, setPostureAlert] = useState(true);
  return (
    <>
      {/* Posture Monitor */}
      <div className="bg-blue-700 text-white p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Posture Monitor</h2>
        {postureAlert && (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500 rounded-full mr-4" />
            <div>
              <p className="font-bold">Posture Alert</p>
              <p>Poor posture detected</p>
              <p className="text-sm">Screen time: 45 mins</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
