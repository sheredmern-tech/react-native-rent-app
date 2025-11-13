import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../constants';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    marginRight: 8,
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.medium,
    color: Colors.text.primary,
  },
  activeLabel: {
    color: Colors.white,
  },
});
