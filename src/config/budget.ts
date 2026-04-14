// Telangana & GHMC budget data
// Sources: Telangana Finance Department Budget Documents, GHMC Budget 2024-25

export interface BudgetEntry {
  id: string;
  fiscalYear: string;
  level: 'state' | 'city';
  sector: string;
  allocatedCr: number; // in crore rupees
  percentage: number;
  description: string;
  color: string;
}

// Telangana State Budget FY 2025-26 (₹3.04 lakh crore total budget)
export const TELANGANA_BUDGET_2025_26: BudgetEntry[] = [
  {
    id: 'tg-agri-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Agriculture & Rural Development',
    allocatedCr: 36900,
    percentage: 12.14,
    description: 'Rythu Bharosa, crop loan waiver, irrigation',
    color: '#4ADE80',
  },
  {
    id: 'tg-women-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Women & Child Welfare',
    allocatedCr: 28800,
    percentage: 9.47,
    description: 'Mahalakshmi scheme, Kalyana Lakshmi, ICDS',
    color: '#EC4899',
  },
  {
    id: 'tg-health-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Health, Medical & Family Welfare',
    allocatedCr: 11500,
    percentage: 3.78,
    description: 'Aarogyasri, Basti Dawakhanas, AIIMS, KIMS',
    color: '#F87171',
  },
  {
    id: 'tg-edu-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'School & Higher Education',
    allocatedCr: 23100,
    percentage: 7.60,
    description: 'Gurukul schools, mid-day meals, scholarships',
    color: '#A78BFA',
  },
  {
    id: 'tg-energy-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Energy',
    allocatedCr: 16400,
    percentage: 5.39,
    description: 'Gruha Jyothi, discom subsidies, power generation',
    color: '#FBBF24',
  },
  {
    id: 'tg-housing-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Housing',
    allocatedCr: 7500,
    percentage: 2.47,
    description: 'Indiramma Indlu, urban housing',
    color: '#F59E0B',
  },
  {
    id: 'tg-sc-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'SC/ST/BC/Minority Welfare',
    allocatedCr: 49000,
    percentage: 16.12,
    description: 'Welfare schemes, scholarships, housing, self-employment',
    color: '#22D3EE',
  },
  {
    id: 'tg-irr-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Irrigation & Command Area Development',
    allocatedCr: 22500,
    percentage: 7.40,
    description: 'Kaleshwaram, Palamuru-Rangareddy lift schemes',
    color: '#38BDF8',
  },
  {
    id: 'tg-mun-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Municipal Administration & Urban Development',
    allocatedCr: 19500,
    percentage: 6.41,
    description: 'GHMC grants, urban infrastructure, Musi rejuvenation',
    color: '#E8A87C',
  },
  {
    id: 'tg-other-25',
    fiscalYear: '2025-26',
    level: 'state',
    sector: 'Others (Admin, Interest, Transport)',
    allocatedCr: 88800,
    percentage: 29.22,
    description: 'Debt servicing, administration, transport, police',
    color: '#6B7280',
  },
];

// Multi-year Telangana budget trend (total outlay in ₹ crore)
export const TELANGANA_BUDGET_TREND = [
  { fy: '2021-22', totalCr: 230825, revenueCr: 186000, capitalCr: 44825 },
  { fy: '2022-23', totalCr: 256958, revenueCr: 211685, capitalCr: 45273 },
  { fy: '2023-24', totalCr: 275891, revenueCr: 228636, capitalCr: 47255 },
  { fy: '2024-25', totalCr: 291159, revenueCr: 240394, capitalCr: 50765 },
  { fy: '2025-26', totalCr: 304000, revenueCr: 251200, capitalCr: 52800 },
];

// GHMC Budget 2024-25 (approx. ₹7,400 crore)
export const GHMC_BUDGET_2024_25: BudgetEntry[] = [
  {
    id: 'ghmc-roads-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Roads & Infrastructure',
    allocatedCr: 1850,
    percentage: 25.0,
    description: 'SRDP, road widening, flyovers',
    color: '#E8A87C',
  },
  {
    id: 'ghmc-sanitation-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Sanitation & Solid Waste',
    allocatedCr: 1250,
    percentage: 16.9,
    description: 'Door-to-door collection, Jawahar Nagar, sweeping',
    color: '#34D399',
  },
  {
    id: 'ghmc-stormwater-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Stormwater Drains',
    allocatedCr: 650,
    percentage: 8.8,
    description: 'Nalas, desilting, SNDP',
    color: '#38BDF8',
  },
  {
    id: 'ghmc-parks-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Parks & Greenery',
    allocatedCr: 320,
    percentage: 4.3,
    description: 'Urban forestry, park maintenance',
    color: '#4ADE80',
  },
  {
    id: 'ghmc-welfare-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Health & Welfare',
    allocatedCr: 410,
    percentage: 5.5,
    description: 'Basti Dawakhanas, veterinary, UCDs',
    color: '#F87171',
  },
  {
    id: 'ghmc-lighting-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Street Lighting',
    allocatedCr: 290,
    percentage: 3.9,
    description: 'LED retrofit, new lights, maintenance',
    color: '#FBBF24',
  },
  {
    id: 'ghmc-town-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Town Planning & Projects',
    allocatedCr: 780,
    percentage: 10.5,
    description: 'LRS, building permissions, layout regularisation',
    color: '#A78BFA',
  },
  {
    id: 'ghmc-est-24',
    fiscalYear: '2024-25',
    level: 'city',
    sector: 'Establishment & Admin',
    allocatedCr: 1850,
    percentage: 25.0,
    description: 'Salaries, pensions, office running',
    color: '#6B7280',
  },
];

export const GHMC_REVENUE_SOURCES_2024_25 = [
  { source: 'Property Tax', amountCr: 1850, color: '#E8A87C' },
  { source: 'Trade License & Advertisement', amountCr: 180, color: '#FBBF24' },
  { source: 'Town Planning Fees', amountCr: 920, color: '#A78BFA' },
  { source: 'State Government Grants', amountCr: 2100, color: '#38BDF8' },
  { source: 'Central Finance Commission', amountCr: 430, color: '#22D3EE' },
  { source: 'Loans & Debt', amountCr: 1200, color: '#F87171' },
  { source: 'Other Non-Tax', amountCr: 720, color: '#6B7280' },
];
