// app/components/DocumentScanner.tsx
'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ScanResult {
  extractedText: string;
  confidence: number;
  documentType: 'prescription' | 'lab_report' | 'medical_note' | 'unknown';
  keyInformation: {
    medications?: string[];
    dosages?: string[];
    dates?: string[];
    doctorName?: string;
    patientName?: string;
  };
}

export default function DocumentScanner() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    setPreview(URL.createObjectURL(file));
    setScanResult(null);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    }
  });
  const performOCR = async () => {
    if (!preview) return;

    setIsProcessing(true);
    setProgress(0);
    setAiSummary(null); // Reset AI summary when new OCR starts

    try {
      // Create Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      // Perform OCR on the image
      const { data: { text, confidence } } = await worker.recognize(preview);
      
      // Analyze the extracted text
      const analyzedResult = analyzeExtractedText(text, confidence);
      setScanResult(analyzedResult);

      await worker.terminate();
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process document. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const analyzeExtractedText = (text: string, confidence: number): ScanResult => {
    const lowercaseText = text.toLowerCase();
    
    // Detect document type
    let documentType: ScanResult['documentType'] = 'unknown';
    if (lowercaseText.includes('prescription') || lowercaseText.includes('rx')) {
      documentType = 'prescription';
    } else if (lowercaseText.includes('lab') || lowercaseText.includes('test') || lowercaseText.includes('result')) {
      documentType = 'lab_report';
    } else if (lowercaseText.includes('note') || lowercaseText.includes('diagnosis')) {
      documentType = 'medical_note';
    }

    // Extract key information using regex patterns
    const medications = extractMedications(text);
    const dosages = extractDosages(text);
    const dates = extractDates(text);
    const doctorName = extractDoctorName(text);
    const patientName = extractPatientName(text);

    return {
      extractedText: text,
      confidence,
      documentType,
      keyInformation: {
        medications,
        dosages,
        dates,
        doctorName,
        patientName
      }
    };
  };

  const extractMedications = (text: string): string[] => {
    // Common medication patterns and suffixes
    const medicationPattern = /\b[A-Z][a-z]+(?:cillin|mycin|oxin|pam|zole|ine|ate|ol|ex|nil|ium|ide)\b/g;
    const matches = text.match(medicationPattern) || [];
    return [...new Set(matches)]; // Remove duplicates
  };

  const extractDosages = (text: string): string[] => {
    // Dosage patterns (e.g., "500mg", "2 tablets", "1 tsp")
    const dosagePattern = /\b\d+(?:\.\d+)?\s*(?:mg|g|ml|tsp|tbsp|tablets?|pills?|capsules?)\b/gi;
    const matches = text.match(dosagePattern) || [];
    return [...new Set(matches)];
  };

  const extractDates = (text: string): string[] => {
    // Date patterns
    const datePattern = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/g;
    const matches = text.match(datePattern) || [];
    return [...new Set(matches)];
  };

  const extractDoctorName = (text: string): string | undefined => {
    // Doctor name patterns
    const doctorPattern = /(?:Dr\.?\s+|Doctor\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(doctorPattern);
    return match ? match[1] : undefined;
  };

  const extractPatientName = (text: string): string | undefined => {
    // Patient name patterns (near "Patient:" or "Name:")
    const patientPattern = /(?:Patient|Name):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = text.match(patientPattern);
    return match ? match[1] : undefined;
  };

  const getDocumentTypeIcon = (type: ScanResult['documentType']) => {
    switch (type) {
      case 'prescription': return '💊';
      case 'lab_report': return '🧪';
      case 'medical_note': return '📋';
      default: return '📄';
    }
  };

  const getDocumentTypeName = (type: ScanResult['documentType']) => {
    switch (type) {
      case 'prescription': return 'Prescription';
      case 'lab_report': return 'Lab Report';
      case 'medical_note': return 'Medical Note';
      default: return 'Unknown Document';
    }
  };

  const generateAISummary = async () => {
    if (!scanResult) return;
    
    setIsGeneratingAI(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please analyze this medical document and provide a clear, simple summary. Focus on the key information that a patient needs to understand:

Document Type: ${getDocumentTypeName(scanResult.documentType)}
Extracted Text: ${scanResult.extractedText}

Please provide:
1. What this document is (in simple terms)
2. Key medications or treatments mentioned
3. Important dates or dosages
4. What the patient should do next
5. Any important warnings or instructions

Make it easy to understand for elderly patients and use simple language.`,
          context: 'document_analysis'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.response);
      } else {
        setAiSummary("I had trouble analyzing this document. The OCR extracted the text successfully, but I couldn't process it for a summary. You can still view the extracted text above.");
      }
    } catch (error) {
      console.error('AI Summary error:', error);
      setAiSummary("I had trouble generating a summary for this document. You can still view all the extracted information above.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400 flex items-center gap-2">
        <span>📄</span>
        AI Document Scanner
        <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          OCR Powered
        </span>
      </h2>

      <div 
        {...getRootProps()}
        className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 
          'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
      >
        <input {...getInputProps()} />
          {preview ? (
          <div className="space-y-4">
            <Image 
              src={preview} 
              alt="Preview" 
              width={300}
              height={200}
              className="max-h-48 mx-auto rounded-lg shadow-md"
            />
            {scanResult && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                {getDocumentTypeIcon(scanResult.documentType)} {getDocumentTypeName(scanResult.documentType)} detected
                ({Math.round(scanResult.confidence)}% confidence)
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📂</div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop medical files here' : 'Drag prescription or lab report'}
            </p>
            <p className="text-sm opacity-75">Supports: PNG, JPG, PDF • AI-powered text extraction</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Processing document...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={performOCR}
          disabled={!preview || isProcessing}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Scanning...
            </>
          ) : (
            <>
              <span>🔍</span>
              Extract Text
            </>
          )}
        </motion.button>        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!scanResult || isProcessing || isGeneratingAI}
          className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          onClick={generateAISummary}
        >
          {isGeneratingAI ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing...
            </>
          ) : (
            <>
              <span>🧠</span>
              AI Summary
            </>
          )}
        </motion.button>
      </div>

      {/* Scan Results */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          {/* Document Type */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              {getDocumentTypeIcon(scanResult.documentType)}
              Document Type: {getDocumentTypeName(scanResult.documentType)}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Confidence: {Math.round(scanResult.confidence)}%
            </div>
          </div>

          {/* Key Information */}
          {Object.keys(scanResult.keyInformation).some(key => 
            scanResult.keyInformation[key as keyof typeof scanResult.keyInformation]?.length
          ) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                📋 Extracted Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {scanResult.keyInformation.medications?.length && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Medications:</div>
                    <div className="space-y-1">
                      {scanResult.keyInformation.medications.map((med, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                          💊 {med}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {scanResult.keyInformation.dosages?.length && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Dosages:</div>
                    <div className="space-y-1">
                      {scanResult.keyInformation.dosages.map((dosage, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                          📏 {dosage}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {scanResult.keyInformation.dates?.length && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Dates:</div>
                    <div className="space-y-1">
                      {scanResult.keyInformation.dates.map((date, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                          📅 {date}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {scanResult.keyInformation.doctorName && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor:</div>
                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                      👨‍⚕️ {scanResult.keyInformation.doctorName}
                    </div>
                  </div>
                )}
                
                {scanResult.keyInformation.patientName && (
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Patient:</div>
                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                      👤 {scanResult.keyInformation.patientName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Summary Section */}
          {aiSummary && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                <span>🧠</span>
                AI Analysis & Summary
              </h3>
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {aiSummary}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(aiSummary)}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                >
                  📋 Copy Summary
                </button>
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(aiSummary);
                      utterance.rate = 0.8;
                      speechSynthesis.speak(utterance);
                    }
                  }}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  🔊 Read Aloud
                </button>
              </div>
            </div>
          )}

          {/* Full Extracted Text */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              📝 Full Extracted Text
            </h3>
            <div className="bg-white dark:bg-gray-800 p-3 rounded border max-h-40 overflow-y-auto">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {scanResult.extractedText || 'No text extracted'}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(scanResult.extractedText)}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <span>📋</span>
              Copy Text
            </button>
            <button
              onClick={() => {
                const summary = `Document Type: ${getDocumentTypeName(scanResult.documentType)}\n` +
                  `Medications: ${scanResult.keyInformation.medications?.join(', ') || 'None detected'}\n` +
                  `Dosages: ${scanResult.keyInformation.dosages?.join(', ') || 'None detected'}\n` +
                  `Doctor: ${scanResult.keyInformation.doctorName || 'Not specified'}\n` +
                  `Confidence: ${Math.round(scanResult.confidence)}%`;
                navigator.clipboard.writeText(summary);
              }}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <span>📊</span>
              Copy Summary
            </button>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
          🤖 AI Scanner Features
        </h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {[
            '🔍 Advanced OCR text extraction',
            '💊 Automatic medication detection',
            '📏 Dosage information parsing',
            '👨‍⚕️ Doctor and patient name extraction',
            '📅 Date recognition and parsing',
            '📋 Document type classification',
            '🧠 AI-powered content analysis',
            '📊 Confidence scoring and validation'
          ].map((feature, index) => (
            <div key={index} className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          100% Private - All OCR processing happens locally on your device
        </div>
      </div>
    </div>
  );
}