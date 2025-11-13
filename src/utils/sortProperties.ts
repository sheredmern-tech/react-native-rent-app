import { Property, SortOption } from '../types';
import { calculateDistance } from './locationHelpers';

export const sortProperties = (
  properties: Property[],
  sortOption: SortOption,
  userLocation?: { latitude: number; longitude: number } | null
): Property[] => {
  const sorted = [...properties];

  switch (sortOption) {
    case 'newest':
      return sorted.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);

    case 'area-small':
      return sorted.sort((a, b) => a.area - b.area);

    case 'area-large':
      return sorted.sort((a, b) => b.area - a.area);

    case 'distance':
      if (!userLocation) return sorted;
      return sorted.sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        return distanceA - distanceB;
      });

    default:
      return sorted;
  }
};

export const getSortLabel = (sortOption: SortOption): string => {
  switch (sortOption) {
    case 'newest':
      return 'Terbaru';
    case 'price-low':
      return 'Harga: Terendah';
    case 'price-high':
      return 'Harga: Tertinggi';
    case 'area-small':
      return 'Luas: Terkecil';
    case 'area-large':
      return 'Luas: Terbesar';
    case 'distance':
      return 'Jarak: Terdekat';
    default:
      return 'Urutkan';
  }
};
