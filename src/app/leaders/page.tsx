'use client';

import { useEffect, useState } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
import type { Leader } from '@/config/leaders';
import { Phone, Mail, Globe } from 'lucide-react';

const TIER_LABELS: Record<string, string> = {
  central: 'Central Government',
  state: 'Telangana State',
  city: 'Hyderabad City (GHMC)',
  admin: 'Administration & Police',
};

const PARTY_COLORS: Record<string, string> = {
  BJP: '#F97316',
  INC: '#19AAED',
  BRS: '#EC4899',
  AIMIM: '#22C55E',
};

export default function LeadersPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    fetch('/api/leaders')
      .then((r) => r.json())
      .then((json) => setLeaders(json.data.leaders));
  }, []);

  const byTier: Record<string, Leader[]> = {};
  for (const l of leaders) {
    byTier[l.tier] = byTier[l.tier] ?? [];
    byTier[l.tier].push(l);
  }

  return (
    <ModulePage
      title="Leadership"
      description="Elected representatives and senior administrators responsible for Hyderabad across central, state, city and administrative tiers."
    >
      <div className="space-y-8">
        {(['central', 'state', 'city', 'admin'] as const).map((tier) => (
          <section key={tier}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
              {TIER_LABELS[tier]}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {(byTier[tier] ?? []).map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </ModulePage>
  );
}

function LeaderCard({ leader }: { leader: Leader }) {
  const color = leader.party ? PARTY_COLORS[leader.party] ?? '#9CA3AF' : '#9CA3AF';
  const initials = leader.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-100">{leader.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{leader.role}</div>
          {leader.constituency && (
            <div className="text-[10px] text-gray-500 mt-1">{leader.constituency}</div>
          )}
        </div>
        {leader.party && (
          <span
            className="rounded px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {leader.party}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-500">
        {leader.phone && (
          <a href={`tel:${leader.phone}`} className="flex items-center gap-1 hover:text-gray-300">
            <Phone size={10} /> {leader.phone}
          </a>
        )}
        {leader.email && (
          <a href={`mailto:${leader.email}`} className="flex items-center gap-1 hover:text-gray-300">
            <Mail size={10} /> Email
          </a>
        )}
        {leader.website && (
          <a
            href={leader.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-300"
          >
            <Globe size={10} /> Site
          </a>
        )}
        {leader.since && <span className="ml-auto">since {leader.since}</span>}
      </div>
    </div>
  );
}
