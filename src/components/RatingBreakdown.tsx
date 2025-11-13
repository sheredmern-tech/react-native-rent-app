import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ReviewStats } from '../types';
import { Colors, Fonts } from '../constants';

interface RatingBreakdownProps {
  stats: ReviewStats;
}

const STAR_COLOR = '#FFD700';
const GRADIENT_COLORS = ['#FFD700', '#FFA500']; // Gold to Orange

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ stats }) => {
  const renderProgressBar = (rating: 1 | 2 | 3 | 4 | 5) => {
    const count = stats.ratingDistribution[rating];
    const percentage =
      stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

    return (
      <View key={rating} style={styles.progressRow}>
        <Text style={styles.ratingLabel}>{rating}</Text>
        <Ionicons name="star" size={14} color={STAR_COLOR} style={styles.starIcon} />

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            {percentage > 0 && (
              <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${percentage}%` }]}
              />
            )}
          </View>
        </View>

        <Text style={styles.countText}>{count}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Overall Rating */}
      <View style={styles.overallContainer}>
        <Text style={styles.ratingNumber}>
          {stats.averageRating.toFixed(1)}
        </Text>
        <View style={styles.starsRow}>
          {Array(5)
            .fill(0)
            .map((_, index) => {
              const isFilled = index < Math.floor(stats.averageRating);
              const isHalf =
                !isFilled &&
                index === Math.floor(stats.averageRating) &&
                stats.averageRating % 1 >= 0.5;

              return (
                <Ionicons
                  key={index}
                  name={isFilled ? 'star' : isHalf ? 'star-half' : 'star-outline'}
                  size={20}
                  color={STAR_COLOR}
                />
              );
            })}
        </View>
        <Text style={styles.totalReviews}>
          Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
        </Text>
      </View>

      {/* Rating Distribution */}
      <View style={styles.distributionContainer}>
        {([5, 4, 3, 2, 1] as const).map((rating) => renderProgressBar(rating))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overallContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 48,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  distributionContainer: {
    gap: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
    width: 12,
  },
  starIcon: {
    marginLeft: 4,
    marginRight: 8,
  },
  progressBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  countText: {
    fontSize: 13,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
    width: 30,
    textAlign: 'right',
  },
});
