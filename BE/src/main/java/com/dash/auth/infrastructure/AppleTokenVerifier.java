package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.domain.SocialProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Apple identityToken 검증 어댑터.
 *
 * <p>{@code apple.client-id} 가 설정되면 Apple JWKS 로 서명·iss·aud·exp 완전검증한다.
 * 미설정(local dev)이면 서명검증 없이 payload claims(sub/email)만 파싱한다.
 */
@Slf4j
@Component
public class AppleTokenVerifier extends AbstractSocialTokenVerifier {

    private final String clientId;
    private final String issuer;
    private final String jwksUri;

    public AppleTokenVerifier(
            JwksKeyLocatorFactory locatorFactory,
            @Value("${apple.client-id:}") String clientId,
            @Value("${apple.issuer:https://appleid.apple.com}") String issuer,
            @Value("${apple.jwks-uri:https://appleid.apple.com/auth/keys}") String jwksUri) {
        super(locatorFactory);
        this.clientId = clientId;
        this.issuer = issuer;
        this.jwksUri = jwksUri;
    }

    @Override
    public SocialProvider provider() {
        return SocialProvider.APPLE;
    }

    @Override
    public SocialAccount verify(String rawToken) {
        if (clientId == null || clientId.isBlank()) {
            log.warn("apple.client-id 미설정 — identityToken 서명검증 비활성 (local dev only, claims 파싱만 수행)");
            return parsePayloadClaims(rawToken);
        }
        return verifyWithJwks(rawToken, jwksUri, issuer, clientId);
    }
}
