import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  PropertyRecommendation,
  UserPreference,
  UserInteraction,
  RecommendationScore,
  TrendingProperty,
} from '../types';
import { mockProperties } from '../data';

interface RecommendationContextType {
  userPreferences: UserPreference;
  userInteractions: UserInteraction;
  getPersonalizedRecommendations: () => PropertyRecommendation[];
  getTrendingProperties: () => PropertyRecommendation[];
  getNewListings: () => PropertyRecommendation[];
  getSimilarProperties: (propertyId: string) => PropertyRecommendation[];
  calculateMatchScore: (property: Property) => RecommendationScore;
  trackView: (propertyId: string) => void;
  trackFavorite: (propertyId: string) => void;
  trackSearch: (query: string) => void;
  hasEnoughInteractions: () => boolean;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(
  undefined
);

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within RecommendationProvider');
  }
  return context;
};

// Generate mock trending data
const generateTrendingData = (): TrendingProperty[] => {
  return mockProperties.slice(0, 15).map((property, index) => ({
    propertyId: property.id,
    views: Math.floor(Math.random() * 500) + 100,
    favorites: Math.floor(Math.random() * 50) + 10,
    trendingScore: Math.random() * 100 + index * 5,
  })).sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10);
};

// Mock user preferences (Indonesian cities and realistic preferences)
const initialUserPreferences: UserPreference = {
  propertyTypes: ['house', 'apartment'],
  priceRange: {
    min: 5000000,
    max: 15000000,
  },
  preferredLocations: ['Jakarta', 'Bandung', 'Tangerang'],
  minBedrooms: 2,
  minBathrooms: 1,
  preferredFeatures: ['Swimming Pool', 'Gym', 'Security 24/7', 'Parking'],
};

// Mock user interactions
const initialUserInteractions: UserInteraction = {
  viewHistory: ['1', '3', '5', '7', '9', '11', '13', '15', '2', '4', '6', '8', '10', '12', '14'],
  favoriteHistory: ['1', '3', '5', '7', '9'],
  searchHistory: ['apartment jakarta', 'house bandung', 'villa bali'],
  lastUpdated: new Date(),
};

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userPreferences] = useState<UserPreference>(initialUserPreferences);
  const [userInteractions, setUserInteractions] = useState<UserInteraction>(
    initialUserInteractions
  );
  const [trendingData] = useState<TrendingProperty[]>(generateTrendingData());

  const hasEnoughInteractions = (): boolean => {
    const totalInteractions =
      userInteractions.viewHistory.length +
      userInteractions.favoriteHistory.length +
      userInteractions.searchHistory.length;
    return totalInteractions >= 3;
  };

  const trackView = (propertyId: string) => {
    setUserInteractions((prev) => {
      if (prev.viewHistory.includes(propertyId)) {
        return prev;
      }
      return {
        ...prev,
        viewHistory: [propertyId, ...prev.viewHistory].slice(0, 50),
        lastUpdated: new Date(),
      };
    });
  };

  const trackFavorite = (propertyId: string) => {
    setUserInteractions((prev) => {
      if (prev.favoriteHistory.includes(propertyId)) {
        return prev;
      }
      return {
        ...prev,
        favoriteHistory: [propertyId, ...prev.favoriteHistory],
        lastUpdated: new Date(),
      };
    });
  };

  const trackSearch = (query: string) => {
    setUserInteractions((prev) => ({
      ...prev,
      searchHistory: [query, ...prev.searchHistory].slice(0, 20),
      lastUpdated: new Date(),
    }));
  };

  // Calculate location match score (0-30)
  const calculateLocationMatch = (property: Property): number => {
    const propertyLocation = property.location.toLowerCase();
    let score = 0;

    userPreferences.preferredLocations.forEach((location) => {
      if (propertyLocation.includes(location.toLowerCase())) {
        score = 30;
      }
    });

    // Check if in favorite history location
    const favoriteProperties = mockProperties.filter((p) =>
      userInteractions.favoriteHistory.includes(p.id)
    );
    favoriteProperties.forEach((fav) => {
      if (fav.location.toLowerCase().includes(property.location.split(',')[0].toLowerCase())) {
        score += 5; // Bonus for being in same area as favorited property
      }
    });

    return Math.min(score, 35); // Cap at 35 (30 base + 5 bonus)
  };

  // Calculate price match score (0-25)
  const calculatePriceMatch = (property: Property): number => {
    const { min, max } = userPreferences.priceRange;
    const price = property.price;

    if (price >= min && price <= max) {
      return 25; // Perfect match
    }

    // Calculate how far off the price is
    if (price < min) {
      const diff = min - price;
      const tolerance = min * 0.3; // 30% tolerance
      if (diff <= tolerance) {
        return 25 * (1 - diff / tolerance);
      }
    } else {
      const diff = price - max;
      const tolerance = max * 0.3; // 30% tolerance
      if (diff <= tolerance) {
        return 25 * (1 - diff / tolerance);
      }
    }

    return 0;
  };

  // Calculate property type match score (0-20)
  const calculateTypeMatch = (property: Property): number => {
    if (userPreferences.propertyTypes.includes(property.type)) {
      return 20;
    }
    return 0;
  };

  // Calculate amenities match score (0-15)
  const calculateAmenitiesMatch = (property: Property): number => {
    if (!property.features || userPreferences.preferredFeatures.length === 0) {
      return 0;
    }

    const matchingFeatures = property.features.filter((feature) =>
      userPreferences.preferredFeatures.some((pref) =>
        feature.toLowerCase().includes(pref.toLowerCase())
      )
    );

    const matchRatio =
      matchingFeatures.length / userPreferences.preferredFeatures.length;
    return matchRatio * 15;
  };

  // Calculate size match score (0-10)
  const calculateSizeMatch = (property: Property): number => {
    let score = 0;

    if (
      userPreferences.minBedrooms &&
      property.bedrooms >= userPreferences.minBedrooms
    ) {
      score += 5;
    }

    if (
      userPreferences.minBathrooms &&
      property.bathrooms >= userPreferences.minBathrooms
    ) {
      score += 5;
    }

    return score;
  };

  // Calculate bonus points
  const calculateBonusPoints = (property: Property): number => {
    let bonus = 0;

    // New listing bonus (<7 days)
    const daysSinceCreated =
      (new Date().getTime() - new Date(property.createdAt).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 7) {
      bonus += 3;
    }

    // Already viewed penalty
    if (userInteractions.viewHistory.includes(property.id)) {
      bonus -= 10;
    }

    // Same owner as favorited property bonus
    const favoriteProperties = mockProperties.filter((p) =>
      userInteractions.favoriteHistory.includes(p.id)
    );
    if (favoriteProperties.some((fav) => fav.owner.id === property.owner.id)) {
      bonus += 5;
    }

    return bonus;
  };

  // Main scoring algorithm
  const calculateMatchScore = (property: Property): RecommendationScore => {
    const locationMatch = calculateLocationMatch(property);
    const priceMatch = calculatePriceMatch(property);
    const typeMatch = calculateTypeMatch(property);
    const amenitiesMatch = calculateAmenitiesMatch(property);
    const sizeMatch = calculateSizeMatch(property);
    const bonusPoints = calculateBonusPoints(property);

    const totalScore = Math.min(
      100,
      Math.max(
        0,
        locationMatch +
          priceMatch +
          typeMatch +
          amenitiesMatch +
          sizeMatch +
          bonusPoints
      )
    );

    return {
      propertyId: property.id,
      score: totalScore,
      matchFactors: {
        locationMatch,
        priceMatch,
        typeMatch,
        amenitiesMatch,
        sizeMatch,
        bonusPoints,
      },
    };
  };

  // Get personalized recommendations
  const getPersonalizedRecommendations = (): PropertyRecommendation[] => {
    if (!hasEnoughInteractions()) {
      return [];
    }

    const scoredProperties = mockProperties
      .map((property) => {
        const scoreData = calculateMatchScore(property);
        return {
          property,
          matchScore: Math.round(scoreData.score),
          recommendationType: 'personalized' as const,
        };
      })
      .filter((rec) => rec.matchScore >= 50) // Filter out low matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    return scoredProperties;
  };

  // Get trending properties
  const getTrendingProperties = (): PropertyRecommendation[] => {
    const trendingProperties = trendingData.map((trending, index) => {
      const property = mockProperties.find((p) => p.id === trending.propertyId);
      if (!property) return null;

      return {
        property,
        matchScore: Math.round(trending.trendingScore),
        recommendationType: 'trending' as const,
        isTrending: true,
        trendingRank: index + 1,
      };
    });

    return trendingProperties.filter(
      (rec) => rec !== null
    ) as PropertyRecommendation[];
  };

  // Get new listings (last 14 days)
  const getNewListings = (): PropertyRecommendation[] => {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const newProperties = mockProperties
      .filter((property) => {
        const createdDate = new Date(property.createdAt);
        return createdDate >= fourteenDaysAgo;
      })
      .map((property) => ({
        property,
        matchScore: 85, // Default good score for new listings
        recommendationType: 'new' as const,
        isNew: true,
      }))
      .sort(
        (a, b) =>
          new Date(b.property.createdAt).getTime() -
          new Date(a.property.createdAt).getTime()
      )
      .slice(0, 7);

    return newProperties;
  };

  // Get similar properties (for property detail page)
  const getSimilarProperties = (propertyId: string): PropertyRecommendation[] => {
    const targetProperty = mockProperties.find((p) => p.id === propertyId);
    if (!targetProperty) return [];

    const similarProperties = mockProperties
      .filter((property) => property.id !== propertyId)
      .map((property) => {
        let similarityScore = 0;

        // Type match (30 points)
        if (property.type === targetProperty.type) {
          similarityScore += 30;
        }

        // Price similarity (25 points)
        const priceDiff = Math.abs(property.price - targetProperty.price);
        const priceRatio = priceDiff / targetProperty.price;
        if (priceRatio <= 0.2) {
          similarityScore += 25;
        } else if (priceRatio <= 0.4) {
          similarityScore += 15;
        } else if (priceRatio <= 0.6) {
          similarityScore += 5;
        }

        // Location similarity (20 points)
        const targetCity = targetProperty.location.split(',').pop()?.trim() || '';
        const propertyCity = property.location.split(',').pop()?.trim() || '';
        if (targetCity === propertyCity) {
          similarityScore += 20;
        }

        // Bedroom similarity (15 points)
        const bedroomDiff = Math.abs(property.bedrooms - targetProperty.bedrooms);
        if (bedroomDiff === 0) {
          similarityScore += 15;
        } else if (bedroomDiff === 1) {
          similarityScore += 10;
        } else if (bedroomDiff === 2) {
          similarityScore += 5;
        }

        // Area similarity (10 points)
        const areaDiff = Math.abs(property.area - targetProperty.area);
        const areaRatio = areaDiff / targetProperty.area;
        if (areaRatio <= 0.2) {
          similarityScore += 10;
        } else if (areaRatio <= 0.4) {
          similarityScore += 5;
        }

        return {
          property,
          matchScore: Math.max(50, Math.round(similarityScore)),
          recommendationType: 'similar' as const,
        };
      })
      .filter((rec) => rec.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    return similarProperties;
  };

  return (
    <RecommendationContext.Provider
      value={{
        userPreferences,
        userInteractions,
        getPersonalizedRecommendations,
        getTrendingProperties,
        getNewListings,
        getSimilarProperties,
        calculateMatchScore,
        trackView,
        trackFavorite,
        trackSearch,
        hasEnoughInteractions,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
