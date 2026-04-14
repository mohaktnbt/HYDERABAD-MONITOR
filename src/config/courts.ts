// Telangana court statistics and Hyderabad district court data
// Sources: National Judicial Data Grid (NJDG), Telangana High Court

export interface CourtStat {
  id: string;
  courtName: string;
  level: 'high' | 'district' | 'lower';
  filedYTD: number;
  disposedYTD: number;
  pending: number;
  pendingOver5Yrs: number;
  pendingOver10Yrs: number;
  avgDaysToDispose: number;
  judgesSanctioned: number;
  judgesWorking: number;
  updatedAt: string;
}

// Figures are approximate public NJDG snapshots for illustration
export const COURT_STATS: CourtStat[] = [
  {
    id: 'tg-hc',
    courtName: 'Telangana High Court',
    level: 'high',
    filedYTD: 48500,
    disposedYTD: 41200,
    pending: 264100,
    pendingOver5Yrs: 42300,
    pendingOver10Yrs: 12800,
    avgDaysToDispose: 1820,
    judgesSanctioned: 42,
    judgesWorking: 31,
    updatedAt: '2025-09-30',
  },
  {
    id: 'hyd-cc',
    courtName: 'Hyderabad City Civil Court',
    level: 'district',
    filedYTD: 12400,
    disposedYTD: 10900,
    pending: 48900,
    pendingOver5Yrs: 8700,
    pendingOver10Yrs: 1900,
    avgDaysToDispose: 1210,
    judgesSanctioned: 38,
    judgesWorking: 34,
    updatedAt: '2025-09-30',
  },
  {
    id: 'hyd-mctc',
    courtName: 'Metropolitan Sessions Court, Hyderabad',
    level: 'district',
    filedYTD: 8900,
    disposedYTD: 8200,
    pending: 31500,
    pendingOver5Yrs: 4200,
    pendingOver10Yrs: 780,
    avgDaysToDispose: 920,
    judgesSanctioned: 22,
    judgesWorking: 20,
    updatedAt: '2025-09-30',
  },
  {
    id: 'hyd-fc',
    courtName: 'Family Court, Hyderabad',
    level: 'district',
    filedYTD: 4100,
    disposedYTD: 3650,
    pending: 9800,
    pendingOver5Yrs: 1100,
    pendingOver10Yrs: 190,
    avgDaysToDispose: 740,
    judgesSanctioned: 8,
    judgesWorking: 7,
    updatedAt: '2025-09-30',
  },
  {
    id: 'hyd-cbi',
    courtName: 'Special CBI Court, Hyderabad',
    level: 'district',
    filedYTD: 290,
    disposedYTD: 210,
    pending: 1450,
    pendingOver5Yrs: 420,
    pendingOver10Yrs: 95,
    avgDaysToDispose: 2100,
    judgesSanctioned: 3,
    judgesWorking: 3,
    updatedAt: '2025-09-30',
  },
];

// Case category breakdown for Hyderabad district courts
export const CASE_CATEGORIES = [
  { category: 'Civil', pending: 52000, color: '#60A5FA' },
  { category: 'Criminal', pending: 38000, color: '#F87171' },
  { category: 'Family', pending: 9800, color: '#EC4899' },
  { category: 'Property', pending: 14500, color: '#FBBF24' },
  { category: 'Motor Accident', pending: 7200, color: '#A78BFA' },
  { category: 'Labour', pending: 3400, color: '#34D399' },
  { category: 'Other', pending: 12000, color: '#6B7280' },
];
