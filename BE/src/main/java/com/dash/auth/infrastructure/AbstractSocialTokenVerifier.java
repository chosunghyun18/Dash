package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.application.SocialTokenVerifier;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import java.io.IOException;
import java.util.Base64;
import java.util.Set;

/**
 * 소셜 identity 토큰(JWT) 검증 공통 로직.
 *
 * <p>두 경로를 제공한다:
 * <ul>
 *   <li>{@link #verifyWithJwks} — <b>운영</b>: JWKS 공개키로 서명검증 + {@code iss}/{@code aud}/
 *       {@code exp} 완전검증. 각 구현체는 client-id 가 설정된 경우 이 경로를 쓴다.</li>
 *   <li>{@link #parsePayloadClaims} — <b>local dev</b>: 서명검증 없이 payload claims 만 파싱.
 *       client-id 미설정(로컬)일 때의 폴백.</li>
 * </ul>
 */
abstract class AbstractSocialTokenVerifier implements SocialTokenVerifier {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    /** 시계 오차 허용(초) — 제공자/서버 시각 편차 흡수. */
    private static final long CLOCK_SKEW_SECONDS = 60L;

    private final JwksKeyLocatorFactory locatorFactory;

    protected AbstractSocialTokenVerifier(JwksKeyLocatorFactory locatorFactory) {
        this.locatorFactory = locatorFactory;
    }

    /**
     * JWKS 서명검증 + iss/aud/exp 완전검증 후 {@link SocialAccount} 반환.
     *
     * @param jwksUri  제공자 JWKS 엔드포인트
     * @param issuer   기대 발급자({@code iss})
     * @param audience 기대 대상({@code aud}) — 앱 client-id
     * @throws BusinessException INVALID_SOCIAL_TOKEN — 서명/iss/aud/exp/sub 검증 실패
     */
    protected SocialAccount verifyWithJwks(String rawToken, String jwksUri, String issuer, String audience) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        try {
            Claims claims = Jwts.parser()
                .keyLocator(locatorFactory.forUri(jwksUri))
                .requireIssuer(issuer)
                .clockSkewSeconds(CLOCK_SKEW_SECONDS)
                .build()
                .parseSignedClaims(rawToken)   // 서명·exp 검증(실패 시 JwtException)
                .getPayload();

            Set<String> aud = claims.getAudience();
            if (aud == null || !aud.contains(audience)) {
                throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
            }
            String subject = claims.getSubject();
            if (subject == null || subject.isBlank()) {
                throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
            }
            return new SocialAccount(provider(), subject, claims.get("email", String.class));
        } catch (JwtException | IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
    }

    /**
     * payload claims 파싱 후 {@link SocialAccount} 반환 — <b>서명검증 없음</b>(local dev 전용).
     *
     * @throws BusinessException INVALID_SOCIAL_TOKEN — JWT 형식 아님/디코드 실패/sub 없음
     */
    protected SocialAccount parsePayloadClaims(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        String[] segments = rawToken.split("\\.");
        if (segments.length < 2) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        JsonNode claims;
        try {
            byte[] payload = Base64.getUrlDecoder().decode(segments[1]);
            claims = MAPPER.readTree(payload);
        } catch (IllegalArgumentException | IOException e) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        String subject = textOrNull(claims, "sub");
        if (subject == null || subject.isBlank()) {
            throw new BusinessException(ErrorCode.INVALID_SOCIAL_TOKEN);
        }
        return new SocialAccount(provider(), subject, textOrNull(claims, "email"));
    }

    private static String textOrNull(JsonNode claims, String field) {
        JsonNode node = claims.get(field);
        return (node == null || node.isNull()) ? null : node.asText();
    }
}
