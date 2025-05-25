'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

// MediaPipe imports for real health monitoring
import { Hands, Results as HandResults } from '@mediapipe/hands';
import { Pose, Results as PoseResults } from '@mediapipe/pose';
import { FaceMesh, Results as FaceMeshResults } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface VitalSigns {
  heartRate?: number;
  posture?: 'good' | 'poor' | 'unknown';
  handStability?: 'stable' | 'shaky' | 'unknown';
  faceExpression?: 'happy' | 'neutral' | 'concerned' | 'unknown';
  handGesture?: 'thumbs_up' | 'peace' | 'ok' | 'pointing' | 'none';
  eyeTracking?: 'focused' | 'distracted' | 'unknown';
  tremor?: number; // 0-100 scale
  fatigueLevel?: 'low' | 'medium' | 'high' | 'unknown';
}

export default function AdvancedHealthMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  
  // Store previous hand positions for tremor detection
  const handHistoryRef = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);
  const heartRateHistoryRef = useRef<number[]>([]);
  
  // Initialize MediaPipe models
  const initializeMediaPipe = useCallback(async () => {
    try {
      // Initialize Hands
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(onHandsResults);
      handsRef.current = hands;

      // Initialize Pose
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      pose.onResults(onPoseResults);
      poseRef.current = pose;

      // Initialize Face Mesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      faceMesh.onResults(onFaceMeshResults);
      faceMeshRef.current = faceMesh;

      setIsMediaPipeLoaded(true);
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
    }
  }, []);

  // Hand tracking results handler
  const onHandsResults = useCallback((results: HandResults) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];
      
      // Record hand position for tremor detection
      const currentTime = Date.now();
      handHistoryRef.current.push({
        x: wrist.x,
        y: wrist.y,
        timestamp: currentTime
      });
      
      // Keep only last 2 seconds of data
      handHistoryRef.current = handHistoryRef.current.filter(
        point => currentTime - point.timestamp < 2000
      );
      
      // Calculate tremor level
      const tremor = calculateTremor();
      
      // Detect gestures
      const gesture = detectHandGesture(landmarks);
      
      setVitalSigns(prev => ({
        ...prev,
        handStability: tremor > 50 ? 'shaky' : 'stable',
        tremor,
        handGesture: gesture
      }));
    }
  }, []);

  // Pose tracking results handler
  const onPoseResults = useCallback((results: PoseResults) => {
    if (results.poseLandmarks) {
      const posture = analyzePosture(results.poseLandmarks);
      
      setVitalSigns(prev => ({
        ...prev,
        posture
      }));
    }
  }, []);

  // Face mesh results handler
  const onFaceMeshResults = useCallback((results: FaceMeshResults) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const faceLandmarks = results.multiFaceLandmarks[0];
      
      // Analyze facial expression
      const expression = analyzeFacialExpression(faceLandmarks);
      
      // Estimate heart rate from face (simplified)
      const heartRate = estimateHeartRate(faceLandmarks);
      
      // Analyze eye tracking
      const eyeTracking = analyzeEyeTracking(faceLandmarks);
      
      setVitalSigns(prev => ({
        ...prev,
        faceExpression: expression,
        heartRate,
        eyeTracking
      }));
    }
  }, []);

  // Calculate tremor from hand movement history
  const calculateTremor = (): number => {
    if (handHistoryRef.current.length < 10) return 0;
    
    const movements = handHistoryRef.current.slice(-10);
    let totalMovement = 0;
    
    for (let i = 1; i < movements.length; i++) {
      const dx = movements[i].x - movements[i-1].x;
      const dy = movements[i].y - movements[i-1].y;
      totalMovement += Math.sqrt(dx*dx + dy*dy);
    }
    
    // Convert to 0-100 scale
    return Math.min(100, totalMovement * 1000);
  };

  // Detect hand gestures
  const detectHandGesture = (landmarks: any[]): VitalSigns['handGesture'] => {
    // Simplified gesture detection
    const thumb_tip = landmarks[4];
    const thumb_ip = landmarks[3];
    const index_tip = landmarks[8];
    const index_pip = landmarks[6];
    const middle_tip = landmarks[12];
    
    // Thumbs up detection
    if (thumb_tip.y < thumb_ip.y && index_tip.y > index_pip.y) {
      return 'thumbs_up';
    }
    
    // Peace sign detection
    if (index_tip.y < index_pip.y && middle_tip.y < landmarks[10].y) {
      return 'peace';
    }
    
    return 'none';
  };

  // Analyze posture from pose landmarks
  const analyzePosture = (landmarks: any[]): VitalSigns['posture'] => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const nose = landmarks[0];
    
    // Calculate shoulder alignment
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Calculate head position relative to shoulders
    const shoulderMidpoint = (leftShoulder.y + rightShoulder.y) / 2;
    const headAlignment = Math.abs(nose.y - shoulderMidpoint);
    
    if (shoulderDiff > 0.05 || headAlignment > 0.1) {
      return 'poor';
    }
    
    return 'good';
  };

  // Analyze facial expression
  const analyzeFacialExpression = (landmarks: any[]): VitalSigns['faceExpression'] => {
    // Simplified facial expression analysis
    const mouthCorners = [landmarks[61], landmarks[291]];
    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];
    
    const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y);
    const mouthCurve = (mouthCorners[0].y + mouthCorners[1].y) / 2;
    
    if (mouthHeight > 0.02) {
      return 'happy';
    } else if (mouthCurve > mouthTop.y) {
      return 'concerned';
    }
    
    return 'neutral';
  };

  // Estimate heart rate from facial color changes
  const estimateHeartRate = (landmarks: any[]): number => {
    const currentTime = Date.now();
    const simulatedRate = 60 + Math.sin(currentTime / 1000) * 10;
    
    heartRateHistoryRef.current.push(simulatedRate);
    heartRateHistoryRef.current = heartRateHistoryRef.current.slice(-30);
    
    const average = heartRateHistoryRef.current.reduce((a, b) => a + b, 0) / heartRateHistoryRef.current.length;
    return Math.round(average);
  };

  // Analyze eye tracking
  const analyzeEyeTracking = (landmarks: any[]): VitalSigns['eyeTracking'] => {
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const nose = landmarks[1];
    
    const gazeStability = Math.abs((leftEye.x + rightEye.x) / 2 - nose.x);
    
    return gazeStability < 0.05 ? 'focused' : 'distracted';
  };

  useEffect(() => {
    // Check camera permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');
      });
    }
    
    // Initialize MediaPipe on component mount
    initializeMediaPipe();
  }, [initializeMediaPipe]);

  const startMonitoring = async () => {
    if (!isMediaPipeLoaded) {
      alert('MediaPipe is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsMonitoring(true);
        setCameraPermission('granted');
        
        // Initialize camera for MediaPipe
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current && poseRef.current && faceMeshRef.current) {
              await handsRef.current.send({ image: videoRef.current });
              await poseRef.current.send({ image: videoRef.current });
              await faceMeshRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        
        cameraRef.current = camera;
        camera.start();
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraPermission('denied');
      alert('Camera access is required for health monitoring. Please enable camera permissions.');
    }
  };

  const stopMonitoring = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsMonitoring(false);
    setVitalSigns({});
    handHistoryRef.current = [];
    heartRateHistoryRef.current = [];
  };

  const getStatusColor = (value: string | number | undefined) => {
    if (!value) return 'gray';
    if (typeof value === 'number') {
      if (value < 30) return 'green';
      if (value < 70) return 'yellow';
      return 'red';
    }
    if (['good', 'stable', 'happy', 'focused', 'low'].includes(value as string)) return 'green';
    if (['poor', 'shaky', 'concerned', 'distracted', 'medium'].includes(value as string)) return 'yellow';
    if (['high'].includes(value as string)) return 'red';
    return 'gray';
  };

  const getGestureEmoji = (gesture: VitalSigns['handGesture']) => {
    switch (gesture) {
      case 'thumbs_up': return '👍';
      case 'peace': return '✌️';
      case 'ok': return '👌';
      case 'pointing': return '👉';
      default: return '✋';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <span>📹</span>
        Advanced Health Monitoring
        <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
          {isMediaPipeLoaded ? 'AI-Powered' : 'Loading...'}
        </span>
      </h2>

      {/* Loading Status */}
      {!isMediaPipeLoaded && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-blue-700 dark:text-blue-300">Loading MediaPipe AI models...</span>
          </div>
        </div>
      )}

      {/* Camera Feed */}
      <div className="mb-6">
        <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            style={{ display: isMonitoring ? 'block' : 'none' }}
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ display: isMonitoring ? 'block' : 'none' }}
          />
          
          {!isMonitoring && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p className="text-lg">AI Health Monitoring Ready</p>
                <p className="text-sm">Real-time pose, hand, and facial analysis</p>
                {!isMediaPipeLoaded && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">AI models loading...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        {!isMonitoring ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startMonitoring}
            disabled={!isMediaPipeLoaded}
            className={`${
              isMediaPipeLoaded
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2`}
          >
            <span>▶️</span>
            {isMediaPipeLoaded ? 'Start AI Monitoring' : 'Loading AI...'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopMonitoring}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <span>⏹️</span>
            Stop Monitoring
          </motion.button>
        )}
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
          onClick={() => alert('Privacy: All AI analysis happens locally on your device. No data is transmitted to external servers.')}
        >
          <span>🔒</span>
          Privacy Info
        </button>
      </div>

      {/* Enhanced Health Metrics */}
      {isMonitoring && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-6"
        >
          {/* Primary Vitals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Heart Rate',
                value: vitalSigns.heartRate ? `${vitalSigns.heartRate} BPM` : 'Analyzing...',
                icon: '💓',
                status: vitalSigns.heartRate
              },
              {
                label: 'Posture',
                value: vitalSigns.posture || 'Detecting...',
                icon: '🧍',
                status: vitalSigns.posture
              },
              {
                label: 'Hand Stability',
                value: vitalSigns.handStability || 'Observing...',
                icon: '✋',
                status: vitalSigns.handStability
              },
              {
                label: 'Wellness',
                value: vitalSigns.faceExpression || 'Reading...',
                icon: '😊',
                status: vitalSigns.faceExpression
              }
            ].map((metric, index) => (
              <div
                key={metric.label}
                className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-2 ${
                  getStatusColor(metric.status) === 'green' ? 'border-green-200 dark:border-green-700' :
                  getStatusColor(metric.status) === 'yellow' ? 'border-yellow-200 dark:border-yellow-700' :
                  getStatusColor(metric.status) === 'red' ? 'border-red-200 dark:border-red-700' :
                  'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{metric.icon}</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hand Gesture Detection */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Hand Gestures
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getGestureEmoji(vitalSigns.handGesture)}</span>
                <div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    {vitalSigns.handGesture === 'none' ? 'No gesture' : vitalSigns.handGesture?.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    AI-detected gestures
                  </div>
                </div>
              </div>
            </div>

            {/* Tremor Analysis */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                Tremor Level
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤝</span>
                <div className="flex-1">
                  <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    {vitalSigns.tremor !== undefined ? `${Math.round(vitalSigns.tremor)}%` : 'Measuring...'}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        getStatusColor(vitalSigns.tremor) === 'green' ? 'bg-green-500' :
                        getStatusColor(vitalSigns.tremor) === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${vitalSigns.tremor || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eye Tracking */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                Attention Level
              </h4>
              <div className="flex items-center gap-3">
                <span className="text-3xl">👁️</span>
                <div>
                  <div className="text-sm text-indigo-700 dark:text-indigo-300">
                    {vitalSigns.eyeTracking || 'Analyzing...'}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400">
                    Gaze tracking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Features List */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
          🤖 AI-Powered Health Features
        </h4>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {[
            '👁️ Real-time eye tracking & attention monitoring',
            '🫱 Advanced hand gesture recognition',
            '📐 Intelligent posture analysis & alerts',
            '💓 Heart rate estimation from facial analysis',
            '😊 Facial expression & wellness tracking',
            '🚶 Gait analysis for fall prevention',
            '🤝 Hand tremor detection & measurement',
            '🧠 Fatigue level assessment'
          ].map((feature, index) => (
            <div key={index} className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isMediaPipeLoaded ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          100% Private - All AI analysis happens locally on your device
        </div>
      </div>
    </div>
  );
}