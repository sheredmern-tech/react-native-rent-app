import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';
import { RecentView } from '../types/recentViews';
import { Colors, Fonts } from '../constants';
import { getRelativeTime } from '../utils/dateHelpers';

interface RecentViewCardProps {
  property: Property;
  recentView: RecentView;
  onPress: () => void;
}

export const RecentViewCard: React.FC<RecentViewCardProps> = ({
  property,
  recentView,
  onPress,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}/mo`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {!imageError ? (
          <>
            <Image
              source={{ uri: property.imageUrls[0] }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageLoading && (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.imageErrorContainer}>
            <Ionicons
              name="image-outline"
              size={32}
              color={Colors.text.disabled}
            />
          </View>
        )}

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />

        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {property.type.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={Colors.text.secondary}
          />
          <Text style={styles.location} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        {/* Price */}
        <Text style={styles.price} numberOfLines={1}>
          {formatPrice(property.price)}
        </Text>

        {/* Timestamp */}
        <View style={styles.timestampRow}>
          <Ionicons name="time-outline" size={11} color={Colors.text.disabled} />
          <Text style={styles.timestamp}>
            {getRelativeTime(recentView.viewedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageErrorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 0.5,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  location: {
    fontSize: 11,
    color: Colors.text.secondary,
    flex: 1,
  },
  price: {
    fontSize: 13,
    fontWeight: Fonts.weight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.text.disabled,
  },
});
