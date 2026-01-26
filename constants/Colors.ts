/**
 * DevPal Minimalist Color System
 * Based on blues, purples, cyans, and blacks for a modern, clean aesthetic
 */

export default {
  // Primary Brand Colors
  primary: "#0066FF", // Primary blue - main actions, headers
  secondary: "#C700FF", // Vibrant purple - secondary actions, accents

  // Blue Palette
  blue: {
    primary: "#0066FF", // Main blue
    light: "#7BA3FF", // Light blue
    medium: "#5881D8", // Medium blue
    dark: "#001F5C", // Dark blue
    lightest: "#B8CDFF", // Lightest blue for backgrounds
  },

  // Purple Palette
  purple: {
    vibrant: "#C700FF", // Vibrant purple
    dark: "#5D058C", // Dark purple
    medium: "#C77FF0", // Medium purple
    light: "#E8B3FF", // Light purple
    deep: "#7700B3", // Deep purple
  },

  // Cyan Palette
  cyan: {
    bright: "#00E5FF", // Bright cyan
    teal: "#21949C", // Teal
    light: "#96E3E8", // Light cyan
    medium: "#00C3D7", // Medium cyan
    muted: "#4F9FA3", // Muted cyan
  },

  // Neutral Colors
  black: "#000000",
  white: "#FFFFFF",
  gray: {
    50: "#F5F5F5", // Lightest gray - backgrounds
    100: "#E0E0E0", // Very light gray
    200: "#BDBDBD", // Light gray
    300: "#9E9E9E", // Medium gray
    400: "#757575", // Dark gray
    500: "#616161", // Darker gray
    600: "#424242", // Very dark gray
    700: "#212121", // Almost black
  },

  // Semantic Colors
  success: "#00C853", // Green for success states
  warning: "#FFB300", // Amber for warnings
  error: "#D32F2F", // Red for errors
  info: "#0066FF", // Blue for info

  // Text Colors
  text: {
    primary: "#000000", // Main text
    secondary: "#616161", // Secondary text
    disabled: "#9E9E9E", // Disabled text
    inverse: "#FFFFFF", // Text on dark backgrounds
  },

  // Background Colors
  background: {
    default: "#FFFFFF", // Main background
    paper: "#F5F5F5", // Card/paper background
    dark: "#000000", // Dark mode background
  },

  // Component-specific colors
  button: {
    primary: "#0066FF",
    primaryHover: "#0052CC",
    secondary: "#C700FF",
    secondaryHover: "#9D00CC",
    disabled: "#E0E0E0",
  },

  // Shadow colors
  shadow: {
    primary: "rgba(0, 102, 255, 0.3)",
    secondary: "rgba(199, 0, 255, 0.3)",
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.2)",
  },

  // Legacy theme colors (for compatibility)
  light: {
    text: "#000000",
    background: "#FFFFFF",
    tint: "#0066FF",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: "#0066FF",
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#00E5FF",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: "#00E5FF",
  },
};
