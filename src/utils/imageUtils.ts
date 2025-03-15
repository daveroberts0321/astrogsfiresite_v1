/**
 * Utility functions for handling images
 * This file contains functions for optimizing and transforming image URLs
 */

/**
 * Optimizes an image URL by adding Cloudinary transformations
 * @param url - The original image URL
 * @param width - The desired width of the image
 * @param height - The desired height of the image
 * @param quality - The desired quality of the image (1-100)
 * @returns The optimized image URL
 */
export function optimizeImageUrl(url: string | null | undefined, width?: number, height?: number, quality: number = 80): string {
  // Return a placeholder if URL is null or undefined
  if (!url) {
    return 'https://placehold.co/600x400?text=No+Image';
  }

  // Check if the URL is already a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Parse the existing URL to extract components
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
      return url; // Return original if not in expected format
    }

    // Build transformation string
    let transformations = 'f_auto,q_' + quality;
    if (width) transformations += ',w_' + width;
    if (height) transformations += ',h_' + height;

    // Return the URL with transformations
    return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
  }

  // For non-Cloudinary URLs, return as is
  return url;
}

/**
 * Generates a placeholder image URL
 * @param width - The width of the placeholder
 * @param height - The height of the placeholder
 * @param text - The text to display on the placeholder
 * @returns The placeholder image URL
 */
export function getPlaceholderImage(width: number = 600, height: number = 400, text: string = 'No+Image'): string {
  return `https://placehold.co/${width}x${height}?text=${text}`;
} 