import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';
import { COLORS } from '../constants/colors';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  onPress,
  rightComponent,
}) => {
  const isInteractive = onPress !== undefined;

  const content = (
    <>
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={22} color={Colors.primary} style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.rightContent}>
        {rightComponent || (
          <>
            {value && <Text style={styles.value}>{value}</Text>}
            {isInteractive && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            )}
          </>
        )}
      </View>
    </>
  );

  if (isInteractive) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    paddingVertical: 14,
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
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: COLORS.text.primary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginRight: 8,
  },
});
