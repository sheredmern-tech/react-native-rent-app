import { ColorScheme } from '../types/theme';

export const lightColors: ColorScheme = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',

  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#FFFFFF',

  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    disabled: '#8E8E93',
    inverse: '#FFFFFF',
  },

  textPrimary: '#000000',
  textSecondary: '#3C3C43',
  textLight: '#8E8E93',

  border: '#C6C6C8',
  divider: '#E5E5EA',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C6C6C8',
    500: '#AEAEB2',
    600: '#8E8E93',
    700: '#636366',
    800: '#48484A',
    900: '#3A3A3C',
  },
};

export const darkColors: ColorScheme = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#32D74B',
  warning: '#FF9F0A',
  danger: '#FF453A',
  info: '#64D2FF',

  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',

  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    disabled: '#8E8E93',
    inverse: '#000000',
  },

  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textLight: '#8E8E93',

  border: '#38383A',
  divider: '#48484A',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    100: '#1C1C1E',
    200: '#2C2C2E',
    300: '#3A3A3C',
    400: '#48484A',
    500: '#636366',
    600: '#8E8E93',
    700: '#AEAEB2',
    800: '#C6C6C8',
    900: '#E5E5EA',
  },
};

// Default export for backward compatibility
export const Colors = lightColors;
export const COLORS = Colors;
export type ColorType = typeof Colors;