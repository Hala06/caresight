'use client'
import { Suspense, useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'

// Dynamic imports to prevent SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), { ssr: false })
const Float = dynamic(() => import('@react-three/drei').then((mod) => mod.Float), { ssr: false })
const OrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), { ssr: false })

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
      >        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        
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

// Simple medical heart model component
function HeartModel() {
  const heartRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    // Simple slow rotation
    const rotateHeart = () => {
      if (heartRef.current) {
        heartRef.current.rotation.y += 0.01 // Nice slow rotation
      }
      requestAnimationFrame(rotateHeart)
    }
    rotateHeart()
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.1} floatingRange={[0, 0.2]}>
      <group ref={heartRef} scale={[2.2, 2.2, 2.2]}>
        {/* Main heart shape */}
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color="#e74c3c" 
            metalness={0.2} 
            roughness={0.3} 
            emissive="#c0392b"
            emissiveIntensity={0.05}
          />
        </mesh>
        
        {/* Left chamber */}
        <mesh position={[-0.25, 0.4, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#e74c3c" 
            metalness={0.2} 
            roughness={0.3}
            emissive="#c0392b"
            emissiveIntensity={0.05}
          />
        </mesh>
        
        {/* Right chamber */}
        <mesh position={[0.25, 0.4, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial 
            color="#e74c3c" 
            metalness={0.2} 
            roughness={0.3}
            emissive="#c0392b"
            emissiveIntensity={0.05}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Simple medical icon component
function MedicalIcon({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatingRange={[0, 0.3]}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.3} 
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.1}
            transparent
            opacity={0.9}
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