export * from './navigation';
export * from './review';

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  responseTime: string;
  verified: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrls: string[];
  description: string;
  type: 'apartment' | 'house' | 'villa';
  isAvailable: boolean;
  features?: string[];
  furnished: boolean;
  petFriendly: boolean;
  hasParking: boolean;
  createdAt: Date;
  owner: Owner;
  latitude: number;
  longitude: number;
  rating?: number; // Average rating (1-5)
  reviewCount?: number; // Total number of reviews
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'all';

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'area-small' | 'area-large' | 'distance';

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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: Date;
  savedProperties: number;
  viewedProperties: number;
}

export interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
  };
  preferences: {
    language: 'en' | 'id';
    currency: 'IDR' | 'USD';
    distanceUnit: 'km' | 'mi';
  };
  darkMode: boolean;
}
