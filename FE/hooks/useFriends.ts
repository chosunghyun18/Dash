import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { friendService } from '../services/friend';
import type { MyProfile } from '../types';

export function useMyFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: friendService.getMyFriends,
  });
}

export function useAcquaintances(userId: number) {
  return useQuery({
    queryKey: ['acquaintances', userId],
    queryFn: () => friendService.getAcquaintances(userId),
    enabled: !!userId,
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => friendService.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useSendContactRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetUserId: number) => friendService.sendContactRequest(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
    },
  });
}

export function useAcceptContactRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: number) => friendService.acceptContactRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
    },
  });
}

export function useRejectContactRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: number) => friendService.rejectContactRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
    },
  });
}

export function useSentRequests() {
  return useQuery({
    queryKey: ['contact-requests', 'sent'],
    queryFn: friendService.getSentRequests,
  });
}

export function useReceivedRequests() {
  return useQuery({
    queryKey: ['contact-requests', 'received'],
    queryFn: friendService.getReceivedRequests,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: friendService.getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MyProfile) => friendService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
}

export function useCheckNickname() {
  return useMutation({
    mutationFn: (nickname: string) => friendService.checkNickname(nickname),
  });
}
