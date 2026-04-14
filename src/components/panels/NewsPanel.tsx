'use client';

import { useEffect, useState } from 'react';
import { PanelCard } from '@/components/layout/PanelGrid';
import { useDashboardStore } from '@/lib/store';
import { timeAgo } from '@/lib/utils';
import type { NewsArticle } from '@/types';

export function NewsPanel() {
  const { newsData, setNewsData, setLastUpdated } = useDashboardStore();
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setNewsData(json.data);
        setLastUpdated('news', json.timestamp);
        setStatus('live');
      } catch {
        setStatus('error');
      }
    }

    fetchNews();
    const interval = setInterval(fetchNews, 15 * 60 * 1000); // 15 min
    return () => clearInterval(interval);
  }, [setNewsData, setLastUpdated]);

  return (
    <PanelCard title="City Pulse" status={status} colSpan={2}>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {newsData.length === 0 && status === 'loading' && (
          <div className="text-xs text-gray-500 text-center py-4">
            Loading news...
          </div>
        )}
        {newsData.slice(0, 15).map((article, i) => (
          <NewsRow key={`${article.url}-${i}`} article={article} />
        ))}
      </div>
    </PanelCard>
  );
}

function NewsRow({ article }: { article: NewsArticle }) {
  const sentiment = article.sentimentScore;
  const sentimentColor =
    sentiment === null
      ? 'text-gray-500'
      : sentiment > 0.1
        ? 'text-green-400'
        : sentiment < -0.1
          ? 'text-red-400'
          : 'text-gray-400';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 rounded-md bg-gray-900/30 px-3 py-2 hover:bg-gray-800/50 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-200 leading-relaxed line-clamp-2 group-hover:text-gray-100">
          {article.title}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
            {article.source}
          </span>
          <span className="text-[10px] text-gray-600">
            {timeAgo(article.time)}
          </span>
        </div>
      </div>
      {sentiment !== null && (
        <div className={`text-[10px] font-mono ${sentimentColor} shrink-0 mt-0.5`}>
          {sentiment > 0 ? '+' : ''}
          {sentiment.toFixed(1)}
        </div>
      )}
    </a>
  );
}
