import { z } from 'zod';

// Zod Schemas
export const TransactionStatusSchema = z.enum(['PENDING', 'SUCCEEDED', 'REFUNDED']);

export const TransactionSchema = z.object({
  id: z.number(),
  key: z.string(),
  userName: z.string().nullable(),
  packageTitle: z.string().nullable(),
  packageQty: z.number().nullable(),
  amount: z.number(),
  status: TransactionStatusSchema,
  createdAt: z.string(),
});

// B2C Metrics (usuarios)
export const B2CMetricsSchema = z.object({
  totalCoupons: z.number(),
  paidCount: z.number(),
  paidValue: z.number(),
  pendingCount: z.number(),
  pendingValue: z.number(),
});

// B2B Metrics (restaurantes)
export const B2BMetricsSchema = z.object({
  totalOrders: z.number(),
  paidCount: z.number(),
  paidValue: z.number(),
  pendingCount: z.number(),
  pendingValue: z.number(),
});

// Usage Metrics (spending)
export const UsageMetricsSchema = z.object({
  couponsUsed: z.number(),
  totalDiscountGiven: z.number(),
});

// Combined Metrics
export const CombinedMetricsSchema = z.object({
  totalValue: z.number(),
  percentage: z.number(),
  remaining: z.number(),
});

export const ProgressSchema = z.object({
  percentage: z.number(),
  remaining: z.number(),
});

// Legacy summary for backwards compatibility
export const SummarySchema = z.object({
  totalCoupons: z.number(),
  totalValue: z.number(),
  paidCount: z.number(),
  paidValue: z.number(),
  pendingCount: z.number(),
  pendingValue: z.number(),
  refundedCount: z.number(),
});

export const MetricsResponseSchema = z.object({
  goal: z.number(),
  b2c: B2CMetricsSchema,
  b2b: B2BMetricsSchema,
  usage: UsageMetricsSchema,
  combined: CombinedMetricsSchema,
  updatedAt: z.string(),
});

// TypeScript Types
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type B2CMetrics = z.infer<typeof B2CMetricsSchema>;
export type B2BMetrics = z.infer<typeof B2BMetricsSchema>;
export type UsageMetrics = z.infer<typeof UsageMetricsSchema>;
export type CombinedMetrics = z.infer<typeof CombinedMetricsSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type MetricsResponse = z.infer<typeof MetricsResponseSchema>;
