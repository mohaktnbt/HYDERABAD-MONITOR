'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { PanelGrid } from '@/components/layout/PanelGrid';
import { AQIPanel } from '@/components/panels/AQIPanel';
import { WeatherPanel } from '@/components/panels/WeatherPanel';
import { NewsPanel } from '@/components/panels/NewsPanel';
import { HydMap } from '@/components/map/HydMap';
import { useDashboardStore } from '@/lib/store';
import { useEffect } from 'react';
import type { PanelId } from '@/types';

export default function Dashboard() {
  const { sidebarCollapsed, mapVisible, setActivePanel } = useDashboardStore();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const panelKeys: Record<string, PanelId> = {
        '1': 'aqi',
        '2': 'weather',
        '3': 'traffic',
        '4': 'stocks',
        '5': 'news',
        '6': 'metro',
        '7': 'flights',
        '8': 'mandi',
        '9': 'water',
        '0': 'health',
      };

      if (panelKeys[e.key]) {
        setActivePanel(panelKeys[e.key]);
      }

      if (e.key === 'm' || e.key === 'M') {
        useDashboardStore.getState().toggleMap();
      }

      if (e.key === 'Escape') {
        setActivePanel(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActivePanel]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <TopBar />

      <div
        className="mt-14 flex-1 transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? '3.5rem' : '13rem' }}
      >
        {/* Map section */}
        {mapVisible && (
          <div className="p-3 pb-0">
            <HydMap />
          </div>
        )}

        {/* Panel grid */}
        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AQIPanel />
          <WeatherPanel />
          <NewsPanel />

          {/* Placeholder panels for future phases */}
          <PlaceholderPanel title="Traffic" description="TomTom congestion heatmap" />
          <PlaceholderPanel title="Stocks" description="Hyderabad equity tracker" />
          <PlaceholderPanel title="Metro" description="HMRL real-time status" />
          <PlaceholderPanel title="Flights" description="Live aircraft over RGIA" />
          <PlaceholderPanel title="Mandi" description="Commodity prices" />
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-800 border-dashed bg-[#111827]/50 p-6 text-center min-h-[180px]">
      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {title}
      </div>
      <div className="mt-1 text-[10px] text-gray-600">{description}</div>
      <div className="mt-2 text-[10px] text-gray-700">Phase 2</div>
    </div>
  );
}
