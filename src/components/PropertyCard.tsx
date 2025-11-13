import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';
import { Colors, Fonts } from '../constants';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}/mo`;
  };

  const visibleFeatures = property.features?.slice(0, 3) || [];
  const remainingFeaturesCount =
    (property.features?.length || 0) - visibleFeatures.length;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

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

          {/* Availability Badge */}
          <View
            style={[
              styles.availabilityBadge,
              property.isAvailable
                ? styles.availableBadge
                : styles.rentedBadge,
            ]}
          >
            <Text style={styles.availabilityText}>
              {property.isAvailable ? 'AVAILABLE' : 'RENTED'}
            </Text>
          </View>

          {/* Title and Location on Gradient */}
          <View style={styles.imageTextContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="white" />
              <Text style={styles.location} numberOfLines={1}>
                {property.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Price */}
          <Text style={styles.price}>{formatPrice(property.price)}</Text>

          {/* Details Row */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons
                name="bed-outline"
                size={16}
                color={Colors.text.secondary}
              />
              <Text style={styles.detailText}>{property.bedrooms}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons
                name="water-outline"
                size={16}
                color={Colors.text.secondary}
              />
              <Text style={styles.detailText}>{property.bathrooms}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons
                name="resize-outline"
                size={16}
                color={Colors.text.secondary}
              />
              <Text style={styles.detailText}>{property.area} m²</Text>
            </View>
          </View>

          {/* Features */}
          {visibleFeatures.length > 0 && (
            <View style={styles.featuresContainer}>
              {visibleFeatures.map((feature, index) => (
                <View key={index} style={styles.featureChip}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              {remainingFeaturesCount > 0 && (
                <View style={styles.featureChip}>
                  <Text style={styles.featureText}>
                    +{remainingFeaturesCount} more
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 0.5,
  },
  availabilityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: Colors.success,
  },
  rentedBadge: {
    backgroundColor: Colors.danger,
  },
  availabilityText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 0.5,
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    color: Colors.white,
    fontSize: 14,
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: Fonts.weight.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: Fonts.weight.medium,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: Fonts.weight.medium,
  },
});
