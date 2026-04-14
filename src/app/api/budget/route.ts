import { NextResponse } from 'next/server';
import {
  TELANGANA_BUDGET_2025_26,
  TELANGANA_BUDGET_TREND,
  GHMC_BUDGET_2024_25,
  GHMC_REVENUE_SOURCES_2024_25,
} from '@/config/budget';

export const dynamic = 'force-static';

export async function GET() {
  const totalTG = TELANGANA_BUDGET_2025_26.reduce((s, e) => s + e.allocatedCr, 0);
  const totalGHMC = GHMC_BUDGET_2024_25.reduce((s, e) => s + e.allocatedCr, 0);
  const totalGHMCRev = GHMC_REVENUE_SOURCES_2024_25.reduce((s, e) => s + e.amountCr, 0);

  return NextResponse.json({
    data: {
      telangana: {
        fiscalYear: '2025-26',
        totalCr: totalTG,
        sectors: TELANGANA_BUDGET_2025_26,
        trend: TELANGANA_BUDGET_TREND,
      },
      ghmc: {
        fiscalYear: '2024-25',
        totalCr: totalGHMC,
        sectors: GHMC_BUDGET_2024_25,
        revenueSources: GHMC_REVENUE_SOURCES_2024_25,
        totalRevenueCr: totalGHMCRev,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
