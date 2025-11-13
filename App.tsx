import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { UserProvider } from './src/context/UserContext';
import { ComparisonProvider } from './src/context/ComparisonContext';
import { LocationProvider } from './src/context/LocationContext';
import { ReviewProvider } from './src/context/ReviewContext';
import { BookingProvider } from './src/context/BookingContext';
import { RecommendationProvider } from './src/context/RecommendationContext';
import { RecentViewsProvider } from './src/context/RecentViewsContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const AppContent = () => {
  const { isDark, colors } = useTheme();

  // Create custom navigation theme based on current theme
  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text.primary,
          border: colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text.primary,
          border: colors.border,
        },
      };

  return (
    <UserProvider>
      <RecentViewsProvider>
        <FavoritesProvider>
          <ReviewProvider>
            <BookingProvider>
              <RecommendationProvider>
                <ComparisonProvider>
                  <LocationProvider>
                    <NavigationContainer theme={navigationTheme}>
                      <RootNavigator />
                      <StatusBar style={isDark ? 'light' : 'dark'} />
                    </NavigationContainer>
                  </LocationProvider>
                </ComparisonProvider>
              </RecommendationProvider>
            </BookingProvider>
          </ReviewProvider>
        </FavoritesProvider>
      </RecentViewsProvider>
    </UserProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
