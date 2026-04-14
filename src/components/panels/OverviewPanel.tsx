'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import type { CityHealthScore } from '@/lib/health-score';

interface OverviewData {
  health: CityHealthScore;
  snapshot: {
    avgAqi: number | null;
    activeStations: number;
    temperature: number | null;
    humidity: number | null;
    condition: string | null;
  };
}

export function OverviewPanel() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch('/api/overview');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setData(json.data);
        setStatus('live');
      } catch {
        setStatus('error');
      }
    }
    fetchOverview();
    const interval = setInterval(fetchOverview, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const score = data?.health.overall ?? 0;
  const grade = data?.health.grade ?? '—';

  const scoreColor =
    score >= 75 ? '#22C55E' : score >= 60 ? '#FBBF24' : score >= 45 ? '#F97316' : '#EF4444';

  return (
    <PanelCard title="City Health Score" status={status} colSpan={2}>
      <div className="flex items-start gap-4">
        {/* Big score */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-4 min-w-[120px]">
          <div className="text-[10px] uppercase tracking-widest text-gray-500">
            Overall
          </div>
          <div className="text-5xl font-bold tabular-nums" style={{ color: scoreColor }}>
            {score || '--'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Grade <span style={{ color: scoreColor }}>{grade}</span>
          </div>
        </div>

        {/* Components */}
        <div className="flex-1 space-y-1.5">
          {data?.health.components &&
            Object.entries(data.health.components).map(([key, value]) => (
              <ComponentRow key={key} label={labelFor(key)} value={value} />
            ))}
        </div>
      </div>

      {data?.health.narrative && (
        <div className="mt-3 rounded-md border border-gray-800 bg-gray-900/40 p-2.5">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">
            Daily Brief
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{data.health.narrative}</p>
        </div>
      )}
    </PanelCard>
  );
}

function ComponentRow({ label, value }: { label: string; value: number }) {
  const color =
    value >= 75 ? '#22C55E' : value >= 60 ? '#FBBF24' : value >= 45 ? '#F97316' : '#EF4444';

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] tabular-nums w-8 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function labelFor(key: string): string {
  const map: Record<string, string> = {
    airQuality: 'Air Quality',
    weather: 'Weather',
    waterAvailability: 'Water',
    mobility: 'Mobility',
    safety: 'Safety',
    governance: 'Governance',
    economy: 'Economy',
  };
  return map[key] ?? key;
}
