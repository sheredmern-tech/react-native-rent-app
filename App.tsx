import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { UserProvider } from './src/context/UserContext';
import { ComparisonProvider } from './src/context/ComparisonContext';
import { LocationProvider } from './src/context/LocationContext';
import { ReviewProvider } from './src/context/ReviewContext';
import { BookingProvider } from './src/context/BookingContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <FavoritesProvider>
          <ReviewProvider>
            <BookingProvider>
              <ComparisonProvider>
                <LocationProvider>
                  <NavigationContainer>
                    <RootNavigator />
                    <StatusBar style="auto" />
                  </NavigationContainer>
                </LocationProvider>
              </ComparisonProvider>
            </BookingProvider>
          </ReviewProvider>
        </FavoritesProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
