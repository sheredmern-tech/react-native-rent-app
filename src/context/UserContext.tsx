import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserSettings } from '../types';

interface UserContextType {
  user: User;
  settings: UserSettings;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  updateNotificationSettings: (updates: Partial<UserSettings['notifications']>) => void;
  updatePreferences: (updates: Partial<UserSettings['preferences']>) => void;
  updatePrivacy: (updates: Partial<UserSettings['privacy']>) => void;
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
  avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=4A90E2&color=fff&size=200',
  bio: 'Looking for the perfect rental property in Jakarta',
  joinedDate: new Date('2024-01-15'),
  location: 'Jakarta, Indonesia',
};

const defaultSettings: UserSettings = {
  notifications: {
    newProperties: true,
    priceDrops: true,
    messages: true,
    newsletter: false,
  },
  preferences: {
    currency: 'IDR',
    language: 'id',
    darkMode: false,
  },
  privacy: {
    showEmail: false,
    showPhone: false,
    showProfile: true,
  },
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      console.log('Updating user:', updates);
      return { ...prev, ...updates };
    });
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      console.log('Updating settings:', updates);
      return { ...prev, ...updates };
    });
  };

  const updateNotificationSettings = (
    updates: Partial<UserSettings['notifications']>
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  const updatePreferences = (updates: Partial<UserSettings['preferences']>) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  };

  const updatePrivacy = (updates: Partial<UserSettings['privacy']>) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...updates },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        settings,
        updateUser,
        updateSettings,
        updateNotificationSettings,
        updatePreferences,
        updatePrivacy,
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
