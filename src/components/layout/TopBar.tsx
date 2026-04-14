'use client';

import { useEffect, useState } from 'react';
import { Activity, Bell, Wifi, WifiOff } from 'lucide-react';
import { useDashboardStore } from '@/lib/store';

export function TopBar() {
  const { sidebarCollapsed, lastUpdated } = useDashboardStore();
  const [time, setTime] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Kolkata',
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setConnected(true);
  }, []);

  const updatedCount = Object.keys(lastUpdated).length;

  return (
    <header
      className="fixed top-0 right-0 z-30 flex h-14 items-center justify-between border-b border-gray-800 bg-[#0A0A0A]/95 backdrop-blur-sm px-4"
      style={{ left: sidebarCollapsed ? '3.5rem' : '13rem' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#E8A87C]" />
          <span className="text-xs text-gray-400">
            {updatedCount} sources active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          {connected ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
          <span className="text-[10px] text-gray-500">
            {connected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>

        {/* Alerts */}
        <button className="relative p-1 text-gray-400 hover:text-gray-200">
          <Bell size={16} />
        </button>

        {/* IST Clock */}
        <div className="flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1.5">
          <span className="font-mono text-sm text-[#E8A87C]">{time}</span>
          <span className="text-[10px] text-gray-500">IST</span>
        </div>
      </div>
    </header>
  );
}
