'use client';

import { ModulePage } from '@/components/layout/ModulePage';
import { OverviewPanel } from '@/components/panels/OverviewPanel';
import { AQIPanel } from '@/components/panels/AQIPanel';
import { WeatherPanel } from '@/components/panels/WeatherPanel';
import { AlertsPanel } from '@/components/panels/AlertsPanel';

export default function OverviewPage() {
  return (
    <ModulePage
      title="City Overview"
      description="A single pane combining air quality, weather, alerts, and a composite city health score for Hyderabad."
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <OverviewPanel />
        <AQIPanel />
        <WeatherPanel />
        <AlertsPanel />
      </div>
    </ModulePage>
  );
}
