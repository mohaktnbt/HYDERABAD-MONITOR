'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import { ALERT_SEVERITY_COLORS } from '@/config/alerts';
import { AlertTriangle } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  source: string;
  startTime: string;
  endTime: string;
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch('/api/alerts');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setAlerts(json.data.alerts);
        setStatus('live');
      } catch {
        setStatus('error');
      }
    }
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PanelCard title="Local Alerts" status={status} colSpan={1}>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {alerts.length === 0 && status === 'live' && (
          <div className="text-xs text-gray-500 text-center py-4">
            No active alerts
          </div>
        )}
        {alerts.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </div>
    </PanelCard>
  );
}

function AlertRow({ alert }: { alert: Alert }) {
  const color = ALERT_SEVERITY_COLORS[alert.severity] ?? '#9CA3AF';

  return (
    <div
      className="rounded-md border-l-2 bg-gray-900/40 px-3 py-2"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-1.5">
        <AlertTriangle size={11} style={{ color }} />
        <span className="text-[9px] uppercase tracking-wider" style={{ color }}>
          {alert.severity} • {alert.type}
        </span>
      </div>
      <div className="text-xs text-gray-200 mt-0.5 line-clamp-1">{alert.title}</div>
      <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
        {alert.description}
      </div>
      <div className="text-[9px] text-gray-600 mt-1">{alert.source}</div>
    </div>
  );
}
