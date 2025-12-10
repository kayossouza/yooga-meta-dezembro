import { NextResponse } from 'next/server';
import { getDailyHistoryFromAPI } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const history = await getDailyHistoryFromAPI();
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching daily history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily history' },
      { status: 500 }
    );
  }
}
