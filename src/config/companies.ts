import type { CompanyInfo } from '@/types';

// Top 20 Hyderabad-headquartered companies by market cap
export const HYD_COMPANIES: CompanyInfo[] = [
  { symbol: 'DIVISLAB.NS', name: "Divi's Laboratories", sector: 'Pharma' },
  { symbol: 'DRREDDY.NS', name: "Dr. Reddy's Labs", sector: 'Pharma' },
  { symbol: 'NMDC.NS', name: 'NMDC Limited', sector: 'Mining' },
  { symbol: 'AUROPHARMA.NS', name: 'Aurobindo Pharma', sector: 'Pharma' },
  { symbol: 'BDL.NS', name: 'Bharat Dynamics', sector: 'Defense' },
  { symbol: 'LAURUS.NS', name: 'Laurus Labs', sector: 'Pharma' },
  { symbol: 'GRANULES.NS', name: 'Granules India', sector: 'Pharma' },
  { symbol: 'KIMS.NS', name: 'KIMS Hospitals', sector: 'Healthcare' },
  { symbol: 'CYIENT.NS', name: 'Cyient Ltd', sector: 'IT' },
  { symbol: 'KFINTECH.NS', name: 'KFin Technologies', sector: 'Fintech' },
  { symbol: 'HAPPSTMNDS.NS', name: 'Happiest Minds', sector: 'IT' },
  { symbol: 'RAIN.NS', name: 'Rain Industries', sector: 'Chemicals' },
  { symbol: 'GRINFRA.NS', name: 'GR Infraprojects', sector: 'Infra' },
  { symbol: 'NATCOPHARM.NS', name: 'Natco Pharma', sector: 'Pharma' },
  { symbol: 'SUVEN.NS', name: 'Suven Pharma', sector: 'Pharma' },
  { symbol: 'EIHOTEL.NS', name: 'EIH Ltd (Oberoi)', sector: 'Hospitality' },
  { symbol: 'SHILPAMED.NS', name: 'Shilpa Medicare', sector: 'Pharma' },
  { symbol: 'NSLNISP.NS', name: 'NACL Industries', sector: 'Chemicals' },
  { symbol: 'NEULANDLAB.NS', name: 'Neuland Labs', sector: 'Pharma' },
  { symbol: 'MSUMI.NS', name: 'Motherson Sumi', sector: 'Auto' },
];

export const SECTOR_COLORS: Record<string, string> = {
  Pharma: '#22D3EE',
  IT: '#A78BFA',
  Defense: '#F87171',
  Mining: '#FBBF24',
  Healthcare: '#34D399',
  Fintech: '#60A5FA',
  Chemicals: '#FB923C',
  Infra: '#94A3B8',
  Hospitality: '#E879F9',
  Auto: '#4ADE80',
};
