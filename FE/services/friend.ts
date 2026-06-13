import { api } from './api';
import { USE_MOCK } from '../config';
import { friendMocks } from '../mocks';
import type {
  Friend, Acquaintance, UserProfile, ContactRequest,
  ReceivedContactRequest, AcceptContactResponse, MyProfile,
} from '../types';

export const friendService = {
  getMyFriends: async (): Promise<Friend[]> => {
    if (USE_MOCK) return friendMocks.getMyFriends();
    return api.get<Friend[]>('/api/v1/friends').then(r => r.data);
  },

  // 특정 노드(친구 또는 더 깊은 지인)의 지인 목록.
  // 인스타 팔로우식 무한 hop 네트워크 — 화면에서 trail 길이로 촌수를 계산한다.
  // 각 항목에 acquaintanceCount(그 사람의 지인 수)를 채워 드릴다운에 사용.
  getAcquaintances: async (userId: number): Promise<Acquaintance[]> => {
    if (USE_MOCK) return friendMocks.getAcquaintances(userId);
    return api.get<Acquaintance[]>(`/api/v1/users/${userId}/acquaintances`).then(r => r.data);
  },

  getUserProfile: async (userId: number): Promise<UserProfile | null> => {
    if (USE_MOCK) return friendMocks.getUserProfile(userId);
    return api.get<UserProfile>(`/api/v1/users/${userId}/profile`).then(r => r.data);
  },

  sendContactRequest: async (targetUserId: number): Promise<ContactRequest> => {
    if (USE_MOCK) return friendMocks.sendContactRequest(targetUserId);
    return api.post<ContactRequest>('/api/v1/contact-requests', { targetUserId }).then(r => r.data);
  },

  acceptContactRequest: async (requestId: number): Promise<AcceptContactResponse> => {
    if (USE_MOCK) return friendMocks.acceptContactRequest(requestId);
    return api.post<AcceptContactResponse>(`/api/v1/contact-requests/${requestId}/accept`).then(r => r.data);
  },

  rejectContactRequest: async (requestId: number): Promise<void> => {
    if (USE_MOCK) return friendMocks.rejectContactRequest(requestId);
    return api.post(`/api/v1/contact-requests/${requestId}/reject`).then(() => undefined);
  },

  getSentRequests: async (): Promise<ContactRequest[]> => {
    if (USE_MOCK) return friendMocks.getSentRequests();
    return api.get<ContactRequest[]>('/api/v1/contact-requests/sent').then(r => r.data);
  },

  getReceivedRequests: async (): Promise<ReceivedContactRequest[]> => {
    if (USE_MOCK) return friendMocks.getReceivedRequests();
    return api.get<ReceivedContactRequest[]>('/api/v1/contact-requests/received').then(r => r.data);
  },

  getMyProfile: async (): Promise<MyProfile> => {
    if (USE_MOCK) return friendMocks.getMyProfile();
    return api.get<MyProfile>('/api/v1/users/me/profile').then(r => r.data);
  },

  updateMyProfile: async (data: MyProfile): Promise<void> => {
    if (USE_MOCK) return friendMocks.updateMyProfile(data);
    return api.put('/api/v1/users/me/profile', data).then(() => undefined);
  },

  checkNickname: async (nickname: string): Promise<{ available: boolean }> => {
    if (USE_MOCK) return friendMocks.checkNickname(nickname);
    return api.get<{ available: boolean }>(`/api/v1/users/nickname-check?nickname=${nickname}`).then(r => r.data);
  },
};
