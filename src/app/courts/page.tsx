'use client';

import { useEffect, useState } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import type { CourtStat } from '@/config/courts';

interface CourtsData {
  courts: CourtStat[];
  caseCategories: Array<{ category: string; pending: number; color: string }>;
  summary: {
    totalPending: number;
    totalFiled: number;
    totalDisposed: number;
    disposalRatePct: number;
    totalJudgesWorking: number;
    totalJudgesSanctioned: number;
  };
}

export default function CourtsPage() {
  const [data, setData] = useState<CourtsData | null>(null);

  useEffect(() => {
    fetch('/api/courts')
      .then((r) => r.json())
      .then((json) => setData(json.data));
  }, []);

  if (!data) return <ModulePage title="Courts & Justice">Loading…</ModulePage>;

  const vacancyPct = Math.round(
    ((data.summary.totalJudgesSanctioned - data.summary.totalJudgesWorking) /
      data.summary.totalJudgesSanctioned) *
      100
  );

  return (
    <ModulePage
      title="Courts & Justice"
      description="Telangana High Court and Hyderabad district-level court statistics: pendency, disposal rates, and judge strength."
    >
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <Metric
            label="Pending Cases"
            value={data.summary.totalPending.toLocaleString('en-IN')}
            color="#F87171"
          />
          <Metric
            label="Disposal Rate"
            value={`${data.summary.disposalRatePct}%`}
            color="#22C55E"
          />
          <Metric
            label="Judge Vacancy"
            value={`${vacancyPct}%`}
            color="#FBBF24"
          />
          <Metric
            label="Filed YTD"
            value={data.summary.totalFiled.toLocaleString('en-IN')}
            color="#60A5FA"
          />
        </div>

        {/* Pending by category */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Pending Cases by Category
          </h2>
          <div className="h-56 -mx-2">
            <ResponsiveContainer>
              <BarChart data={data.caseCategories}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                  formatter={(v) => [Number(v).toLocaleString('en-IN'), 'Pending']}
                />
                <Bar dataKey="pending" radius={[4, 4, 0, 0]}>
                  {data.caseCategories.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Court-wise table */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] overflow-hidden">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] px-4 pt-4">
            Court-wise Statistics
          </h2>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-800 text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="text-left px-4 py-2">Court</th>
                  <th className="text-right px-4 py-2">Filed</th>
                  <th className="text-right px-4 py-2">Disposed</th>
                  <th className="text-right px-4 py-2">Pending</th>
                  <th className="text-right px-4 py-2">Avg Days</th>
                  <th className="text-right px-4 py-2">Judges</th>
                </tr>
              </thead>
              <tbody>
                {data.courts.map((c) => (
                  <tr key={c.id} className="border-b border-gray-900 hover:bg-gray-900/30">
                    <td className="px-4 py-2 text-gray-200">{c.courtName}</td>
                    <td className="px-4 py-2 text-right text-gray-400 tabular-nums">
                      {c.filedYTD.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2 text-right text-green-400 tabular-nums">
                      {c.disposedYTD.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2 text-right text-red-400 tabular-nums">
                      {c.pending.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-400 tabular-nums">
                      {c.avgDaysToDispose}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-400 tabular-nums">
                      {c.judgesWorking}/{c.judgesSanctioned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModulePage>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
