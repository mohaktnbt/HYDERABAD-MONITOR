// ============================================================
// Hyderabad Monitor — Core Type Definitions
// ============================================================

// --- AQI ---
export interface AQIReading {
  time: string;
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  so2: number | null;
  co: number | null;
  o3: number | null;
  nh3: number | null;
  aqi: number | null;
  source: string;
}

export interface AQIStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city: string;
}

// --- Weather ---
export interface WeatherReading {
  time: string;
  source: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDir: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
}

export interface WeatherForecast {
  current: WeatherReading;
  hourly: WeatherReading[];
  daily: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  condition: string;
  windSpeed: number;
}

// --- News ---
export interface NewsArticle {
  time: string;
  source: string;
  title: string;
  summary: string | null;
  url: string;
  sentimentScore: number | null;
  entities: string[];
  category: string | null;
}

// --- Traffic ---
export interface TrafficFlow {
  time: string;
  segmentId: string;
  roadName: string;
  latitude: number;
  longitude: number;
  currentSpeed: number;
  freeFlowSpeed: number;
  congestion: number;
  source: string;
}

// --- Stocks ---
export interface StockPrice {
  time: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  marketCap?: number;
}

// --- Mandi ---
export interface MandiPrice {
  time: string;
  market: string;
  commodity: string;
  variety: string | null;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
}

// --- Flights ---
export interface FlightPosition {
  time: string;
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  onGround: boolean;
}

// --- SSE ---
export type SSEChannel =
  | 'aqi'
  | 'weather'
  | 'news'
  | 'traffic'
  | 'stocks'
  | 'flights'
  | 'mandi';

export interface SSEMessage {
  channel: SSEChannel;
  data: unknown;
  timestamp: string;
}

// --- Dashboard ---
export type PanelId =
  | 'aqi'
  | 'weather'
  | 'traffic'
  | 'stocks'
  | 'news'
  | 'metro'
  | 'flights'
  | 'mandi'
  | 'water'
  | 'health'
  | 'satellite'
  | 'economy'
  | 'realestate'
  | 'social';

export interface PanelConfig {
  id: PanelId;
  title: string;
  icon: string;
  refreshInterval: number; // ms
  status: 'live' | 'stale' | 'error' | 'loading';
  lastUpdated: string | null;
}

// --- Cache ---
export interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  ttl: number;
}
