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
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
} from 'recharts';
import type { BudgetEntry } from '@/config/budget';

interface BudgetData {
  telangana: {
    fiscalYear: string;
    totalCr: number;
    sectors: BudgetEntry[];
    trend: Array<{ fy: string; totalCr: number; revenueCr: number; capitalCr: number }>;
  };
  ghmc: {
    fiscalYear: string;
    totalCr: number;
    sectors: BudgetEntry[];
    revenueSources: Array<{ source: string; amountCr: number; color: string }>;
    totalRevenueCr: number;
  };
}

export default function BudgetPage() {
  const [data, setData] = useState<BudgetData | null>(null);

  useEffect(() => {
    fetch('/api/budget')
      .then((r) => r.json())
      .then((json) => setData(json.data));
  }, []);

  if (!data) return <ModulePage title="Budget & Finance">Loading…</ModulePage>;

  return (
    <ModulePage
      title="Budget & Finance"
      description="Telangana state budget allocation and GHMC municipal budget breakdown, with multi-year trends."
    >
      <div className="space-y-6">
        {/* Top-line metrics */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <MetricCard
            label={`Telangana FY ${data.telangana.fiscalYear}`}
            value={`₹${(data.telangana.totalCr / 1000).toFixed(2)}L Cr`}
            description="Total state budget outlay"
            color="#E8A87C"
          />
          <MetricCard
            label={`GHMC FY ${data.ghmc.fiscalYear}`}
            value={`₹${data.ghmc.totalCr.toLocaleString()} Cr`}
            description="Municipal spending plan"
            color="#22D3EE"
          />
          <MetricCard
            label="GHMC Revenue"
            value={`₹${data.ghmc.totalRevenueCr.toLocaleString()} Cr`}
            description="Revenue from all sources"
            color="#4ADE80"
          />
        </div>

        {/* Telangana trend */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Telangana Budget Trend (₹ Crore)
          </h2>
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={data.telangana.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="fy" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalCr"
                  name="Total"
                  stroke="#E8A87C"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="revenueCr"
                  name="Revenue"
                  stroke="#22D3EE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="capitalCr"
                  name="Capital"
                  stroke="#A78BFA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Telangana sector breakdown */}
        <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Telangana {data.telangana.fiscalYear} — Sectoral Allocation
          </h2>
          <div className="h-80 -mx-2">
            <ResponsiveContainer>
              <BarChart
                data={data.telangana.sectors
                  .slice()
                  .sort((a, b) => b.allocatedCr - a.allocatedCr)}
                layout="vertical"
                margin={{ left: 60 }}
              >
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis
                  type="category"
                  dataKey="sector"
                  width={180}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
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
                <Bar dataKey="allocatedCr" radius={[0, 4, 4, 0]}>
                  {data.telangana.sectors.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GHMC revenue pie */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
              GHMC Revenue Sources (₹ Cr)
            </h2>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.ghmc.revenueSources}
                    innerRadius={40}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="amountCr"
                    nameKey="source"
                    stroke="none"
                  >
                    {data.ghmc.revenueSources.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
              {data.ghmc.revenueSources.map((s) => (
                <div key={s.source} className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-sm shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-gray-400 truncate">{s.source}</span>
                  <span className="text-gray-200 ml-auto tabular-nums">₹{s.amountCr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GHMC sector breakdown */}
          <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
              GHMC {data.ghmc.fiscalYear} Allocations
            </h2>
            <div className="h-64 -mx-2">
              <ResponsiveContainer>
                <BarChart
                  data={data.ghmc.sectors
                    .slice()
                    .sort((a, b) => b.allocatedCr - a.allocatedCr)}
                  layout="vertical"
                  margin={{ left: 30 }}
                >
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                  <YAxis
                    type="category"
                    dataKey="sector"
                    width={140}
                    tick={{ fontSize: 9, fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                    formatter={(v) => [`₹${Number(v)} Cr`, 'Allocated']}
                  />
                  <Bar dataKey="allocatedCr" radius={[0, 4, 4, 0]}>
                    {data.ghmc.sectors.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </ModulePage>
  );
}

function MetricCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1 tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] text-gray-500 mt-1">{description}</div>
    </div>
  );
}
