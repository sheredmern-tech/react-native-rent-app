import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingStatus } from '../types';
import { Fonts } from '../constants';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: 'small' | 'medium' | 'large';
}

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  pending: {
    label: 'Pending',
    color: '#F57C00',
    backgroundColor: '#FFF3E0',
    icon: 'time-outline',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#388E3C',
    backgroundColor: '#E8F5E9',
    icon: 'checkmark-circle-outline',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#D32F2F',
    backgroundColor: '#FFEBEE',
    icon: 'close-circle-outline',
  },
  completed: {
    label: 'Completed',
    color: '#616161',
    backgroundColor: '#F5F5F5',
    icon: 'checkmark-done-outline',
  },
};

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const config = STATUS_CONFIG[status];

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      iconSize: 14,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      iconSize: 16,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      iconSize: 20,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        currentSize.container,
        { backgroundColor: config.backgroundColor },
      ]}
    >
      <Ionicons name={config.icon} size={currentSize.iconSize} color={config.color} />
      <Text style={[styles.text, currentSize.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  containerLarge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  text: {
    fontFamily: Fonts.family.semiBold,
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 15,
  },
});
