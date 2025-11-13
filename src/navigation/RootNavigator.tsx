import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import {
  HomeScreen,
  PropertyDetailScreen,
  SearchScreen,
  FavoritesScreen,
  ProfileScreen,
  EditProfileScreen,
  SettingsScreen,
  AboutScreen,
  TermsScreen,
  PrivacyScreen,
  ComparisonScreen,
  MapScreen,
  NearbyPropertiesScreen,
} from '../screens';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Rent App' }}
      />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About' }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <Stack.Screen
        name="Comparison"
        component={ComparisonScreen}
        options={{ title: 'Bandingkan Properti' }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NearbyProperties"
        component={NearbyPropertiesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
