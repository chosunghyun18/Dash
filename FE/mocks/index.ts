/**
 * 개발 모드 전용 mock 데이터 및 mock 서비스 구현.
 *
 * FE 전역의 하드코딩 mock을 이 파일 한 곳에서 모두 관리한다.
 * services/* 는 config.USE_MOCK 가 true일 때만 여기를 호출하며,
 * 개발/운영 모드에서는 BE API를 호출한다.
 */
import type {
  Friend, Acquaintance, UserProfile, ContactRequest,
  ReceivedContactRequest, AcceptContactResponse, MyProfile,
} from '../types';
import type { SocialLoginResponse } from '../services/auth';

// ──────────────────────────────────────────────────────────────
// 데이터셋
// ──────────────────────────────────────────────────────────────

const FRIENDS: Friend[] = [
  { id: 1, userId: 101, nickname: '김민준', profileImageUrl: null, bio: '안녕하세요! 만나서 반갑습니다.' },
  { id: 2, userId: 102, nickname: '이서연', profileImageUrl: null, bio: '여행을 좋아하는 서연입니다.' },
  { id: 3, userId: 103, nickname: '박지현', profileImageUrl: null, bio: '커피와 책을 사랑합니다.' },
  { id: 4, userId: 104, nickname: '최준호', profileImageUrl: null, bio: '운동을 즐기는 준호입니다.' },
  { id: 5, userId: 105, nickname: '강수빈', profileImageUrl: null, bio: '음악을 좋아하는 수빈입니다.' },
];

const ACQUAINTANCES: Record<number, Acquaintance[]> = {
  101: [
    { id: 1, userId: 201, nickname: '정하은', profileImageUrl: null, hasAcquaintances: true },
    { id: 2, userId: 202, nickname: '윤서진', profileImageUrl: null, hasAcquaintances: true },
    { id: 3, userId: 203, nickname: '한지우', profileImageUrl: null, hasAcquaintances: false },
  ],
  102: [
    { id: 4, userId: 204, nickname: '오태양', profileImageUrl: null, hasAcquaintances: true },
    { id: 5, userId: 205, nickname: '장은비', profileImageUrl: null, hasAcquaintances: false },
  ],
  103: [
    { id: 6, userId: 206, nickname: '임도현', profileImageUrl: null, hasAcquaintances: true },
  ],
  104: [
    { id: 7, userId: 207, nickname: '신예진', profileImageUrl: null, hasAcquaintances: false },
    { id: 8, userId: 208, nickname: '류민서', profileImageUrl: null, hasAcquaintances: true },
  ],
  105: [
    { id: 9, userId: 209, nickname: '고나라', profileImageUrl: null, hasAcquaintances: true },
  ],
  201: [
    { id: 10, userId: 301, nickname: '배성우', profileImageUrl: null, hasAcquaintances: false },
    { id: 11, userId: 302, nickname: '전지유', profileImageUrl: null, hasAcquaintances: false },
  ],
  204: [
    { id: 12, userId: 303, nickname: '홍다인', profileImageUrl: null, hasAcquaintances: false },
  ],
};

const PROFILES: Record<number, UserProfile> = {
  101: {
    userId: 101, nickname: '김민준', profileImageUrl: null,
    introText: '안녕하세요! 저는 서울에 사는 28살 김민준입니다.\n\n취미는 독서와 영화 감상이에요. 주말에는 한강 공원을 산책하거나 카페에서 책을 읽어요.\n\n진지하고 성실한 인연을 찾고 있습니다.',
    hasAcquaintances: true,
  },
  102: {
    userId: 102, nickname: '이서연', profileImageUrl: null,
    introText: '여행을 좋아하는 27살 이서연이에요.\n\n아직 가보지 못한 나라가 너무 많아서 시간이 날 때마다 떠나려 해요. 같이 여행 이야기 나눌 분 환영합니다!',
    hasAcquaintances: true,
  },
  103: {
    userId: 103, nickname: '박지현', profileImageUrl: null,
    introText: '커피와 책을 사랑하는 박지현입니다.\n\n바리스타 자격증을 보유하고 있어요. 조용하고 따뜻한 시간을 함께할 분을 찾고 있어요.',
    hasAcquaintances: true,
  },
  104: {
    userId: 104, nickname: '최준호', profileImageUrl: null,
    introText: '운동을 즐기는 최준호입니다.\n\n크로스핏 3년차, 등산도 좋아해요. 건강한 라이프스타일을 함께 할 분이면 좋겠어요!',
    hasAcquaintances: true,
  },
  105: {
    userId: 105, nickname: '강수빈', profileImageUrl: null,
    introText: '음악을 사랑하는 강수빈이에요.\n\n피아노를 10년 넘게 쳤고, 요즘은 재즈에 빠져 있어요. 공연이나 전시 함께 다닐 분을 찾아요.',
    hasAcquaintances: true,
  },
  201: {
    userId: 201, nickname: '정하은', profileImageUrl: null,
    introText: '안녕하세요! 커피를 사랑하는 정하은입니다.\n\n바리스타 자격증 보유중이에요. 맛있는 커피와 따뜻한 대화를 좋아합니다.',
    hasAcquaintances: true,
  },
  202: {
    userId: 202, nickname: '윤서진', profileImageUrl: null,
    introText: '반갑습니다. 회사원 윤서진입니다.\n\n퇴근 후에는 헬스장에서 운동하거나 유튜브를 보며 쉬어요. 소소한 일상을 공유할 분을 찾습니다.',
    hasAcquaintances: false,
  },
  204: {
    userId: 204, nickname: '오태양', profileImageUrl: null,
    introText: '개발자 오태양입니다.\n\n주말에는 사이드 프로젝트 개발, 평일엔 당근마켓 눈팅이 취미입니다. 같이 코딩하거나 맛집 탐방 할 분 구해요.',
    hasAcquaintances: true,
  },
  206: {
    userId: 206, nickname: '임도현', profileImageUrl: null,
    introText: '안녕하세요, 임도현입니다.\n\n요리를 좋아해서 주말마다 새로운 레시피를 시도해요. 같이 맛있는 것 먹으러 다닐 분 찾습니다!',
    hasAcquaintances: true,
  },
  209: {
    userId: 209, nickname: '고나라', profileImageUrl: null,
    introText: '고나라입니다. 강아지를 키우고 있고 반려동물 좋아하는 분이라면 더 반가울 것 같아요.',
    hasAcquaintances: true,
  },
};

// 연락처는 전화번호 OR 이메일 중 하나만 등록
const CONTACT_INFO: Record<number, { phone?: string; email?: string }> = {
  201: { phone: '010-1234-5678' },
  204: { phone: '010-9876-5432' },
};

// 수락/거절 시 in-memory 업데이트되는 가변 상태
let received: ReceivedContactRequest[] = [
  {
    id: 1, requesterUserId: 201, requesterNickname: '정하은',
    status: 'PENDING', createdAt: '2026-04-18T10:30:00Z', via: '김민준의 소개',
  },
  {
    id: 2, requesterUserId: 204, requesterNickname: '오태양',
    status: 'ACCEPTED', createdAt: '2026-04-15T14:20:00Z',
    contactPhone: '010-9876-5432', via: '이서연의 소개',
  },
  {
    id: 3, requesterUserId: 206, requesterNickname: '임도현',
    status: 'REJECTED', createdAt: '2026-04-12T09:00:00Z', via: '박지현의 소개',
  },
];

const SENT: ContactRequest[] = [
  {
    id: 4, targetUserId: 202, targetNickname: '윤서진',
    status: 'PENDING', createdAt: '2026-04-17T09:00:00Z', via: '김민준을 통해',
  },
  {
    id: 5, targetUserId: 103, targetNickname: '박지현',
    status: 'ACCEPTED', createdAt: '2026-04-10T16:45:00Z',
    contactEmail: 'jh.park@example.com', via: '최준호를 통해',
  },
  {
    id: 6, targetUserId: 105, targetNickname: '강수빈',
    status: 'REJECTED', createdAt: '2026-04-08T11:00:00Z', via: '강수빈을 통해',
  },
];

let myProfile: MyProfile = {
  nickname: 'josh',
  phone: '010-0000-1234',
  introText: '안녕하세요, josh입니다.\n\n좋은 사람들과 좋은 시간을 보내고 싶어요.',
};

// ──────────────────────────────────────────────────────────────
// friend mock 구현
// ──────────────────────────────────────────────────────────────

export const friendMocks = {
  getMyFriends: (): Friend[] => FRIENDS,

  getAcquaintances: (userId: number): Acquaintance[] =>
    (ACQUAINTANCES[userId] ?? []).map<Acquaintance>(a => ({
      ...a,
      acquaintanceCount: (ACQUAINTANCES[a.userId] ?? []).length,
    })),

  getUserProfile: (userId: number): UserProfile | null => PROFILES[userId] ?? null,

  sendContactRequest: (targetUserId: number): ContactRequest => ({
    id: Date.now(), targetUserId, targetNickname: '상대방', status: 'PENDING', createdAt: new Date().toISOString(),
  }),

  acceptContactRequest: (requestId: number): AcceptContactResponse => {
    const idx = received.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      const info = CONTACT_INFO[received[idx].requesterUserId] ?? {};
      received = received.map(r =>
        r.id === requestId
          ? { ...r, status: 'ACCEPTED', contactPhone: info.phone, contactEmail: info.email }
          : r
      );
      return { requestId, contactPhone: info.phone, contactEmail: info.email };
    }
    return { requestId };
  },

  rejectContactRequest: (requestId: number): void => {
    received = received.map(r =>
      r.id === requestId ? { ...r, status: 'REJECTED' } : r
    );
  },

  getSentRequests: (): ContactRequest[] => SENT,

  getReceivedRequests: (): ReceivedContactRequest[] => received,

  getMyProfile: (): MyProfile => ({ ...myProfile }),

  updateMyProfile: (data: MyProfile): void => {
    myProfile = { ...data };
  },

  checkNickname: (nickname: string): { available: boolean } => ({ available: nickname !== '김민준' }),
};

// ──────────────────────────────────────────────────────────────
// auth mock 구현
// ──────────────────────────────────────────────────────────────

function mockDelay<T>(value: T, ms = 700): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const authMocks = {
  loginWithApple: (): Promise<SocialLoginResponse> =>
    mockDelay({
      accessToken: 'mock-access-apple',
      refreshToken: 'mock-refresh-apple',
      userId: 'mock-user-1',
      isNewUser: false,
    }),

  loginWithGoogle: (): Promise<SocialLoginResponse> =>
    mockDelay({
      accessToken: 'mock-access-google',
      refreshToken: 'mock-refresh-google',
      userId: 'mock-user-1',
      isNewUser: false,
    }),

  signOut: (): Promise<void> => mockDelay(undefined, 200),
};
