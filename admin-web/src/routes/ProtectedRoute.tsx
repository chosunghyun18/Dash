import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import { adminAuthService } from '@/services/adminAuth';

/**
 * 인증 가드. 토큰 없으면 로그인으로. 토큰은 있으나 프로필 미보유 시(새로고침 등)
 * /me 로 하이드레이트하며 검증한다. /me 401 이면 api 인터셉터가 세션 정리 후 로그인으로 보낸다.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);

  const { isLoading, isError } = useQuery({
    queryKey: ['admin-me'],
    queryFn: async () => {
      const me = await adminAuthService.me();
      setAdmin(me);
      return me;
    },
    enabled: !!accessToken && !admin,
  });

  if (!accessToken) return <Navigate to="/login" replace />;
  if (!admin && isLoading) {
    return <Spin size="large" fullscreen tip="불러오는 중…" />;
  }
  if (!admin && isError) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
