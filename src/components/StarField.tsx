'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  size: number;
  delay: number;
}

interface StarFieldProps {
  speedMultiplier?: number; // 1 = normal, 4 = supersonic
}

export default function StarField({ speedMultiplier = 1 }: StarFieldProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  // Calculate animation duration based on speed multiplier
  const baseDuration = useMemo(() => {
    // Faster stars = shorter duration
    // speedMultiplier 1 = 8s, speedMultiplier 4 = 2s
    return Math.max(2, 8 / speedMultiplier);
  }, [speedMultiplier]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ top: '-2%', opacity: 0 }}
          animate={{
            top: ['0%', '102%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: baseDuration + (Math.random() * 2),
            delay: star.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Extra fast streaking stars when going supersonic */}
      {speedMultiplier > 2.5 && (
        <>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`streak-${i}`}
              className="absolute bg-gradient-to-b from-white to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                width: 2,
                height: 20 + speedMultiplier * 10,
              }}
              initial={{ top: '-5%', opacity: 0 }}
              animate={{
                top: ['0%', '105%'],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: baseDuration * 0.5,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
