import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { useAuthStore } from '@/stores/authStore';

/**
 * 관리자 API axios 인스턴스. 화면에서 직접 호출하지 않고 services/ 레이어를 통해서만 사용한다
 * (앱 FE 규칙 준용). 공통 헤더 X-API-Version + Bearer(admin_access) 자동 주입, 401 시 1회 refresh.
 */
export const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': config.apiVersion,
  },
});

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// 동시 401 다발 시 refresh 를 1회로 합친다.
let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;
  try {
    const res = await axios.post(
      `${config.apiBaseUrl}/api/admin/auth/refresh`,
      { refreshToken },
      { headers: { 'X-API-Version': config.apiVersion } },
    );
    const newAccess = res.data.accessToken as string;
    useAuthStore.getState().setAccessToken(newAccess);
    return newAccess;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const url = original?.url ?? '';
    const isAuthEndpoint =
      url.includes('/api/admin/auth/login') || url.includes('/api/admin/auth/refresh');

    if (error.response?.status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      refreshing = refreshing ?? refreshAccessToken();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      // refresh 실패 → 세션 정리 후 로그인으로
      useAuthStore.getState().clear();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);
