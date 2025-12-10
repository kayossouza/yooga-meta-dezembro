import type { MetricsResponse, DailyHistoryResponse } from '@/types';

const GOAL = 400000; // R$ 400.000,00
const API_URL = process.env.NEST_DELIVERY_API_URL || 'https://delivery.yooga.com.br';

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
    const response = await fetch(`${API_URL}/boost-dashboard`, {
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

// Mock daily history for development
function generateMockDailyHistory(): DailyHistoryResponse {
  const today = new Date();
  const startDate = new Date(2025, 11, 1); // December 1, 2025
  const history: DailyHistoryResponse['history'] = [];
  let b2cCumulative = 0;
  let b2bPurchasedCumulative = 0;
  let b2bSpentCumulative = 0;

  const currentDate = new Date(startDate);
  while (currentDate <= today && currentDate.getMonth() === 11) {
    const b2cDaily = Math.floor(Math.random() * 20000) + 5000; // 5k-25k per day
    const b2bPurchasedDaily = Math.floor(Math.random() * 8000) + 2000; // 2k-10k per day
    const b2bSpentDaily = Math.floor(Math.random() * 5000) + 1000; // 1k-6k per day (gasto)

    b2cCumulative += b2cDaily;
    b2bPurchasedCumulative += b2bPurchasedDaily;
    b2bSpentCumulative += b2bSpentDaily;

    history.push({
      date: currentDate.toISOString().split('T')[0],
      b2cDaily,
      b2cCumulative,
      b2bPurchasedDaily,
      b2bPurchasedCumulative,
      b2bSpentDaily,
      b2bSpentCumulative,
      b2bBalance: b2bPurchasedCumulative - b2bSpentCumulative,
      totalDaily: b2cDaily + b2bPurchasedDaily,
      totalCumulative: b2cCumulative + b2bPurchasedCumulative,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    history,
    period: {
      start: '2025-12-01',
      end: today.toISOString().split('T')[0],
    },
    updatedAt: new Date().toISOString(),
  };
}

const mockDailyHistory = generateMockDailyHistory();

export async function getDailyHistoryFromAPI(): Promise<DailyHistoryResponse> {
  if (useMockData()) {
    console.log('Using mock daily history data');
    return mockDailyHistory;
  }

  try {
    const response = await fetch(`${API_URL}/boost-dashboard/daily-history`, {
      next: { revalidate: 0 },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data as DailyHistoryResponse;
  } catch (error) {
    console.error('Failed to fetch daily history, using mock:', error);
    return mockDailyHistory;
  }
}

export { GOAL };
