// Local alerts feed sources for Hyderabad
// Emergency alerts, traffic advisories, weather warnings, curfews, power outages

export interface LocalAlertSource {
  id: string;
  name: string;
  type: 'rss' | 'scrape' | 'api' | 'static';
  url: string;
  category: 'weather' | 'traffic' | 'power' | 'water' | 'health' | 'civic' | 'general';
  active: boolean;
}

export const ALERT_SOURCES: LocalAlertSource[] = [
  {
    id: 'imd-warnings',
    name: 'IMD Weather Warnings',
    type: 'api',
    url: 'https://mausam.imd.gov.in/imd_latest/contents/api.pdf',
    category: 'weather',
    active: true,
  },
  {
    id: 'hyd-traffic',
    name: 'Hyderabad Traffic Police',
    type: 'scrape',
    url: 'https://www.hyderabadtrafficpolice.gov.in',
    category: 'traffic',
    active: true,
  },
  {
    id: 'tgspdcl-outage',
    name: 'TGSPDCL Power Outages',
    type: 'scrape',
    url: 'https://webportal.tgsouthernpower.org',
    category: 'power',
    active: true,
  },
  {
    id: 'hmwssb-supply',
    name: 'HMWSSB Water Supply Alerts',
    type: 'scrape',
    url: 'https://www.hyderabadwater.gov.in',
    category: 'water',
    active: true,
  },
  {
    id: 'ghmc-notices',
    name: 'GHMC Public Notices',
    type: 'scrape',
    url: 'https://www.ghmc.gov.in',
    category: 'civic',
    active: true,
  },
  {
    id: 'cdac-ndma',
    name: 'NDMA Cyclone/Heatwave Alerts',
    type: 'api',
    url: 'https://ndma.gov.in',
    category: 'weather',
    active: true,
  },
];

// Demo seed alerts — replaced by real feeds at runtime
export const SAMPLE_ALERTS = [
  {
    id: 'alert-1',
    type: 'weather',
    severity: 'moderate',
    title: 'Thunderstorm with heavy rain expected',
    description: 'IMD has issued a thunderstorm alert for Hyderabad and surrounding districts with expected rainfall of 40-60mm in the next 24 hours.',
    source: 'IMD',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-2',
    type: 'traffic',
    severity: 'low',
    title: 'Road work on Kukatpally flyover',
    description: 'Resurfacing work in progress on the Kukatpally flyover. Expect delays between 10 PM - 5 AM for the next 3 days. Divert via KPHB colony.',
    source: 'Hyderabad Traffic Police',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-3',
    type: 'water',
    severity: 'moderate',
    title: 'Water supply interruption — Jubilee Hills',
    description: 'HMWSSB main line maintenance at Road No. 36. Water supply will be affected from 6 AM to 8 PM. Tanker services will be available on request.',
    source: 'HMWSSB',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
  },
  {
    id: 'alert-4',
    type: 'power',
    severity: 'low',
    title: 'Scheduled power outage — Gachibowli feeder',
    description: 'TGSPDCL scheduled maintenance on the Gachibowli 33kV feeder tomorrow from 10 AM - 2 PM. Affected areas: Financial District, Nanakramguda.',
    source: 'TGSPDCL',
    startTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    endTime: new Date(Date.now() + 16 * 3600 * 1000).toISOString(),
  },
];

export const ALERT_SEVERITY_COLORS: Record<string, string> = {
  low: '#60A5FA',
  moderate: '#FBBF24',
  high: '#F97316',
  severe: '#EF4444',
  critical: '#DC2626',
};
