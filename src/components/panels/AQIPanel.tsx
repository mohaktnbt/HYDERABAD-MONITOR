'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import { getAQILevel } from '@/config/constants';
import { timeAgo } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';
import type { AQIReading } from '@/types';

export function AQIPanel() {
  const { aqiData, setAQIData, setLastUpdated } = useDashboardStore();
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    async function fetchAQI() {
      try {
        const res = await fetch('/api/aqi');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setAQIData(json.data);
        setLastUpdated('aqi', json.timestamp);
        setStatus('live');
      } catch {
        setStatus('error');
      }
    }

    fetchAQI();
    const interval = setInterval(fetchAQI, 30 * 60 * 1000); // 30 min
    return () => clearInterval(interval);
  }, [setAQIData, setLastUpdated]);

  // Calculate city average
  const validReadings = aqiData.filter((r) => r.aqi != null);
  const avgAQI = validReadings.length
    ? Math.round(validReadings.reduce((sum, r) => sum + (r.aqi ?? 0), 0) / validReadings.length)
    : 0;
  const level = getAQILevel(avgAQI);

  return (
    <PanelCard title="AQI Monitor" status={status} colSpan={1}>
      <div className="space-y-4">
        {/* City average */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold"
            style={{ backgroundColor: level.bg, color: level.color }}
          >
            {avgAQI || '--'}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-200" style={{ color: level.color }}>
              {level.label}
            </div>
            <div className="text-xs text-gray-500">
              City Avg | {validReadings.length} stations
            </div>
          </div>
        </div>

        {/* Station list */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {aqiData.slice(0, 8).map((station) => (
            <StationRow key={station.stationId} station={station} />
          ))}
        </div>
      </div>
    </PanelCard>
  );
}

function StationRow({ station }: { station: AQIReading }) {
  const aqi = station.aqi ?? 0;
  const level = getAQILevel(aqi);

  return (
    <div className="flex items-center justify-between rounded-md bg-gray-900/50 px-3 py-1.5">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-300 truncate">{station.stationName}</div>
        <div className="text-[10px] text-gray-500">
          PM2.5: {station.pm25 ?? '--'} | PM10: {station.pm10 ?? '--'}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: level.color }}
        >
          {aqi || '--'}
        </span>
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: level.color }}
        />
      </div>
    </div>
  );
}
