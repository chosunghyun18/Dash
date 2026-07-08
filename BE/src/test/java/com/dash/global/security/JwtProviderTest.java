package com.dash.global.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtProviderTest {

    // 32바이트 이상 base64 시크릿("local-secret-key-for-dash-development-32")
    private static final String SECRET = "bG9jYWwtc2VjcmV0LWtleS1mb3ItZGFzaC1kZXZlbG9wbWVudC0zMg==";

    private JwtProvider jwtProvider;

    @BeforeEach
    void setUp() {
        jwtProvider = new JwtProvider();
        ReflectionTestUtils.setField(jwtProvider, "secret", SECRET);
        ReflectionTestUtils.setField(jwtProvider, "expiration", 86_400_000L);
        ReflectionTestUtils.setField(jwtProvider, "refreshExpiration", 604_800_000L);
        jwtProvider.init();
    }

    @Test
    @DisplayName("access 토큰: type=access, subject=memberId(숫자)")
    void accessToken() {
        String token = jwtProvider.generateAccessToken(5L);

        assertThat(jwtProvider.isValid(token)).isTrue();
        assertThat(jwtProvider.extractType(token)).isEqualTo(JwtProvider.TYPE_ACCESS);
        assertThat(jwtProvider.extractMemberId(token)).isEqualTo(5L);
    }

    @Test
    @DisplayName("admin access 토큰: type=admin_access + role claim, subject=adminId")
    void adminAccessToken() {
        String token = jwtProvider.generateAdminAccessToken(1L, "SUPER_ADMIN");

        assertThat(jwtProvider.isValid(token)).isTrue();
        assertThat(jwtProvider.extractType(token)).isEqualTo(JwtProvider.TYPE_ADMIN_ACCESS);
        assertThat(jwtProvider.extractRole(token)).isEqualTo("SUPER_ADMIN");
        assertThat(jwtProvider.extractAdminId(token)).isEqualTo(1L);
    }

    @Test
    @DisplayName("admin refresh 토큰: type=admin_refresh")
    void adminRefreshToken() {
        String token = jwtProvider.generateAdminRefreshToken(2L);

        assertThat(jwtProvider.extractType(token)).isEqualTo(JwtProvider.TYPE_ADMIN_REFRESH);
        assertThat(jwtProvider.extractAdminId(token)).isEqualTo(2L);
    }

    @Test
    @DisplayName("회귀 방지: registration 토큰의 subject 는 소셜 ID 문자열 — extractMemberId(Long 파싱)는 반드시 실패한다")
    void registrationToken_subjectIsNotNumeric() {
        String token = jwtProvider.generateRegistrationToken("apple:xyz");

        assertThat(jwtProvider.extractType(token)).isEqualTo(JwtProvider.TYPE_REGISTRATION);
        assertThat(jwtProvider.extractSubject(token)).isEqualTo("apple:xyz");
        // 필터가 type=access 로 먼저 걸러야 하는 이유 — 이 토큰에 extractMemberId 를 부르면 터진다.
        assertThatThrownBy(() -> jwtProvider.extractMemberId(token))
            .isInstanceOf(NumberFormatException.class);
    }
}
