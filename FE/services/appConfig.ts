import { api } from './api';

export type UpdateStatus = 'OK' | 'SOFT_UPDATE' | 'FORCE_UPDATE';

export interface AppConfig {
  status: UpdateStatus;
  latestVersion: string;
  minSupportedVersion: string;
  storeUrl: string;
  message: string;
  maintenance: boolean;
}

export const appConfigService = {
  /**
   * 앱 버전 정책 조회 (인증 불필요). X-App-Version/X-Platform 헤더는 api 기본 헤더로 전송.
   * 호출 실패 시 게이트는 fail-open — 호출부에서 앱 진입을 막지 않는다.
   */
  get: async (): Promise<AppConfig> => {
    const { data } = await api.get<AppConfig>('/api/app-config');
    return data;
  },
};
