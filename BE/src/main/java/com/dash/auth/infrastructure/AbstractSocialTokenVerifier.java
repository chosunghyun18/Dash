package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.application.SocialTokenVerifier;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Base64;

/**
 * 소셜 identity 토큰(JWT) 로컬 파싱 공통 로직.
 *
 * <p>JWT payload(가운데 세그먼트)를 Base64URL 디코드해 {@code sub}/{@code email} claim 만
 * 추출한다. <b>서명검증은 수행하지 않는다</b> — local dev 범위이며, JWKS 서명·aud·iss·exp
 * 완전검증은 각 구현체의 {@code TODO(prod)} 확장점 참조.
 */
abstract class AbstractSocialTokenVerifier implements SocialTokenVerifier {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * payload claims 파싱 후 {@link SocialAccount} 반환.
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
