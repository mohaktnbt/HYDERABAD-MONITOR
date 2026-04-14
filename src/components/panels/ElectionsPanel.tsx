'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ElectionsData {
  telangana2024Summary: Array<{ party: string; seats: number; voteSharePct: number; color: string }>;
  upcoming: Array<{ name: string; expectedDate: string; type: string; totalSeats: number }>;
}

export function ElectionsPanel() {
  const [data, setData] = useState<ElectionsData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/elections')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  const pieData = data?.telangana2024Summary.map((p) => ({
    name: p.party,
    value: p.voteSharePct,
    color: p.color,
  })) ?? [];

  return (
    <PanelCard title="Elections — 2024 LS (Telangana)" status={status} colSpan={1}>
      <div className="h-32 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={30}
              outerRadius={55}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(v) => [`${v}%`, 'Vote Share']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
        {data?.telangana2024Summary.map((p) => (
          <div key={p.party} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: p.color }} />
            <span className="text-gray-400">{p.party}</span>
            <span className="text-gray-200 ml-auto tabular-nums">{p.seats}</span>
          </div>
        ))}
      </div>

      {data?.upcoming[0] && (
        <div className="mt-3 rounded-md border border-gray-800 bg-gray-900/30 px-2.5 py-1.5">
          <div className="text-[9px] uppercase tracking-wider text-gray-500">
            Next Election
          </div>
          <div className="text-xs text-gray-200 mt-0.5">
            {data.upcoming[0].name} — {data.upcoming[0].expectedDate}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
