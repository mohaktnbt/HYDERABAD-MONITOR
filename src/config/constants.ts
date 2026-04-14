// ============================================================
// Polling intervals (milliseconds)
// ============================================================
export const POLL_INTERVALS = {
  FLIGHTS: 60_000,
  BUS: 60_000,
  TRAFFIC: 120_000,
  STOCKS: 300_000,
  WEATHER: 600_000,
  NEWS: 900_000,
  AQI: 1_800_000,
  SOCIAL: 1_800_000,
  TANKER: 3_600_000,
  MANDI: 86_400_000,
} as const;

// ============================================================
// Cache TTLs (seconds) — L2 Redis layer
// ============================================================
export const CACHE_TTL = {
  TRAFFIC: 90,
  WEATHER: 480,
  AQI: 1500,
  NEWS: 840,
  STOCKS: 240,
  FLIGHTS: 45,
  MANDI: 43200,
  DEFAULT: 300,
} as const;

// ============================================================
// Hyderabad coordinates
// ============================================================
export const HYDERABAD = {
  CENTER: { lat: 17.385, lng: 78.4867 } as const,
  BOUNDS: {
    north: 17.6,
    south: 17.2,
    east: 78.7,
    west: 78.2,
  } as const,
  ZOOM: 11,
} as const;

// ============================================================
// AQI breakpoints (India NAQI standard)
// ============================================================
export const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#00B050', bg: '#00B05020' },
  { max: 100, label: 'Satisfactory', color: '#92D050', bg: '#92D05020' },
  { max: 200, label: 'Moderate', color: '#FFD700', bg: '#FFD70020' },
  { max: 300, label: 'Poor', color: '#FF6600', bg: '#FF660020' },
  { max: 400, label: 'Very Poor', color: '#FF0000', bg: '#FF000020' },
  { max: 500, label: 'Severe', color: '#8B0000', bg: '#8B000020' },
] as const;

export function getAQILevel(aqi: number) {
  return AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

// ============================================================
// UI theme colors — Charminar-inspired palette
// ============================================================
export const THEME = {
  BG_PRIMARY: '#0A0A0A',
  BG_SECONDARY: '#1A1A2E',
  BG_CARD: '#111827',
  ACCENT_WARM: '#E8A87C',
  ACCENT_EARTH: '#D4A373',
  ACCENT_TEAL: '#2DD4BF',
  TEXT_PRIMARY: '#F9FAFB',
  TEXT_SECONDARY: '#9CA3AF',
  BORDER: '#374151',
  STATUS_LIVE: '#22C55E',
  STATUS_STALE: '#F59E0B',
  STATUS_ERROR: '#EF4444',
} as const;

// ============================================================
// Night mode hours (IST)
// ============================================================
export const NIGHT_MODE = {
  START_HOUR: 2, // 2 AM IST
  END_HOUR: 6,   // 6 AM IST
} as const;

export function isNightMode(): boolean {
  const now = new Date();
  const istHour = (now.getUTCHours() + 5) % 24 + (now.getUTCMinutes() >= 30 ? 1 : 0);
  return istHour >= NIGHT_MODE.START_HOUR && istHour < NIGHT_MODE.END_HOUR;
}
