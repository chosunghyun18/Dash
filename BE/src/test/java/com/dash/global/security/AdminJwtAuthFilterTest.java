package com.dash.global.security;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * AdminJwtAuthFilter 테스트 — admin_access 토큰만 인증하며 역할 위계를 권한으로 부여한다.
 * 앱 access 토큰은 admin 체인에서 무시되어야 한다(토큰 type 분리 계약).
 */
@ExtendWith(MockitoExtension.class)
class AdminJwtAuthFilterTest {

    @Mock JwtProvider jwtProvider;
    @InjectMocks AdminJwtAuthFilter adminJwtAuthFilter;

    @AfterEach
    void clear() {
        SecurityContextHolder.clearContext();
    }

    private MockHttpServletRequest requestWithBearer(String token) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        return request;
    }

    @Test
    @DisplayName("admin_access(OPERATOR) 토큰 → principal=adminId, ROLE_ADMIN + 위계(OPERATOR, VIEWER) 부여")
    void adminAccessToken_grantsRoleHierarchy() throws Exception {
        when(jwtProvider.isValid("adm")).thenReturn(true);
        when(jwtProvider.extractType("adm")).thenReturn(JwtProvider.TYPE_ADMIN_ACCESS);
        when(jwtProvider.extractRole("adm")).thenReturn("OPERATOR");
        when(jwtProvider.extractSubject("adm")).thenReturn("7");

        adminJwtAuthFilter.doFilter(requestWithBearer("adm"), new MockHttpServletResponse(), new MockFilterChain());

        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.getName()).isEqualTo("7");
        assertThat(AuthorityUtils.authorityListToSet(auth.getAuthorities()))
            .contains("ROLE_ADMIN", "ROLE_OPERATOR", "ROLE_VIEWER")
            .doesNotContain("ROLE_SUPER_ADMIN");
    }

    @Test
    @DisplayName("앱 access 토큰은 admin 체인에서 무시된다(인증 없음)")
    void appAccessToken_ignored() throws Exception {
        when(jwtProvider.isValid("app")).thenReturn(true);
        when(jwtProvider.extractType("app")).thenReturn(JwtProvider.TYPE_ACCESS);

        adminJwtAuthFilter.doFilter(requestWithBearer("app"), new MockHttpServletResponse(), new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}
