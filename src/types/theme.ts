export type ThemeMode = 'light' | 'dark';

export interface ColorScheme {
  // Core colors
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;

  // Background colors
  background: string;
  surface: string;
  card: string;

  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };

  // Legacy text colors (for backward compatibility)
  textPrimary: string;
  textSecondary: string;
  textLight: string;

  // UI colors
  border: string;
  divider: string;

  // Basic colors
  white: string;
  black: string;

  // Gray scale
  gray: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorScheme;
  themeMode: ThemeMode;
}
