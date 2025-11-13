import { Property, SortOption } from '../types';

export const sortProperties = (
  properties: Property[],
  sortOption: SortOption
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

    default:
      return sorted;
  }
};

export const getSortLabel = (sortOption: SortOption): string => {
  switch (sortOption) {
    case 'newest':
      return 'Newest First';
    case 'price-low':
      return 'Price: Low to High';
    case 'price-high':
      return 'Price: High to Low';
    case 'area-small':
      return 'Area: Smallest';
    case 'area-large':
      return 'Area: Largest';
    default:
      return 'Sort';
  }
};
