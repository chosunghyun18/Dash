import Constants, { ExecutionEnvironment } from 'expo-constants';

interface SecureStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string | boolean | number) => void;
  delete: (key: string) => void;
}

// Expo Go does not support custom native modules (react-native-mmkv).
// Fall back to an in-memory shim so dev screens can render. Tokens won't
// persist across reloads — acceptable for Expo Go dev only.
function createMemoryStorage(): SecureStorage {
  const map = new Map<string, string>();
  return {
    getString: (key: string) => map.get(key),
    set: (key: string, value: string | boolean | number) => {
      map.set(key, String(value));
    },
    delete: (key: string) => {
      map.delete(key);
    },
  } as SecureStorage;
}

function createMmkvStorage(): SecureStorage {
  const { MMKV } = require('react-native-mmkv');
  return new MMKV({
    id: 'dash-secure',
    encryptionKey: 'dash-secure-key-v1',
  });
}

export const secureStorage: SecureStorage =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient
    ? createMemoryStorage()
    : createMmkvStorage();

export const STORAGE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  provider: 'auth.provider',
  userId: 'auth.userId',
} as const;
