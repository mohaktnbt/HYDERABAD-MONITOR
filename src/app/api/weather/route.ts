import { NextResponse } from 'next/server';
import { getWeatherData } from '@/services/weather.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getWeatherData();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[API] Weather error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
