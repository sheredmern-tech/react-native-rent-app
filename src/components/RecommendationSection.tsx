import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PropertyRecommendation } from '../types';
import { Colors, Fonts } from '../constants';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  recommendations: PropertyRecommendation[];
  onPressCard: (recommendation: PropertyRecommendation) => void;
  onPressSeeAll?: () => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  icon,
  recommendations,
  onPressCard,
  onPressSeeAll,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name={icon} size={24} color={Colors.primary} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {onPressSeeAll && (
          <TouchableOpacity onPress={onPressSeeAll} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={292} // 280 width + 12 margin
        snapToAlignment="start"
      >
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.property.id}
            recommendation={recommendation}
            onPress={() => onPressCard(recommendation)}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 4,
  },
});
