'use client';

import { useDashboardStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function PanelGrid({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useDashboardStore();

  return (
    <main
      className={cn(
        'mt-14 transition-all duration-200',
        sidebarCollapsed ? 'ml-14' : 'ml-52'
      )}
    >
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </main>
  );
}

// Reusable panel wrapper
export function PanelCard({
  title,
  status = 'live',
  lastUpdated,
  children,
  className,
  colSpan = 1,
}: {
  title: string;
  status?: 'live' | 'stale' | 'error' | 'loading';
  lastUpdated?: string | null;
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2;
}) {
  const statusColor = {
    live: 'bg-green-500',
    stale: 'bg-yellow-500',
    error: 'bg-red-500',
    loading: 'bg-blue-500 animate-pulse',
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-gray-800 bg-[#111827] overflow-hidden',
        colSpan === 2 && 'md:col-span-2',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-800/50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className={cn('h-1.5 w-1.5 rounded-full', statusColor[status])} />
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {title}
          </h3>
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-gray-600">{lastUpdated}</span>
        )}
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
