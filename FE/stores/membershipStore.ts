import { create } from 'zustand';

export type Plan = 'free' | 'plus';

export const DASH_PLUS_PRICE = 9900; // 월 구독가 (원)
export const DASH_PLUS_PRICE_YEARLY = 99000; // 연 구독가 (원)
/**
 * 무료 회원이 '연락 요청'을 보낼 수 있는 최대 촌수 (2촌까지). 3촌부터 Dash+ 전용.
 * 열람·탐색(소개 보기, 지인 리스트 drilldown)은 전 촌수 무료 — 게이팅은 연락 요청에만.
 */
export const FREE_HOP_LIMIT = 2;

interface MembershipState {
  plan: Plan;
  /** ISO date — Dash+ 다음 결제일 (plan === 'plus'일 때만) */
  plusUntil?: string;

  isPlus: () => boolean;
  upgradeToPlus: () => void;
  cancelPlus: () => void;
}

function addOneMonth(from: Date): string {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

export const useMembershipStore = create<MembershipState>((set, get) => ({
  plan: 'free',
  plusUntil: undefined,

  isPlus: () => get().plan === 'plus',

  // 실제 결제 연동(POST /billing/plus/checkout)은 TBD — 현재는 클라이언트 상태만 갱신
  upgradeToPlus: () =>
    set({ plan: 'plus', plusUntil: addOneMonth(new Date()) }),

  cancelPlus: () => set({ plan: 'free', plusUntil: undefined }),
}));
