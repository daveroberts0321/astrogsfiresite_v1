import Redis from 'ioredis';

const API_BASE_URL = "https://gunstorewebsite.com";
const REDIS_URL = "redis://default:testpw@redis-17863.c282.east-us-mz.azure.redns.redis-cloud.com:17863";
const CACHE_DURATION = parseInt("3600", 10);

let redis = null;
let isRedisAvailable = false;
const memoryCache = {};
{
  try {
    redis = new Redis(REDIS_URL);
    redis.on("connect", () => {
      console.log("✅ Redis connected successfully");
      isRedisAvailable = true;
    });
    redis.on("error", (err) => {
      console.error("❌ Redis connection error:", err);
      isRedisAvailable = false;
      console.log("⚠️ Falling back to in-memory cache");
    });
  } catch (error) {
    console.error("❌ Error initializing Redis:", error);
    console.log("⚠️ Falling back to in-memory cache");
  }
}
async function cacheData(key, fetcher, expirySeconds = 3600) {
  if (isRedisAvailable && redis) {
    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      const freshData2 = await fetcher();
      await redis.set(key, JSON.stringify(freshData2), "EX", expirySeconds);
      return freshData2;
    } catch (error) {
      console.error("Redis error in cacheData:", error);
    }
  }
  const now = Date.now();
  if (memoryCache[key] && memoryCache[key].expiry > now) {
    return memoryCache[key].value;
  }
  const freshData = await fetcher();
  memoryCache[key] = {
    value: freshData,
    expiry: now + expirySeconds * 1e3
  };
  return freshData;
}

export { API_BASE_URL as A, CACHE_DURATION as C, cacheData as c };
