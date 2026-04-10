import { NextResponse } from 'next/server';
import { SCHEMES, SCHEME_CATEGORIES } from '@/config/schemes';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const level = searchParams.get('level');

  let schemes = SCHEMES;
  if (category) schemes = schemes.filter((s) => s.category === category);
  if (level) schemes = schemes.filter((s) => s.level === level);

  return NextResponse.json({
    data: {
      schemes,
      categories: SCHEME_CATEGORIES,
      counts: {
        total: SCHEMES.length,
        central: SCHEMES.filter((s) => s.level === 'central').length,
        state: SCHEMES.filter((s) => s.level === 'state').length,
        city: SCHEMES.filter((s) => s.level === 'city').length,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
