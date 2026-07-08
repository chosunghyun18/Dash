import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AdminRole } from '@/rbac';

export interface AdminProfile {
  id: number;
  loginId: string;
  name: string;
  role: AdminRole;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminProfile | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setAdmin: (admin: AdminProfile) => void;
  clear: () => void;
}

/**
 * 관리자 세션 스토어. 앱의 MMKV 규칙에 준하는 "안전 저장" 원칙으로 sessionStorage 에만 보관
 * (탭 종료 시 소멸, localStorage 미사용). accessToken 은 2h, refreshToken 은 24h.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      admin: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setAdmin: (admin) => set({ admin }),
      clear: () => set({ accessToken: null, refreshToken: null, admin: null }),
    }),
    {
      name: 'dash-admin-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
