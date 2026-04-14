'use client';

import { useEffect, useState, useMemo } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
import type { Scheme } from '@/config/schemes';
import { ExternalLink, Phone } from 'lucide-react';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<'all' | 'central' | 'state'>('all');

  useEffect(() => {
    fetch('/api/schemes')
      .then((r) => r.json())
      .then((json) => setSchemes(json.data.schemes));
  }, []);

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      if (level !== 'all' && s.level !== level) return false;
      if (q) {
        const ql = q.toLowerCase();
        return (
          s.name.toLowerCase().includes(ql) ||
          s.description.toLowerCase().includes(ql) ||
          s.department.toLowerCase().includes(ql)
        );
      }
      return true;
    });
  }, [schemes, q, level]);

  return (
    <ModulePage
      title="Government Schemes"
      description="Active central, Telangana state, and GHMC schemes available to Hyderabad residents. Filter by level or search by name."
    >
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search schemes..."
          className="flex-1 rounded-md border border-gray-800 bg-[#111827] px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-[#E8A87C] focus:outline-none"
        />
        <div className="flex rounded-md border border-gray-800 overflow-hidden">
          {(['all', 'central', 'state'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-2 text-xs capitalize ${
                level === l ? 'bg-[#E8A87C] text-black' : 'text-gray-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-10">
          No schemes found. Try a different search.
        </div>
      )}
    </ModulePage>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const levelColor = {
    central: '#F97316',
    state: '#22C55E',
    city: '#60A5FA',
  }[scheme.level];

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase"
          style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
        >
          {scheme.level}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-gray-500">
          {scheme.category}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-gray-100">{scheme.name}</h3>
      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{scheme.description}</p>

      <div className="mt-3 space-y-1.5 text-[10px]">
        <Row label="Benefit" value={scheme.benefit} />
        <Row label="Eligibility" value={scheme.eligibility} />
        <Row label="Department" value={scheme.department} />
        {scheme.beneficiariesLakh !== null && (
          <Row label="Beneficiaries" value={`${scheme.beneficiariesLakh} Lakh`} />
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-gray-800 pt-2">
        <a
          href={scheme.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-[#E8A87C] hover:underline"
        >
          <ExternalLink size={10} /> Apply Online
        </a>
        {scheme.helpline && (
          <a
            href={`tel:${scheme.helpline}`}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-200"
          >
            <Phone size={10} /> {scheme.helpline}
          </a>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-500 shrink-0">{label}:</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}
