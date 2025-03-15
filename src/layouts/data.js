import fetch from 'node-fetch';
import Redis from 'ioredis';
import dotenv from 'dotenv';

const STORENUMBER = '1719256048388139000'
const REDIS= 'redis://default:testpw@redis-17863.c282.east-us-mz.azure.redns.redis-cloud.com:17863'
const FORTIS_ENV= 'production'

let baseUrl = "https://gunstorewebsite.com";
let baseTime = 30; // 600 seconds = 10 minutes
if (FORTIS_ENV === "sandbox") {
  baseUrl = "http://localhost:3000"; 
  baseTime = 30; // 30 seconds for sandbox environment
}

let redisClient;
try {
  if (REDIS) {
    const redisUrl = new URL(REDIS);
    const redisOptions = {
      host: redisUrl.hostname,
      port: parseInt(redisUrl.port),
      password: redisUrl.password,
    };
    redisClient = new Redis(redisOptions);
  } else {
    console.log("Redis URL not provided.");
  }
} catch (error) {
  console.error('Error setting up Redis:', error);
}

const cacheData = async (cacheKey, fetchDataFunction) => {
  if (!redisClient) {
    console.log(`Redis client not available. Fetching data for ${cacheKey} directly.`);
    return await fetchDataFunction();
  }
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const data = await fetchDataFunction();
      await redisClient.setex(cacheKey, baseTime, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error(`Error accessing Redis cache for ${cacheKey}:`, error);
    return await fetchDataFunction();
  }
};

// Fetch store data
export const fetchStore = async () => {
  try {
    const url = `${baseUrl}/apistore_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch store data');
    return JSON.parse(await response.text());
  } catch (error) {
    console.error('Error fetching store data:', error);
    return { store: { storename: 'GSFire', city: 'Demo City', state: 'ST' } };
  }
};

/* Fetch carousel images data
export const fetchCarouselImages = async () => {
  try {
    const url = `${baseUrl}/apicarouselimages_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch carousel images');
    return JSON.parse(await response.text());
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    return [];
  }
};
*/

// Fetch categories data
export const fetchCategories = async () => {
  try {
    const url = `${baseUrl}/apicategory_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = JSON.parse(await response.text());
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch featured products data
export const fetchFeaturedProducts = async () => {
  try {
    const url = `${baseUrl}/apifeaturedproducts_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    const data = JSON.parse(await response.text());
    //console.log('Featured products data structure:', data);
    if (data.products && data.products.length > 0) {
      const firstProduct = data.products[0];
      //console.log('First featured product example:', firstProduct);
      //console.log('Available fields:', Object.keys(firstProduct));
      //console.log('Stock fields:', {
      //  inventory: firstProduct.inventory,
      //  productstock: firstProduct.productstock,
      //  stock: firstProduct.stock
      //});
    }
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Fetch blog posts data
export const fetchBlogPosts = async () => {
  try {
    const url = `${baseUrl}/lastfourblogposts_${STORENUMBER}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    const data = JSON.parse(await response.text());
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const storeData = await cacheData('storeData', fetchStore);
//export const carouselData = await cacheData('carouselData', fetchCarouselImages);
export const categoriesData = await cacheData('categoriesData', fetchCategories);
export const productsData = await cacheData('productsData', fetchFeaturedProducts);
export const blogPostsData = await cacheData('blogPostsData', fetchBlogPosts);