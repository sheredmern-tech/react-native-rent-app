export * from './navigation';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  description: string;
  type: 'apartment' | 'house' | 'villa';
  isAvailable: boolean;
  features?: string[];
  furnished: boolean;
  petFriendly: boolean;
  hasParking: boolean;
  createdAt: Date;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'all';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'area-small' | 'area-large';

export interface SearchFilters {
  searchQuery: string;
  propertyType: PropertyType;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  availableOnly: boolean;
  furnished: boolean | null;
  petFriendly: boolean | null;
  hasParking: boolean | null;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<SearchFilters>;
}

export interface FavoriteProperty {
  propertyId: string;
  addedAt: Date;
}
