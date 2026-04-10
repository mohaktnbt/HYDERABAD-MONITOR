'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import type { CitizenService } from '@/config/services';
import { ChevronRight } from 'lucide-react';

export function ServicesPanel() {
  const [services, setServices] = useState<CitizenService[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((json) => {
        setServices(json.data.services);
        setStatus('live');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <PanelCard title="Citizen Services Guide" status={status} colSpan={1}>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {services.slice(0, 8).map((service) => (
          <a
            key={service.id}
            href={service.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md bg-gray-900/40 px-2.5 py-1.5 hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-200 truncate">{service.title}</div>
              <div className="text-[10px] text-gray-500 truncate">
                {service.department} • {service.feeInr}
              </div>
            </div>
            <ChevronRight
              size={12}
              className="text-gray-600 group-hover:text-gray-400 shrink-0"
            />
          </a>
        ))}
      </div>
    </PanelCard>
  );
}
