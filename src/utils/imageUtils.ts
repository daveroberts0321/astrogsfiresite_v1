/**
 * Image optimization utilities
 * Provides functions to optimize image URLs for better performance
 */

/**
 * Optimizes an image URL by adding Cloudinary transformations
 * @param url The original image URL
 * @returns The optimized image URL
 */
export function optimizeImageUrl(url: string | undefined | null): string {
  // Default image if no URL provided
  if (!url) {
    return 'https://res.cloudinary.com/di0r3kmxh/image/upload/f_auto,q_auto/v1724876754/placeholder.jpg';
  }

  // Check if URL is already a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // If it doesn't have optimization parameters, add them
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      // Insert optimization parameters before the version part of the URL
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
      }
    }
    return url;
  }

  // For non-Cloudinary URLs, return as is
  return url;
}

/**
 * Generates a responsive image srcset for different screen sizes
 * @param url The base image URL
 * @param widths Array of widths to generate srcset for
 * @returns The srcset string
 */
export function generateSrcSet(url: string, widths: number[] = [320, 640, 960, 1280]): string {
  if (!url || !url.includes('cloudinary.com')) {
    return '';
  }

  return widths
    .map(width => {
      const optimizedUrl = url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Generates a blurred placeholder image URL
 * @param url The original image URL
 * @returns The blurred placeholder image URL
 */
export function getPlaceholderImage(url: string): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  return url.replace('/upload/', '/upload/w_50,h_50,c_fill,e_blur:1000,f_auto,q_auto/');
} 