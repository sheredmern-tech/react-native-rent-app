import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AppSettings } from '../types';

interface UserContextType {
  user: User;
  settings: AppSettings;
  updateUser: (data: Partial<User>) => void;
  updateAvatar: (uri: string) => void;
  updateSettings: (data: Partial<AppSettings>) => void;
  getSavedPropertiesCount: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Mock user data - in a real app this would come from authentication/backend
const defaultUser: User = {
  id: '1',
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  phone: '+62 812-3456-7890',
  avatar: undefined, // Will use initials
  joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
  savedProperties: 0, // Will be synced with favorites
  viewedProperties: 8,
};

const defaultSettings: AppSettings = {
  notifications: {
    push: true,
    email: false,
  },
  preferences: {
    language: 'en',
    currency: 'IDR',
    distanceUnit: 'km',
  },
  darkMode: false,
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      console.log('Updating user:', data);
      return { ...prev, ...data };
    });
  };

  const updateAvatar = (uri: string) => {
    setUser((prev) => ({
      ...prev,
      avatar: uri,
    }));
  };

  const updateSettings = (data: Partial<AppSettings>) => {
    setSettings((prev) => {
      console.log('Updating settings:', data);
      return { ...prev, ...data };
    });
  };

  const getSavedPropertiesCount = (): number => {
    return user.savedProperties;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        settings,
        updateUser,
        updateAvatar,
        updateSettings,
        getSavedPropertiesCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
