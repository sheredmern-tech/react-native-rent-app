import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContextType, ThemeMode, ColorScheme } from '../types/theme';
import { lightColors, darkColors } from '../constants/colors';

const THEME_STORAGE_KEY = '@theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        newTheme ? 'dark' : 'light'
      );
      console.log('Theme switched to:', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors: ColorScheme = isDark ? darkColors : lightColors;
  const themeMode: ThemeMode = isDark ? 'dark' : 'light';

  // Don't render children until theme is loaded to prevent flash
  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        colors,
        themeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
