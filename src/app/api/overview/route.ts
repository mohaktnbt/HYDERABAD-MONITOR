import { NextResponse } from 'next/server';
import { getAQIData } from '@/services/aqi.service';
import { getWeatherData } from '@/services/weather.service';
import { computeCityHealth } from '@/lib/health-score';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [aqi, weather] = await Promise.allSettled([getAQIData(), getWeatherData()]);
    const aqiData = aqi.status === 'fulfilled' ? aqi.value : [];
    const weatherData = weather.status === 'fulfilled' ? weather.value : null;

    const health = computeCityHealth({
      aqi: aqiData,
      weather: weatherData,
    });

    const validAqi = aqiData.filter((r) => r.aqi != null);
    const avgAqi = validAqi.length
      ? Math.round(validAqi.reduce((s, r) => s + (r.aqi ?? 0), 0) / validAqi.length)
      : null;

    return NextResponse.json({
      data: {
        health,
        snapshot: {
          avgAqi,
          activeStations: validAqi.length,
          temperature: weatherData?.current?.temperature ?? null,
          humidity: weatherData?.current?.humidity ?? null,
          condition: weatherData?.current?.condition ?? null,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[API] Overview error:', err);
    return NextResponse.json({ error: 'Failed to compute overview' }, { status: 500 });
  }
}
