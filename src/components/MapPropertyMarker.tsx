import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Property } from '../types';
import { COLORS } from '../constants/colors';

interface MapPropertyMarkerProps {
  property: Property;
  isSelected?: boolean;
  onPress: () => void;
}

export const MapPropertyMarker: React.FC<MapPropertyMarkerProps> = ({
  property,
  isSelected = false,
  onPress,
}) => {
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}jt`;
    }
    return `${(price / 1000).toFixed(0)}rb`;
  };

  return (
    <Marker
      coordinate={{
        latitude: property.latitude,
        longitude: property.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false} // Optimize performance
    >
      <View style={[styles.markerContainer, isSelected && styles.markerSelected]}>
        <View style={[styles.markerBubble, isSelected && styles.bubbleSelected]}>
          <Text style={[styles.markerText, isSelected && styles.textSelected]}>
            {formatPrice(property.price)}
          </Text>
        </View>
        <View style={[styles.markerArrow, isSelected && styles.arrowSelected]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  markerSelected: {
    zIndex: 1000,
  },
  markerBubble: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bubbleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  markerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  textSelected: {
    color: COLORS.white,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.primary,
    marginTop: -1,
  },
  arrowSelected: {
    borderTopColor: COLORS.primary,
  },
});
