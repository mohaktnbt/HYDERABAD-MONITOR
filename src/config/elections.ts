// Recent elections in Hyderabad district — 2024 Lok Sabha and 2023 Telangana Assembly
// Data sourced from Election Commission of India public results

export interface ElectionResult {
  id: string;
  year: number;
  electionType: 'lok-sabha' | 'assembly' | 'ghmc';
  constituency: string;
  winnerName: string;
  winnerParty: string;
  winnerVotes: number;
  runnerUpName: string;
  runnerUpParty: string;
  runnerUpVotes: number;
  marginVotes: number;
  turnoutPct: number;
  totalVoters: number;
}

// 2024 Lok Sabha results for Hyderabad-area constituencies
export const LOK_SABHA_2024: ElectionResult[] = [
  {
    id: 'ls-2024-hyd',
    year: 2024,
    electionType: 'lok-sabha',
    constituency: 'Hyderabad',
    winnerName: 'Asaduddin Owaisi',
    winnerParty: 'AIMIM',
    winnerVotes: 661981,
    runnerUpName: 'Madhavi Latha',
    runnerUpParty: 'BJP',
    runnerUpVotes: 323894,
    marginVotes: 338087,
    turnoutPct: 48.48,
    totalVoters: 2044931,
  },
  {
    id: 'ls-2024-sec',
    year: 2024,
    electionType: 'lok-sabha',
    constituency: 'Secunderabad',
    winnerName: 'G Kishan Reddy',
    winnerParty: 'BJP',
    winnerVotes: 479059,
    runnerUpName: 'Danam Nagender',
    runnerUpParty: 'INC',
    runnerUpVotes: 428962,
    marginVotes: 50097,
    turnoutPct: 49.59,
    totalVoters: 1886867,
  },
  {
    id: 'ls-2024-mal',
    year: 2024,
    electionType: 'lok-sabha',
    constituency: 'Malkajgiri',
    winnerName: 'Etala Rajender',
    winnerParty: 'BJP',
    winnerVotes: 989506,
    runnerUpName: 'Patnam Sunitha Mahender Reddy',
    runnerUpParty: 'INC',
    runnerUpVotes: 610161,
    marginVotes: 379345,
    turnoutPct: 50.85,
    totalVoters: 3126940,
  },
  {
    id: 'ls-2024-chv',
    year: 2024,
    electionType: 'lok-sabha',
    constituency: 'Chevella',
    winnerName: 'Konda Vishweshwar Reddy',
    winnerParty: 'BJP',
    winnerVotes: 810165,
    runnerUpName: 'G Ranjith Reddy',
    runnerUpParty: 'INC',
    runnerUpVotes: 634108,
    marginVotes: 176057,
    turnoutPct: 58.08,
    totalVoters: 2468632,
  },
];

// Party-wise summary for the state (Telangana, 17 Lok Sabha seats)
export const TELANGANA_2024_SUMMARY = [
  { party: 'INC', seats: 8, voteSharePct: 40.10, color: '#19AAED' },
  { party: 'BJP', seats: 8, voteSharePct: 35.08, color: '#F97316' },
  { party: 'AIMIM', seats: 1, voteSharePct: 2.26, color: '#22C55E' },
  { party: 'BRS', seats: 0, voteSharePct: 16.68, color: '#EC4899' },
  { party: 'Others', seats: 0, voteSharePct: 5.88, color: '#6B7280' },
];

// 2023 Telangana Assembly — party-wise state totals
export const ASSEMBLY_2023_SUMMARY = [
  { party: 'INC', seats: 64, voteSharePct: 39.40, color: '#19AAED' },
  { party: 'BRS', seats: 39, voteSharePct: 37.35, color: '#EC4899' },
  { party: 'BJP', seats: 8, voteSharePct: 13.90, color: '#F97316' },
  { party: 'AIMIM', seats: 7, voteSharePct: 2.22, color: '#22C55E' },
  { party: 'Others', seats: 1, voteSharePct: 7.13, color: '#6B7280' },
];

// Upcoming elections
export const UPCOMING_ELECTIONS = [
  {
    name: 'GHMC Council Elections',
    expectedDate: '2026',
    type: 'Municipal',
    totalSeats: 150,
  },
  {
    name: 'Telangana Legislative Assembly',
    expectedDate: '2028',
    type: 'State',
    totalSeats: 119,
  },
  {
    name: 'Lok Sabha General Elections',
    expectedDate: '2029',
    type: 'National',
    totalSeats: 543,
  },
];
