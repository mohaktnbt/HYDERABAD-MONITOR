import { NextResponse } from 'next/server';
import { ALERT_SOURCES, SAMPLE_ALERTS } from '@/config/alerts';
import { getCached } from '@/lib/cache';
import { CACHE_TTL } from '@/config/constants';

export const dynamic = 'force-dynamic';

// In the future this will scrape IMD/GHMC/TGSPDCL; for now returns sample alerts
// with timestamps relative to "now" so the panel always looks fresh.
async function fetchAlerts() {
  return SAMPLE_ALERTS.map((a) => ({
    ...a,
    startTime: new Date().toISOString(),
    endTime: a.endTime,
  }));
}

export async function GET() {
  try {
    const alerts = await getCached('alerts:hyderabad', fetchAlerts, CACHE_TTL.NEWS);
    return NextResponse.json({
      data: {
        alerts,
        sources: ALERT_SOURCES,
        active: alerts.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[API] Alerts error:', err);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}
