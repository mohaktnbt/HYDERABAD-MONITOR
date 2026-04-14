'use client';

import { useEffect, useState } from 'react';
import { ModulePage } from '@/components/layout/ModulePage';
import { AlertTriangle } from 'lucide-react';
import { ALERT_SEVERITY_COLORS, ALERT_SOURCES } from '@/config/alerts';
import { timeAgo } from '@/lib/utils';

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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((json) => setAlerts(json.data.alerts));
  }, []);

  return (
    <ModulePage
      title="Local Alerts"
      description="Emergency alerts, traffic advisories, weather warnings, water and power disruptions for Hyderabad."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main alerts feed */}
        <div className="lg:col-span-2 space-y-3">
          {alerts.length === 0 && (
            <div className="rounded-lg border border-gray-800 bg-[#111827] p-8 text-center">
              <div className="text-sm text-gray-500">No active alerts for Hyderabad</div>
            </div>
          )}
          {alerts.map((alert) => {
            const color = ALERT_SEVERITY_COLORS[alert.severity] ?? '#9CA3AF';
            return (
              <div
                key={alert.id}
                className="rounded-lg border-l-4 border-gray-800 bg-[#111827] p-4"
                style={{ borderLeftColor: color }}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color }} />
                  <span
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color }}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-gray-500">• {alert.type}</span>
                  <span className="text-[10px] text-gray-600 ml-auto">
                    {timeAgo(alert.startTime)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mt-1">{alert.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                <div className="text-[10px] text-gray-600 mt-2">Source: {alert.source}</div>
              </div>
            );
          })}
        </div>

        {/* Sidebar: alert sources */}
        <aside>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#E8A87C] mb-3">
            Alert Sources
          </h2>
          <div className="space-y-2">
            {ALERT_SOURCES.map((src) => (
              <div
                key={src.id}
                className="rounded-lg border border-gray-800 bg-[#111827] p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-200 font-medium">{src.name}</div>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      src.active ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-gray-500 mt-1 capitalize">
                  {src.category} • {src.type}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </ModulePage>
  );
}
