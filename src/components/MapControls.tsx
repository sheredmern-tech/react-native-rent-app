import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMyLocation: () => void;
  onListView: () => void;
  hasLocationPermission: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onMyLocation,
  onListView,
  hasLocationPermission,
}) => {
  return (
    <View style={styles.container}>
      {/* Zoom Controls */}
      <View style={styles.controlGroup}>
        <TouchableOpacity
          style={[styles.button, styles.buttonTop]}
          onPress={onZoomIn}
          activeOpacity={0.7}
        >
          <Ionicons name="funnel-outline" size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={[styles.button, styles.buttonBottom]}
          onPress={onZoomOut}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Location Control */}
      {hasLocationPermission && (
        <TouchableOpacity
          style={[styles.button, styles.singleButton, styles.locationButton]}
          onPress={onMyLocation}
          activeOpacity={0.7}
        >
          <Ionicons name="locate" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* List View Control */}
      <TouchableOpacity
        style={[styles.button, styles.singleButton, styles.listButton]}
        onPress={onListView}
        activeOpacity={0.7}
      >
        <Ionicons name="layers-outline" size={20} color={COLORS.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 60 : 16,
    alignItems: 'flex-end',
    gap: 12,
  },
  controlGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  buttonTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  buttonBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  singleButton: {
    borderRadius: 8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  locationButton: {
    backgroundColor: COLORS.white,
  },
  listButton: {
    backgroundColor: COLORS.white,
  },
});
