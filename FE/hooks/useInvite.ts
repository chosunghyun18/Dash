import { Share } from 'react-native';
import { getLocales } from 'expo-localization';
import { useMutation, useQuery } from '@tanstack/react-query';
import { invitationService } from '../services/invitation';

function getRegion(): string {
  return getLocales()[0]?.regionCode ?? 'US';
}

function buildShareMessage(inviterNickname: string, shareUrl: string, region: string): string {
  if (region === 'KR') {
    return `${inviterNickname}님이 Dash에 초대했어요!\n지금 바로 소개팅을 시작해 보세요 👇\n${shareUrl}`;
  }
  return `${inviterNickname} invited you to Dash!\nJoin now 👇\n${shareUrl}`;
}

export function useCreateInvitation() {
  return useMutation({
    mutationFn: invitationService.create,
  });
}

export function useShareInvitation() {
  const region = getRegion();

  return async (inviterNickname: string, shareUrl: string) => {
    const message = buildShareMessage(inviterNickname, shareUrl, region);

    await Share.share(
      {
        message,
        url: shareUrl,   // iOS 전용: 미리보기 URL
        title: 'Dash 초대',
      },
      {
        // Android: 카카오톡 앱이 설치된 KR 기기에서는 공유 시트에 카카오톡이 자동 포함
        dialogTitle: region === 'KR' ? '카카오톡으로 초대하기' : 'Invite via',
      },
    );
  };
}

export function useMyInvitations() {
  return useQuery({
    queryKey: ['invitations', 'mine'],
    queryFn: invitationService.getMyInvitations,
  });
}
