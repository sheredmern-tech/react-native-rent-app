import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { ReviewSortOption, ReviewFilterRating } from '../types';
import { Colors, Fonts } from '../constants';
import {
  ReviewCard,
  RatingBreakdown,
  ReviewFilter,
  EmptyState,
  LoadingSpinner,
} from '../components';
import { useReviews } from '../context/ReviewContext';
import { useUser } from '../context/UserContext';

type PropertyReviewsScreenRouteProp = RouteProp<RootStackParamList, 'PropertyReviews'>;

export const PropertyReviewsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'PropertyReviews'>>();
  const route = useRoute<PropertyReviewsScreenRouteProp>();
  const { propertyId, propertyTitle } = route.params;

  const { user } = useUser();
  const {
    getReviewsByProperty,
    getReviewStats,
    toggleHelpful,
    getUserReview,
    sortReviews,
    filterReviews,
  } = useReviews();

  const [sortBy, setSortBy] = useState<ReviewSortOption>('recent');
  const [filterRating, setFilterRating] = useState<ReviewFilterRating>('all');
  const [loading, setLoading] = useState(false);

  const stats = getReviewStats(propertyId);
  const allReviews = getReviewsByProperty(propertyId);
  const userReview = getUserReview(propertyId, user.id);

  // Apply filters and sorting
  const processedReviews = useMemo(() => {
    let filtered = filterReviews(allReviews, filterRating);
    return sortReviews(filtered, sortBy);
  }, [allReviews, filterRating, sortBy, filterReviews, sortReviews]);

  const handleWriteReview = () => {
    if (userReview) {
      Alert.alert(
        'Edit Review',
        'You have already reviewed this property. Would you like to edit your review?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Edit',
            onPress: () =>
              navigation.navigate('EditReview', {
                reviewId: userReview.id,
                propertyId,
              }),
          },
        ]
      );
    } else {
      navigation.navigate('WriteReview', {
        propertyId,
        propertyTitle,
      });
    }
  };

  const handleToggleHelpful = (reviewId: string) => {
    toggleHelpful(reviewId, user.id);
  };

  const handleEditReview = (reviewId: string) => {
    navigation.navigate('EditReview', { reviewId, propertyId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Reviews & Ratings</Text>
      <Text style={styles.propertyTitle}>{propertyTitle}</Text>

      {/* Rating Breakdown */}
      {stats.totalReviews > 0 && (
        <View style={styles.breakdownContainer}>
          <RatingBreakdown stats={stats} />
        </View>
      )}

      {/* Write Review Button */}
      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={handleWriteReview}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbox-ellipses-outline" size={20} color={Colors.text.inverse} />
        <Text style={styles.writeReviewText}>
          {userReview ? 'Edit Your Review' : 'Write a Review'}
        </Text>
      </TouchableOpacity>

      {/* Filter and Sort */}
      {stats.totalReviews > 0 && (
        <View style={styles.filterContainer}>
          <ReviewFilter
            sortBy={sortBy}
            filterRating={filterRating}
            onSortChange={setSortBy}
            onFilterChange={setFilterRating}
          />
        </View>
      )}

      <Text style={styles.reviewsCount}>
        {processedReviews.length === allReviews.length
          ? `All Reviews (${processedReviews.length})`
          : `Showing ${processedReviews.length} of ${allReviews.length} reviews`}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner message="Loading reviews..." />
      </SafeAreaView>
    );
  }

  if (stats.totalReviews === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <EmptyState
          icon="chatbox-ellipses-outline"
          title="No Reviews Yet"
          message="Be the first to review this property!"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={processedReviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            currentUserId={user.id}
            isHelpfulMarked={item.markedHelpfulBy?.includes(user.id)}
            onHelpfulPress={() => handleToggleHelpful(item.id)}
            onEditPress={
              item.userId === user.id
                ? () => handleEditReview(item.id)
                : undefined
            }
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 16,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  breakdownContainer: {
    marginBottom: 20,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  writeReviewText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.inverse,
    marginLeft: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  reviewsCount: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
