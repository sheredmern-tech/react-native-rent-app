import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp, PropertyRecommendation } from '../types';
import { Colors, Fonts } from '../constants';
import { RecommendationSection, EmptyState } from '../components';
import { useRecommendations } from '../context/RecommendationContext';

export const RecommendationsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Home'>>();
  const {
    getPersonalizedRecommendations,
    getTrendingProperties,
    getNewListings,
    hasEnoughInteractions,
  } = useRecommendations();

  const [refreshing, setRefreshing] = useState(false);

  const personalizedRecommendations = getPersonalizedRecommendations();
  const trendingProperties = getTrendingProperties();
  const newListings = getNewListings();
  const hasInteractions = hasEnoughInteractions();

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCardPress = (recommendation: PropertyRecommendation) => {
    navigation.navigate('PropertyDetail', { property: recommendation.property });
  };

  const renderContent = () => {
    if (!hasInteractions) {
      return (
        <View style={styles.notEnoughDataContainer}>
          <EmptyState
            icon="compass-outline"
            title="Start Exploring"
            message="Browse properties to get personalized recommendations tailored just for you"
          />
          <View style={styles.divider} />

          {/* Show trending and new even without interactions */}
          {trendingProperties.length > 0 && (
            <RecommendationSection
              title="Trending Now"
              icon="trending-up-outline"
              recommendations={trendingProperties}
              onPressCard={handleCardPress}
            />
          )}

          {newListings.length > 0 && (
            <RecommendationSection
              title="New Listings"
              icon="star-outline"
              recommendations={newListings}
              onPressCard={handleCardPress}
            />
          )}
        </View>
      );
    }

    return (
      <View style={styles.sectionsContainer}>
        {/* Personalized Section */}
        {personalizedRecommendations.length > 0 && (
          <RecommendationSection
            title="For You"
            icon="heart-outline"
            recommendations={personalizedRecommendations.slice(0, 10)}
            onPressCard={handleCardPress}
          />
        )}

        {/* Trending Section */}
        {trendingProperties.length > 0 && (
          <RecommendationSection
            title="Trending Now"
            icon="trending-up-outline"
            recommendations={trendingProperties}
            onPressCard={handleCardPress}
          />
        )}

        {/* New Listings Section */}
        {newListings.length > 0 && (
          <RecommendationSection
            title="New Listings"
            icon="star-outline"
            recommendations={newListings}
            onPressCard={handleCardPress}
          />
        )}

        {/* All empty */}
        {personalizedRecommendations.length === 0 &&
          trendingProperties.length === 0 &&
          newListings.length === 0 && (
            <EmptyState
              icon="compass-outline"
              title="No Recommendations"
              message="We couldn't find any recommendations at the moment. Try exploring more properties!"
            />
          )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="compass" size={28} color={Colors.primary} />
          <Text style={styles.headerTitle}>Discover</Text>
        </View>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  notEnoughDataContainer: {
    paddingHorizontal: 16,
  },
  sectionsContainer: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
    marginHorizontal: 16,
  },
});
