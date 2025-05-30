// app/components/BackgroundAnimations.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function BackgroundAnimations() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {theme === 'dark' ? <StarField /> : <LavaLampBlobs />}
    </div>
  );
}

// Calm stars animation for dark mode
function StarField() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 15, // 15-25 seconds
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Shooting stars occasionally */}
      <ShootingStars />
    </div>
  );
}

function ShootingStars() {
  const [shootingStars, setShootingStars] = useState<Array<{id: number, delay: number}>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 5 seconds
        const newStar = {
          id: Date.now(),
          delay: 0,
        };
        setShootingStars(prev => [...prev, newStar]);
        
        // Remove after animation
        setTimeout(() => {
          setShootingStars(prev => prev.filter(star => star.id !== newStar.id));
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-blue-200 rounded-full"
          style={{
            left: '10%',
            top: '20%',
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            rotate: 45,
          }}
          animate={{
            x: window.innerWidth * 0.8,
            y: window.innerHeight * 0.6,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        >
          {/* Trail effect */}
          <div className="absolute -top-0.5 -left-8 w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-60" />
        </motion.div>
      ))}
    </>
  );
}

// Calm lava lamp blobs for light mode
function LavaLampBlobs() {
  const blobs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 60, // 60-180px
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    color: i % 3 === 0 ? 'bg-blue-200' : i % 3 === 1 ? 'bg-purple-200' : 'bg-teal-200',
    duration: Math.random() * 20 + 25, // 25-45 seconds
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 opacity-40">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full blur-xl ${blob.color}`}
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
          }}
          initial={{
            x: `${blob.initialX}vw`,
            y: `${blob.initialY}vh`,
          }}
          animate={{
            x: [
              `${blob.initialX}vw`,
              `${(blob.initialX + 30) % 100}vw`,
              `${(blob.initialX + 60) % 100}vw`,
              `${blob.initialX}vw`,
            ],
            y: [
              `${blob.initialY}vh`,
              `${(blob.initialY + 20) % 100}vh`,
              `${(blob.initialY + 40) % 100}vh`,
              `${blob.initialY}vh`,
            ],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating particles */}
      <FloatingParticles />
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 15 + 20,
    delay: Math.random() * 10,
  }));

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-300 opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
