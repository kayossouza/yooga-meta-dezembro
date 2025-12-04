'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GoalCounterProps {
  currentValue: number;
  goal: number;
  percentage: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function GoalCounter({ currentValue, goal, percentage }: GoalCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(startValue + (currentValue - startValue) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [currentValue]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Current Value */}
      <div className="mb-2">
        <motion.span
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
          animate={{
            textShadow: [
              '0 0 20px rgba(34,211,238,0.5)',
              '0 0 40px rgba(34,211,238,0.8)',
              '0 0 20px rgba(34,211,238,0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {formatCurrency(displayValue)}
        </motion.span>
      </div>

      {/* Goal */}
      <div className="text-gray-400 text-lg mb-4">
        de{' '}
        <span className="text-white font-semibold">{formatCurrency(goal)}</span>
      </div>

      {/* Percentage */}
      <motion.div
        className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full"
        animate={{
          boxShadow: percentage >= 100
            ? [
                '0 0 20px rgba(34,197,94,0.3)',
                '0 0 40px rgba(34,197,94,0.5)',
                '0 0 20px rgba(34,197,94,0.3)',
              ]
            : 'none',
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <span
          className={`text-2xl font-bold ${
            percentage >= 100 ? 'text-green-400' : 'text-cyan-400'
          }`}
        >
          {percentage.toFixed(1)}%
        </span>
        <span className="text-gray-400">da meta</span>
      </motion.div>

      {/* Remaining */}
      {percentage < 100 && (
        <motion.div
          className="mt-4 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Faltam{' '}
          <span className="text-yellow-400 font-medium">
            {formatCurrency(goal - currentValue)}
          </span>{' '}
          para a meta
        </motion.div>
      )}

      {/* Goal reached message */}
      {percentage >= 100 && (
        <motion.div
          className="mt-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <span className="text-green-400 font-bold text-lg">
            META ATINGIDA!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
