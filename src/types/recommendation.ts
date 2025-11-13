import { Property, PropertyType } from './index';

export type RecommendationType = 'personalized' | 'trending' | 'new' | 'similar';

export interface UserPreference {
  propertyTypes: PropertyType[];
  priceRange: {
    min: number;
    max: number;
  };
  preferredLocations: string[];
  minBedrooms?: number;
  minBathrooms?: number;
  preferredFeatures: string[];
}

export interface UserInteraction {
  viewHistory: string[]; // Property IDs
  favoriteHistory: string[]; // Property IDs
  searchHistory: string[]; // Search queries
  lastUpdated: Date;
}

export interface RecommendationScore {
  propertyId: string;
  score: number; // 0-100
  matchFactors: {
    locationMatch: number; // 0-30
    priceMatch: number; // 0-25
    typeMatch: number; // 0-20
    amenitiesMatch: number; // 0-15
    sizeMatch: number; // 0-10
    bonusPoints: number; // bonus/penalty
  };
}

export interface PropertyRecommendation {
  property: Property;
  matchScore: number; // 50-99
  recommendationType: RecommendationType;
  isNew?: boolean; // Within 14 days
  isTrending?: boolean;
  trendingRank?: number; // 1-10 for trending properties
}

export interface TrendingProperty {
  propertyId: string;
  views: number;
  favorites: number;
  trendingScore: number; // Weighted score
}
