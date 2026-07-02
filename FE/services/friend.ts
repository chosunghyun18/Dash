import { api } from './api';
import type {
  Friend, Acquaintance, UserProfile, ContactRequest,
  ReceivedContactRequest, AcceptContactResponse, MyProfile,
} from '../types';

export const friendService = {
  getMyFriends: async (): Promise<Friend[]> =>
    api.get<Friend[]>('/api/friends').then(r => r.data),

  // 특정 노드(친구 또는 더 깊은 지인)의 지인 목록.
  // 인스타 팔로우식 무한 hop 네트워크 — 화면에서 trail 길이로 촌수를 계산한다.
  // 각 항목에 acquaintanceCount(그 사람의 지인 수)를 채워 드릴다운에 사용.
  getAcquaintances: async (userId: number): Promise<Acquaintance[]> =>
    api.get<Acquaintance[]>(`/api/users/${userId}/acquaintances`).then(r => r.data),

  getUserProfile: async (userId: number): Promise<UserProfile | null> =>
    api.get<UserProfile>(`/api/users/${userId}/profile`).then(r => r.data),

  sendContactRequest: async (targetUserId: number): Promise<ContactRequest> =>
    api.post<ContactRequest>('/api/contact-requests', { targetUserId }).then(r => r.data),

  acceptContactRequest: async (requestId: number): Promise<AcceptContactResponse> =>
    api.post<AcceptContactResponse>(`/api/contact-requests/${requestId}/accept`).then(r => r.data),

  rejectContactRequest: async (requestId: number): Promise<void> =>
    api.post(`/api/contact-requests/${requestId}/reject`).then(() => undefined),

  getSentRequests: async (): Promise<ContactRequest[]> =>
    api.get<ContactRequest[]>('/api/contact-requests/sent').then(r => r.data),

  getReceivedRequests: async (): Promise<ReceivedContactRequest[]> =>
    api.get<ReceivedContactRequest[]>('/api/contact-requests/received').then(r => r.data),

  getMyProfile: async (): Promise<MyProfile> =>
    api.get<MyProfile>('/api/users/me/profile').then(r => r.data),

  updateMyProfile: async (data: MyProfile): Promise<void> =>
    api.put('/api/users/me/profile', data).then(() => undefined),

  checkNickname: async (nickname: string): Promise<{ available: boolean }> =>
    api.get<{ available: boolean }>(`/api/users/nickname-check?nickname=${nickname}`).then(r => r.data),
};
