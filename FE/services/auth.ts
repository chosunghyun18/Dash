import { api } from './api';

export const USE_MOCK_AUTH = true;

export interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  isNewUser: boolean;
}

interface AppleLoginRequest {
  identityToken: string;
  authorizationCode: string;
  fullName?: string | null;
  email?: string | null;
}

interface GoogleLoginRequest {
  idToken: string;
}

async function mockDelay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const authService = {
  loginWithApple: async (req: AppleLoginRequest): Promise<SocialLoginResponse> => {
    if (USE_MOCK_AUTH) {
      return mockDelay({
        accessToken: 'mock-access-apple',
        refreshToken: 'mock-refresh-apple',
        userId: 'mock-user-1',
        isNewUser: false,
      });
    }
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/apple', req);
    return data;
  },

  loginWithGoogle: async (req: GoogleLoginRequest): Promise<SocialLoginResponse> => {
    if (USE_MOCK_AUTH) {
      return mockDelay({
        accessToken: 'mock-access-google',
        refreshToken: 'mock-refresh-google',
        userId: 'mock-user-1',
        isNewUser: false,
      });
    }
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/google', req);
    return data;
  },

  signOut: async (): Promise<void> => {
    if (USE_MOCK_AUTH) return mockDelay(undefined, 200);
    await api.post('/api/v1/auth/sign-out');
  },
};
