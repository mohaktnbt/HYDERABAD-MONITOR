'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { AQIPanel } from '@/components/panels/AQIPanel';
import { WeatherPanel } from '@/components/panels/WeatherPanel';
import { NewsPanel } from '@/components/panels/NewsPanel';
import { OverviewPanel } from '@/components/panels/OverviewPanel';
import { LeadersPanel } from '@/components/panels/LeadersPanel';
import { ElectionsPanel } from '@/components/panels/ElectionsPanel';
import { SchemesPanel } from '@/components/panels/SchemesPanel';
import { BudgetPanel } from '@/components/panels/BudgetPanel';
import { CourtsPanel } from '@/components/panels/CourtsPanel';
import { ServicesPanel } from '@/components/panels/ServicesPanel';
import { PersonalitiesPanel } from '@/components/panels/PersonalitiesPanel';
import { AlertsPanel } from '@/components/panels/AlertsPanel';
import { HydMap } from '@/components/map/HydMap';
import { useDashboardStore } from '@/lib/store';
import { useEffect } from 'react';

const PANEL_SHORTCUTS: Record<string, string> = {
  '1': '/aqi',
  '2': '/weather',
  '3': '/traffic',
  '4': '/stocks',
  '5': '/news',
  '6': '/metro',
  '7': '/flights',
  '8': '/mandi',
  '9': '/water',
  '0': '/health',
};

export default function Dashboard() {
  const { sidebarCollapsed, mapVisible, toggleMap } = useDashboardStore();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (PANEL_SHORTCUTS[e.key]) {
        window.location.href = PANEL_SHORTCUTS[e.key];
      }

      if (e.key === 'm' || e.key === 'M') {
        toggleMap();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMap]);

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

        {/* Main panel grid */}
        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Top row: Overview (2 cols) + key live data */}
          <OverviewPanel />
          <AQIPanel />
          <WeatherPanel />

          {/* Governance row */}
          <BudgetPanel />
          <LeadersPanel />
          <ElectionsPanel />

          {/* Citizen row */}
          <SchemesPanel />
          <ServicesPanel />
          <CourtsPanel />
          <AlertsPanel />

          {/* News + personalities */}
          <NewsPanel />
          <PersonalitiesPanel />

          {/* Placeholder panels for future phases */}
          <PlaceholderPanel
            title="Traffic"
            description="TomTom congestion heatmap"
            href="/traffic"
          />
          <PlaceholderPanel
            title="Metro"
            description="HMRL real-time status"
            href="/metro"
          />
          <PlaceholderPanel
            title="Stocks"
            description="Hyderabad equity tracker"
            href="/stocks"
          />
          <PlaceholderPanel
            title="Flights"
            description="Live aircraft over RGIA"
            href="/flights"
          />
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-4 px-6 py-6 text-[10px] text-gray-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              Hyderabad Monitor — Real-time city intelligence for Hyderabad, India.
            </div>
            <div className="flex gap-4">
              <span>Data sources: CPCB, Open-Meteo, GDELT, GHMC, Telangana Finance, NJDG, ECI</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function PlaceholderPanel({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center rounded-lg border border-gray-800 border-dashed bg-[#111827]/50 p-6 text-center min-h-[180px] hover:border-[#E8A87C]/40 transition-colors"
    >
      <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {title}
      </div>
      <div className="mt-1 text-[10px] text-gray-600">{description}</div>
      <div className="mt-2 text-[10px] text-gray-700">Phase 2 →</div>
    </a>
  );
}
