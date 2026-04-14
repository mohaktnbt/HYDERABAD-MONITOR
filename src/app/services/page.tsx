'use client';

import { useEffect, useState, useMemo } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
import type { CitizenService } from '@/config/services';
import { ExternalLink, Phone, MapPin, Clock, IndianRupee, FileText } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<CitizenService[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((json) => setServices(json.data.services));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(services.map((s) => s.category)));
  }, [services]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (category !== 'all' && s.category !== category) return false;
      if (q) {
        const ql = q.toLowerCase();
        return (
          s.title.toLowerCase().includes(ql) ||
          s.description.toLowerCase().includes(ql) ||
          s.department.toLowerCase().includes(ql)
        );
      }
      return true;
    });
  }, [services, q, category]);

  return (
    <ModulePage
      title="Citizen Services Guide"
      description="Step-by-step guides for accessing government services available to Hyderabad residents."
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services..."
          className="flex-1 min-w-[200px] rounded-md border border-gray-800 bg-[#111827] px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-[#E8A87C] focus:outline-none"
        />
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setCategory('all')}
            className={`rounded px-2.5 py-1 text-xs ${
              category === 'all' ? 'bg-[#E8A87C] text-black' : 'bg-gray-900 text-gray-400'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded px-2.5 py-1 text-xs capitalize ${
                category === c ? 'bg-[#E8A87C] text-black' : 'bg-gray-900 text-gray-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </ModulePage>
  );
}

function ServiceCard({ service }: { service: CitizenService }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-800 bg-[#111827] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">
            {service.category}
          </div>
          <h3 className="text-sm font-semibold text-gray-100 mt-0.5">{service.title}</h3>
          <div className="text-xs text-gray-400 mt-0.5">{service.department}</div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">{service.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <IndianRupee size={10} />
          <span className="text-gray-300">{service.feeInr}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span className="text-gray-300">{service.timelineDays}</span>
        </div>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="text-[10px] text-[#E8A87C] hover:underline mt-3"
      >
        {expanded ? 'Hide steps' : 'Show how to apply →'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-gray-800 pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              Steps
            </div>
            <ol className="space-y-0.5 text-[11px] text-gray-300 list-decimal list-inside">
              {service.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              <FileText size={10} className="inline mr-1" />
              Documents Required
            </div>
            <ul className="space-y-0.5 text-[11px] text-gray-300 list-disc list-inside">
              {service.documentsRequired.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center flex-wrap gap-3 border-t border-gray-800 pt-2">
        <a
          href={service.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-[#E8A87C] hover:underline"
        >
          <ExternalLink size={10} /> Apply Online
        </a>
        {service.helpline && (
          <a
            href={`tel:${service.helpline}`}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-200"
          >
            <Phone size={10} /> {service.helpline}
          </a>
        )}
        {service.offlineLocation && (
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <MapPin size={10} /> {service.offlineLocation}
          </span>
        )}
      </div>
    </div>
  );
}
