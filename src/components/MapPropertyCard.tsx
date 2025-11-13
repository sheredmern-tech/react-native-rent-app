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
import { Property } from '../types';
import { Colors } from '../constants/colors';
import { useLocation } from '../context/LocationContext';
import { calculateDistance, formatDistance } from '../utils/locationHelpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface MapPropertyCardProps {
  property: Property;
  onPress: () => void;
}

const formatPrice = (price: number): string => {
  return `Rp ${price.toLocaleString('id-ID')}`;
};

export const MapPropertyCard: React.FC<MapPropertyCardProps> = ({
  property,
  onPress,
}) => {
  const { userLocation } = useLocation();

  const distance = userLocation
    ? calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      property.latitude,
      property.longitude
    )
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: property.imageUrls[0] }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Badges */}
      <View style={styles.badgeContainer}>
        <View style={[styles.badge, styles.typeBadge]}>
          <Text style={styles.badgeText}>{property.type}</Text>
        </View>
        {property.isAvailable && (
          <View style={[styles.badge, styles.availableBadge]}>
            <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
            <Text style={styles.badgeText}>Tersedia</Text>
          </View>
        )}
        {distance !== null && (
          <View style={[styles.badge, styles.distanceBadge]}>
            <Ionicons name="location" size={12} color={Colors.white} />
            <Text style={styles.badgeText}>{formatDistance(distance)}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
          <Text style={styles.location} numberOfLines={1}>
            {property.location}
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="bed-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.featureText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="water-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.featureText}>{property.bathrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="expand-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.featureText}>{property.area} m²</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
            <Text style={styles.period}>per bulan</Text>
          </View>

          <TouchableOpacity style={styles.detailButton} onPress={onPress}>
            <Text style={styles.detailButtonText}>Lihat Detail</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.background,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeBadge: {
    backgroundColor: Colors.primary,
  },
  availableBadge: {
    backgroundColor: Colors.success,
  },
  distanceBadge: {
    backgroundColor: Colors.info,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  features: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  period: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});