package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.domain.SocialProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Google idToken 검증 어댑터.
 *
 * <p>현재는 payload claims 로컬 파싱(sub/email)만 수행하며 서명검증을 하지 않는다.
 */
@Slf4j
@Component
public class GoogleTokenVerifier extends AbstractSocialTokenVerifier {

    @Value("${google.client-id:}")
    private String clientId;

    @Override
    public SocialProvider provider() {
        return SocialProvider.GOOGLE;
    }

    // TODO(prod): JWKS 서명·aud·iss·exp 완전검증 —
    //  Google 공개키(https://www.googleapis.com/oauth2/v3/certs)로 서명 검증,
    //  aud=clientId, iss=https://accounts.google.com, exp 확인.
    @Override
    public SocialAccount verify(String rawToken) {
        if (clientId == null || clientId.isBlank()) {
            log.warn("google.client-id 미설정 — idToken 서명검증 비활성 (local dev only, claims 파싱만 수행)");
        }
        return parsePayloadClaims(rawToken);
    }
}
