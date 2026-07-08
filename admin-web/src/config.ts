// 앱 전역 설정. API 베이스 URL 은 환경변수(VITE_API_URL) 우선, 없으면 로컬 BE.
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  apiVersion: '1.0.0',
} as const;
