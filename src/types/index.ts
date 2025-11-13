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
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'all';

export interface FavoriteProperty {
  propertyId: string;
  addedAt: Date;
}
