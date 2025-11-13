import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Property } from '../types';
import { COLORS } from '../constants/colors';
import { mockProperties } from '../data/mockProperties';
import { MapPropertyMarker } from '../components/MapPropertyMarker';
import { MapPropertyCard } from '../components/MapPropertyCard';
import { MapControls } from '../components/MapControls';
import { LocationPermissionPrompt } from '../components/LocationPermissionPrompt';
import { useLocation } from '../context/LocationContext';
import { getRegionForProperties } from '../utils/locationHelpers';

type Props = StackScreenProps<RootStackParamList, 'Map'>;

const { height } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = 300;

export const MapScreen: React.FC<Props> = ({ navigation }) => {
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);

  const { userLocation, permission, requestPermission } = useLocation();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties] = useState<Property[]>(mockProperties);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region>(
    getRegionForProperties(mockProperties)
  );

  useEffect(() => {
    // Show permission prompt if not granted
    if (permission === 'denied') {
      setShowPermissionPrompt(true);
    }
  }, [permission]);

  const handleMarkerPress = (property: Property) => {
    setSelectedProperty(property);

    // Animate map to selected property
    mapRef.current?.animateToRegion(
      {
        latitude: property.latitude,
        longitude: property.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      350
    );
  };

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetail', { property });
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...mapRegion,
      latitudeDelta: mapRegion.latitudeDelta / 2,
      longitudeDelta: mapRegion.longitudeDelta / 2,
    };
    mapRef.current?.animateToRegion(newRegion, 300);
    setMapRegion(newRegion);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...mapRegion,
      latitudeDelta: mapRegion.latitudeDelta * 2,
      longitudeDelta: mapRegion.longitudeDelta * 2,
    };
    mapRef.current?.animateToRegion(newRegion, 300);
    setMapRegion(newRegion);
  };

  const handleMyLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        500
      );
    } else {
      setShowPermissionPrompt(true);
    }
  };

  const handleListView = () => {
    navigation.navigate('NearbyProperties');
  };

  const handleRequestPermission = async () => {
    setShowPermissionPrompt(false);
    await requestPermission();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={permission === 'granted'}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {properties.map((property) => (
          <MapPropertyMarker
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onPress={() => handleMarkerPress(property)}
          />
        ))}
      </MapView>

      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Peta Properti</Text>
          <Text style={styles.headerSubtitle}>
            {properties.length} properti tersedia
          </Text>
        </View>
      </SafeAreaView>

      {/* Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onMyLocation={handleMyLocation}
        onListView={handleListView}
        hasLocationPermission={permission === 'granted'}
      />

      {/* Bottom Sheet with Selected Property */}
      {selectedProperty && (
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}
          >
            <MapPropertyCard
              property={selectedProperty}
              onPress={() => handlePropertyPress(selectedProperty)}
            />
          </ScrollView>
        </View>
      )}

      {/* Location Permission Prompt */}
      <LocationPermissionPrompt
        visible={showPermissionPrompt}
        onRequestPermission={handleRequestPermission}
        onDismiss={() => setShowPermissionPrompt(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: 20,
  },
});
