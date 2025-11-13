import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../constants';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Dark Mode
          </Text>
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {isDark ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.gray[300], true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray[300]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: Fonts.weight.semiBold,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontWeight: Fonts.weight.regular,
  },
});
