import { NextResponse } from 'next/server';
import { COURT_STATS, CASE_CATEGORIES } from '@/config/courts';

export const dynamic = 'force-static';

export async function GET() {
  const totalPending = COURT_STATS.reduce((s, c) => s + c.pending, 0);
  const totalFiled = COURT_STATS.reduce((s, c) => s + c.filedYTD, 0);
  const totalDisposed = COURT_STATS.reduce((s, c) => s + c.disposedYTD, 0);
  const disposalRate = totalFiled > 0 ? (totalDisposed / totalFiled) * 100 : 0;

  return NextResponse.json({
    data: {
      courts: COURT_STATS,
      caseCategories: CASE_CATEGORIES,
      summary: {
        totalPending,
        totalFiled,
        totalDisposed,
        disposalRatePct: Math.round(disposalRate * 10) / 10,
        totalJudgesWorking: COURT_STATS.reduce((s, c) => s + c.judgesWorking, 0),
        totalJudgesSanctioned: COURT_STATS.reduce((s, c) => s + c.judgesSanctioned, 0),
      },
    },
    timestamp: new Date().toISOString(),
  });
}
