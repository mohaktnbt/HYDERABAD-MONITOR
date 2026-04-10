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
  PieChart,
  Pie,
} from 'recharts';

interface ElectionResult {
  id: string;
  year: number;
  constituency: string;
  winnerName: string;
  winnerParty: string;
  winnerVotes: number;
  runnerUpName: string;
  runnerUpParty: string;
  runnerUpVotes: number;
  marginVotes: number;
  turnoutPct: number;
  totalVoters: number;
}

interface ElectionsData {
  lokSabha2024: ElectionResult[];
  telangana2024Summary: Array<{ party: string; seats: number; voteSharePct: number; color: string }>;
  assembly2023Summary: Array<{ party: string; seats: number; voteSharePct: number; color: string }>;
  upcoming: Array<{ name: string; expectedDate: string; type: string; totalSeats: number }>;
}

export default function ElectionsPage() {
  const [data, setData] = useState<ElectionsData | null>(null);

  useEffect(() => {
    fetch('/api/elections')
      .then((r) => r.json())
      .then((json) => setData(json.data));
  }, []);

  if (!data) return <ModulePage title="Elections">Loading…</ModulePage>;

  return (
    <ModulePage
      title="Elections"
      description="Hyderabad-area Lok Sabha 2024 results, Telangana Assembly 2023 summary, and a tracker for upcoming elections."
    >
      <div className="space-y-6">
        {/* Summaries */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PartyPie
            title="Lok Sabha 2024 — Telangana (17 seats)"
            summary={data.telangana2024Summary}
            valueKey="seats"
          />
          <PartyPie
            title="Assembly 2023 — Telangana (119 seats)"
            summary={data.assembly2023Summary}
            valueKey="seats"
          />
        </div>

        {/* Constituency results */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Hyderabad-Area Lok Sabha 2024 Results
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {data.lokSabha2024.map((r) => (
              <ResultCard key={r.id} result={r} />
            ))}
          </div>
        </section>

        {/* Upcoming */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Upcoming Elections
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {data.upcoming.map((u) => (
              <div
                key={u.name}
                className="rounded-lg border border-gray-800 bg-[#111827] p-4"
              >
                <div className="text-xs text-gray-500 uppercase tracking-wider">{u.type}</div>
                <div className="text-base font-semibold text-gray-100 mt-1">{u.name}</div>
                <div className="text-sm text-gray-400 mt-1">{u.expectedDate}</div>
                <div className="text-[10px] text-gray-600 mt-2">{u.totalSeats} seats</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ModulePage>
  );
}

function PartyPie({
  title,
  summary,
}: {
  title: string;
  summary: ElectionsData['telangana2024Summary'];
  valueKey: 'seats' | 'voteSharePct';
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        {title}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-32 w-32">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={summary}
                innerRadius={34}
                outerRadius={60}
                paddingAngle={2}
                dataKey="seats"
                stroke="none"
              >
                {summary.map((entry) => (
                  <Cell key={entry.party} fill={entry.color} />
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
        <div className="flex-1 space-y-1.5">
          {summary.map((p) => (
            <div key={p.party} className="flex items-center gap-2 text-[11px]">
              <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: p.color }} />
              <span className="text-gray-300 w-14">{p.party}</span>
              <span className="text-gray-500">{p.seats} seats</span>
              <span className="text-gray-600 ml-auto tabular-nums">
                {p.voteSharePct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: ElectionResult }) {
  const PARTY_COLORS: Record<string, string> = {
    BJP: '#F97316',
    INC: '#19AAED',
    AIMIM: '#22C55E',
    BRS: '#EC4899',
  };
  const winnerColor = PARTY_COLORS[result.winnerParty] ?? '#9CA3AF';

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {result.constituency}
          </div>
          <div className="text-base font-semibold text-gray-100 mt-1">
            {result.winnerName}
          </div>
          <span
            className="inline-block mt-1 rounded px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${winnerColor}20`, color: winnerColor }}
          >
            {result.winnerParty}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500">Turnout</div>
          <div className="text-sm font-semibold text-gray-200 tabular-nums">
            {result.turnoutPct}%
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
        <div>
          <div>Winner Votes</div>
          <div className="text-gray-300 tabular-nums">
            {result.winnerVotes.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div>Margin</div>
          <div className="text-gray-300 tabular-nums">
            {result.marginVotes.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[10px] text-gray-600">
        Runner-up: {result.runnerUpName} ({result.runnerUpParty}) —{' '}
        {result.runnerUpVotes.toLocaleString('en-IN')}
      </div>
    </div>
  );
}
