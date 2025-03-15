/**
 * Application configuration
 * Environment variables should be set in .env file or hosting platform
 */

// API endpoints
export const API_BASE_URL = import.meta.env.API_BASE_URL || 'https://gunstorewebsite.com';

// Redis configuration
// Check for both REDIS_URL and legacy REDIS environment variables
export const REDIS_URL = import.meta.env.REDIS_URL || import.meta.env.REDIS || '';

// Environment detection
export const isDevelopment = import.meta.env.DEV === true;
export const isProduction = import.meta.env.PROD === true;

// Feature flags
export const USE_REDIS_CACHE = Boolean(REDIS_URL);
export const CACHE_DURATION = parseInt(import.meta.env.CACHE_DURATION || '3600', 10); // Default 1 hour 