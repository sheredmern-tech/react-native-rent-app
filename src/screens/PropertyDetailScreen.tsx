import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp, RootStackRouteProp } from '../types';
import { Colors, Fonts } from '../constants';
import { mockProperties } from '../data';
import { useFavorites } from '../context/FavoritesContext';

type PropertyDetailScreenProps = {
  navigation: RootStackNavigationProp<'PropertyDetail'>;
  route: RootStackRouteProp<'PropertyDetail'>;
};

export const PropertyDetailScreen: React.FC<PropertyDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { propertyId } = route.params;
  const property = mockProperties.find((p) => p.id === propertyId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const heartScaleAnim = useRef(new Animated.Value(1)).current;

  if (!property) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleShare = () => {
    console.log('Share property:', propertyId);
  };

  const handleContact = () => {
    console.log('Contact owner for property:', propertyId);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(propertyId);
    const favorited = isFavorite(propertyId);
    console.log(favorited ? 'Removed from favorites' : 'Added to favorites');

    // Animate heart
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.4,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const favorited = isFavorite(propertyId);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: property.imageUrl }}
            style={styles.headerImage}
            resizeMode="cover"
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gradientOverlay}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={28}
                color={favorited ? '#FF3B30' : 'white'}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Property Type Badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {property.type.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{property.title}</Text>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.text.secondary}
            />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>

          {/* Availability Status */}
          <View
            style={[
              styles.availabilityChip,
              property.isAvailable
                ? styles.availableChip
                : styles.rentedChip,
            ]}
          >
            <Text style={styles.availabilityChipText}>
              {property.isAvailable
                ? 'Available for Rent'
                : 'Currently Rented'}
            </Text>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>{formatPrice(property.price)}</Text>
            <Text style={styles.priceLabel}>/month</Text>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Ionicons
                name="bed-outline"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.detailNumber}>{property.bedrooms}</Text>
              <Text style={styles.detailLabel}>Bedrooms</Text>
            </View>

            <View style={styles.detailCard}>
              <Ionicons
                name="water-outline"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.detailNumber}>{property.bathrooms}</Text>
              <Text style={styles.detailLabel}>Bathrooms</Text>
            </View>

            <View style={styles.detailCard}>
              <Ionicons
                name="resize-outline"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.detailNumber}>{property.area}</Text>
              <Text style={styles.detailLabel}>m²</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About this property</Text>
            <Text style={styles.descriptionText}>{property.description}</Text>
          </View>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Features & Amenities</Text>
              <View style={styles.featuresGrid}>
                {property.features.map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={Colors.success}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Contact Button (Sticky) */}
      <SafeAreaView edges={['bottom']} style={styles.contactButtonContainer}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContact}
          activeOpacity={0.8}
        >
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: Fonts.size.xl,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.semiBold,
  },
  imageContainer: {
    position: 'relative',
    height: 350,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 50,
    right: 64,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 16,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginTop: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  availabilityChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  availableChip: {
    backgroundColor: Colors.success,
  },
  rentedChip: {
    backgroundColor: Colors.danger,
  },
  availabilityChipText: {
    fontSize: 14,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.white,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: Fonts.weight.bold,
    color: Colors.primary,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailNumber: {
    fontSize: 20,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: Fonts.weight.medium,
  },
  bottomPadding: {
    height: 100,
  },
  contactButtonContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.bold,
  },
});
