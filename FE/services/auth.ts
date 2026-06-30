import { api } from './api';

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
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/apple', req);
    return data;
  },

  loginWithGoogle: async (req: GoogleLoginRequest): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>('/api/v1/auth/google', req);
    return data;
  },

  /**
   * 개발 전용 로그인. BE(local 프로파일)의 `/api/v1/auth/dev` 가 시드 멤버로 정식 JWT를 발급.
   * 기본 memberId=1(수지). 운영 빌드에는 노출되지 않는다.
   */
  devLogin: async (memberId?: number): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>(
      '/api/v1/auth/dev',
      memberId ? { memberId } : {}
    );
    return data;
  },

  signOut: async (): Promise<void> => {
    await api.post('/api/v1/auth/sign-out');
  },
};
