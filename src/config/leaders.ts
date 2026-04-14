// Hyderabad leadership — MPs, MLAs, GHMC officials
// Data reflects positions as publicly reported (2024-2026)

export interface Leader {
  id: string;
  name: string;
  role: string;
  tier: 'central' | 'state' | 'city' | 'admin';
  party: string | null;
  constituency: string | null;
  photoUrl: string | null;
  since: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

// Hyderabad district has multiple Lok Sabha constituencies
// Secunderabad, Hyderabad, Chevella (partial), Malkajgiri (partial)
export const LEADERS: Leader[] = [
  // === Central / Lok Sabha MPs ===
  {
    id: 'mp-hyd',
    name: 'Asaduddin Owaisi',
    role: 'Member of Parliament',
    tier: 'central',
    party: 'AIMIM',
    constituency: 'Hyderabad (Lok Sabha)',
    photoUrl: null,
    since: '2004',
    phone: null,
    email: null,
    website: 'https://sansad.in',
  },
  {
    id: 'mp-sec',
    name: 'Etala Rajender',
    role: 'Member of Parliament',
    tier: 'central',
    party: 'BJP',
    constituency: 'Malkajgiri (Lok Sabha)',
    photoUrl: null,
    since: '2024',
    phone: null,
    email: null,
    website: 'https://sansad.in',
  },
  {
    id: 'mp-sec2',
    name: 'Kishan Reddy',
    role: 'Member of Parliament',
    tier: 'central',
    party: 'BJP',
    constituency: 'Secunderabad (Lok Sabha)',
    photoUrl: null,
    since: '2019',
    phone: null,
    email: null,
    website: 'https://sansad.in',
  },
  {
    id: 'mp-chev',
    name: 'Konda Vishweshwar Reddy',
    role: 'Member of Parliament',
    tier: 'central',
    party: 'BJP',
    constituency: 'Chevella (Lok Sabha)',
    photoUrl: null,
    since: '2024',
    phone: null,
    email: null,
    website: 'https://sansad.in',
  },

  // === State / Telangana Government ===
  {
    id: 'cm-tg',
    name: 'Anumula Revanth Reddy',
    role: 'Chief Minister of Telangana',
    tier: 'state',
    party: 'INC',
    constituency: 'Kodangal (Vikarabad district)',
    photoUrl: null,
    since: 'December 2023',
    phone: null,
    email: 'cm@telangana.gov.in',
    website: 'https://cm.telangana.gov.in',
  },
  {
    id: 'dycm-tg',
    name: 'Mallu Bhatti Vikramarka',
    role: 'Deputy Chief Minister, Finance Minister',
    tier: 'state',
    party: 'INC',
    constituency: 'Madhira',
    photoUrl: null,
    since: 'December 2023',
    phone: null,
    email: null,
    website: 'https://telangana.gov.in',
  },
  {
    id: 'gov-tg',
    name: 'Jishnu Dev Varma',
    role: 'Governor of Telangana',
    tier: 'state',
    party: null,
    constituency: null,
    photoUrl: null,
    since: 'July 2024',
    phone: null,
    email: null,
    website: 'https://rajbhavan.telangana.gov.in',
  },

  // === City / GHMC ===
  {
    id: 'mayor-ghmc',
    name: 'Gadwal Vijayalakshmi',
    role: 'Mayor of Hyderabad (GHMC)',
    tier: 'city',
    party: 'BRS',
    constituency: 'GHMC',
    photoUrl: null,
    since: 'February 2021',
    phone: null,
    email: null,
    website: 'https://www.ghmc.gov.in',
  },
  {
    id: 'ghmc-comm',
    name: 'GHMC Commissioner',
    role: 'Commissioner, GHMC',
    tier: 'admin',
    party: null,
    constituency: null,
    photoUrl: null,
    since: null,
    phone: '040-21111111',
    email: 'commissioner@ghmc.gov.in',
    website: 'https://www.ghmc.gov.in',
  },
  {
    id: 'police-cp-hyd',
    name: 'Commissioner of Police, Hyderabad City',
    role: 'Commissioner of Police (Hyderabad City)',
    tier: 'admin',
    party: null,
    constituency: null,
    photoUrl: null,
    since: null,
    phone: '100',
    email: null,
    website: 'https://www.hyderabadpolice.gov.in',
  },
  {
    id: 'police-cp-cyb',
    name: 'Commissioner of Police, Cyberabad',
    role: 'Commissioner of Police (Cyberabad)',
    tier: 'admin',
    party: null,
    constituency: null,
    photoUrl: null,
    since: null,
    phone: '100',
    email: null,
    website: 'https://www.cyberabadpolice.gov.in',
  },
  {
    id: 'police-cp-rch',
    name: 'Commissioner of Police, Rachakonda',
    role: 'Commissioner of Police (Rachakonda)',
    tier: 'admin',
    party: null,
    constituency: null,
    photoUrl: null,
    since: null,
    phone: '100',
    email: null,
    website: 'https://www.rachakondapolice.gov.in',
  },
];

// Hyderabad district Assembly Constituencies (partial list — 15 constituencies)
export const ASSEMBLY_CONSTITUENCIES = [
  'Malakpet',
  'Karwan',
  'Goshamahal',
  'Charminar',
  'Chandrayangutta',
  'Yakutpura',
  'Bahadurpura',
  'Musheerabad',
  'Amberpet',
  'Khairatabad',
  'Jubilee Hills',
  'Sanathnagar',
  'Nampally',
  'Secunderabad',
  'Secunderabad Cantonment',
];
