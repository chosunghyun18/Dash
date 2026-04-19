import { api } from './api';

export interface InvitationCreateResponse {
  token: string;
  shareUrl: string;
  expiresAt: string;
}

export interface InvitationValidateResponse {
  token: string;
  inviterNickname: string;
  expiresAt: string;
}

export interface InvitationAcceptResponse {
  token: string;
  friendshipId: number;
  inviterNickname: string;
}

export interface InvitationSummary {
  id: number;
  token: string;
  shareUrl: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELED';
  inviteeNickname: string | null;
  expiresAt: string;
  createdAt: string;
}

export const invitationService = {
  create: () =>
    api.post<InvitationCreateResponse>('/api/v1/invitations').then((r) => r.data),

  validate: (token: string) =>
    api.get<InvitationValidateResponse>(`/api/v1/invitations/validate/${token}`).then((r) => r.data),

  accept: (token: string) =>
    api.post<InvitationAcceptResponse>(`/api/v1/invitations/${token}/accept`).then((r) => r.data),

  getMyInvitations: () =>
    api.get<InvitationSummary[]>('/api/v1/invitations/mine').then((r) => r.data),
};
