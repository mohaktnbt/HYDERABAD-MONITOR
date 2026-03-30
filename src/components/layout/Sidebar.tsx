'use client';

import {
  Wind,
  CloudSun,
  Car,
  TrendingUp,
  Newspaper,
  Train,
  Plane,
  Wheat,
  Droplets,
  Heart,
  Satellite,
  Building2,
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
  Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';
import type { PanelId } from '@/types';

const NAV_ITEMS: { id: PanelId; label: string; icon: React.ReactNode; key: string }[] = [
  { id: 'aqi', label: 'Air Quality', icon: <Wind size={18} />, key: '1' },
  { id: 'weather', label: 'Weather', icon: <CloudSun size={18} />, key: '2' },
  { id: 'traffic', label: 'Traffic', icon: <Car size={18} />, key: '3' },
  { id: 'stocks', label: 'Stocks', icon: <TrendingUp size={18} />, key: '4' },
  { id: 'news', label: 'News', icon: <Newspaper size={18} />, key: '5' },
  { id: 'metro', label: 'Metro', icon: <Train size={18} />, key: '6' },
  { id: 'flights', label: 'Flights', icon: <Plane size={18} />, key: '7' },
  { id: 'mandi', label: 'Mandi', icon: <Wheat size={18} />, key: '8' },
  { id: 'water', label: 'Water', icon: <Droplets size={18} />, key: '9' },
  { id: 'health', label: 'Health', icon: <Heart size={18} />, key: '0' },
  { id: 'satellite', label: 'Satellite', icon: <Satellite size={18} />, key: '' },
  { id: 'economy', label: 'Economy', icon: <Building2 size={18} />, key: '' },
  { id: 'realestate', label: 'Property', icon: <Home size={18} />, key: '' },
  { id: 'social', label: 'Social', icon: <Users size={18} />, key: '' },
];

export function Sidebar() {
  const { activePanel, setActivePanel, sidebarCollapsed, toggleSidebar, toggleMap } =
    useDashboardStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-gray-800 bg-[#0A0A0A] transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-gray-800 px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E8A87C] to-[#D4A373] text-xs font-bold text-black">
          HM
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold text-gray-100 truncate">
            Hyderabad Monitor
          </span>
        )}
      </div>

      {/* Map toggle */}
      <button
        onClick={toggleMap}
        className="flex items-center gap-3 px-3 py-2 mx-1 mt-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
        title="Toggle Map (M)"
      >
        <Map size={18} />
        {!sidebarCollapsed && <span className="text-xs">Map View</span>}
      </button>

      {/* Nav items */}
      <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto px-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              activePanel === item.id
                ? 'bg-[#E8A87C]/10 text-[#E8A87C]'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            )}
            title={`${item.label}${item.key ? ` (${item.key})` : ''}`}
          >
            {item.icon}
            {!sidebarCollapsed && (
              <span className="flex-1 truncate text-left">{item.label}</span>
            )}
            {!sidebarCollapsed && item.key && (
              <kbd className="text-[10px] text-gray-600">{item.key}</kbd>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 items-center justify-center border-t border-gray-800 text-gray-500 hover:text-gray-300"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
