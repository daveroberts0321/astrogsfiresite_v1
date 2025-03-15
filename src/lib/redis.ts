import Redis from 'ioredis';
import { REDIS_URL } from '../config';

// Initialize Redis client
let redis: Redis | null = null;
let isRedisAvailable = false;

// In-memory cache as fallback
const memoryCache: Record<string, { value: any; expiry: number }> = {};

// Initialize Redis connection if REDIS_URL is provided
if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL);
    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
      isRedisAvailable = true;
    });
    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
      isRedisAvailable = false;
      console.log('⚠️ Falling back to in-memory cache');
    });
  } catch (error) {
    console.error('❌ Error initializing Redis:', error);
    console.log('⚠️ Falling back to in-memory cache');
  }
} else {
  console.log('ℹ️ Redis disabled - using in-memory cache (this is normal in development)');
}

/**
 * cacheData fetches data from Redis cache or calls the fetcher function
 * Falls back to in-memory cache if Redis is not available
 * @param key - Cache key
 * @param fetcher - Function to fetch data if not in cache
 * @param expirySeconds - Cache expiry time in seconds
 * @returns The cached or freshly fetched data
 */
export async function cacheData<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  expirySeconds: number = 3600
): Promise<T> {
  // Try to get from Redis first
  if (isRedisAvailable && redis) {
    try {
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // If not in cache, fetch the data
      const freshData = await fetcher();
      
      // Store in Redis cache
      await redis.set(key, JSON.stringify(freshData), 'EX', expirySeconds);
      
      return freshData;
    } catch (error) {
      console.error('Redis error in cacheData:', error);
      // Fall through to memory cache
    }
  }
  
  // Memory cache fallback
  const now = Date.now();
  
  // Check memory cache
  if (memoryCache[key] && memoryCache[key].expiry > now) {
    return memoryCache[key].value;
  }
  
  // Fetch fresh data
  const freshData = await fetcher();
  
  // Store in memory cache
  memoryCache[key] = {
    value: freshData,
    expiry: now + (expirySeconds * 1000)
  };
  
  return freshData;
}

/**
 * Invalidates a cache entry
 * @param key - Cache key to invalidate
 */
export async function invalidateCache(key: string): Promise<void> {
  if (isRedisAvailable && redis) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis error in invalidateCache:', error);
    }
  }
  
  // Also remove from memory cache
  if (memoryCache[key]) {
    delete memoryCache[key];
  }
}

/**
 * Closes Redis connection - call when shutting down
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    isRedisAvailable = false;
  }
} 