import { NextResponse } from 'next/server';
import { getAQIData } from '@/services/aqi.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAQIData();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[API] AQI error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AQI data' },
      { status: 500 }
    );
  }
}
