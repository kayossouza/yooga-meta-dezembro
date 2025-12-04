'use client';

import { motion } from 'framer-motion';
import { Users, Store, TrendingUp, Wallet } from 'lucide-react';
import type { B2CMetrics, B2BMetrics, UsageMetrics } from '@/types';

interface StatsCardsProps {
  b2c: B2CMetrics;
  b2b: B2BMetrics;
  usage: UsageMetrics;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export default function StatsCards({ b2c, b2b, usage }: StatsCardsProps) {
  const cards = [
    {
      key: 'b2c',
      label: 'B2C - Usuarios',
      value: formatCurrency(b2c.paidValue),
      subtext: `${b2c.paidCount} cupons pagos`,
      pending: `${b2c.pendingCount} pendentes (${formatCurrency(b2c.pendingValue)})`,
      icon: Users,
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      key: 'b2b',
      label: 'B2B - Restaurantes',
      value: formatCurrency(b2b.paidValue),
      subtext: `${b2b.paidCount} pedidos pagos`,
      pending: `${b2b.pendingCount} pendentes (${formatCurrency(b2b.pendingValue)})`,
      icon: Store,
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
    },
    {
      key: 'total',
      label: 'Total Vendido',
      value: formatCurrency(b2c.paidValue + b2b.paidValue),
      subtext: `B2C + B2B`,
      pending: `${b2c.pendingCount + b2b.pendingCount} itens pendentes`,
      icon: TrendingUp,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
    {
      key: 'spending',
      label: 'Cupons Usados',
      value: formatCurrency(usage.totalDiscountGiven),
      subtext: `${formatNumber(usage.couponsUsed)} cupons resgatados`,
      pending: 'Desconto dado aos clientes',
      icon: Wallet,
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.key}
            className={`${card.bgColor} ${card.borderColor} border rounded-xl p-4 backdrop-blur`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{card.label}</span>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-gray-400 mt-1">{card.subtext}</div>
            <div className="text-xs text-gray-500 mt-0.5">{card.pending}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
