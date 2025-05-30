'use client'
import { Suspense, useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports to prevent SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false })
const Float = dynamic(() => import('@react-three/drei').then((mod) => mod.Float), { ssr: false })
const OrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), { ssr: false })
const Text = dynamic(() => import('@react-three/drei').then((mod) => mod.Text), { ssr: false })

// Loading component
function ThreeSceneLoading() {
  return (
    <div className="h-64 sm:h-80 md:h-96 w-full relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D Health Visualization...</p>
      </div>
    </div>
  )
}

// Scene content component
function ThreeSceneContent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <ThreeSceneLoading />
  }

  return (
    <div className="h-64 sm:h-80 md:h-96 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-teal-50/30 rounded-3xl"></div>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      >
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        
        {/* Simple animated heart */}
        <HeartModel />
        
        {/* Medical icons */}
        <MedicalIcon position={[-3, 2, 0]} color="#10B981" />
        <MedicalIcon position={[3, -1, 0]} color="#8B5CF6" />
        <MedicalIcon position={[-2, -2, 0]} color="#F59E0B" />
        <MedicalIcon position={[2, 2, 0]} color="#EF4444" />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
        <div className="text-center max-w-2xl">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Advanced AI Technology
          </h3>
          <p className="text-lg text-gray-600">
            Powered by cutting-edge machine learning
          </p>
        </div>
      </div>
    </div>
  )
}

// Heart model component
function HeartModel() {
  const heartRef = useRef<any>(null)
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatingRange={[0, 0.2]}>
      <group ref={heartRef} scale={[2, 2, 2]}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#ff4757" 
            metalness={0.1} 
            roughness={0.2} 
            emissive="#ff1744"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[-0.3, 0.6, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#ff4757" 
            metalness={0.1} 
            roughness={0.2}
            emissive="#ff1744"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[0.3, 0.6, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#ff4757" 
            metalness={0.1} 
            roughness={0.2}
            emissive="#ff1744"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Medical icon component
function MedicalIcon({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<any>(null)
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatingRange={[0, 0.3]}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.1} 
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default function ThreeScene() {
  return (
    <Suspense fallback={<ThreeSceneLoading />}>
      <ThreeSceneContent />
    </Suspense>
  )
}
