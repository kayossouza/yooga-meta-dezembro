'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Settings } from 'lucide-react';
import RocketScene from '@/components/RocketScene';
import StatsCards from '@/components/StatsCards';
import CouponTable from '@/components/CouponTable';
import type { MetricsResponse, Transaction } from '@/types';

const REFRESH_INTERVAL = 30000; // 30 seconds

// Mock transactions for display (until API returns real data)
const mockTransactions: Transaction[] = [
  {
    id: 1,
    key: 'a1b2c3d4',
    userName: 'Maria Silva',
    packageTitle: '3 Cupons de R$ 10',
    packageQty: 3,
    amount: 29.9,
    status: 'SUCCEEDED',
    createdAt: '2025-12-03T14:30:00Z',
  },
  {
    id: 2,
    key: 'b2c3d4e5',
    userName: 'Joao Santos',
    packageTitle: '7 Cupons de R$ 10',
    packageQty: 7,
    amount: 59.9,
    status: 'SUCCEEDED',
    createdAt: '2025-12-03T13:15:00Z',
  },
  {
    id: 3,
    key: 'c3d4e5f6',
    userName: 'Ana Costa',
    packageTitle: '5 Cupons de R$ 15',
    packageQty: 5,
    amount: 69.9,
    status: 'PENDING',
    createdAt: '2025-12-03T12:00:00Z',
  },
  {
    id: 4,
    key: 'd4e5f6a7',
    userName: 'Pedro Oliveira',
    packageTitle: '10 Cupons de R$ 10',
    packageQty: 10,
    amount: 89.9,
    status: 'SUCCEEDED',
    createdAt: '2025-12-02T18:45:00Z',
  },
  {
    id: 5,
    key: 'e5f6a7b8',
    userName: 'Carla Ferreira',
    packageTitle: '3 Cupons de R$ 20',
    packageQty: 3,
    amount: 54.9,
    status: 'SUCCEEDED',
    createdAt: '2025-12-02T16:30:00Z',
  },
];

export default function Home() {
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Test mode state
  const [testMode, setTestMode] = useState(false);
  const [testValue, setTestValue] = useState<number | null>(null);
  const [testSpending, setTestSpending] = useState<number | null>(null);

  const fetchMetrics = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setIsRefreshing(true);

      const response = await fetch('/api/metrics', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar dados');
      }

      const result: MetricsResponse = await response.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMetrics();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-red-500 text-6xl mb-4">!</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchMetrics();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header with refresh info */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Meta Dezembro 2025
            </h1>
            <p className="text-gray-500 text-xs">
              Clube de Cupons Yooga - B2C + B2B
            </p>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-gray-500 text-xs hidden md:inline">
                {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
            <button
              onClick={() => fetchMetrics(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              <span className="text-xs hidden md:inline">Atualizar</span>
            </button>
            {/* Test mode toggle - discrete */}
            <button
              onClick={() => {
                setTestMode(!testMode);
                if (!testMode) {
                  setTestValue(data?.combined.totalValue || 0);
                  setTestSpending(data?.usage.totalDiscountGiven || 0);
                } else {
                  setTestValue(null);
                  setTestSpending(null);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                testMode
                  ? 'bg-cyan-600/30 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-600 hover:text-gray-400'
              }`}
              title="Modo Teste"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Test Mode Controls Panel */}
        {testMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3"
          >
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-cyan-400 font-bold">MODO TESTE</span>

              {/* Value controls */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Vendas:</span>
                <div className="flex gap-1">
                  {[0, 50000, 100000, 200000, 300000, 400000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTestValue(val)}
                      className={`px-2 py-1 rounded transition-all ${
                        testValue === val
                          ? 'bg-cyan-500/50 text-white'
                          : 'bg-gray-800 text-gray-500 hover:text-white'
                      }`}
                    >
                      {val === 0 ? '0' : `${val / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spending controls */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Gastos:</span>
                <div className="flex gap-1">
                  {[0, 10000, 50000, 100000, 200000, 300000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTestSpending(val)}
                      className={`px-2 py-1 rounded transition-all ${
                        testSpending === val
                          ? 'bg-red-500/50 text-white'
                          : 'bg-gray-800 text-gray-500 hover:text-white'
                      }`}
                    >
                      {val === 0 ? '0' : `${val / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ratio indicator */}
              {testValue !== null && testSpending !== null && testValue > 0 && (
                <div className="text-gray-400">
                  Ratio: <span className={testSpending / testValue >= 1 ? 'text-red-400' : testSpending / testValue >= 0.5 ? 'text-yellow-400' : 'text-green-400'}>
                    {((testSpending / testValue) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rocket Scene */}
        <RocketScene
          percentage={testMode && testValue !== null
            ? (testValue / data.goal) * 100
            : data.combined.percentage}
          currentValue={testMode && testValue !== null
            ? testValue
            : data.combined.totalValue}
          goal={data.goal}
          spending={testMode && testSpending !== null
            ? testSpending
            : data.usage.totalDiscountGiven}
          couponsUsed={data.usage.couponsUsed}
        />

        {/* Progress Stats Section */}
        <div className="flex items-center justify-center gap-8 py-3 px-4 bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/30">
          <div className="text-center">
            <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {(testMode && testValue !== null
                ? (testValue / data.goal) * 100
                : data.combined.percentage
              ).toFixed(1)}%
            </span>
            <p className="text-gray-500 text-xs mt-1">da meta</p>
          </div>
          <div className="w-px h-10 bg-gray-700" />
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-300">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                data.goal - (testMode && testValue !== null ? testValue : data.combined.totalValue)
              )}
            </span>
            <p className="text-gray-500 text-xs mt-1">faltam</p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards
          b2c={data.b2c}
          b2b={data.b2b}
          usage={data.usage}
        />

        {/* Transactions Table */}
        <CouponTable transactions={mockTransactions} />

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs py-2">
          Auto-refresh a cada 30 segundos
        </div>
      </div>
    </main>
  );
}
