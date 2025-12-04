'use client';

import { motion } from 'framer-motion';
import type { Transaction } from '@/types';

interface CouponTableProps {
  transactions: Transaction[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'SUCCEEDED':
    case 'SUCCEDED': // typo fallback
      return {
        label: 'Pago',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30',
      };
    case 'PENDING':
      return {
        label: 'Pendente',
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
      };
    case 'REFUNDED':
      return {
        label: 'Reembolsado',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
      };
    default:
      return {
        label: status,
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-500/30',
      };
  }
}

export default function CouponTable({ transactions }: CouponTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
        <p className="text-gray-500">Nenhuma transacao encontrada em dezembro de 2025</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-4 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold text-white">
          Detalhes dos Cupons Vendidos
        </h2>
        <p className="text-sm text-gray-500">
          Ultimas {transactions.length} transacoes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">
                Cliente
              </th>
              <th className="text-left px-4 py-3 text-gray-400 text-sm font-medium">
                Cupom
              </th>
              <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">
                Qtd.
              </th>
              <th className="text-right px-4 py-3 text-gray-400 text-sm font-medium">
                Valor
              </th>
              <th className="text-center px-4 py-3 text-gray-400 text-sm font-medium">
                Status
              </th>
              <th className="text-right px-4 py-3 text-gray-400 text-sm font-medium">
                Data
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const statusConfig = getStatusConfig(tx.status);

              return (
                <motion.tr
                  key={tx.id}
                  className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">
                      {tx.userName || 'Usuario Anonimo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300">
                      {tx.packageTitle || 'Pacote personalizado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-300">{tx.packageQty || 1}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-cyan-400 font-medium">
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-400 text-sm">
                      {formatDate(tx.createdAt)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
