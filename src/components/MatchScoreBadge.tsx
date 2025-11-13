import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../constants';

interface MatchScoreBadgeProps {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
}

const getScoreColor = (score: number): { colors: readonly [string, string]; label: string } => {
  if (score >= 90) {
    return {
      colors: ['#4CAF50', '#45A049'] as const, // Excellent - Green
      label: 'Excellent Match',
    };
  } else if (score >= 70) {
    return {
      colors: ['#FFA500', '#FF8C00'] as const, // Good - Orange
      label: 'Good Match',
    };
  } else {
    return {
      colors: ['#FF9800', '#F57C00'] as const, // Fair - Amber
      label: 'Fair Match',
    };
  }
};

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = 'medium',
}) => {
  const { colors, label } = getScoreColor(score);

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      label: styles.labelLarge,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, currentSize.container]}
    >
      <Text style={[styles.scoreText, currentSize.text]}>{score}%</Text>
      {size !== 'small' && (
        <Text style={[styles.labelText, currentSize.label]}>{label}</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  containerSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  containerMedium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scoreText: {
    fontFamily: Fonts.family.bold,
    color: '#FFFFFF',
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
  labelText: {
    fontFamily: Fonts.family.medium,
    color: '#FFFFFF',
    marginTop: 2,
  },
  labelSmall: {
    fontSize: 8,
  },
  labelMedium: {
    fontSize: 10,
  },
  labelLarge: {
    fontSize: 11,
  },
});
