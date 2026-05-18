import { create } from 'zustand';
import { secureStorage, STORAGE_KEYS } from '../services/storage';

export type AuthProvider = 'apple' | 'google';
export type AuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated';

interface AuthState {
  status: AuthStatus;
  provider?: AuthProvider;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;

  bootstrap: () => void;
  startAuthenticating: (provider: AuthProvider) => void;
  setSession: (s: { accessToken: string; refreshToken?: string; userId: string; provider: AuthProvider }) => void;
  cancelAuthenticating: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'unauthenticated',

  bootstrap: () => {
    const accessToken = secureStorage.getString(STORAGE_KEYS.accessToken);
    const refreshToken = secureStorage.getString(STORAGE_KEYS.refreshToken);
    const provider = secureStorage.getString(STORAGE_KEYS.provider) as AuthProvider | undefined;
    const userId = secureStorage.getString(STORAGE_KEYS.userId);

    if (accessToken && userId && provider) {
      set({ status: 'authenticated', accessToken, refreshToken, provider, userId });
    } else {
      set({ status: 'unauthenticated' });
    }
  },

  startAuthenticating: (provider) => set({ status: 'authenticating', provider }),

  setSession: ({ accessToken, refreshToken, userId, provider }) => {
    secureStorage.set(STORAGE_KEYS.accessToken, accessToken);
    if (refreshToken) secureStorage.set(STORAGE_KEYS.refreshToken, refreshToken);
    secureStorage.set(STORAGE_KEYS.provider, provider);
    secureStorage.set(STORAGE_KEYS.userId, userId);
    set({ status: 'authenticated', accessToken, refreshToken, provider, userId });
  },

  cancelAuthenticating: () => set({ status: 'unauthenticated', provider: undefined }),

  signOut: () => {
    secureStorage.delete(STORAGE_KEYS.accessToken);
    secureStorage.delete(STORAGE_KEYS.refreshToken);
    secureStorage.delete(STORAGE_KEYS.provider);
    secureStorage.delete(STORAGE_KEYS.userId);
    set({
      status: 'unauthenticated',
      accessToken: undefined,
      refreshToken: undefined,
      provider: undefined,
      userId: undefined,
    });
  },
}));

export function getAccessToken(): string | undefined {
  return secureStorage.getString(STORAGE_KEYS.accessToken);
}
