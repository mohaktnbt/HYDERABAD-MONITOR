import { NextResponse } from 'next/server';
import {
  LOK_SABHA_2024,
  TELANGANA_2024_SUMMARY,
  ASSEMBLY_2023_SUMMARY,
  UPCOMING_ELECTIONS,
} from '@/config/elections';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    data: {
      lokSabha2024: LOK_SABHA_2024,
      telangana2024Summary: TELANGANA_2024_SUMMARY,
      assembly2023Summary: ASSEMBLY_2023_SUMMARY,
      upcoming: UPCOMING_ELECTIONS,
    },
    timestamp: new Date().toISOString(),
  });
}
