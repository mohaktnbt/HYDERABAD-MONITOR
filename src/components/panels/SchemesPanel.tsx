'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import type { Scheme } from '@/config/schemes';
import { ExternalLink } from 'lucide-react';

export function SchemesPanel() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/schemes')
      .then((r) => r.json())
      .then((json) => {
        setSchemes(json.data.schemes);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  const top = schemes.slice(0, 6);

  return (
    <PanelCard title="Government Schemes" status={status} colSpan={1}>
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {top.map((scheme) => (
          <SchemeRow key={scheme.id} scheme={scheme} />
        ))}
      </div>
      <div className="mt-2 text-[10px] text-gray-500">
        {schemes.length} active schemes available
      </div>
    </PanelCard>
  );
}

function SchemeRow({ scheme }: { scheme: Scheme }) {
  const levelBadge = {
    central: { label: 'Central', color: '#F97316' },
    state: { label: 'State', color: '#22C55E' },
    city: { label: 'GHMC', color: '#60A5FA' },
  }[scheme.level];

  return (
    <a
      href={scheme.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-md bg-gray-900/50 px-3 py-2 hover:bg-gray-800/70 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="rounded px-1 py-0.5 text-[8px] font-semibold uppercase"
              style={{ backgroundColor: `${levelBadge.color}20`, color: levelBadge.color }}
            >
              {levelBadge.label}
            </span>
            <span className="text-xs text-gray-200 truncate font-medium">
              {scheme.name}
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
            {scheme.benefit}
          </div>
        </div>
        <ExternalLink
          size={11}
          className="text-gray-600 group-hover:text-gray-400 shrink-0 mt-0.5"
        />
      </div>
    </a>
  );
}
