'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import { useDashboardStore } from '@/lib/store';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Gauge,
} from 'lucide-react';

export function WeatherPanel() {
  const { weatherData, setWeatherData, setLastUpdated } = useDashboardStore();
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setWeatherData(json.data);
        setLastUpdated('weather', json.timestamp);
        setStatus('live');
      } catch {
        setStatus('error');
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // 10 min
    return () => clearInterval(interval);
  }, [setWeatherData, setLastUpdated]);

  const current = weatherData?.current;
  const daily = weatherData?.daily ?? [];

  return (
    <PanelCard title="Weather Station" status={status} colSpan={1}>
      <div className="space-y-4">
        {/* Current conditions */}
        {current ? (
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-100">
                {Math.round(current.temperature)}°C
              </div>
              <div className="text-sm text-gray-400">{current.condition}</div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <MetricRow
                icon={<Droplets size={12} />}
                label="Humidity"
                value={`${current.humidity}%`}
              />
              <MetricRow
                icon={<Wind size={12} />}
                label="Wind"
                value={`${current.windSpeed} km/h`}
              />
              <MetricRow
                icon={<Gauge size={12} />}
                label="Pressure"
                value={`${Math.round(current.pressure)} hPa`}
              />
              <MetricRow
                icon={<Droplets size={12} />}
                label="Rain"
                value={`${current.precipitation} mm`}
              />
            </div>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-center text-xs text-gray-500">
            Loading weather data...
          </div>
        )}

        {/* 7-day forecast */}
        {daily.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto">
            {daily.slice(0, 7).map((day) => (
              <div
                key={day.date}
                className="flex min-w-[60px] flex-col items-center rounded-md bg-gray-900/50 px-2 py-2 text-xs"
              >
                <span className="text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    timeZone: 'Asia/Kolkata',
                  })}
                </span>
                <span className="text-gray-300 font-medium mt-1">
                  {Math.round(day.maxTemp)}°
                </span>
                <span className="text-gray-500">
                  {Math.round(day.minTemp)}°
                </span>
                {day.precipitation > 0 && (
                  <span className="text-blue-400 text-[10px] mt-0.5">
                    {day.precipitation}mm
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PanelCard>
  );
}

function MetricRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-500">{icon}</span>
      <span className="text-gray-400">{value}</span>
    </div>
  );
}
