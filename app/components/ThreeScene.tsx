// app/components/ThreeScene.tsx
'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, useGLTF, Text, Sphere, Box } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

// 3D Heart Model Component
function HeartModel() {
  const heartRef = useRef<THREE.Group>(null)
  
  // Try to load the heart model, with fallback to basic geometry
  let heart;
  try {
    heart = useGLTF('/heart.glb')
  } catch (error) {
    console.log('Heart model not found, using fallback')
  }

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
      heartRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.1} floatingRange={[0, 0.2]}>
      <group ref={heartRef} scale={[2, 2, 2]}>
        {heart?.scene ? (
          <primitive object={heart.scene} />
        ) : (
          // Fallback heart shape made from spheres
          <group>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color="#e74c3c" metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[-0.3, 0.6, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color="#e74c3c" metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0.3, 0.6, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color="#e74c3c" metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  )
}

// Floating Medical Icons
const MedicalIcon = ({ position, children, color = "#3B82F6" }: any) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.2
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[1]) * 0.1
    }
  })

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
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {children}
        </Text>
      </group>
    </Float>
  )
}

// Particle System for ambient effect
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
      particlesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  const particleCount = 50
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60A5FA" transparent opacity={0.6} />
    </points>
  )
}

export default function ThreeScene() {
  return (
    <div className="h-96 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 rounded-3xl"></div>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#60A5FA" />
        
        {/* Main heart model */}
        <HeartModel />
        
        {/* Floating medical icons around the heart */}
        <MedicalIcon position={[-3, 2, 0]} color="#10B981">💊</MedicalIcon>
        <MedicalIcon position={[3, -1, 0]} color="#8B5CF6">🩺</MedicalIcon>
        <MedicalIcon position={[-2, -2, 0]} color="#F59E0B">📋</MedicalIcon>
        <MedicalIcon position={[2, 2, 0]} color="#EF4444">⚕️</MedicalIcon>
        <MedicalIcon position={[0, 3, -2]} color="#06B6D4">🏥</MedicalIcon>
        <MedicalIcon position={[0, -3, -2]} color="#84CC16">👩‍⚕️</MedicalIcon>
        
        {/* Ambient particles */}
        <Particles />
        
        {/* Interactive text */}
        <Text
          position={[0, -4, 0]}
          fontSize={0.8}
          color="#374151"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Medium.woff"
        >
          Healthcare Made Simple
        </Text>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Advanced AI Technology
          </h3>
          <p className="text-lg text-gray-600 max-w-md">
            Powered by cutting-edge machine learning to understand and simplify complex medical information
          </p>
        </div>
      </div>
    </div>
  )
}