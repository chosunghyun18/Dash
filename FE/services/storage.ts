import { MMKV } from 'react-native-mmkv';

export const secureStorage = new MMKV({
  id: 'dash-secure',
  encryptionKey: 'dash-secure-key-v1',
});

export const STORAGE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  provider: 'auth.provider',
  userId: 'auth.userId',
} as const;
