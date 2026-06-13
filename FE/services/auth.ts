import { api } from './api';
import { USE_MOCK } from '../config';
import { authMocks } from '../mocks';

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

export const authService = {
  loginWithApple: async (req: AppleLoginRequest): Promise<SocialLoginResponse> => {
    if (USE_MOCK) return authMocks.loginWithApple();
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/apple', req);
    return data;
  },

  loginWithGoogle: async (req: GoogleLoginRequest): Promise<SocialLoginResponse> => {
    if (USE_MOCK) return authMocks.loginWithGoogle();
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/google', req);
    return data;
  },

  signOut: async (): Promise<void> => {
    if (USE_MOCK) return authMocks.signOut();
    await api.post('/api/v1/auth/sign-out');
  },
};
