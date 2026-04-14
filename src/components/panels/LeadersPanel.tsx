'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import type { Leader } from '@/config/leaders';

interface LeadersData {
  leaders: Leader[];
  counts: { total: number; central: number; state: number; city: number; admin: number };
}

export function LeadersPanel() {
  const [data, setData] = useState<LeadersData | null>(null);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/leaders')
      .then((r) => r.json())
      .then((json) => {
        setData(json.data);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  const topLeaders = data?.leaders.slice(0, 8) ?? [];

  return (
    <PanelCard title="Leadership" status={status} colSpan={1}>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {topLeaders.map((leader) => (
          <LeaderRow key={leader.id} leader={leader} />
        ))}
      </div>
      {data && (
        <div className="mt-3 flex gap-2 text-[10px] text-gray-500">
          <span>{data.counts.central} MP</span>
          <span>•</span>
          <span>{data.counts.state} State</span>
          <span>•</span>
          <span>{data.counts.city} City</span>
        </div>
      )}
    </PanelCard>
  );
}

function LeaderRow({ leader }: { leader: Leader }) {
  const partyColor: Record<string, string> = {
    BJP: '#F97316',
    INC: '#19AAED',
    BRS: '#EC4899',
    AIMIM: '#22C55E',
  };
  const color = leader.party ? partyColor[leader.party] ?? '#9CA3AF' : '#9CA3AF';

  return (
    <div className="flex items-center justify-between rounded-md bg-gray-900/50 px-3 py-2">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-200 truncate font-medium">{leader.name}</div>
        <div className="text-[10px] text-gray-500 truncate">{leader.role}</div>
      </div>
      {leader.party && (
        <span
          className="ml-2 rounded px-1.5 py-0.5 text-[9px] font-semibold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {leader.party}
        </span>
      )}
    </div>
  );
}
