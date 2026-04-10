'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import type { FamousPersonality } from '@/config/personalities';

const CATEGORY_COLORS: Record<string, string> = {
  sports: '#22C55E',
  cinema: '#EC4899',
  politics: '#F97316',
  science: '#60A5FA',
  business: '#FBBF24',
  literature: '#A78BFA',
  music: '#34D399',
  other: '#9CA3AF',
};

export function PersonalitiesPanel() {
  const [people, setPeople] = useState<FamousPersonality[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/personalities')
      .then((r) => r.json())
      .then((json) => {
        setPeople(json.data.personalities);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <PanelCard title="Famous Hyderabadis" status={status} colSpan={1}>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {people.slice(0, 8).map((p) => (
          <PersonRow key={p.id} person={p} />
        ))}
      </div>
      <div className="mt-2 text-[10px] text-gray-500">
        {people.length} notable personalities
      </div>
    </PanelCard>
  );
}

function PersonRow({ person }: { person: FamousPersonality }) {
  const color = CATEGORY_COLORS[person.category] ?? '#9CA3AF';
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="flex items-center gap-2.5 rounded-md bg-gray-900/40 px-2 py-1.5">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-200 truncate font-medium">{person.name}</div>
        <div className="text-[10px] text-gray-500 truncate">{person.notable}</div>
      </div>
    </div>
  );
}
