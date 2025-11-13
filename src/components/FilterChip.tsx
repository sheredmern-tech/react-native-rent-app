import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface FilterChipProps {
  label: string;
  isActive: boolean | null;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isActive,
  onPress,
  icon,
}) => {
  const getChipStyle = () => {
    if (isActive === true) {
      return {
        container: styles.activeContainer,
        text: styles.activeText,
        iconColor: '#10B981',
        statusIcon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
      };
    } else if (isActive === false) {
      return {
        container: styles.inactiveContainer,
        text: styles.inactiveText,
        iconColor: '#EF4444',
        statusIcon: 'close-circle' as keyof typeof Ionicons.glyphMap,
      };
    } else {
      return {
        container: styles.neutralContainer,
        text: styles.neutralText,
        iconColor: '#9CA3AF',
        statusIcon: null,
      };
    }
  };

  const chipStyle = getChipStyle();

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle.container]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons name={icon} size={16} color={chipStyle.iconColor} />
        )}
        <Text style={[styles.label, chipStyle.text]}>{label}</Text>
        {chipStyle.statusIcon && (
          <Ionicons name={chipStyle.statusIcon} size={16} color={chipStyle.iconColor} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Neutral state (null)
  neutralContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  neutralText: {
    color: '#6B7280',
  },
  // Active state (true - green)
  activeContainer: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  activeText: {
    color: '#059669',
  },
  // Inactive state (false - red)
  inactiveContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  inactiveText: {
    color: '#DC2626',
  },
});
