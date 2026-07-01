import { create } from 'zustand';
import { secureStorage, STORAGE_KEYS } from '../lib/storage';

export type AuthProvider = 'apple' | 'google';
export type AuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated';

/** 신규 유저 등록 대기 상태 — 소셜 인증은 됐지만 아직 회원이 아닌 단계의 registration 토큰. */
interface PendingRegistration {
  token: string;
  provider: AuthProvider;
}

interface AuthState {
  status: AuthStatus;
  provider?: AuthProvider;
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  /**
   * 등록 토큰(단기, 서버 10분 만료)은 일반 세션 토큰이 아니므로 secureStorage 에
   * 저장하지 않고 메모리에만 보관한다. register 성공(setSession) 시 소거된다.
   */
  pendingRegistration?: PendingRegistration;

  bootstrap: () => void;
  startAuthenticating: (provider: AuthProvider) => void;
  setSession: (s: { accessToken: string; refreshToken?: string; userId: string; provider: AuthProvider }) => void;
  setPendingRegistration: (p: PendingRegistration) => void;
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
    set({
      status: 'authenticated',
      accessToken,
      refreshToken,
      provider,
      userId,
      pendingRegistration: undefined,
    });
  },

  setPendingRegistration: ({ token, provider }) =>
    set({ status: 'authenticating', provider, pendingRegistration: { token, provider } }),

  cancelAuthenticating: () =>
    set({ status: 'unauthenticated', provider: undefined, pendingRegistration: undefined }),

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
      pendingRegistration: undefined,
    });
  },
}));

export function getAccessToken(): string | undefined {
  return secureStorage.getString(STORAGE_KEYS.accessToken);
}
