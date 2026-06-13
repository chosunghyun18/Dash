import type { TrailNode } from '../components/HopIndicators';

/**
 * 지인 네트워크 trail(루트 친구부터 현재 head까지의 경로) 직렬화 유틸.
 *
 * 화면 간 router 파라미터로 전달되는 trail의 인코딩/파싱을 한 곳에서 관리한다.
 * (홈 → 지인 리스트 → 드릴다운에서 동일한 포맷을 공유)
 */

/** trail 배열을 URL 파라미터용 문자열로 인코딩 */
export function encodeTrail(trail: TrailNode[]): string {
  return encodeURIComponent(JSON.stringify(trail));
}

/** 단일 노드로 시작하는 trail 파라미터 생성 (홈 화면 진입용) */
export function trailFromNode(userId: number, name: string): string {
  return encodeTrail([{ id: String(userId), name }]);
}

/** 기존 trail에 노드를 덧붙인 파라미터 생성 (드릴다운용) */
export function appendTrail(trail: TrailNode[], userId: number, name: string): string {
  return encodeTrail([...trail, { id: String(userId), name }]);
}

/** URL 파라미터 문자열을 TrailNode 배열로 파싱. 유효하지 않으면 빈 배열 */
export function parseTrail(raw?: string): TrailNode[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((n) => n && n.id && n.name);
  } catch {
    /* ignore malformed param */
  }
  return [];
}
