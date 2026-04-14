'use client';

import { useEffect, useState, useMemo } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
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

export default function PersonalitiesPage() {
  const [people, setPeople] = useState<FamousPersonality[]>([]);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/personalities')
      .then((r) => r.json())
      .then((json) => setPeople(json.data.personalities));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(people.map((p) => p.category)));
  }, [people]);

  const filtered = useMemo(() => {
    if (category === 'all') return people;
    return people.filter((p) => p.category === category);
  }, [people, category]);

  return (
    <ModulePage
      title="Famous Hyderabadis"
      description="Notable personalities born in or strongly associated with Hyderabad — across sports, cinema, business, science, and more."
    >
      <div className="mb-4 flex flex-wrap gap-1">
        <button
          onClick={() => setCategory('all')}
          className={`rounded px-2.5 py-1 text-xs ${
            category === 'all' ? 'bg-[#E8A87C] text-black' : 'bg-gray-900 text-gray-400'
          }`}
        >
          All ({people.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded px-2.5 py-1 text-xs capitalize ${
              category === c ? 'bg-[#E8A87C] text-black' : 'bg-gray-900 text-gray-400'
            }`}
          >
            {c} ({people.filter((p) => p.category === c).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PersonCard key={p.id} person={p} />
        ))}
      </div>
    </ModulePage>
  );
}

function PersonCard({ person }: { person: FamousPersonality }) {
  const color = CATEGORY_COLORS[person.category] ?? '#9CA3AF';
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-100">{person.name}</div>
          <span
            className="inline-block mt-1 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {person.category}
          </span>
          {person.bornYear && (
            <span className="ml-1.5 text-[10px] text-gray-500">b. {person.bornYear}</span>
          )}
        </div>
      </div>
      <div className="mt-3 text-[11px] text-[#E8A87C] italic">{person.notable}</div>
      <p className="mt-2 text-xs text-gray-400 leading-relaxed">{person.bio}</p>
    </div>
  );
}
