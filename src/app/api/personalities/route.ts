import { NextResponse } from 'next/server';
import { PERSONALITIES } from '@/config/personalities';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let people = PERSONALITIES;
  if (category) people = people.filter((p) => p.category === category);

  const categories = Array.from(new Set(PERSONALITIES.map((p) => p.category)));

  return NextResponse.json({
    data: {
      personalities: people,
      categories,
      total: PERSONALITIES.length,
    },
    timestamp: new Date().toISOString(),
  });
}
