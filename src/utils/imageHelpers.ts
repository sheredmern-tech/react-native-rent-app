import { Image } from 'react-native';

/**
 * Append width and height parameters to Unsplash URLs for optimized image loading
 */
export const getImageUrl = (
  url: string,
  width?: number,
  height?: number
): string => {
  if (!url) return '';

  // Check if URL already has query parameters
  const hasParams = url.includes('?');
  const separator = hasParams ? '&' : '?';

  let optimizedUrl = url;

  if (width) {
    optimizedUrl += `${separator}w=${width}`;
  }

  if (height) {
    optimizedUrl += `${optimizedUrl.includes('?') ? '&' : '?'}h=${height}`;
  }

  // Add fit parameter for Unsplash
  if (url.includes('unsplash.com')) {
    optimizedUrl += `${optimizedUrl.includes('?') ? '&' : '?'}fit=crop`;
  }

  return optimizedUrl;
};

/**
 * Preload images for better UX
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    const promises = urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        Image.prefetch(url)
          .then(() => resolve())
          .catch(() => resolve()); // Resolve even on error to not block other images
      });
    });

    await Promise.all(promises);
  } catch (error) {
    console.warn('Error preloading images:', error);
  }
};

/**
 * Get thumbnail URL with smaller dimensions
 */
export const getThumbnailUrl = (url: string): string => {
  return getImageUrl(url, 200, 200);
};

/**
 * Get carousel image URL with optimized dimensions
 */
export const getCarouselImageUrl = (url: string): string => {
  return getImageUrl(url, 800, 600);
};

/**
 * Get fullscreen image URL with higher quality
 */
export const getFullscreenImageUrl = (url: string): string => {
  return getImageUrl(url, 1200, 1200);
};
