'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from './StarField';
import Rocket from './Rocket';
import ProgressTrack from './ProgressTrack';
import SpendingMeteors from './SpendingMeteors';

interface RocketSceneProps {
  percentage: number;
  currentValue: number;
  goal: number;
  spending: number;
  couponsUsed: number;
}

// Checkpoint milestones
const CHECKPOINTS = [
  { value: 0, label: 'PREPARANDO...', color: 'text-gray-400' },
  { value: 100000, label: 'READY TO LIFT OFF!', color: 'text-yellow-400' },
  { value: 200000, label: 'LIFT OFF!', color: 'text-orange-400' },
  { value: 300000, label: 'ACELERANDO!', color: 'text-red-400' },
  { value: 400000, label: 'SUPERSONIC!', color: 'text-cyan-400' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RocketScene({
  percentage,
  currentValue,
  goal,
  spending,
  couponsUsed,
}: RocketSceneProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCheckpointMessage, setShowCheckpointMessage] = useState(false);
  const [lastCheckpoint, setLastCheckpoint] = useState(0);

  // Calculate current checkpoint (0-4)
  const checkpoint = useMemo(() => {
    if (currentValue >= 400000) return 4;
    if (currentValue >= 300000) return 3;
    if (currentValue >= 200000) return 2;
    if (currentValue >= 100000) return 1;
    return 0;
  }, [currentValue]);

  // Calculate speed multiplier for stars (1 to 4)
  const speedMultiplier = useMemo(() => {
    return 1 + (checkpoint * 0.75);
  }, [checkpoint]);

  // Get current status message
  const currentStatus = CHECKPOINTS[checkpoint];

  // Trigger animation every 5 minutes
  useEffect(() => {
    const runAnimation = () => {
      setIsAnimating(true);
      setShowCheckpointMessage(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 5000);

      setTimeout(() => {
        setShowCheckpointMessage(false);
      }, 3000);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect checkpoint changes
  useEffect(() => {
    if (checkpoint !== lastCheckpoint) {
      setShowCheckpointMessage(true);
      setIsAnimating(true);

      setTimeout(() => {
        setShowCheckpointMessage(false);
        setIsAnimating(false);
      }, 5000);

      setLastCheckpoint(checkpoint);
    }
  }, [checkpoint, lastCheckpoint]);

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-[#0a0a1a] via-[#0f172a] to-[#1a1a3a] rounded-2xl overflow-hidden">
      {/* Stars Background */}
      <StarField speedMultiplier={speedMultiplier} />

      {/* Spending Meteors - Full width overlay */}
      <SpendingMeteors
        totalSpending={spending}
        couponsUsed={couponsUsed}
        currentValue={currentValue}
      />

      {/* Top Header: Title + Hero Value */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-4 px-6">
        <div className="flex items-start justify-between">
          {/* Left: Title */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              YOOGA META DEZEMBRO 2025
            </h1>
            <p className="text-gray-500 text-xs">Meta: {formatCurrency(goal)}</p>
          </div>

          {/* Right: Hero Value */}
          <div className="text-right">
            <motion.div
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
              animate={{
                filter: [
                  'drop-shadow(0 0 10px rgba(34,211,238,0.5))',
                  'drop-shadow(0 0 20px rgba(34,211,238,0.8))',
                  'drop-shadow(0 0 10px rgba(34,211,238,0.5))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatCurrency(currentValue)}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {showCheckpointMessage && (
          <motion.div
            className="absolute top-20 left-0 right-0 text-center z-30"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block px-4 py-2 rounded-full bg-black/50 backdrop-blur border border-white/20"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                  '0 0 40px rgba(59, 130, 246, 0.6)',
                  '0 0 20px rgba(59, 130, 246, 0.3)',
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className={`text-xl md:text-2xl font-bold ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - 3 columns layout inside the box */}
      <div className="absolute inset-0 flex items-center justify-between pt-20 pb-16 px-4">
        {/* Left: Sales Progress Track */}
        <div className="h-[320px] flex-shrink-0 z-10 ml-16">
          <div className="text-center mb-2">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Vendas
            </span>
          </div>
          <ProgressTrack
            percentage={percentage}
            goal={goal}
            currentValue={currentValue}
          />
        </div>

        {/* Center: Rocket only (clean) */}
        <div className="relative flex-1 h-[320px] flex flex-col items-center justify-center">
          {/* Launch pad - Enhanced */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
            {/* Base platform */}
            <div className="relative w-32 h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-t-lg border-t border-gray-600">
              {/* Metal texture lines */}
              <div className="absolute inset-0 flex justify-between px-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-gray-600/50" />
                ))}
              </div>

              {/* Energy line - animated glow */}
              <motion.div
                className="absolute inset-x-0 top-0 h-1 rounded-full overflow-hidden"
                style={{
                  background: checkpoint >= 3
                    ? 'linear-gradient(90deg, transparent, #22d3ee, #3b82f6, #22d3ee, transparent)'
                    : checkpoint >= 2
                    ? 'linear-gradient(90deg, transparent, #f97316, #fbbf24, #f97316, transparent)'
                    : 'linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)',
                }}
                animate={{
                  opacity: percentage > 0 ? [0.6, 1, 0.6] : 0.3,
                  boxShadow: percentage > 0
                    ? [
                        `0 0 10px ${checkpoint >= 3 ? '#22d3ee' : '#f97316'}`,
                        `0 0 25px ${checkpoint >= 3 ? '#22d3ee' : '#f97316'}`,
                        `0 0 10px ${checkpoint >= 3 ? '#22d3ee' : '#f97316'}`,
                      ]
                    : '0 0 5px rgba(251,146,60,0.3)',
                }}
                transition={{
                  duration: Math.max(0.3, 1 - checkpoint * 0.15),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Running lights */}
              <div className="absolute inset-x-2 top-0.5 flex justify-between">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: checkpoint >= 3 ? '#22d3ee' : '#f97316',
                    }}
                    animate={{
                      opacity: percentage > 0 ? [0.3, 1, 0.3] : 0.2,
                      scale: percentage > 0 ? [0.8, 1.2, 0.8] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              {/* Energy particles flowing along the pad */}
              {percentage > 0 && (
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(4 + checkpoint * 2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: checkpoint >= 3 ? '#22d3ee' : '#fbbf24',
                        top: '25%',
                      }}
                      animate={{
                        x: [-20, 140],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: Math.max(0.8, 2 - checkpoint * 0.3),
                        delay: i * (0.3 - checkpoint * 0.03),
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Heat distortion effect above pad */}
            {percentage > 10 && (
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse, ${checkpoint >= 3 ? 'rgba(34,211,238,0.15)' : 'rgba(251,146,60,0.15)'} 0%, transparent 70%)`,
                }}
                animate={{
                  scaleY: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              />
            )}

            {/* Side supports with lights */}
            <div className="absolute -left-2 bottom-0 w-2 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t">
              <motion.div
                className="absolute top-1 left-0.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: checkpoint >= 3 ? '#22d3ee' : '#f97316' }}
                animate={{ opacity: percentage > 0 ? [0.5, 1, 0.5] : 0.3 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
            <div className="absolute -right-2 bottom-0 w-2 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t">
              <motion.div
                className="absolute top-1 left-0.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: checkpoint >= 3 ? '#22d3ee' : '#f97316' }}
                animate={{ opacity: percentage > 0 ? [0.5, 1, 0.5] : 0.3 }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>

          {/* Rocket */}
          <Rocket
            percentage={percentage}
            checkpoint={checkpoint}
            isAnimating={isAnimating}
          />

          {/* Launch smoke */}
          {percentage > 0 && percentage < 20 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-6 rounded-full bg-gray-400/20 animate-ping"
                  style={{
                    left: `${(i - 3) * 12}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Spending stats card */}
        <div className="h-[320px] flex-shrink-0 flex flex-col justify-center z-10">
          <div className="text-center mb-2">
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
              Gastos
            </span>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg p-3 min-w-[90px]">
            <div className="text-red-400 text-sm font-bold text-center whitespace-nowrap">
              {formatCurrency(spending)}
            </div>
            <div className="text-gray-500 text-[10px] text-center mt-1">
              {couponsUsed} cupons
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#1a1a3a] to-transparent pointer-events-none" />
    </div>
  );
}
