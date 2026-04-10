'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';

interface CourtsData {
  summary: {
    totalPending: number;
    totalFiled: number;
    totalDisposed: number;
    disposalRatePct: number;
    totalJudgesWorking: number;
    totalJudgesSanctioned: number;
  };
  courts: Array<{
    id: string;
    courtName: string;
    pending: number;
    avgDaysToDispose: number;
    judgesWorking: number;
    judgesSanctioned: number;
  }>;
}

export function CourtsPanel() {
  const [data, setData] = useState<CourtsData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/courts')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <PanelCard title="Courts & Justice" status={status} colSpan={1}>
      {data && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat
              label="Pending Cases"
              value={`${(data.summary.totalPending / 1000).toFixed(0)}K`}
              color="#F87171"
            />
            <Stat
              label="Disposal Rate"
              value={`${data.summary.disposalRatePct}%`}
              color="#22C55E"
            />
            <Stat
              label="Judges Working"
              value={`${data.summary.totalJudgesWorking}/${data.summary.totalJudgesSanctioned}`}
              color="#60A5FA"
            />
            <Stat
              label="Filed YTD"
              value={`${(data.summary.totalFiled / 1000).toFixed(0)}K`}
              color="#FBBF24"
            />
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {data.courts.slice(0, 4).map((court) => (
              <div
                key={court.id}
                className="flex items-center justify-between rounded-md bg-gray-900/40 px-2.5 py-1.5"
              >
                <div className="text-[10px] text-gray-300 truncate flex-1">
                  {court.courtName.replace(', Hyderabad', '')}
                </div>
                <div className="text-[10px] text-gray-500 tabular-nums ml-2">
                  {(court.pending / 1000).toFixed(1)}K pending
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-md border border-gray-800 bg-gray-900/30 p-2">
      <div className="text-[9px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="text-base font-bold mt-0.5 tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
