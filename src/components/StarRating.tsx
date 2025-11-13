import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface StarRatingProps {
  rating: number; // 0-5
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumber?: boolean;
  showCount?: boolean;
  count?: number;
}

const STAR_COLOR = '#FFD700'; // Gold color for stars
const ANIMATION_DURATION = 200;

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 20,
  interactive = false,
  onRatingChange,
  showNumber = false,
  showCount = false,
  count,
}) => {
  const [animatedScales] = React.useState(
    Array(5)
      .fill(0)
      .map(() => new Animated.Value(1))
  );

  const handleStarPress = (selectedRating: number) => {
    if (!interactive || !onRatingChange) return;

    // Animate the pressed star
    Animated.sequence([
      Animated.timing(animatedScales[selectedRating - 1], {
        toValue: 1.3,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScales[selectedRating - 1], {
        toValue: 1,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
    ]).start();

    onRatingChange(selectedRating);
  };

  const renderStar = (index: number) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= Math.floor(rating);
    const isHalf = !isFilled && starNumber === Math.ceil(rating) && rating % 1 !== 0;

    let iconName: keyof typeof Ionicons.glyphMap = 'star-outline';
    if (isFilled) {
      iconName = 'star';
    } else if (isHalf) {
      iconName = 'star-half';
    }

    const StarComponent = interactive ? TouchableOpacity : View;

    return (
      <StarComponent
        key={index}
        onPress={interactive ? () => handleStarPress(starNumber) : undefined}
        activeOpacity={0.7}
        style={styles.starContainer}
      >
        <Animated.View
          style={[
            {
              transform: [{ scale: animatedScales[index] }],
            },
          ]}
        >
          <Ionicons name={iconName} size={size} color={STAR_COLOR} />
        </Animated.View>
      </StarComponent>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array(5)
          .fill(0)
          .map((_, index) => renderStar(index))}
      </View>
      {showNumber && (
        <Text style={[styles.ratingNumber, { fontSize: size * 0.9 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {showCount && count !== undefined && (
        <Text style={styles.reviewCount}>({count})</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  starContainer: {
    padding: 2,
  },
  ratingNumber: {
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
});
