import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types';
import { Colors, Fonts, Animations } from '../constants';

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
  index?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  index = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fade in animation with stagger
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: Animations.duration.normal,
      delay: index * 50, // Stagger animation
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: Animations.scale.press,
      ...Animations.spring.default,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: Animations.scale.active,
      ...Animations.spring.default,
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
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {!imageError ? (
            <>
              <Image
                source={{ uri: property.imageUrl }}
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
                size={40}
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
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
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
