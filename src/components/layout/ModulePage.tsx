'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useDashboardStore } from '@/lib/store';

export function ModulePage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useDashboardStore();

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <TopBar />
      <main
        className="mt-14 flex-1 transition-all duration-200"
        style={{ marginLeft: sidebarCollapsed ? '3.5rem' : '13rem' }}
      >
        <div className="px-6 pt-5 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-3"
          >
            <ArrowLeft size={12} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
          {description && (
            <p className="text-sm text-gray-400 mt-1 max-w-3xl">{description}</p>
          )}
        </div>
        <div className="px-6 pb-10">{children}</div>
      </main>
    </div>
  );
}
