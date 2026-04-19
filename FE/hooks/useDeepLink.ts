import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

const INVITE_PATH = '/invite/';

function extractInviteToken(url: string): string | null {
  const idx = url.indexOf(INVITE_PATH);
  if (idx === -1) return null;
  const token = url.slice(idx + INVITE_PATH.length).split('?')[0].split('#')[0];
  return token.length > 0 ? token : null;
}

/**
 * 앱 진입 시 딥링크를 감지하여 초대 수락 화면으로 라우팅합니다.
 *
 * 처리 경로:
 *   https://dash.app/invite/{token}  →  /invite/[token]
 *   dash://invite/{token}            →  /invite/[token]
 */
export function useDeepLink() {
  const router = useRouter();

  useEffect(() => {
    // 앱이 종료된 상태에서 링크로 실행된 경우
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    // 앱이 백그라운드 상태에서 링크를 받은 경우
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => subscription.remove();
  }, []);

  function handleUrl(url: string) {
    const token = extractInviteToken(url);
    if (token) {
      router.push(`/invite/${token}`);
    }
  }
}
