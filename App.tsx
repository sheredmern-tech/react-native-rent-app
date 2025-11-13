import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { UserProvider } from './src/context/UserContext';
import { ComparisonProvider } from './src/context/ComparisonContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </ComparisonProvider>
        </FavoritesProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
