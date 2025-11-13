import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecentView, RecentViewsContextType } from '../types/recentViews';
import { Property } from '../types';
import { mockProperties } from '../data';

const STORAGE_KEY = '@rent_app:recent_views';
const MAX_RECENT_VIEWS = 10;
const MIN_TIME_BETWEEN_VIEWS = 5 * 60 * 1000; // 5 minutes in milliseconds

const RecentViewsContext = createContext<RecentViewsContextType | undefined>(
  undefined
);

interface RecentViewsProviderProps {
  children: ReactNode;
}

export const RecentViewsProvider: React.FC<RecentViewsProviderProps> = ({
  children,
}) => {
  const [recentViews, setRecentViews] = useState<RecentView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load recent views from AsyncStorage on mount
  useEffect(() => {
    loadRecentViews();
  }, []);

  /**
   * Load recent views from AsyncStorage
   */
  const loadRecentViews = async (): Promise<void> => {
    try {
      setLoading(true);
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const views = JSON.parse(json);
        // Convert ISO strings back to Date objects
        const parsedViews = views.map((v: any) => ({
          ...v,
          viewedAt: new Date(v.viewedAt),
        }));
        setRecentViews(parsedViews);
        console.log('Loaded recent views:', parsedViews.length);
      }
    } catch (error) {
      console.error('Error loading recent views:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save recent views to AsyncStorage
   */
  const saveRecentViews = async (views: RecentView[]): Promise<void> => {
    try {
      const json = JSON.stringify(views);
      await AsyncStorage.setItem(STORAGE_KEY, json);
      console.log('Saved recent views:', views.length);
    } catch (error) {
      console.error('Error saving recent views:', error);
    }
  };

  /**
   * Add a property to recent views
   * - If already viewed recently (within 5 minutes), skip
   * - If already in history, update timestamp and move to top
   * - If at max capacity (10 items), remove oldest
   */
  const addRecentView = async (propertyId: string): Promise<void> => {
    try {
      const now = new Date();

      // Check if property was viewed very recently (prevent spam)
      const existingView = recentViews.find(
        (v) => v.propertyId === propertyId
      );
      if (existingView) {
        const timeSinceLastView = now.getTime() - existingView.viewedAt.getTime();
        if (timeSinceLastView < MIN_TIME_BETWEEN_VIEWS) {
          console.log('Property viewed too recently, skipping:', propertyId);
          return;
        }
      }

      // Remove existing view if present
      const filteredViews = recentViews.filter(
        (v) => v.propertyId !== propertyId
      );

      // Add new view at the beginning
      const newView: RecentView = {
        propertyId,
        viewedAt: now,
      };

      // Keep only MAX_RECENT_VIEWS items (newest first)
      const updatedViews = [newView, ...filteredViews].slice(
        0,
        MAX_RECENT_VIEWS
      );

      setRecentViews(updatedViews);
      await saveRecentViews(updatedViews);
      console.log('Added to recent views:', propertyId);
    } catch (error) {
      console.error('Error adding recent view:', error);
    }
  };

  /**
   * Get all recent views (sorted by timestamp DESC)
   */
  const getRecentViews = (): RecentView[] => {
    return recentViews;
  };

  /**
   * Clear all recent views
   */
  const clearRecentViews = async (): Promise<void> => {
    try {
      setRecentViews([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Cleared all recent views');
    } catch (error) {
      console.error('Error clearing recent views:', error);
    }
  };

  /**
   * Remove a single recent view
   */
  const removeRecentView = async (propertyId: string): Promise<void> => {
    try {
      const updatedViews = recentViews.filter(
        (v) => v.propertyId !== propertyId
      );
      setRecentViews(updatedViews);
      await saveRecentViews(updatedViews);
      console.log('Removed from recent views:', propertyId);
    } catch (error) {
      console.error('Error removing recent view:', error);
    }
  };

  /**
   * Check if a property is in recent views
   */
  const isRecentlyViewed = (propertyId: string): boolean => {
    return recentViews.some((v) => v.propertyId === propertyId);
  };

  /**
   * Get recent properties with full details
   */
  const getRecentProperties = (): Property[] => {
    return recentViews
      .map((view) => mockProperties.find((p) => p.id === view.propertyId))
      .filter((p): p is Property => p !== undefined);
  };

  return (
    <RecentViewsContext.Provider
      value={{
        recentViews,
        loading,
        addRecentView,
        getRecentViews,
        clearRecentViews,
        removeRecentView,
        isRecentlyViewed,
      }}
    >
      {children}
    </RecentViewsContext.Provider>
  );
};

export const useRecentViews = (): RecentViewsContextType => {
  const context = useContext(RecentViewsContext);
  if (!context) {
    throw new Error('useRecentViews must be used within a RecentViewsProvider');
  }
  return context;
};
