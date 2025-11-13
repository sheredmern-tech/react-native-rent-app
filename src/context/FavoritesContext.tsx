import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property } from '../types';
import { mockProperties } from '../data';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  getFavoriteProperties: () => Property[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      if (prev.includes(propertyId)) {
        return prev;
      }
      console.log('Added to favorites:', propertyId);
      return [...prev, propertyId];
    });
  };

  const removeFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      console.log('Removed from favorites:', propertyId);
      return prev.filter((id) => id !== propertyId);
    });
  };

  const isFavorite = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (propertyId: string) => {
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  const getFavoriteProperties = (): Property[] => {
    return mockProperties.filter((property) =>
      favorites.includes(property.id)
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        getFavoriteProperties,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
