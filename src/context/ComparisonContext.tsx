import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { Property } from '../types';
import { MAX_COMPARISON_ITEMS } from '../types/comparison';

interface ComparisonContextType {
  comparisonList: string[];
  addToComparison: (property: Property) => void;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  getComparisonCount: () => number;
  canAddMore: () => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({
  children,
}) => {
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  const addToComparison = (property: Property) => {
    if (comparisonList.length >= MAX_COMPARISON_ITEMS) {
      Alert.alert(
        'Batas Tercapai',
        `Anda hanya dapat membandingkan maksimal ${MAX_COMPARISON_ITEMS} properti.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (comparisonList.includes(property.id)) {
      console.log('Property already in comparison:', property.id);
      return;
    }

    setComparisonList((prev) => {
      console.log('Added to comparison:', property.title);
      return [...prev, property.id];
    });

    Alert.alert(
      'Ditambahkan',
      `${property.title} ditambahkan ke perbandingan`,
      [{ text: 'OK' }]
    );
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonList((prev) => {
      console.log('Removed from comparison:', propertyId);
      return prev.filter((id) => id !== propertyId);
    });
  };

  const clearComparison = () => {
    setComparisonList([]);
    console.log('Comparison cleared');
  };

  const isInComparison = (propertyId: string): boolean => {
    return comparisonList.includes(propertyId);
  };

  const getComparisonCount = (): number => {
    return comparisonList.length;
  };

  const canAddMore = (): boolean => {
    return comparisonList.length < MAX_COMPARISON_ITEMS;
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        getComparisonCount,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
