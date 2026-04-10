import { NextResponse } from 'next/server';
import { CITIZEN_SERVICES } from '@/config/services';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.toLowerCase();

  let services = CITIZEN_SERVICES;
  if (category) services = services.filter((s) => s.category === category);
  if (q) {
    services = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
    );
  }

  const categories = Array.from(new Set(CITIZEN_SERVICES.map((s) => s.category)));

  return NextResponse.json({
    data: {
      services,
      categories,
      total: CITIZEN_SERVICES.length,
    },
    timestamp: new Date().toISOString(),
  });
}
