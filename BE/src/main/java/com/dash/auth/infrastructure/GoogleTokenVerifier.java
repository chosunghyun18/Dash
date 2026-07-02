package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.domain.SocialProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Google idToken 검증 어댑터.
 *
 * <p>{@code google.client-id} 가 설정되면 Google JWKS 로 서명·iss·aud·exp 완전검증한다.
 * 미설정(local dev)이면 서명검증 없이 payload claims(sub/email)만 파싱한다.
 */
@Slf4j
@Component
public class GoogleTokenVerifier extends AbstractSocialTokenVerifier {

    private final String clientId;
    private final String issuer;
    private final String jwksUri;

    public GoogleTokenVerifier(
            JwksKeyLocatorFactory locatorFactory,
            @Value("${google.client-id:}") String clientId,
            @Value("${google.issuer:https://accounts.google.com}") String issuer,
            @Value("${google.jwks-uri:https://www.googleapis.com/oauth2/v3/certs}") String jwksUri) {
        super(locatorFactory);
        this.clientId = clientId;
        this.issuer = issuer;
        this.jwksUri = jwksUri;
    }

    @Override
    public SocialProvider provider() {
        return SocialProvider.GOOGLE;
    }

    @Override
    public SocialAccount verify(String rawToken) {
        if (clientId == null || clientId.isBlank()) {
            log.warn("google.client-id 미설정 — idToken 서명검증 비활성 (local dev only, claims 파싱만 수행)");
            return parsePayloadClaims(rawToken);
        }
        return verifyWithJwks(rawToken, jwksUri, issuer, clientId);
    }
}
