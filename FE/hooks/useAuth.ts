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
  const setPendingRegistration = useAuthStore((s) => s.setPendingRegistration);
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
      if (res.isNewUser) {
        // 등록 토큰 방식: isNewUser=true 면 accessToken 자리에 담긴 것은 단기 registration
        // 토큰이므로 일반 세션으로 저장하면 안 된다. 별도 보관 후 프로필 첫 설정으로 이동.
        setPendingRegistration({ token: res.accessToken, provider });
        router.replace('/profile/edit');
        return true;
      }
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
        provider,
      });
      router.replace('/(tabs)');
      return true;
    } catch {
      cancelAuthenticating();
      return false;
    } finally {
      setLoadingProvider(null);
    }
  };

  /**
   * 개발 환경 전용 로그인.
   *
   * BE(local 프로파일)의 `/api/auth/dev` 를 호출해 시드 멤버(기본 수지 id=1)로
   * 정식 JWT를 발급받아 세션에 저장한다. 이후 보호 API가 인증되어 시드 데이터가 보인다.
   * `__DEV__` 빌드에서만 버튼이 렌더되며, 운영 번들엔 BE 엔드포인트도 존재하지 않는다.
   */
  const devLogin = () => run('google', () => authService.devLogin());

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
    devLogin,
    appleLoading: loadingProvider === 'apple',
    googleLoading: loadingProvider === 'google',
  };
}
