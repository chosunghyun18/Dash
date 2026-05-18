import { Platform } from 'react-native';

export const radius = {
  sm: 12,
  md: 14,
  lg: 16,
  pill: 999,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
} as const;

export const safeBottomInset = Platform.select({ ios: 24, android: 14, default: 16 }) as number;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.15,
    shadowRadius: 70,
    elevation: 8,
  },
  heroAvatar: {
    shadowColor: 'rgba(255,75,110,0.25)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
