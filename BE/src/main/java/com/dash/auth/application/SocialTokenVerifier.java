package com.dash.auth.application;

import com.dash.auth.domain.SocialProvider;

/**
 * 소셜 identity 토큰 검증 포트. 제공자(Apple/Google)별 구현체가 토큰을 검증하고
 * 소셜 계정 정보를 반환한다.
 *
 * <p>현재 구현 깊이: payload claims 로컬 파싱(sub/email 추출)까지. JWKS 서명검증·aud·iss
 * 완전검증은 각 구현체의 {@code TODO(prod)} 확장점으로 남겨져 있다.
 */
public interface SocialTokenVerifier {

    SocialProvider provider();

    /**
     * 토큰 검증 후 소셜 계정 반환.
     *
     * @throws com.dash.global.exception.BusinessException INVALID_SOCIAL_TOKEN(400) — 파싱 실패/sub 없음
     */
    SocialAccount verify(String rawToken);
}
