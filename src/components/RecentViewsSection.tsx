import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useRecentViews } from '../context/RecentViewsContext';
import { mockProperties } from '../data';
import { RecentViewCard } from './RecentViewCard';
import { Colors, Fonts } from '../constants';
import { Property } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const RecentViewsSection: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recentViews, clearRecentViews } = useRecentViews();

  // Don't render if no recent views
  if (recentViews.length === 0) {
    return null;
  }

  // Get properties with details
  const recentProperties = recentViews
    .map((view) => {
      const property = mockProperties.find((p) => p.id === view.propertyId);
      return property ? { property, view } : null;
    })
    .filter((item): item is { property: Property; view: any } => item !== null);

  const handleClearAll = () => {
    Alert.alert(
      'Clear Recent Views?',
      'This will remove all your recently viewed properties.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearRecentViews();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetail', { property });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recently Viewed</Text>
        <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
          <Text style={styles.clearAllButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {recentProperties.map(({ property, view }) => (
          <RecentViewCard
            key={view.propertyId}
            property={property}
            recentView={view}
            onPress={() => handlePropertyPress(property)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
  },
  clearAllButton: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: Fonts.weight.semibold,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
