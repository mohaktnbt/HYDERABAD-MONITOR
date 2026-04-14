'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import type { BudgetEntry } from '@/config/budget';

interface BudgetData {
  telangana: { fiscalYear: string; totalCr: number; sectors: BudgetEntry[] };
  ghmc: { fiscalYear: string; totalCr: number; sectors: BudgetEntry[] };
}

export function BudgetPanel() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [view, setView] = useState<'state' | 'city'>('state');
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/budget')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  const active = view === 'state' ? data?.telangana : data?.ghmc;
  const label = view === 'state' ? 'Telangana State' : 'GHMC';
  const topSectors = active?.sectors
    .slice()
    .sort((a, b) => b.allocatedCr - a.allocatedCr)
    .slice(0, 6) ?? [];

  const chartData = topSectors.map((s) => ({
    name: s.sector.split(/[\s&/(]/)[0],
    value: s.allocatedCr,
    color: s.color,
  }));

  return (
    <PanelCard title="Budget & Finance" status={status} colSpan={2}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">
            {label} FY {active?.fiscalYear}
          </div>
          <div className="text-xl font-bold text-gray-100">
            {active ? `₹${(active.totalCr / 1000).toFixed(2)}L Cr` : '—'}
          </div>
        </div>
        <div className="flex rounded-md border border-gray-800 overflow-hidden">
          <button
            onClick={() => setView('state')}
            className={`px-2.5 py-1 text-[10px] ${
              view === 'state' ? 'bg-[#E8A87C] text-black' : 'text-gray-400'
            }`}
          >
            State
          </button>
          <button
            onClick={() => setView('city')}
            className={`px-2.5 py-1 text-[10px] ${
              view === 'city' ? 'bg-[#E8A87C] text-black' : 'text-gray-400'
            }`}
          >
            GHMC
          </button>
        </div>
      </div>

      <div className="h-32 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: -10 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={70}
              tick={{ fontSize: 9, fill: '#9CA3AF' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(v) => [`₹${Number(v).toLocaleString()} Cr`, 'Allocated']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </PanelCard>
  );
}
