export interface Friend {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
}

/** 연결 거리 — 2촌(친구의 지인) · 3촌(친구의 친구의 지인) */
export type Hop = 2 | 3;

export interface Acquaintance {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  hasAcquaintances: boolean;
  bio?: string | null;
  /** 나로부터의 연결 거리 (없으면 2촌으로 간주) */
  hop?: Hop;
  /** 소개 경로 — "민수 → 하은" */
  via?: string;
  /** 이 사람이 등록한 지인 수 (드릴다운 "지인 N명 더 보기"에 사용) */
  acquaintanceCount?: number;
}

export interface UserProfile {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  introText: string;
  hasAcquaintances: boolean;
}

export interface ContactRequest {
  id: number;
  targetUserId: number;
  targetNickname: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  contactPhone?: string;
  contactEmail?: string;
  /** 소개 경로 — "민수를 통해" */
  via?: string;
}

export interface ReceivedContactRequest {
  id: number;
  requesterUserId: number;
  requesterNickname: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  contactPhone?: string;
  contactEmail?: string;
  /** 소개 경로 — "민수의 소개" */
  via?: string;
}

export interface AcceptContactResponse {
  requestId: number;
  contactPhone?: string;
  contactEmail?: string;
}

export interface MyProfile {
  nickname: string;
  phone?: string;
  email?: string;
  introText: string;
}
