import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';
import { LocationPermission } from '../types/location';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  userLocation: UserLocation | null;
  permission: LocationPermission;
  requestPermission: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [permission, setPermission] = useState<LocationPermission>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permission status on mount
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermission('granted');
        getCurrentLocation();
      } else if (status === 'denied') {
        setPermission('denied');
      } else {
        setPermission('undetermined');
      }
    } catch (err) {
      console.error('Error checking location permission:', err);
      setError('Gagal memeriksa izin lokasi');
      setPermission('denied');
    }
  };

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setPermission('granted');
        await getCurrentLocation();
      } else {
        setPermission('denied');
        setError('Izin lokasi ditolak');
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Gagal meminta izin lokasi');
      setPermission('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      console.error('Error getting current location:', err);
      setError('Gagal mendapatkan lokasi saat ini');
    } finally {
      setIsLoading(false);
    }
  };

  const value: LocationContextType = {
    userLocation,
    permission,
    requestPermission,
    isLoading,
    error,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
