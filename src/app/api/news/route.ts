import { NextResponse } from 'next/server';
import { getNewsData } from '@/services/news.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getNewsData();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[API] News error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}
