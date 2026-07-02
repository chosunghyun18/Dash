package com.dash.auth.infrastructure;

import com.dash.auth.application.SocialAccount;
import com.dash.auth.domain.SocialProvider;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Jwks;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * JWKS 서명검증 경로({@link AbstractSocialTokenVerifier#verifyWithJwks})와 local 폴백
 * ({@link AbstractSocialTokenVerifier#parsePayloadClaims}) 검증.
 *
 * <p>실 제공자 호출 없이 in-memory RSA 키쌍으로 JWKS/토큰을 생성해 {@link AppleTokenVerifier}
 * (concrete)로 전 경로를 태운다. 제공자별 로직은 동일 추상클래스이므로 Apple 로 대표 검증한다.
 */
class SocialTokenVerifierTest {

    private static final String CLIENT_ID = "com.dash.app";
    private static final String ISSUER = "https://appleid.apple.com";
    private static final String JWKS_URI = "https://appleid.apple.com/auth/keys";
    private static final String KID = "kid-test-1";

    private static KeyPair keyPair;      // JWKS 에 실린 정상 키
    private static KeyPair attackerPair; // JWKS 에 없는 키(서명 위조 시나리오)

    private String jwksJson;

    static {
        keyPair = rsaKeyPair();
        attackerPair = rsaKeyPair();
    }

    @BeforeEach
    void setUp() {
        jwksJson = jwksJson((RSAPublicKey) keyPair.getPublic(), KID);
    }

    /** clientId 설정 → JWKS 서명검증 경로를 타는 verifier. fetcher 는 고정 JWKS JSON 반환. */
    private AppleTokenVerifier jwksVerifier() {
        JwksKeyLocatorFactory factory =
            new JwksKeyLocatorFactory(uri -> jwksJson, 60_000L);
        return new AppleTokenVerifier(factory, CLIENT_ID, ISSUER, JWKS_URI);
    }

    @Nested
    @DisplayName("JWKS 서명검증 경로 (client-id 설정)")
    class JwksPath {

        @Test
        @DisplayName("유효 토큰 → provider/subject/email 매핑")
        void validToken_returnsAccount() {
            String token = signedToken(keyPair.getPrivate(), KID, ISSUER, CLIENT_ID,
                "001234.abcd", "user@example.com", plusSeconds(600));

            SocialAccount account = jwksVerifier().verify(token);

            assertThat(account.provider()).isEqualTo(SocialProvider.APPLE);
            assertThat(account.subject()).isEqualTo("001234.abcd");
            assertThat(account.email()).isEqualTo("user@example.com");
        }

        @Test
        @DisplayName("email claim 없음 → email=null 허용")
        void missingEmail_allowsNull() {
            String token = signedToken(keyPair.getPrivate(), KID, ISSUER, CLIENT_ID,
                "001234.abcd", null, plusSeconds(600));

            SocialAccount account = jwksVerifier().verify(token);

            assertThat(account.subject()).isEqualTo("001234.abcd");
            assertThat(account.email()).isNull();
        }

        @Test
        @DisplayName("aud 불일치 → INVALID_SOCIAL_TOKEN")
        void wrongAudience_rejected() {
            String token = signedToken(keyPair.getPrivate(), KID, ISSUER, "other.app",
                "001234.abcd", "user@example.com", plusSeconds(600));

            assertInvalid(() -> jwksVerifier().verify(token));
        }

        @Test
        @DisplayName("iss 불일치 → INVALID_SOCIAL_TOKEN")
        void wrongIssuer_rejected() {
            String token = signedToken(keyPair.getPrivate(), KID, "https://evil.example.com",
                CLIENT_ID, "001234.abcd", "user@example.com", plusSeconds(600));

            assertInvalid(() -> jwksVerifier().verify(token));
        }

        @Test
        @DisplayName("만료 토큰 → INVALID_SOCIAL_TOKEN")
        void expiredToken_rejected() {
            // clock skew(60s) 보다 더 과거로 만료시켜 확실히 만료 처리
            String token = signedToken(keyPair.getPrivate(), KID, ISSUER, CLIENT_ID,
                "001234.abcd", "user@example.com", plusSeconds(-120));

            assertInvalid(() -> jwksVerifier().verify(token));
        }

        @Test
        @DisplayName("서명 위조(JWKS 에 없는 키로 서명) → INVALID_SOCIAL_TOKEN")
        void forgedSignature_rejected() {
            // 헤더 kid 는 JWKS 의 KID 를 가리키지만 실제 서명은 다른 키 → 서명 불일치
            String token = signedToken(attackerPair.getPrivate(), KID, ISSUER, CLIENT_ID,
                "001234.abcd", "user@example.com", plusSeconds(600));

            assertInvalid(() -> jwksVerifier().verify(token));
        }

        @Test
        @DisplayName("헤더 kid 가 JWKS 에 없음 → INVALID_SOCIAL_TOKEN")
        void unknownKid_rejected() {
            String token = signedToken(keyPair.getPrivate(), "unknown-kid", ISSUER, CLIENT_ID,
                "001234.abcd", "user@example.com", plusSeconds(600));

            assertInvalid(() -> jwksVerifier().verify(token));
        }

        @Test
        @DisplayName("null/blank 토큰 → INVALID_SOCIAL_TOKEN")
        void blankToken_rejected() {
            assertInvalid(() -> jwksVerifier().verify(null));
            assertInvalid(() -> jwksVerifier().verify("   "));
        }
    }

    @Nested
    @DisplayName("local 폴백 (client-id 미설정)")
    class LocalFallback {

        /** clientId 공백 → parsePayloadClaims 경로(서명검증 없음). */
        private AppleTokenVerifier fallbackVerifier() {
            JwksKeyLocatorFactory factory =
                new JwksKeyLocatorFactory(uri -> jwksJson, 60_000L);
            return new AppleTokenVerifier(factory, "", ISSUER, JWKS_URI);
        }

        @Test
        @DisplayName("서명검증 없이 payload sub/email 파싱 (만료·aud 무시)")
        void parsesPayloadWithoutVerification() {
            // 만료됐고 aud 도 다르지만 폴백은 서명/exp/aud 검증하지 않는다
            String token = signedToken(attackerPair.getPrivate(), KID, "https://evil.example.com",
                "other.app", "999.zzz", "local@example.com", plusSeconds(-999));

            SocialAccount account = fallbackVerifier().verify(token);

            assertThat(account.provider()).isEqualTo(SocialProvider.APPLE);
            assertThat(account.subject()).isEqualTo("999.zzz");
            assertThat(account.email()).isEqualTo("local@example.com");
        }

        @Test
        @DisplayName("sub 없는 payload → INVALID_SOCIAL_TOKEN")
        void missingSubject_rejected() {
            String token = signedToken(keyPair.getPrivate(), KID, ISSUER, CLIENT_ID,
                null, "local@example.com", plusSeconds(600));

            assertInvalid(() -> fallbackVerifier().verify(token));
        }
    }

    // ---- helpers ----

    private static void assertInvalid(org.assertj.core.api.ThrowableAssert.ThrowingCallable call) {
        assertThatThrownBy(call)
            .isInstanceOf(BusinessException.class)
            .satisfies(e -> assertThat(((BusinessException) e).getErrorCode())
                .isEqualTo(ErrorCode.INVALID_SOCIAL_TOKEN));
    }

    private static Date plusSeconds(long seconds) {
        return new Date(System.currentTimeMillis() + seconds * 1000L);
    }

    private static String signedToken(java.security.PrivateKey signingKey, String kid,
                                      String issuer, String audience, String subject,
                                      String email, Date expiration) {
        var builder = Jwts.builder()
            .header().keyId(kid).and()
            .issuer(issuer)
            .audience().add(audience).and()
            .expiration(expiration)
            .issuedAt(new Date(System.currentTimeMillis() - 1000L));
        if (subject != null) {
            builder.subject(subject);
        }
        if (email != null) {
            builder.claim("email", email);
        }
        return builder.signWith(signingKey, Jwts.SIG.RS256).compact();
    }

    /** 공개키 하나를 담은 JWKS(JSON) 생성 — 제공자 /auth/keys 응답 모사. */
    private static String jwksJson(RSAPublicKey publicKey, String kid) {
        var jwk = Jwks.builder().key(publicKey).id(kid).build(); // Map<String,Object>
        Map<String, Object> set = new LinkedHashMap<>();
        set.put("keys", List.of(new LinkedHashMap<>(jwk)));
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(set);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static KeyPair rsaKeyPair() {
        try {
            KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048);
            return gen.generateKeyPair();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
