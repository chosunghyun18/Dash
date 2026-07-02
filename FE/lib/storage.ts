import { Platform } from 'react-native';
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

// Expo Go(StoreClient)와 웹은 react-native-mmkv 네이티브 모듈을 쓸 수 없으므로
// 메모리 셰임으로 폴백. 네이티브 dev/release 빌드에서만 MMKV 사용.
export const secureStorage: SecureStorage =
  Platform.OS === 'web' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient
    ? createMemoryStorage()
    : createMmkvStorage();

export const STORAGE_KEYS = {
  accessToken: 'auth.accessToken',
  refreshToken: 'auth.refreshToken',
  provider: 'auth.provider',
  userId: 'auth.userId',
  /** SOFT_UPDATE 배너 마지막 노출 날짜(yyyy-mm-dd) — 1일 1회 노출 제어 */
  softUpdateShownDate: 'appConfig.softUpdateShownDate',
} as const;
