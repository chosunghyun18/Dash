import { api } from './api';
import type {
  Friend, Acquaintance, UserProfile, ContactRequest,
  ReceivedContactRequest, AcceptContactResponse, MyProfile,
} from '../types';

const MOCK_FRIENDS: Friend[] = [
  { id: 1, userId: 101, nickname: '김민준', profileImageUrl: null, bio: '안녕하세요! 만나서 반갑습니다.' },
  { id: 2, userId: 102, nickname: '이서연', profileImageUrl: null, bio: '여행을 좋아하는 서연입니다.' },
  { id: 3, userId: 103, nickname: '박지현', profileImageUrl: null, bio: '커피와 책을 사랑합니다.' },
  { id: 4, userId: 104, nickname: '최준호', profileImageUrl: null, bio: '운동을 즐기는 준호입니다.' },
  { id: 5, userId: 105, nickname: '강수빈', profileImageUrl: null, bio: '음악을 좋아하는 수빈입니다.' },
];

const MOCK_ACQUAINTANCES: Record<number, Acquaintance[]> = {
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

const MOCK_PROFILES: Record<number, UserProfile> = {
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
const MOCK_CONTACT_INFO: Record<number, { phone?: string; email?: string }> = {
  201: { phone: '010-1234-5678' },
  204: { phone: '010-9876-5432' },
};

// let으로 선언 — 수락/거절 시 in-memory 업데이트
let MOCK_RECEIVED: ReceivedContactRequest[] = [
  {
    id: 1, requesterUserId: 201, requesterNickname: '정하은',
    status: 'PENDING', createdAt: '2026-04-18T10:30:00Z',
  },
  {
    id: 2, requesterUserId: 204, requesterNickname: '오태양',
    status: 'ACCEPTED', createdAt: '2026-04-15T14:20:00Z',
    contactPhone: '010-9876-5432',
  },
  {
    id: 3, requesterUserId: 206, requesterNickname: '임도현',
    status: 'REJECTED', createdAt: '2026-04-12T09:00:00Z',
  },
];

const MOCK_SENT: ContactRequest[] = [
  {
    id: 4, targetUserId: 202, targetNickname: '윤서진',
    status: 'PENDING', createdAt: '2026-04-17T09:00:00Z',
  },
  {
    id: 5, targetUserId: 103, targetNickname: '박지현',
    status: 'ACCEPTED', createdAt: '2026-04-10T16:45:00Z',
    contactEmail: 'jh.park@example.com',
  },
  {
    id: 6, targetUserId: 105, targetNickname: '강수빈',
    status: 'REJECTED', createdAt: '2026-04-08T11:00:00Z',
  },
];

let MOCK_MY_PROFILE: MyProfile = {
  nickname: 'josh',
  phone: '010-0000-1234',
  introText: '안녕하세요, josh입니다.\n\n좋은 사람들과 좋은 시간을 보내고 싶어요.',
};

const USE_MOCK = true;

export const friendService = {
  getMyFriends: async (): Promise<Friend[]> => {
    if (USE_MOCK) return MOCK_FRIENDS;
    return api.get<Friend[]>('/api/v1/friends').then(r => r.data);
  },

  getAcquaintances: async (userId: number): Promise<Acquaintance[]> => {
    if (USE_MOCK) return MOCK_ACQUAINTANCES[userId] ?? [];
    return api.get<Acquaintance[]>(`/api/v1/users/${userId}/acquaintances`).then(r => r.data);
  },

  getUserProfile: async (userId: number): Promise<UserProfile | null> => {
    if (USE_MOCK) return MOCK_PROFILES[userId] ?? null;
    return api.get<UserProfile>(`/api/v1/users/${userId}/profile`).then(r => r.data);
  },

  sendContactRequest: async (targetUserId: number): Promise<ContactRequest> => {
    if (USE_MOCK) {
      return { id: Date.now(), targetUserId, targetNickname: '상대방', status: 'PENDING', createdAt: new Date().toISOString() };
    }
    return api.post<ContactRequest>('/api/v1/contact-requests', { targetUserId }).then(r => r.data);
  },

  acceptContactRequest: async (requestId: number): Promise<AcceptContactResponse> => {
    if (USE_MOCK) {
      const idx = MOCK_RECEIVED.findIndex(r => r.id === requestId);
      if (idx !== -1) {
        const info = MOCK_CONTACT_INFO[MOCK_RECEIVED[idx].requesterUserId] ?? {};
        MOCK_RECEIVED = MOCK_RECEIVED.map(r =>
          r.id === requestId
            ? { ...r, status: 'ACCEPTED', contactPhone: info.phone, contactEmail: info.email }
            : r
        );
        return { requestId, contactPhone: info.phone, contactEmail: info.email };
      }
      return { requestId };
    }
    return api.post<AcceptContactResponse>(`/api/v1/contact-requests/${requestId}/accept`).then(r => r.data);
  },

  rejectContactRequest: async (requestId: number): Promise<void> => {
    if (USE_MOCK) {
      MOCK_RECEIVED = MOCK_RECEIVED.map(r =>
        r.id === requestId ? { ...r, status: 'REJECTED' } : r
      );
      return;
    }
    return api.post(`/api/v1/contact-requests/${requestId}/reject`).then(() => undefined);
  },

  getSentRequests: async (): Promise<ContactRequest[]> => {
    if (USE_MOCK) return MOCK_SENT;
    return api.get<ContactRequest[]>('/api/v1/contact-requests/sent').then(r => r.data);
  },

  getReceivedRequests: async (): Promise<ReceivedContactRequest[]> => {
    if (USE_MOCK) return MOCK_RECEIVED;
    return api.get<ReceivedContactRequest[]>('/api/v1/contact-requests/received').then(r => r.data);
  },

  getMyProfile: async (): Promise<MyProfile> => {
    if (USE_MOCK) return { ...MOCK_MY_PROFILE };
    return api.get<MyProfile>('/api/v1/users/me/profile').then(r => r.data);
  },

  updateMyProfile: async (data: MyProfile): Promise<void> => {
    if (USE_MOCK) {
      MOCK_MY_PROFILE = { ...data };
      return;
    }
    return api.put('/api/v1/users/me/profile', data).then(() => undefined);
  },

  checkNickname: async (nickname: string): Promise<{ available: boolean }> => {
    if (USE_MOCK) return { available: nickname !== '김민준' };
    return api.get<{ available: boolean }>(`/api/v1/users/nickname-check?nickname=${nickname}`).then(r => r.data);
  },
};
