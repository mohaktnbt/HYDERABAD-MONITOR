import { getCached } from '@/lib/cache';
import { CACHE_TTL } from '@/config/constants';
import { AQI_STATIONS } from '@/config/stations';
import type { AQIReading } from '@/types';

interface CPCBRecord {
  id: string;
  country: string;
  state: string;
  city: string;
  station: string;
  last_update: string;
  pollutant_id: string;
  pollutant_min: string;
  pollutant_max: string;
  pollutant_avg: string;
}

interface CPCBResponse {
  records: CPCBRecord[];
  total: number;
  count: number;
}

// Fetch AQI data from CPCB via data.gov.in
async function fetchFromCPCB(): Promise<AQIReading[]> {
  const apiKey = process.env.DATA_GOV_IN_API_KEY;
  if (!apiKey) {
    console.warn('[AQI] DATA_GOV_IN_API_KEY not set, using mock data');
    return getMockAQIData();
  }

  const url = `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=${apiKey}&format=json&filters[city]=Hyderabad&limit=200`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`CPCB API error: ${res.status}`);
  }

  const data: CPCBResponse = await res.json();

  // Group records by station
  const stationMap = new Map<string, Partial<AQIReading>>();

  for (const record of data.records) {
    const stationInfo = AQI_STATIONS.find((s) =>
      record.station.toLowerCase().includes(s.name.split(',')[0].toLowerCase())
    );

    const stationId = stationInfo?.id || record.station.replace(/\s+/g, '_').toLowerCase();
    if (!stationMap.has(stationId)) {
      stationMap.set(stationId, {
        time: record.last_update || new Date().toISOString(),
        stationId,
        stationName: record.station,
        latitude: stationInfo?.latitude || 17.385,
        longitude: stationInfo?.longitude || 78.4867,
        source: 'cpcb',
      });
    }

    const reading = stationMap.get(stationId)!;
    const avg = parseFloat(record.pollutant_avg) || null;
    switch (record.pollutant_id?.toUpperCase()) {
      case 'PM2.5': reading.pm25 = avg; break;
      case 'PM10': reading.pm10 = avg; break;
      case 'NO2': reading.no2 = avg; break;
      case 'SO2': reading.so2 = avg; break;
      case 'CO': reading.co = avg; break;
      case 'OZONE':
      case 'O3': reading.o3 = avg; break;
      case 'NH3': reading.nh3 = avg; break;
    }
  }

  // Calculate AQI based on PM2.5 (simplified)
  return Array.from(stationMap.values()).map((r) => ({
    time: r.time || new Date().toISOString(),
    stationId: r.stationId || '',
    stationName: r.stationName || '',
    latitude: r.latitude || 17.385,
    longitude: r.longitude || 78.4867,
    pm25: r.pm25 ?? null,
    pm10: r.pm10 ?? null,
    no2: r.no2 ?? null,
    so2: r.so2 ?? null,
    co: r.co ?? null,
    o3: r.o3 ?? null,
    nh3: r.nh3 ?? null,
    aqi: r.pm25 ? calculateAQI(r.pm25) : null,
    source: 'cpcb',
  }));
}

// India NAQI AQI calculation from PM2.5 (simplified breakpoint interpolation)
function calculateAQI(pm25: number): number {
  const breakpoints = [
    { lo: 0, hi: 30, aqiLo: 0, aqiHi: 50 },
    { lo: 31, hi: 60, aqiLo: 51, aqiHi: 100 },
    { lo: 61, hi: 90, aqiLo: 101, aqiHi: 200 },
    { lo: 91, hi: 120, aqiLo: 201, aqiHi: 300 },
    { lo: 121, hi: 250, aqiLo: 301, aqiHi: 400 },
    { lo: 251, hi: 500, aqiLo: 401, aqiHi: 500 },
  ];
  for (const bp of breakpoints) {
    if (pm25 <= bp.hi) {
      return Math.round(
        ((bp.aqiHi - bp.aqiLo) / (bp.hi - bp.lo)) * (pm25 - bp.lo) + bp.aqiLo
      );
    }
  }
  return 500;
}

function getMockAQIData(): AQIReading[] {
  return AQI_STATIONS.map((station) => {
    const pm25 = Math.round(30 + Math.random() * 80);
    return {
      time: new Date().toISOString(),
      stationId: station.id,
      stationName: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      pm25,
      pm10: Math.round(pm25 * 1.5 + Math.random() * 30),
      no2: Math.round(15 + Math.random() * 40),
      so2: Math.round(5 + Math.random() * 20),
      co: Math.round(5 + Math.random() * 15) / 10,
      o3: Math.round(20 + Math.random() * 50),
      nh3: Math.round(5 + Math.random() * 25),
      aqi: calculateAQI(pm25),
      source: 'mock',
    };
  });
}

export async function getAQIData(): Promise<AQIReading[]> {
  return getCached('aqi:hyderabad', fetchFromCPCB, CACHE_TTL.AQI);
}
