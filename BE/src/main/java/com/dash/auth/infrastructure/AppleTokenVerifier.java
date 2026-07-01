package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.domain.SocialProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Apple identityToken 검증 어댑터.
 *
 * <p>현재는 payload claims 로컬 파싱(sub/email)만 수행하며 서명검증을 하지 않는다.
 */
@Slf4j
@Component
public class AppleTokenVerifier extends AbstractSocialTokenVerifier {

    @Value("${apple.client-id:}")
    private String clientId;

    @Override
    public SocialProvider provider() {
        return SocialProvider.APPLE;
    }

    // TODO(prod): JWKS 서명·aud·iss·exp 완전검증 —
    //  Apple 공개키(https://appleid.apple.com/auth/keys)로 서명 검증,
    //  aud=clientId(bundle id), iss=https://appleid.apple.com, exp 확인.
    @Override
    public SocialAccount verify(String rawToken) {
        if (clientId == null || clientId.isBlank()) {
            log.warn("apple.client-id 미설정 — identityToken 서명검증 비활성 (local dev only, claims 파싱만 수행)");
        }
        return parsePayloadClaims(rawToken);
    }
}
