'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR to avoid webpack issues
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);

const Text = dynamic(
  () => import('@react-three/drei').then((mod) => mod.Text),
  { ssr: false }
);

const Sphere = dynamic(
  () => import('@react-three/drei').then((mod) => mod.Sphere),
  { ssr: false }
);

interface ThreeSceneProps {
  className?: string;
}

// Loading component
function SceneLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading 3D Health Visualization...</p>
      </div>
    </div>
  );
}

// 3D Scene Content Component
function SceneContent() {
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  
  // Heart component
  function Heart({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
    return (
      <Sphere
        position={position}
        args={[0.8, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHoveredOrgan('heart')}
        onPointerOut={() => setHoveredOrgan(null)}
      >
        <meshStandardMaterial 
          color={hoveredOrgan === 'heart' ? '#ef4444' : '#dc2626'} 
          emissive={hoveredOrgan === 'heart' ? '#7f1d1d' : '#000000'}
        />
      </Sphere>
    );
  }

  // Brain component
  function Brain({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
    return (
      <Sphere
        position={position}
        args={[0.7, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHoveredOrgan('brain')}
        onPointerOut={() => setHoveredOrgan(null)}
      >
        <meshStandardMaterial 
          color={hoveredOrgan === 'brain' ? '#8b5cf6' : '#7c3aed'} 
          emissive={hoveredOrgan === 'brain' ? '#3730a3' : '#000000'}
        />
      </Sphere>
    );
  }

  // Lungs component
  function Lungs({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
    return (
      <group position={position}>
        <Sphere
          position={[-0.5, 0, 0]}
          args={[0.6, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHoveredOrgan('lungs')}
          onPointerOut={() => setHoveredOrgan(null)}
        >
          <meshStandardMaterial 
            color={hoveredOrgan === 'lungs' ? '#06b6d4' : '#0891b2'} 
            emissive={hoveredOrgan === 'lungs' ? '#164e63' : '#000000'}
          />
        </Sphere>
        <Sphere
          position={[0.5, 0, 0]}
          args={[0.6, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHoveredOrgan('lungs')}
          onPointerOut={() => setHoveredOrgan(null)}
        >
          <meshStandardMaterial 
            color={hoveredOrgan === 'lungs' ? '#06b6d4' : '#0891b2'} 
            emissive={hoveredOrgan === 'lungs' ? '#164e63' : '#000000'}
          />
        </Sphere>
      </group>
    );
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Interactive organs */}
      <Heart 
        position={[0, 0, 0]} 
        onClick={() => console.log('Heart clicked - show heart health info')} 
      />
      <Brain 
        position={[0, 3, 0]} 
        onClick={() => console.log('Brain clicked - show mental health info')} 
      />
      <Lungs 
        position={[0, -2, 0]} 
        onClick={() => console.log('Lungs clicked - show respiratory info')} 
      />

      {/* Labels */}
      {hoveredOrgan && (
        <Text
          position={[3, 2, 0]}
          fontSize={0.5}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          {hoveredOrgan === 'heart' && 'Heart Health'}
          {hoveredOrgan === 'brain' && 'Mental Wellness'}
          {hoveredOrgan === 'lungs' && 'Respiratory Health'}
        </Text>
      )}

      {/* Camera controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={3}
      />
    </>
  );
}

export default function ThreeScene({ className = "" }: ThreeSceneProps) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server side
  if (!isClient) {
    return <SceneLoading />;
  }

  // Error fallback
  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">3D Visualization Unavailable</h3>
          <p className="text-gray-600 text-sm">Interactive health model couldn't load</p>
          <button 
            onClick={() => setError(null)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className={`w-full h-full ${className}`}>
        <Suspense fallback={<SceneLoading />}>
          <Canvas
            camera={{ position: [5, 2, 5], fov: 60 }}
            style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)' }}
            onError={(error) => {
              console.error('Three.js Canvas error:', error);
              setError('Failed to initialize 3D scene');
            }}
          >
            <SceneContent />
          </Canvas>
        </Suspense>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg max-w-sm">
          <h4 className="font-semibold text-gray-800 mb-1">Interactive Health Model</h4>
          <p className="text-sm text-gray-600">
            Click and drag to rotate • Scroll to zoom • Click organs for health insights
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ThreeScene render error:', error);
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">3D Visualization Unavailable</h3>
          <p className="text-gray-600 text-sm">Your browser doesn't support 3D graphics</p>
        </div>
      </div>
    );
  }
}