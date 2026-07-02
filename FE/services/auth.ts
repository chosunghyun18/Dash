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

/** 신규 회원 등록 요청 — 소셜 로그인에서 받은 registration 토큰과 함께 전송. */
export interface RegisterRequest {
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  birthYear?: number;
  phone?: string;
  email?: string;
  introText?: string;
}

export const authService = {
  loginWithApple: async (req: AppleLoginRequest): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>('/api/auth/apple', req);
    return data;
  },

  loginWithGoogle: async (req: GoogleLoginRequest): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>('/api/auth/google', req);
    return data;
  },

  /**
   * 신규 회원 등록. 소셜 로그인 응답이 `isNewUser=true` 일 때 받은 registration 토큰을
   * Authorization 헤더로 보내고, 프로필 정보로 회원을 생성해 정식 JWT를 발급받는다.
   */
  register: async (
    registrationToken: string,
    req: RegisterRequest
  ): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>('/api/auth/register', req, {
      headers: { Authorization: `Bearer ${registrationToken}` },
    });
    return data;
  },

  /**
   * 개발 전용 로그인. BE(local 프로파일)의 `/api/auth/dev` 가 시드 멤버로 정식 JWT를 발급.
   * 기본 memberId=1(수지). 운영 빌드에는 노출되지 않는다.
   */
  devLogin: async (memberId?: number): Promise<SocialLoginResponse> => {
    const { data } = await api.post<SocialLoginResponse>(
      '/api/auth/dev',
      memberId ? { memberId } : {}
    );
    return data;
  },

  signOut: async (): Promise<void> => {
    await api.post('/api/auth/sign-out');
  },
};
