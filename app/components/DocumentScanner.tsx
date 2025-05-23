"use client";
// app/components/SmartDocumentScanner.tsx
import { useState } from "react";

export default function SmartDocumentScanner() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-1/3 h-96 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <input type="checkbox" className="accent-blue-600" />
        Smart Document Scanner
      </h2>

      <div className="border-2 border-dashed border-blue-400 rounded-md bg-blue-50 h-48 flex flex-col items-center justify-center text-center p-4">
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-8 border border-blue-400 rounded-sm bg-white" />
            <p className="font-semibold">Scan or Upload Documents</p>
            <p className="text-sm text-gray-600">
              Prescriptions, lab results, discharge summaries
            </p>
          </div>
        </label>
      </div>

      <div className="mt-4 flex justify-between space-x-4">
        <button className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          🖼️ Analyze Image
        </button>
        <button className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
          📄 Summarize
        </button>
      </div>
    </div>
  );
}
