import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface MenuButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  icon,
  label,
  onPress,
  color = Colors.text.primary,
  showChevron = true,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={24} color={color} style={styles.icon} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.text.secondary}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
  },
});
