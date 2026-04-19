export interface Friend {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  bio: string | null;
}

export interface Acquaintance {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
  hasAcquaintances: boolean;
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
}

export interface ReceivedContactRequest {
  id: number;
  requesterUserId: number;
  requesterNickname: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  contactPhone?: string;
  contactEmail?: string;
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
