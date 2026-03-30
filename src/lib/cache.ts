import { getRedis } from './redis';
import { CACHE_TTL } from '@/config/constants';

// ============================================================
// L1: In-memory cache (per-process, 30s default TTL)
// ============================================================
const memoryCache = new Map<string, { data: string; expiresAt: number }>();

function getFromMemory(key: string): string | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setInMemory(key: string, data: string, ttlSeconds: number): void {
  const memTtl = Math.min(ttlSeconds, 30); // L1 max 30s
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + memTtl * 1000,
  });
}

// ============================================================
// L2: Redis cache
// ============================================================
async function getFromRedis(key: string): Promise<string | null> {
  try {
    const redis = getRedis();
    return await redis.get(`hydmon:${key}`);
  } catch {
    return null;
  }
}

async function setInRedis(key: string, data: string, ttlSeconds: number): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(`hydmon:${key}`, ttlSeconds, data);
  } catch {
    // Redis unavailable — degrade gracefully
  }
}

// ============================================================
// 3-tier cache: Memory → Redis → Fetch
// ============================================================
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.DEFAULT
): Promise<T> {
  // L1: In-memory
  const memHit = getFromMemory(key);
  if (memHit) return JSON.parse(memHit) as T;

  // L2: Redis
  const redisHit = await getFromRedis(key);
  if (redisHit) {
    setInMemory(key, redisHit, ttlSeconds);
    return JSON.parse(redisHit) as T;
  }

  // L3: Fetch from source
  const data = await fetcher();
  const serialized = JSON.stringify(data);
  setInMemory(key, serialized, ttlSeconds);
  await setInRedis(key, serialized, ttlSeconds);
  return data;
}

export function invalidateCache(key: string): void {
  memoryCache.delete(key);
  getFromRedis(key).catch(() => {}); // best effort
  try {
    const redis = getRedis();
    redis.del(`hydmon:${key}`).catch(() => {});
  } catch {
    // ignore
  }
}
