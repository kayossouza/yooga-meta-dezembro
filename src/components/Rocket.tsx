'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RocketProps {
  percentage: number;
  checkpoint: number; // 0, 1, 2, 3, 4
  isAnimating: boolean;
}

export default function Rocket({ percentage, checkpoint, isAnimating }: RocketProps) {
  // Calculate position: 0% = bottom (20%), 100% = top (65%)
  // Adjusted for the larger rocket (260px height) to always stay visible
  const bottomPosition = 20 + (percentage * 0.45);

  // Shake intensity based on speed
  const shakeIntensity = checkpoint * 0.5;

  // Flame size based on checkpoint
  const flameScale = 0.6 + (checkpoint * 0.35);

  // Glow intensity
  const glowIntensity = 0.3 + (checkpoint * 0.2);

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 z-10"
      animate={{
        bottom: `${bottomPosition}%`,
        x: isAnimating ? [-2 * shakeIntensity, 2 * shakeIntensity, -2 * shakeIntensity, 2 * shakeIntensity, 0] : 0,
      }}
      initial={{ bottom: '20%' }}
      transition={{
        bottom: {
          type: 'spring',
          stiffness: 50,
          damping: 15,
          duration: 1.5,
        },
        x: {
          duration: 0.3,
          repeat: isAnimating ? Infinity : 0,
        },
      }}
    >
      {/* Rocket Body */}
      <div className="relative">
        {/* Outer glow effect based on checkpoint - contained */}
        <motion.div
          className="absolute -inset-4 rounded-full blur-xl pointer-events-none"
          style={{
            background: checkpoint >= 3
              ? `radial-gradient(circle, rgba(34,211,238,${glowIntensity * 0.7}) 0%, transparent 60%)`
              : checkpoint >= 2
              ? `radial-gradient(circle, rgba(59,130,246,${glowIntensity * 0.7}) 0%, transparent 60%)`
              : checkpoint >= 1
              ? `radial-gradient(circle, rgba(251,146,60,${glowIntensity * 0.5}) 0%, transparent 60%)`
              : 'transparent',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />

        {/* Speed lines at high checkpoints - more dramatic */}
        {checkpoint >= 2 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Vertical speed lines */}
            {[...Array(10 + checkpoint * 3)].map((_, i) => (
              <motion.div
                key={`speed-${i}`}
                className="absolute bg-gradient-to-b from-cyan-400/50 to-transparent rounded-full"
                style={{
                  width: 1 + Math.random() * 2,
                  height: 20 + Math.random() * 40,
                  left: `${15 + Math.random() * 70}%`,
                  top: -50,
                }}
                animate={{
                  y: [0, 120],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        )}

        {/* Wind streaks around rocket - checkpoint 1+ */}
        {checkpoint >= 1 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Left wind streaks */}
            {[...Array(3 + checkpoint)].map((_, i) => (
              <motion.div
                key={`wind-left-${i}`}
                className="absolute bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                style={{
                  width: 30 + Math.random() * 20,
                  height: 1,
                  left: -40,
                  top: `${20 + i * 15 + Math.random() * 10}%`,
                }}
                animate={{
                  x: [-20, 60],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
            {/* Right wind streaks */}
            {[...Array(3 + checkpoint)].map((_, i) => (
              <motion.div
                key={`wind-right-${i}`}
                className="absolute bg-gradient-to-l from-transparent via-white/20 to-transparent rounded-full"
                style={{
                  width: 30 + Math.random() * 20,
                  height: 1,
                  right: -40,
                  top: `${25 + i * 15 + Math.random() * 10}%`,
                }}
                animate={{
                  x: [20, -60],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  delay: i * 0.15 + 0.1,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Sonic boom rings at checkpoint 3+ */}
        {checkpoint >= 3 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`sonic-${i}`}
                className="absolute border border-cyan-400/30 rounded-full"
                style={{
                  width: 80,
                  height: 40,
                }}
                animate={{
                  scale: [0.5, 2, 3],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        {/* Energy aura at checkpoint 4 */}
        {checkpoint >= 4 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          >
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.3) 0%, transparent 70%)',
              }}
            />
          </motion.div>
        )}

        <svg
          width="160"
          height="260"
          viewBox="0 0 100 180"
          className="drop-shadow-2xl"
          style={{
            filter: `drop-shadow(0 0 ${15 + checkpoint * 10}px rgba(59,130,246,${glowIntensity}))`,
          }}
        >
          <defs>
            {/* Metallic body gradient */}
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="25%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>

            {/* Nose cone gradient */}
            <linearGradient id="noseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="30%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#f9fafb" />
              <stop offset="70%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>

            {/* Yooga blue gradient */}
            <linearGradient id="yoogaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Second stage gradient - darker */}
            <linearGradient id="stage2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="25%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#e5e7eb" />
              <stop offset="75%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>

            {/* Third stage gradient - even darker */}
            <linearGradient id="stage3Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="25%" stopColor="#9ca3af" />
              <stop offset="50%" stopColor="#d1d5db" />
              <stop offset="75%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>

            {/* Fin gradient */}
            <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>

            {/* Window reflection gradient */}
            <radialGradient id="windowGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="40%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>

            {/* Engine gradient */}
            <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="50%" stopColor="#6b7280" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>

            {/* Orange accent gradient */}
            <linearGradient id="orangeAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            {/* Shadow filter */}
            <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
              <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
            </filter>
          </defs>

          {/* ============ STAGE 1: NOSE CONE & COMMAND MODULE ============ */}

          {/* Rocket nose cone - 3D effect */}
          <path
            d="M50 3 L68 35 L32 35 Z"
            fill="url(#noseGradient)"
            stroke="#9ca3af"
            strokeWidth="1"
          />
          {/* Nose highlight */}
          <path
            d="M50 6 L54 28 L46 28 Z"
            fill="rgba(255,255,255,0.3)"
          />
          {/* Nose tip */}
          <circle cx="50" cy="5" r="2" fill="#ef4444" />

          {/* Command module body */}
          <rect
            x="32"
            y="35"
            width="36"
            height="30"
            fill="url(#bodyGradient)"
            stroke="#9ca3af"
            strokeWidth="1"
            rx="2"
          />

          {/* Body highlight stripe */}
          <rect
            x="46"
            y="35"
            width="6"
            height="30"
            fill="rgba(255,255,255,0.2)"
          />

          {/* Top Yooga stripe */}
          <rect
            x="32"
            y="40"
            width="36"
            height="3"
            fill="url(#yoogaBlue)"
          />

          {/* Main window - 3D glass effect */}
          <circle
            cx="50"
            cy="52"
            r="10"
            fill="url(#windowGradient)"
            stroke="#1e40af"
            strokeWidth="2"
          />
          {/* Window reflection */}
          <ellipse
            cx="47"
            cy="49"
            rx="3"
            ry="2"
            fill="rgba(255,255,255,0.6)"
          />
          {/* Window inner ring */}
          <circle
            cx="50"
            cy="52"
            r="7"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />

          {/* ============ STAGE 2: SERVICE MODULE ============ */}

          {/* Stage separator ring */}
          <rect
            x="30"
            y="65"
            width="40"
            height="4"
            fill="url(#orangeAccent)"
            stroke="#ea580c"
            strokeWidth="0.5"
          />

          {/* Service module body */}
          <rect
            x="30"
            y="69"
            width="40"
            height="35"
            fill="url(#stage2Gradient)"
            stroke="#6b7280"
            strokeWidth="1"
          />

          {/* Body highlight */}
          <rect
            x="46"
            y="69"
            width="6"
            height="35"
            fill="rgba(255,255,255,0.15)"
          />

          {/* Yooga logo area - circular badge with Y */}
          <circle
            cx="50"
            cy="86"
            r="9"
            fill="url(#yoogaBlue)"
            stroke="#1d4ed8"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="86"
            r="6.5"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          <text
            x="50"
            y="90"
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="bold"
            fontFamily="system-ui"
          >
            Y
          </text>

          {/* Side detail panels - left */}
          <rect x="31" y="72" width="3" height="8" fill="#4b5563" rx="0.5" />
          <rect x="31" y="82" width="3" height="8" fill="#4b5563" rx="0.5" />
          {/* Side detail panels - right */}
          <rect x="66" y="72" width="3" height="8" fill="#4b5563" rx="0.5" />
          <rect x="66" y="82" width="3" height="8" fill="#4b5563" rx="0.5" />

          {/* ============ STAGE 3: BOOSTER STAGE ============ */}

          {/* Stage separator ring */}
          <rect
            x="28"
            y="104"
            width="44"
            height="4"
            fill="url(#orangeAccent)"
            stroke="#ea580c"
            strokeWidth="0.5"
          />

          {/* Booster stage body - wider */}
          <rect
            x="26"
            y="108"
            width="48"
            height="40"
            fill="url(#stage3Gradient)"
            stroke="#4b5563"
            strokeWidth="1"
          />

          {/* Body highlight */}
          <rect
            x="46"
            y="108"
            width="8"
            height="40"
            fill="rgba(255,255,255,0.1)"
          />

          {/* Bottom Yooga stripe */}
          <rect
            x="26"
            y="138"
            width="48"
            height="4"
            fill="url(#yoogaBlue)"
          />

          {/* Booster detail lines */}
          <line x1="38" y1="108" x2="38" y2="148" stroke="#374151" strokeWidth="1" />
          <line x1="62" y1="108" x2="62" y2="148" stroke="#374151" strokeWidth="1" />

          {/* Small windows on booster */}
          <circle cx="38" cy="120" r="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <circle cx="62" cy="120" r="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <ellipse cx="36" cy="118" rx="1.5" ry="1" fill="rgba(255,255,255,0.4)" />
          <ellipse cx="60" cy="118" rx="1.5" ry="1" fill="rgba(255,255,255,0.4)" />

          {/* ============ FINS ============ */}

          {/* Left fin - 3D */}
          <path
            d="M26 120 L5 155 L26 145 Z"
            fill="url(#finGradient)"
            stroke="#1e40af"
            strokeWidth="1"
          />
          {/* Left fin highlight */}
          <path
            d="M24 125 L12 148 L24 142 Z"
            fill="rgba(255,255,255,0.2)"
          />

          {/* Right fin - 3D */}
          <path
            d="M74 120 L95 155 L74 145 Z"
            fill="url(#finGradient)"
            stroke="#1e40af"
            strokeWidth="1"
          />
          {/* Right fin shadow */}
          <path
            d="M76 125 L88 148 L76 142 Z"
            fill="rgba(0,0,0,0.2)"
          />

          {/* Center fin - back */}
          <path
            d="M44 140 L50 165 L56 140 Z"
            fill="url(#finGradient)"
            stroke="#1e40af"
            strokeWidth="1"
          />

          {/* ============ ENGINE SECTION ============ */}

          {/* Engine base */}
          <rect
            x="30"
            y="148"
            width="40"
            height="12"
            fill="url(#engineGradient)"
            stroke="#374151"
            strokeWidth="1"
            rx="2"
          />

          {/* Engine nozzles - 3 engines */}
          <ellipse cx="38" cy="160" rx="5" ry="3" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <ellipse cx="50" cy="162" rx="6" ry="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <ellipse cx="62" cy="160" rx="5" ry="3" fill="#1f2937" stroke="#374151" strokeWidth="1" />

          {/* Engine inner glow */}
          <ellipse cx="38" cy="160" rx="3" ry="2" fill="#374151" />
          <ellipse cx="50" cy="162" rx="4" ry="2.5" fill="#374151" />
          <ellipse cx="62" cy="160" rx="3" ry="2" fill="#374151" />

          {/* ============ RIVETS & DETAILS ============ */}

          {/* Top rivets */}
          {[35, 42, 58, 65].map((x) => (
            <circle key={`rivet-top-${x}`} cx={x} cy="37" r="1" fill="#6b7280" />
          ))}

          {/* Middle rivets */}
          {[32, 40, 60, 68].map((x) => (
            <circle key={`rivet-mid-${x}`} cx={x} cy="106" r="1" fill="#4b5563" />
          ))}

          {/* Bottom rivets */}
          {[30, 38, 50, 62, 70].map((x) => (
            <circle key={`rivet-bot-${x}`} cx={x} cy="148" r="1.2" fill="#374151" />
          ))}
        </svg>

        {/* Enhanced Flames - 3 engines */}
        {percentage > 0 && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            {/* Flame container */}
            <div className="relative flex flex-col items-center" style={{ transform: `scale(${flameScale})` }}>
              {/* Outer flame glow */}
              <motion.div
                className="absolute -inset-6 rounded-full blur-xl"
                style={{
                  background: checkpoint >= 3
                    ? 'radial-gradient(ellipse, rgba(34,211,238,0.7) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse, rgba(251,146,60,0.7) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                }}
              />

              {/* Triple engine flames container */}
              <div className="flex gap-1 justify-center items-end">
                {/* Left engine flame */}
                <motion.div
                  className="w-3 rounded-b-full"
                  style={{
                    height: 22,
                    background: checkpoint >= 3
                      ? 'linear-gradient(to bottom, #ffffff, #22d3ee, #3b82f6, #1e40af)'
                      : checkpoint >= 2
                      ? 'linear-gradient(to bottom, #ffffff, #fbbf24, #f97316, #dc2626)'
                      : 'linear-gradient(to bottom, #fef3c7, #fbbf24, #f97316, #ea580c)',
                  }}
                  animate={{
                    scaleY: [1, 1.4, 1],
                    scaleX: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: Math.max(0.04, 0.12 - checkpoint * 0.02),
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Center engine flame - bigger */}
                <motion.div
                  className="w-5 rounded-b-full"
                  style={{
                    height: 30,
                    background: checkpoint >= 3
                      ? 'linear-gradient(to bottom, #ffffff, #22d3ee, #3b82f6, #1e40af)'
                      : checkpoint >= 2
                      ? 'linear-gradient(to bottom, #ffffff, #fbbf24, #f97316, #dc2626)'
                      : 'linear-gradient(to bottom, #fef3c7, #fbbf24, #f97316, #ea580c)',
                  }}
                  animate={{
                    scaleY: [1, 1.5, 1],
                    scaleX: [1, 0.85, 1],
                  }}
                  transition={{
                    duration: Math.max(0.04, 0.1 - checkpoint * 0.02),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.01,
                  }}
                />

                {/* Right engine flame */}
                <motion.div
                  className="w-3 rounded-b-full"
                  style={{
                    height: 22,
                    background: checkpoint >= 3
                      ? 'linear-gradient(to bottom, #ffffff, #22d3ee, #3b82f6, #1e40af)'
                      : checkpoint >= 2
                      ? 'linear-gradient(to bottom, #ffffff, #fbbf24, #f97316, #dc2626)'
                      : 'linear-gradient(to bottom, #fef3c7, #fbbf24, #f97316, #ea580c)',
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    scaleX: [1, 0.85, 1],
                  }}
                  transition={{
                    duration: Math.max(0.04, 0.12 - checkpoint * 0.02),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.02,
                  }}
                />
              </div>

              {/* Inner white-hot flames container */}
              <div className="absolute top-1 flex gap-2 justify-center items-end">
                {/* Inner left */}
                <motion.div
                  className="w-1.5 rounded-b-full"
                  style={{
                    height: 12,
                    background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0))',
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 0.08,
                    repeat: Infinity,
                  }}
                />

                {/* Inner center - bigger */}
                <motion.div
                  className="w-2.5 rounded-b-full"
                  style={{
                    height: 18,
                    background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0))',
                  }}
                  animate={{
                    scaleY: [1, 1.4, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 0.06,
                    repeat: Infinity,
                    delay: 0.01,
                  }}
                />

                {/* Inner right */}
                <motion.div
                  className="w-1.5 rounded-b-full"
                  style={{
                    height: 12,
                    background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0))',
                  }}
                  animate={{
                    scaleY: [1, 1.2, 1],
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 0.08,
                    repeat: Infinity,
                    delay: 0.03,
                  }}
                />
              </div>

              {/* Particle system - centered */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                {[...Array(6 + checkpoint * 2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: 2 + Math.random() * 2,
                      height: 2 + Math.random() * 2,
                      left: `${-8 + Math.random() * 16}px`,
                      backgroundColor: checkpoint >= 3
                        ? ['#22d3ee', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 3)]
                        : ['#fbbf24', '#f97316', '#ffffff'][Math.floor(Math.random() * 3)],
                    }}
                    animate={{
                      y: [0, 30 + checkpoint * 8, 60 + checkpoint * 15],
                      x: [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 15],
                      opacity: [1, 0.5, 0],
                      scale: [1, 0.5, 0],
                    }}
                    transition={{
                      duration: Math.max(0.25, 0.5 - checkpoint * 0.06),
                      delay: i * 0.04,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>

              {/* Smoke puffs at lower speeds - centered */}
              {checkpoint < 2 && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`smoke-${i}`}
                      className="absolute rounded-full bg-gray-400/20"
                      style={{
                        width: 10 + Math.random() * 8,
                        height: 10 + Math.random() * 8,
                        left: `${-10 + Math.random() * 20}px`,
                      }}
                      animate={{
                        y: [0, 30, 60],
                        x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20],
                        opacity: [0.3, 0.15, 0],
                        scale: [0.5, 1, 1.5],
                      }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Supersonic rings at checkpoint 3+ - centered */}
              {checkpoint >= 3 && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute border rounded-full"
                      style={{
                        width: 20,
                        height: 10,
                        top: i * 10,
                        borderColor: checkpoint >= 4 ? 'rgba(34,211,238,0.5)' : 'rgba(251,146,60,0.4)',
                      }}
                      animate={{
                        scale: [1, 1.8, 2.5],
                        opacity: [0.6, 0.3, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.12,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Side thrusters at checkpoint 2+ */}
        <AnimatePresence>
          {checkpoint >= 2 && (
            <>
              {/* Left thruster */}
              <motion.div
                className="absolute -left-6 bottom-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <motion.div
                  className="w-2 h-8 rounded-b-full"
                  style={{
                    background: checkpoint >= 3
                      ? 'linear-gradient(to bottom, #22d3ee, #3b82f6, transparent)'
                      : 'linear-gradient(to bottom, #fbbf24, #f97316, transparent)',
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    rotate: [-15, -20, -15],
                  }}
                  transition={{
                    duration: 0.08,
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              {/* Right thruster */}
              <motion.div
                className="absolute -right-6 bottom-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <motion.div
                  className="w-2 h-8 rounded-b-full"
                  style={{
                    background: checkpoint >= 3
                      ? 'linear-gradient(to bottom, #22d3ee, #3b82f6, transparent)'
                      : 'linear-gradient(to bottom, #fbbf24, #f97316, transparent)',
                  }}
                  animate={{
                    scaleY: [1, 1.3, 1],
                    rotate: [15, 20, 15],
                  }}
                  transition={{
                    duration: 0.08,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Checkpoint 4: Afterburner effect - contained */}
        {checkpoint >= 4 && (
          <motion.div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-10 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), rgba(59,130,246,0.15), transparent)',
              borderRadius: '0 0 50% 50%',
            }}
            animate={{
              scaleY: [1, 1.15, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
