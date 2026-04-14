'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
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
  Landmark,
  Vote,
  HandCoins,
  Wallet,
  Gavel,
  FileText,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/lib/store';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  key?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
      { href: '/overview', label: 'City Health', icon: <Map size={16} /> },
      { href: '/alerts', label: 'Local Alerts', icon: <AlertTriangle size={16} /> },
    ],
  },
  {
    label: 'Live Data',
    items: [
      { href: '/aqi', label: 'Air Quality', icon: <Wind size={16} />, key: '1' },
      { href: '/weather', label: 'Weather', icon: <CloudSun size={16} />, key: '2' },
      { href: '/water', label: 'Water', icon: <Droplets size={16} />, key: '9' },
      { href: '/traffic', label: 'Traffic', icon: <Car size={16} />, key: '3' },
      { href: '/metro', label: 'Metro', icon: <Train size={16} />, key: '6' },
      { href: '/flights', label: 'Flights', icon: <Plane size={16} />, key: '7' },
      { href: '/news', label: 'News', icon: <Newspaper size={16} />, key: '5' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/leaders', label: 'Leadership', icon: <Landmark size={16} /> },
      { href: '/elections', label: 'Elections', icon: <Vote size={16} /> },
      { href: '/budget', label: 'Budget', icon: <Wallet size={16} /> },
      { href: '/courts', label: 'Courts', icon: <Gavel size={16} /> },
    ],
  },
  {
    label: 'Citizen',
    items: [
      { href: '/schemes', label: 'Schemes', icon: <HandCoins size={16} /> },
      { href: '/services', label: 'Services', icon: <FileText size={16} /> },
      { href: '/health', label: 'Health', icon: <Heart size={16} />, key: '0' },
      { href: '/personalities', label: 'Personalities', icon: <Star size={16} /> },
    ],
  },
  {
    label: 'Markets',
    items: [
      { href: '/stocks', label: 'Stocks', icon: <TrendingUp size={16} />, key: '4' },
      { href: '/mandi', label: 'Mandi', icon: <Wheat size={16} />, key: '8' },
      { href: '/economy', label: 'Economy', icon: <Building2 size={16} /> },
      { href: '/realestate', label: 'Property', icon: <Home size={16} /> },
    ],
  },
  {
    label: 'Other',
    items: [
      { href: '/satellite', label: 'Satellite', icon: <Satellite size={16} /> },
      { href: '/social', label: 'Social', icon: <Users size={16} /> },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, toggleMap } = useDashboardStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-gray-800 bg-[#0A0A0A] transition-all duration-200',
        sidebarCollapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex h-14 items-center gap-2 border-b border-gray-800 px-3"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E8A87C] to-[#D4A373] text-xs font-bold text-black">
          HM
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-semibold text-gray-100 truncate">
            Hyderabad Monitor
          </span>
        )}
      </Link>

      {/* Map toggle */}
      <button
        onClick={toggleMap}
        className="flex items-center gap-3 px-3 py-2 mx-1 mt-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
        title="Toggle Map (M)"
      >
        <Map size={16} />
        {!sidebarCollapsed && <span className="text-xs">Map View</span>}
      </button>

      {/* Nav groups */}
      <nav className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto px-1 pb-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mt-2">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[9px] font-semibold uppercase tracking-widest text-gray-600">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-1.5 text-xs transition-colors',
                    isActive
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
                    <kbd className="text-[9px] text-gray-600">{item.key}</kbd>
                  )}
                </Link>
              );
            })}
          </div>
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
