import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PropertyRecommendation } from '../types';
import { Colors, Fonts } from '../constants';
import { MatchScoreBadge } from './MatchScoreBadge';
import { TrendingBadge } from './TrendingBadge';
import { NewListingBadge } from './NewListingBadge';

interface RecommendationCardProps {
  recommendation: PropertyRecommendation;
  onPress: () => void;
  width?: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
  width = 280,
}) => {
  const { property, matchScore, isTrending, isNew, trendingRank } = recommendation;

  const formatPrice = (price: number): string => {
    return `Rp ${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.imageUrls[0] }} style={styles.image} />

        {/* Badges overlay */}
        <View style={styles.badgesContainer}>
          <View style={styles.topBadges}>
            {isTrending && <TrendingBadge rank={trendingRank} />}
            {isNew && <NewListingBadge />}
          </View>
          <View style={styles.matchBadge}>
            <MatchScoreBadge score={matchScore} size="small" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={14} color={Colors.primary} />
            <Text style={styles.detailText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={14} color={Colors.primary} />
            <Text style={styles.detailText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={14} color={Colors.primary} />
            <Text style={styles.detailText}>{property.area}m²</Text>
          </View>
        </View>

        {/* Price */}
        <Text style={styles.price}>{formatPrice(property.price)}/month</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 8,
  },
  topBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  matchBadge: {
    alignSelf: 'flex-end',
  },
  content: {
    padding: 12,
  },
  typeBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
  },
  price: {
    fontSize: 18,
    fontFamily: Fonts.family.bold,
    color: Colors.primary,
  },
});
