import { getCached } from '@/lib/cache';
import { CACHE_TTL } from '@/config/constants';
import type { NewsArticle } from '@/types';

interface GDELTArticle {
  url: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
  tone: string;
}

interface GDELTResponse {
  articles: GDELTArticle[];
}

const RSS_FEEDS = [
  { name: 'The Hindu Hyderabad', url: 'https://www.thehindu.com/news/cities/Hyderabad/?service=rss' },
  { name: 'TOI Hyderabad', url: 'https://timesofindia.indiatimes.com/rssfeeds/3808275.cms' },
  { name: 'Telangana Today', url: 'https://telanganatoday.com/feed' },
  { name: 'Google News Hyderabad', url: 'https://news.google.com/rss/search?q=Hyderabad+India&hl=en-IN&gl=IN&ceid=IN:en' },
];

async function fetchFromGDELT(): Promise<NewsArticle[]> {
  try {
    const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=Hyderabad%20India&mode=artlist&format=json&maxrecords=30&sort=DateDesc';
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return [];

    const data: GDELTResponse = await res.json();
    if (!data.articles) return [];

    return data.articles.map((article) => {
      const toneParts = article.tone?.split(',') || [];
      const toneScore = parseFloat(toneParts[0]) || 0;
      // Normalize GDELT tone (-100 to 100) to sentiment (-1 to 1)
      const sentiment = Math.max(-1, Math.min(1, toneScore / 10));

      return {
        time: article.seendate
          ? `${article.seendate.slice(0, 4)}-${article.seendate.slice(4, 6)}-${article.seendate.slice(6, 8)}T${article.seendate.slice(8, 10)}:${article.seendate.slice(10, 12)}:${article.seendate.slice(12, 14)}Z`
          : new Date().toISOString(),
        source: article.domain || 'gdelt',
        title: article.title || '',
        summary: null,
        url: article.url,
        sentimentScore: sentiment,
        entities: [],
        category: 'general',
      };
    });
  } catch (err) {
    console.error('[News] GDELT fetch error:', err);
    return [];
  }
}

async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<NewsArticle[]> {
  try {
    // Use a simple XML fetch + regex parse to avoid rss-parser issues in edge runtime
    const res = await fetch(feedUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'HyderabadMonitor/1.0',
      },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const articles: NewsArticle[] = [];

    // Simple regex-based RSS parsing
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || '';

      if (title && link) {
        articles.push({
          time: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          source: sourceName,
          title: title.replace(/<[^>]*>/g, '').trim(),
          summary: description.replace(/<[^>]*>/g, '').trim().slice(0, 200) || null,
          url: link.trim(),
          sentimentScore: null,
          entities: [],
          category: 'general',
        });
      }
    }

    return articles.slice(0, 10);
  } catch (err) {
    console.error(`[News] RSS fetch error for ${sourceName}:`, err);
    return [];
  }
}

async function fetchAllNews(): Promise<NewsArticle[]> {
  const [gdeltArticles, ...rssResults] = await Promise.allSettled([
    fetchFromGDELT(),
    ...RSS_FEEDS.map((feed) => fetchRSSFeed(feed.url, feed.name)),
  ]);

  const allArticles: NewsArticle[] = [];

  if (gdeltArticles.status === 'fulfilled') {
    allArticles.push(...gdeltArticles.value);
  }
  for (const result of rssResults) {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // Sort by time descending
  unique.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return unique.slice(0, 50);
}

export async function getNewsData(): Promise<NewsArticle[]> {
  return getCached('news:hyderabad', fetchAllNews, CACHE_TTL.NEWS);
}
