/**
 * Utility functions for formatting data
 */

/**
 * Format price to Indonesian Rupiah
 * @param price - Price in number
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString('id-ID')}`;
};

/**
 * Format price short (for markers and compact displays)
 * @param price - Price in number
 * @returns Shortened price string
 */
export const formatPriceShort = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}jt`;
  }
  return `${(price / 1000).toFixed(0)}rb`;
};

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('id-ID');
};