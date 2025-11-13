import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Property } from '../types';
import { Colors } from '../constants/colors';
import { mockProperties } from '../data/mockProperties';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { LocationPermissionPrompt } from '../components/LocationPermissionPrompt';
import { useLocation } from '../context/LocationContext';
import { sortPropertiesByDistance, calculateDistance } from '../utils/locationHelpers';

type Props = StackScreenProps<RootStackParamList, 'NearbyProperties'>;

export const NearbyPropertiesScreen: React.FC<Props> = ({ navigation }) => {
  const { userLocation, permission, requestPermission } = useLocation();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(10); // km

  useEffect(() => {
    loadNearbyProperties();
  }, [userLocation, maxDistance]);

  const loadNearbyProperties = () => {
    setLoading(true);

    if (!userLocation) {
      // If no location, show all properties unsorted
      setProperties(mockProperties);
      setLoading(false);
      if (permission === 'denied') {
        setShowPermissionPrompt(true);
      }
      return;
    }

    // Sort properties by distance
    const sorted = sortPropertiesByDistance(
      mockProperties,
      userLocation.latitude,
      userLocation.longitude
    );

    // Filter by max distance if needed
    const filtered = sorted.filter((property) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.latitude,
        property.longitude
      );
      return distance <= maxDistance;
    });

    setProperties(filtered);
    setLoading(false);
  };

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetail', { property });
  };

  const handleRequestPermission = async () => {
    setShowPermissionPrompt(false);
    await requestPermission();
  };

  const handleMapView = () => {
    navigation.navigate('Map');
  };

  const renderDistanceFilter = () => {
    const distances = [5, 10, 20, 50];

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Radius:</Text>
        <View style={styles.filterButtons}>
          {distances.map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.filterButton,
                maxDistance === distance && styles.filterButtonActive,
              ]}
              onPress={() => setMaxDistance(distance)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  maxDistance === distance && styles.filterButtonTextActive,
                ]}
              >
                {distance} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContent}>
        {userLocation && renderDistanceFilter()}

        <View style={styles.resultInfo}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <Text style={styles.resultText}>
            {properties.length} properti terdekat
            {!userLocation && ' (Izinkan akses lokasi untuk filter jarak)'}
          </Text>
        </View>

        {!userLocation && (
          <TouchableOpacity
            style={styles.enableLocationButton}
            onPress={() => setShowPermissionPrompt(true)}
          >
            <Ionicons name="location-outline" size={20} color={Colors.white} />
            <Text style={styles.enableLocationText}>Aktifkan Lokasi</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Properti Terdekat</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat properti...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properti Terdekat</Text>
        <TouchableOpacity style={styles.mapButton} onPress={handleMapView}>
          <Ionicons name="map" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title="Tidak ada properti terdekat"
            message={`Tidak ada properti dalam radius ${maxDistance} km dari lokasi Anda.`}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <LocationPermissionPrompt
        visible={showPermissionPrompt}
        onRequestPermission={handleRequestPermission}
        onDismiss={() => setShowPermissionPrompt(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  mapButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  listContent: {
    padding: 16,
  },
  headerContent: {
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  resultInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  resultText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
  },
  enableLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  enableLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});