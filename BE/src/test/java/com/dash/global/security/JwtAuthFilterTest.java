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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * JwtAuthFilter 회귀 방지 테스트 — 필터는 반드시 type=access 토큰만 인증해야 한다.
 * registration 토큰(subject="apple:xxx")에 extractMemberId(Long 파싱)를 호출하면 500 이 나므로,
 * 필터가 type 으로 먼저 거르는 계약을 고정한다.
 */
@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @Mock JwtProvider jwtProvider;
    @Mock CustomUserDetailsService userDetailsService;
    @InjectMocks JwtAuthFilter jwtAuthFilter;

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
    @DisplayName("registration 토큰은 인증되지 않으며 extractMemberId 를 절대 호출하지 않는다")
    void registrationToken_notAuthenticated() throws Exception {
        when(jwtProvider.isValid("reg")).thenReturn(true);
        when(jwtProvider.extractType("reg")).thenReturn(JwtProvider.TYPE_REGISTRATION);

        jwtAuthFilter.doFilter(requestWithBearer("reg"), new MockHttpServletResponse(), new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(jwtProvider, never()).extractMemberId(anyString());
    }

    @Test
    @DisplayName("access 토큰은 인증되어 SecurityContext 에 principal 이 설정된다")
    void accessToken_authenticated() throws Exception {
        when(jwtProvider.isValid("acc")).thenReturn(true);
        when(jwtProvider.extractType("acc")).thenReturn(JwtProvider.TYPE_ACCESS);
        when(jwtProvider.extractMemberId("acc")).thenReturn(1L);
        when(userDetailsService.loadUserById(1L)).thenReturn(
            User.builder().username("1").password("").authorities("ROLE_USER").build());

        jwtAuthFilter.doFilter(requestWithBearer("acc"), new MockHttpServletResponse(), new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("1");
    }

    @Test
    @DisplayName("토큰이 없으면 익명으로 통과한다")
    void noToken_anonymous() throws Exception {
        jwtAuthFilter.doFilter(new MockHttpServletRequest(), new MockHttpServletResponse(), new MockFilterChain());

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}
