// Data fetching for the application
// This file contains functions to fetch data from the API

// Define the base URL for API requests
const baseUrl = "http://localhost:4321";

// Cache data in memory to avoid repeated fetches
const cache = new Map();
const cacheTime = 600; // 10 minutes in seconds

// Helper function to fetch data with caching
async function fetchWithCache(key: string, fetchFn: () => Promise<any>) {
  const now = Date.now();
  
  // Check if data is in cache and not expired
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (now - timestamp < cacheTime * 1000) {
      return data;
    }
  }
  
  // Fetch fresh data
  try {
    const data = await fetchFn();
    cache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
}

// Fetch store data
export const storeData = fetchWithCache('store', async () => {
  const response = await fetch(`${baseUrl}/api/store`);
  if (!response.ok) throw new Error('Failed to fetch store data');
  return await response.json();
});

// Fetch carousel images
export const carouselData = fetchWithCache('carousel', async () => {
  const response = await fetch(`${baseUrl}/api/carousel`);
  if (!response.ok) throw new Error('Failed to fetch carousel data');
  return await response.json();
});

// Fetch categories
export const categoriesData = fetchWithCache('categories', async () => {
  const response = await fetch(`${baseUrl}/api/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories data');
  return await response.json();
});

// Fetch services
export const servicesData = fetchWithCache('services', async () => {
  const response = await fetch(`${baseUrl}/api/services`);
  if (!response.ok) throw new Error('Failed to fetch services data');
  return await response.json();
});

// Fetch featured products
export const productsData = fetchWithCache('products', async () => {
  const response = await fetch(`${baseUrl}/api/products?featured=true`);
  if (!response.ok) throw new Error('Failed to fetch featured products data');
  return await response.json();
});

// Fetch all products
export const allProductsData = fetchWithCache('allProducts', async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch all products data');
  return await response.json();
});

// Fetch blog posts
export const blogPostsData = fetchWithCache('blogPosts', async () => {
  const response = await fetch(`${baseUrl}/api/blog/posts`);
  if (!response.ok) throw new Error('Failed to fetch blog posts data');
  return await response.json();
}); 