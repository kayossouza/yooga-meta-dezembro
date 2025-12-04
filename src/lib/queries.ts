import type { MetricsResponse } from '@/types';

const GOAL = 400000; // R$ 400.000,00
const API_URL = process.env.NEST_DELIVERY_API_URL || 'https://delivery2.yooga.com.br';

// Check at runtime if we should use mock data
function useMockData(): boolean {
  return process.env.USE_MOCK_DATA === 'true';
}

// Mock data for development
const mockMetrics: MetricsResponse = {
  goal: GOAL,
  b2c: {
    totalCoupons: 156,
    paidCount: 98,
    paidValue: 245600.0,
    pendingCount: 52,
    pendingValue: 58350.0,
  },
  b2b: {
    totalOrders: 45,
    paidCount: 38,
    paidValue: 80000.0,
    pendingCount: 7,
    pendingValue: 15000.0,
  },
  usage: {
    couponsUsed: 150,
    totalDiscountGiven: 45000.0,
  },
  combined: {
    totalValue: 325600.0,
    percentage: 81.4,
    remaining: 74400.0,
  },
  updatedAt: new Date().toISOString(),
};

export async function getMetricsFromAPI(): Promise<MetricsResponse> {
  if (useMockData()) {
    console.log('Using mock data');
    return mockMetrics;
  }

  try {
    const response = await fetch(`${API_URL}/boost/meta-dashboard`, {
      next: { revalidate: 0 },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data as MetricsResponse;
  } catch (error) {
    console.error('Failed to fetch from API, using mock data:', error);
    return mockMetrics;
  }
}

export { GOAL };
