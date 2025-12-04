'use client';

import { motion } from 'framer-motion';

interface ProgressTrackProps {
  percentage: number;
  goal: number;
  currentValue: number;
}

const milestones = [
  { percent: 0, label: '0%' },
  { percent: 25, label: '25%' },
  { percent: 50, label: '50%' },
  { percent: 75, label: '75%' },
  { percent: 100, label: '100%' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProgressTrack({ percentage, goal, currentValue }: ProgressTrackProps) {
  return (
    <div className="relative h-full w-32 flex flex-col justify-between py-8 pl-12">
      {/* Track background */}
      <div className="absolute left-1/2 -translate-x-1/2 top-8 bottom-8 w-2 bg-gray-700 rounded-full overflow-hidden">
        {/* Filled progress */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-300"
          initial={{ height: '0%' }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      {/* Milestones */}
      {milestones.map((milestone) => {
        const value = (milestone.percent / 100) * goal;
        const isReached = percentage >= milestone.percent;
        // Position from bottom (0% at bottom, 100% at top)
        const bottomPosition = milestone.percent;

        return (
          <div
            key={milestone.percent}
            className="absolute left-0 right-0 flex items-center"
            style={{ bottom: `${bottomPosition * 0.84 + 8}%` }}
          >
            {/* Value label */}
            <div className="absolute right-full mr-1 text-right whitespace-nowrap">
              <span
                className={`text-[10px] font-medium ${
                  isReached ? 'text-cyan-400' : 'text-gray-500'
                }`}
              >
                {formatCurrency(value)}
              </span>
            </div>

            {/* Milestone dot */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                className={`w-4 h-4 rounded-full border-2 ${
                  isReached
                    ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                    : 'bg-gray-700 border-gray-600'
                }`}
                animate={isReached ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Percentage label */}
            <div className="absolute left-full ml-1">
              <span
                className={`text-[10px] font-bold ${
                  isReached ? 'text-cyan-400' : 'text-gray-500'
                }`}
              >
                {milestone.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Current value indicator */}
      <motion.div
        className="absolute left-full ml-3 bg-blue-600 px-2 py-1 rounded-lg shadow-lg"
        style={{ bottom: `${Math.min(percentage, 100) * 0.84 + 5}%` }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-white text-[10px] font-bold whitespace-nowrap">
          {formatCurrency(currentValue)}
        </span>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-blue-600 rotate-45" />
      </motion.div>
    </div>
  );
}
