import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appConfigService, AppConfig } from '../services/appConfig';
import { secureStorage, STORAGE_KEYS } from '../lib/storage';

/** 게이트 판정 결과. pass 외에는 UpdateGate 가 오버레이를 렌더한다. */
export type GateState =
  | { kind: 'pass' }
  | { kind: 'maintenance'; message: string }
  | { kind: 'force'; storeUrl: string; message: string; latestVersion: string }
  | { kind: 'soft'; storeUrl: string; message: string; latestVersion: string };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 앱 시작 시 1회 앱 버전 정책을 조회해 게이트 상태를 반환한다.
 *
 * fail-open: 호출 실패/타임아웃/로딩 중에는 항상 pass — maintenance 또는
 * FORCE_UPDATE 가 성공 응답으로 확정된 경우에만 차단한다.
 * SOFT_UPDATE 는 1일 1회만 노출(마지막 노출 날짜를 storage에 기록).
 */
export function useAppConfigGate(): { gate: GateState; dismissSoft: () => void } {
  const { data } = useQuery<AppConfig>({
    queryKey: ['app-config'],
    queryFn: appConfigService.get,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const [softVisible, setSoftVisible] = useState(false);

  useEffect(() => {
    if (data?.status !== 'SOFT_UPDATE' || data.maintenance) return;
    const todayStr = today();
    if (secureStorage.getString(STORAGE_KEYS.softUpdateShownDate) === todayStr) return; // 오늘 이미 노출
    secureStorage.set(STORAGE_KEYS.softUpdateShownDate, todayStr);
    setSoftVisible(true);
  }, [data]);

  const dismissSoft = useCallback(() => setSoftVisible(false), []);

  const gate = useMemo<GateState>(() => {
    if (!data) return { kind: 'pass' }; // fail-open: 로딩/실패 시 진입 허용
    if (data.maintenance) {
      return { kind: 'maintenance', message: data.message };
    }
    if (data.status === 'FORCE_UPDATE') {
      return {
        kind: 'force',
        storeUrl: data.storeUrl,
        message: data.message,
        latestVersion: data.latestVersion,
      };
    }
    if (data.status === 'SOFT_UPDATE' && softVisible) {
      return {
        kind: 'soft',
        storeUrl: data.storeUrl,
        message: data.message,
        latestVersion: data.latestVersion,
      };
    }
    return { kind: 'pass' };
  }, [data, softVisible]);

  return { gate, dismissSoft };
}
