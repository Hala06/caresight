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
          // Fallback heart shape made from spheres - Much Brighter
          <group>
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
    <div className="h-64 sm:h-80 md:h-96 w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-teal-50/30 rounded-3xl"></div>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      >{/* Enhanced Lighting - Much Brighter */}
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 10, 10]} intensity={1.0} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#60A5FA" />
        <hemisphereLight args={["#ffffff", "#f0f9ff", 0.8]} />
        
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
          color="#1F2937"
          anchorX="center"
          anchorY="middle"
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
      
      {/* Overlay content - Responsive */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
        <div className="text-center max-w-2xl">
          <h3 className="text-responsive-3xl font-bold text-gray-800 mb-4">
            Advanced AI Technology
          </h3>
          <p className="text-responsive-lg text-gray-600">
            Powered by cutting-edge machine learning to understand and simplify complex medical information
          </p>
        </div>
      </div>
    </div>
  )
}