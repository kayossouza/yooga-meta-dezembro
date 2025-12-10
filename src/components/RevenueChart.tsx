'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import type { DailyDataPoint } from '@/types';

interface RevenueChartProps {
  data: DailyDataPoint[];
}

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

type MetricKey = 'b2cCumulative' | 'b2bPurchasedCumulative' | 'totalCumulative' | 'b2bSpentCumulative';

const METRIC_CONFIG: Record<MetricKey, { label: string; fullLabel: string; color: string; bgColor: string; borderColor: string }> = {
  b2cCumulative: { label: 'B2C', fullLabel: 'B2C - Usuarios', color: '#22d3ee', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/50' },
  b2bPurchasedCumulative: { label: 'B2B', fullLabel: 'B2B - Restaurantes', color: '#4ade80', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/50' },
  totalCumulative: { label: 'Total', fullLabel: 'Total Vendido', color: '#a855f7', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/50' },
  b2bSpentCumulative: { label: 'Usados', fullLabel: 'Cupons Usados', color: '#f97316', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50' },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !label) return null;

  const labelMap: Record<string, string> = {
    b2cCumulative: 'B2C - Usuarios',
    b2bPurchasedCumulative: 'B2B - Restaurantes',
    totalCumulative: 'Total Vendido',
    b2bSpentCumulative: 'Cupons Usados',
  };

  return (
    <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-gray-400 text-xs mb-2">{formatDate(label)}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300 text-sm">
            {labelMap[entry.dataKey] || entry.name}:
          </span>
          <span className="text-white font-bold text-sm">
            {formatFullCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['b2cCumulative', 'b2bPurchasedCumulative', 'totalCumulative', 'b2bSpentCumulative'])
  );

  const toggleMetric = (metric: MetricKey) => {
    const newSet = new Set(activeMetrics);
    if (newSet.has(metric)) {
      if (newSet.size > 1) newSet.delete(metric);
    } else {
      newSet.add(metric);
    }
    setActiveMetrics(newSet);
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 text-center">
        <p className="text-gray-500">Sem dados de historico disponiveis</p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.totalCumulative, d.b2bPurchasedCumulative, d.b2cCumulative))
  );

  return (
    <motion.div
      className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Evolução da Receita</h3>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Acumulado Dezembro 2025
            </p>
          </div>
        </div>

        {/* Toggle buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(METRIC_CONFIG) as [MetricKey, typeof METRIC_CONFIG[MetricKey]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`px-2 py-1 text-[10px] rounded-lg transition-all ${
                activeMetrics.has(key)
                  ? `${config.bgColor} border ${config.borderColor}`
                  : 'bg-gray-800 text-gray-500 border border-gray-700'
              }`}
              style={{ color: activeMetrics.has(key) ? config.color : undefined }}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#374151' }}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />

            {activeMetrics.has('totalCumulative') && (
              <Area
                type="monotone"
                dataKey="totalCumulative"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#colorTotal)"
                dot={false}
              />
            )}

            {activeMetrics.has('b2cCumulative') && (
              <Line
                type="monotone"
                dataKey="b2cCumulative"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={{ fill: '#22d3ee', r: 2 }}
                activeDot={{ r: 4, fill: '#22d3ee' }}
              />
            )}

            {activeMetrics.has('b2bPurchasedCumulative') && (
              <Line
                type="monotone"
                dataKey="b2bPurchasedCumulative"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ fill: '#4ade80', r: 2 }}
                activeDot={{ r: 4, fill: '#4ade80' }}
              />
            )}

            {activeMetrics.has('b2bSpentCumulative') && (
              <Line
                type="monotone"
                dataKey="b2bSpentCumulative"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 2 }}
                activeDot={{ r: 4, fill: '#f97316' }}
              />
            )}

            {activeMetrics.has('totalCumulative') && (
              <Line
                type="monotone"
                dataKey="totalCumulative"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 2 }}
                activeDot={{ r: 4, fill: '#a855f7' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
        {activeMetrics.has('b2cCumulative') && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-cyan-400 rounded" />
            <span className="text-gray-400">B2C - Usuarios</span>
          </div>
        )}
        {activeMetrics.has('b2bPurchasedCumulative') && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-green-400 rounded" />
            <span className="text-gray-400">B2B - Restaurantes</span>
          </div>
        )}
        {activeMetrics.has('totalCumulative') && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-purple-400 rounded" />
            <span className="text-gray-400">Total Vendido</span>
          </div>
        )}
        {activeMetrics.has('b2bSpentCumulative') && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-orange-400 rounded" />
            <span className="text-gray-400">Cupons Usados</span>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-500 py-2 px-2">Data</th>
              <th className="text-right text-cyan-400 py-2 px-2">B2C</th>
              <th className="text-right text-green-400 py-2 px-2">B2B</th>
              <th className="text-right text-purple-400 py-2 px-2">Total</th>
              <th className="text-right text-orange-400 py-2 px-2">Usados</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="text-gray-400 py-1.5 px-2">{formatDate(row.date)}</td>
                <td className="text-right text-gray-300 py-1.5 px-2">{formatFullCurrency(row.b2cCumulative)}</td>
                <td className="text-right text-gray-300 py-1.5 px-2">{formatFullCurrency(row.b2bPurchasedCumulative)}</td>
                <td className="text-right text-gray-300 py-1.5 px-2">{formatFullCurrency(row.totalCumulative)}</td>
                <td className="text-right text-gray-300 py-1.5 px-2">{formatFullCurrency(row.b2bSpentCumulative)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
