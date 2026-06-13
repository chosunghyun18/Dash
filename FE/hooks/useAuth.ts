import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';
import { useAuthStore, type AuthProvider } from '../stores/authStore';

/**
 * 소셜 로그인 흐름(인증 → 세션 저장 → 라우팅)을 캡슐화한 Application 레이어 훅.
 *
 * 화면은 provider별 핸들러와 로딩 상태만 사용하며, service/store/router 배선은
 * 모두 이 훅 안에서 처리한다. 실패 시 false를 반환해 화면이 에러 UI를 띄울 수 있다.
 *
 * NOTE: identityToken/idToken은 실제 Apple/Google SDK 연동 전까지 placeholder.
 */
export function useSocialLogin() {
  const router = useRouter();
  const startAuthenticating = useAuthStore((s) => s.startAuthenticating);
  const setSession = useAuthStore((s) => s.setSession);
  const cancelAuthenticating = useAuthStore((s) => s.cancelAuthenticating);

  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  const run = async (
    provider: AuthProvider,
    login: () => ReturnType<typeof authService.loginWithApple>,
  ): Promise<boolean> => {
    try {
      setLoadingProvider(provider);
      startAuthenticating(provider);
      const res = await login();
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
        provider,
      });
      router.replace(res.isNewUser ? '/profile/edit' : '/(tabs)');
      return true;
    } catch {
      cancelAuthenticating();
      return false;
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    loginWithApple: () =>
      run('apple', () =>
        authService.loginWithApple({
          identityToken: 'mock-identity-token',
          authorizationCode: 'mock-auth-code',
        }),
      ),
    loginWithGoogle: () =>
      run('google', () => authService.loginWithGoogle({ idToken: 'mock-google-id-token' })),
    appleLoading: loadingProvider === 'apple',
    googleLoading: loadingProvider === 'google',
  };
}
