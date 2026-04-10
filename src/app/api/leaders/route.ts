import { NextResponse } from 'next/server';
import { LEADERS, ASSEMBLY_CONSTITUENCIES } from '@/config/leaders';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    data: {
      leaders: LEADERS,
      assemblyConstituencies: ASSEMBLY_CONSTITUENCIES,
      counts: {
        total: LEADERS.length,
        central: LEADERS.filter((l) => l.tier === 'central').length,
        state: LEADERS.filter((l) => l.tier === 'state').length,
        city: LEADERS.filter((l) => l.tier === 'city').length,
        admin: LEADERS.filter((l) => l.tier === 'admin').length,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
