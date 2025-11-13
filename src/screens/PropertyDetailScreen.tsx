import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RootStackNavigationProp, RootStackRouteProp } from '../types';
import { Colors, Fonts } from '../constants';
import { mockProperties } from '../data';
import { useFavorites } from '../context/FavoritesContext';
import { useComparison } from '../context/ComparisonContext';
import { useLocation } from '../context/LocationContext';
import { useReviews } from '../context/ReviewContext';
import { useRecommendations } from '../context/RecommendationContext';
import { ImageCarousel, ImageThumbnailGrid, ImageViewerModal, OwnerCard, ContactOwnerModal, StarRating, ReviewCard, RecommendationSection } from '../components';
import { calculateDistance, formatDistance } from '../utils/locationHelpers';

const { width } = Dimensions.get('window');

type PropertyDetailScreenProps = {
  navigation: RootStackNavigationProp<'PropertyDetail'>;
  route: RootStackRouteProp<'PropertyDetail'>;
};

export const PropertyDetailScreen: React.FC<PropertyDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { property } = route.params;
  const { userLocation } = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, addToComparison, removeFromComparison } =
    useComparison();
  const { getReviewsByProperty, getReviewStats } = useReviews();
  const { getSimilarProperties } = useRecommendations();
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);

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
    console.log('Share property:', property.id);
  };

  const handleContact = () => {
    setContactModalVisible(true);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(property.id);
    const favorited = isFavorite(property.id);
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

  const handleToggleComparison = () => {
    if (!property) return;

    if (isInComparison(property.id)) {
      removeFromComparison(property.id);
    } else {
      addToComparison(property);
    }
  };

  const favorited = isFavorite(property.id);
  const inComparison = property ? isInComparison(property.id) : false;

  // Calculate distance from user location
  const distance = userLocation
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.latitude,
        property.longitude
      )
    : null;

  // Get reviews data
  const reviewStats = getReviewStats(property.id);
  const allReviews = getReviewsByProperty(property.id);
  const recentReviews = allReviews.slice(0, 2); // Show first 2 reviews

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
    setFullscreenVisible(true);
  };

  const handleThumbnailPress = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ImageCarousel
            images={property.imageUrls}
            onImagePress={handleImagePress}
            currentIndex={currentImageIndex}
          />

          {/* Gradient Overlay for Buttons */}
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.buttonGradient}
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

          {/* Compare Button */}
          <TouchableOpacity
            style={styles.compareBtn}
            onPress={handleToggleComparison}
            activeOpacity={0.7}
          >
            <Ionicons
              name={inComparison ? 'checkmark-circle' : 'git-compare-outline'}
              size={24}
              color={inComparison ? Colors.primary : 'white'}
            />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Thumbnail Grid */}
        <ImageThumbnailGrid
          images={property.imageUrls}
          onThumbnailPress={handleThumbnailPress}
          selectedIndex={currentImageIndex}
        />

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

          {/* Property Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Property Features</Text>
            <View style={styles.propertyFeaturesGrid}>
              <View style={styles.propertyFeatureRow}>
                <Ionicons
                  name={property.furnished ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={property.furnished ? '#10B981' : '#EF4444'}
                />
                <Text style={styles.propertyFeatureLabel}>Furnished</Text>
              </View>
              <View style={styles.propertyFeatureRow}>
                <Ionicons
                  name={property.petFriendly ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={property.petFriendly ? '#10B981' : '#EF4444'}
                />
                <Text style={styles.propertyFeatureLabel}>Pet Friendly</Text>
              </View>
              <View style={styles.propertyFeatureRow}>
                <Ionicons
                  name={property.hasParking ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={property.hasParking ? '#10B981' : '#EF4444'}
                />
                <Text style={styles.propertyFeatureLabel}>Parking Available</Text>
              </View>
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

          {/* Location Map */}
          <View style={styles.section}>
            <View style={styles.mapHeader}>
              <Text style={styles.sectionHeading}>Lokasi</Text>
              {distance !== null && (
                <View style={styles.distanceBadge}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.mapContainer}
              onPress={() => navigation.navigate('Map')}
              activeOpacity={0.9}
            >
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: property.latitude,
                  longitude: property.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: property.latitude,
                    longitude: property.longitude,
                  }}
                  title={property.title}
                />
              </MapView>
              <View style={styles.mapOverlay}>
                <Ionicons name="expand-outline" size={24} color={Colors.white} />
                <Text style={styles.mapOverlayText}>Lihat di Peta</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.addressText}>{property.location}</Text>
            </View>
          </View>

          {/* Reviews & Ratings */}
          {reviewStats.totalReviews > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeading}>Reviews & Ratings</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PropertyReviews', {
                      propertyId: property.id,
                      propertyTitle: property.title,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.seeAllText}>
                    See All ({reviewStats.totalReviews})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Rating Summary */}
              <View style={styles.ratingSummary}>
                <View style={styles.ratingLeft}>
                  <Text style={styles.ratingNumber}>
                    {reviewStats.averageRating.toFixed(1)}
                  </Text>
                  <StarRating
                    rating={reviewStats.averageRating}
                    size={20}
                    showNumber={false}
                  />
                  <Text style={styles.ratingCount}>
                    {reviewStats.totalReviews}{' '}
                    {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.writeReviewButton}
                  onPress={() =>
                    navigation.navigate('WriteReview', {
                      propertyId: property.id,
                      propertyTitle: property.title,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Ionicons name="chatbox-ellipses-outline" size={18} color={Colors.primary} />
                  <Text style={styles.writeReviewText}>Write Review</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Reviews */}
              {recentReviews.map((review) => (
                <View key={review.id} style={styles.reviewCardWrapper}>
                  <ReviewCard
                    review={review}
                    showActions={false}
                  />
                </View>
              ))}
            </View>
          )}

          {/* Owner Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Property Owner</Text>
            <OwnerCard owner={property.owner} onContactPress={handleContact} />
          </View>

          {/* Similar Properties */}
          <View style={styles.similarPropertiesSection}>
            <RecommendationSection
              title="Similar Properties"
              icon="home-outline"
              recommendations={getSimilarProperties(property.id).slice(0, 5)}
              onPressCard={(rec) =>
                navigation.push('PropertyDetail', { property: rec.property })
              }
              onPressSeeAll={() =>
                navigation.navigate('SimilarProperties', { propertyId: property.id })
              }
            />
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Action Buttons (Sticky) */}
      <SafeAreaView edges={['bottom']} style={styles.contactButtonContainer}>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => navigation.navigate('ScheduleVisit', { property })}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.scheduleButtonText}>Schedule Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContact}
            activeOpacity={0.8}
          >
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Fullscreen Image Viewer */}
      <ImageViewerModal
        visible={fullscreenVisible}
        images={property.imageUrls}
        initialIndex={currentImageIndex}
        onClose={() => setFullscreenVisible(false)}
      />

      {/* Contact Owner Modal */}
      <ContactOwnerModal
        visible={contactModalVisible}
        property={property}
        onClose={() => setContactModalVisible(false)}
      />
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
  carouselContainer: {
    position: 'relative',
  },
  buttonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: 'none',
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
    right: 112,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareBtn: {
    position: 'absolute',
    top: 50,
    right: 64,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  similarPropertiesSection: {
    marginTop: 24,
    marginLeft: -16,
    marginRight: -16,
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
  propertyFeaturesGrid: {
    gap: 16,
  },
  propertyFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  propertyFeatureLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: Fonts.weight.medium,
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
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  scheduleButtonText: {
    color: Colors.primary,
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.bold,
  },
  contactButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.bold,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.primary,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapOverlayText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: Fonts.weight.semiBold,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
  },
  ratingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  ratingNumber: {
    fontSize: 32,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginTop: 6,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}10`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  writeReviewText: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
    marginLeft: 6,
  },
  reviewCardWrapper: {
    marginTop: 12,
  },
});
