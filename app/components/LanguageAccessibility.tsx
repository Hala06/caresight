import React, { useState } from "react";
export default function LanguageAccessibility() {
  const [language, setLanguage] = useState("EN");

  return (
    <>
      {/* Language & Accessibility */}
      <div className="bg-white text-black p-4 rounded-2xl shadow-lg col-span-1">
        <h2 className="text-xl font-bold mb-2">Language & Accessibility</h2>
        <div className="flex space-x-2 mb-2">
          {["EN", "ES", "FR", "中文"].map((lang) => (
            <button
              key={lang}
              className={`px-3 py-2 rounded-full ${
                language === lang ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
        <input type="range" className="w-full" />
      </div>
    </>
  );
}
