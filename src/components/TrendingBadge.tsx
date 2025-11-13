import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '../constants';

interface TrendingBadgeProps {
  rank?: number; // 1-10
}

export const TrendingBadge: React.FC<TrendingBadgeProps> = ({ rank }) => {
  return (
    <LinearGradient
      colors={['#FF5252', '#F44336'] as const}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Ionicons name="flame" size={12} color="#FFFFFF" />
      <Text style={styles.text}>Trending</Text>
      {rank && <Text style={styles.rank}>#{rank}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 10,
    fontFamily: Fonts.family.bold,
    color: '#FFFFFF',
  },
  rank: {
    fontSize: 10,
    fontFamily: Fonts.family.bold,
    color: '#FFFFFF',
  },
});
