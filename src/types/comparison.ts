import { Property } from './index';

export interface ComparisonProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'apartment' | 'house' | 'villa';
  furnished: boolean;
  petFriendly: boolean;
  hasParking: boolean;
  features?: string[];
}

export const MAX_COMPARISON_ITEMS = 3;
