'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface SpendingMeteorsProps {
  totalSpending: number;
  couponsUsed: number;
  currentValue?: number; // earnings to compare ratio
}

export default function SpendingMeteors({ totalSpending, couponsUsed, currentValue = 0 }: SpendingMeteorsProps) {
  const [meteors, setMeteors] = useState<{ id: number; x: number; delay: number; duration: number; size: number }[]>([]);

  // Calculate meteor count based on spending/earnings ratio
  // If spending >= earnings (pau a pau or negative), lots of meteors (30-50)
  // If spending is small compared to earnings, few meteors (3-10)
  const meteorCount = useMemo(() => {
    if (currentValue <= 0) return 5; // No earnings yet, minimal meteors

    const ratio = totalSpending / currentValue;

    if (ratio >= 1) {
      // Spending >= earnings - DANGER! Many meteors
      return Math.min(50, Math.floor(30 + ratio * 10));
    } else if (ratio >= 0.5) {
      // Spending is 50-100% of earnings - moderate danger
      return Math.floor(15 + ratio * 20);
    } else if (ratio >= 0.2) {
      // Spending is 20-50% of earnings - some meteors
      return Math.floor(8 + ratio * 15);
    } else {
      // Spending < 20% of earnings - very few meteors
      return Math.max(3, Math.floor(ratio * 25));
    }
  }, [totalSpending, currentValue]);

  useEffect(() => {
    // Generate meteors in the center area only (25% to 75% of width)
    // to avoid overlapping with text on left (Vendas) and right (Gastos)
    const newMeteors = Array.from({ length: meteorCount }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50, // Center 50% of width (25% to 75%)
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 2,
      size: 0.6 + Math.random() * 0.5, // Slightly smaller
    }));
    setMeteors(newMeteors);
  }, [meteorCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          className="absolute"
          style={{
            left: `${meteor.x}%`,
            transform: `scale(${meteor.size})`,
          }}
          initial={{ top: '-5%', opacity: 0 }}
          animate={{
            top: ['0%', '110%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Meteor body */}
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-3 bg-red-500/20 rounded-full blur-lg" />

            {/* Core */}
            <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-orange-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)]" />

            {/* Tail */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-16 bg-gradient-to-b from-red-400/80 via-orange-400/50 to-transparent rounded-full" />

            {/* Sparks */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-orange-300 rounded-full"
                style={{
                  left: `${-8 + Math.random() * 20}px`,
                  top: `${15 + i * 10}px`,
                }}
                animate={{
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
