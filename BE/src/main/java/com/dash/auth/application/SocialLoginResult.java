package com.dash.auth.application;

/**
 * 소셜 로그인/등록 결과.
 *
 * <p>기존 회원: access/refresh 토큰 + userId, {@code isNewUser=false}.
 * 미등록 소셜 ID: {@code accessToken} 자리에 단기 <b>registration 토큰</b>이 담기고
 * refreshToken/userId 는 빈 문자열, {@code isNewUser=true}. 실제 회원 생성은
 * {@code /auth/register} 에서 이 등록 토큰과 프로필 정보로 수행한다.
 */
public record SocialLoginResult(String accessToken, String refreshToken, String userId, boolean isNewUser) {
}
