import { api } from '@/services/api';
import type { AdminProfile } from '@/stores/authStore';

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
}

/** 관리자 인증 API (BE /api/admin/auth/**). */
export const adminAuthService = {
  login: async (loginId: string, password: string): Promise<AdminLoginResponse> =>
    (await api.post('/api/admin/auth/login', { loginId, password })).data,

  me: async (): Promise<AdminProfile> => (await api.get('/api/admin/auth/me')).data,
};
