import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Review } from '../types';
import { Colors, Fonts } from '../constants';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: Review;
  onHelpfulPress?: () => void;
  onEditPress?: () => void;
  isHelpfulMarked?: boolean;
  showActions?: boolean;
  currentUserId?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpfulPress,
  onEditPress,
  isHelpfulMarked = false,
  showActions = true,
  currentUserId,
}) => {
  const [pulseAnim] = React.useState(new Animated.Value(1));

  const isOwnReview = currentUserId === review.userId;

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleHelpfulPress = () => {
    if (!onHelpfulPress) return;

    // Pulse animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onHelpfulPress();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(review.userName)}</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{review.userName}</Text>
            {review.verifiedStay && (
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={Colors.success}
                />
                <Text style={styles.verifiedText}>Verified Stay</Text>
              </View>
            )}
          </View>
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={Colors.text.secondary}
            />
            <Text style={styles.dateText}>{formatDate(review.createdAt)}</Text>
            {review.updatedAt && (
              <Text style={styles.editedText}>(edited)</Text>
            )}
          </View>
        </View>

        {/* Edit button for own reviews */}
        {isOwnReview && onEditPress && (
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <StarRating rating={review.rating} size={18} />
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{review.comment}</Text>

      {/* Actions */}
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleHelpfulPress}
            style={[
              styles.helpfulButton,
              isHelpfulMarked && styles.helpfulButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.helpfulContent,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Ionicons
                name={isHelpfulMarked ? 'thumbs-up' : 'thumbs-up-outline'}
                size={16}
                color={isHelpfulMarked ? Colors.primary : Colors.text.secondary}
              />
              <Text
                style={[
                  styles.helpfulText,
                  isHelpfulMarked && styles.helpfulTextActive,
                ]}
              >
                Helpful {review.helpfulCount > 0 ? `(${review.helpfulCount})` : ''}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: Fonts.family.bold,
    color: Colors.text.inverse,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.success}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: Fonts.family.medium,
    color: Colors.success,
    marginLeft: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  editedText: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  editButton: {
    padding: 8,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  comment: {
    fontSize: 15,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpfulButtonActive: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: Colors.primary,
  },
  helpfulContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  helpfulTextActive: {
    color: Colors.primary,
  },
});
