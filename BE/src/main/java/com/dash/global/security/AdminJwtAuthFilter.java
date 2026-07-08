package com.dash.global.security;

import com.dash.admin.domain.AdminRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 관리자 전용 JWT 인증 필터 — {@code type=admin_access} 토큰만 인증한다.
 * 앱 access 토큰은 여기서 무시되어(익명 → 403) admin API 에 접근할 수 없다(토큰 type 분리).
 * 권한은 토큰의 role claim 에서 파생: {@code ROLE_ADMIN} + 역할 위계({@link AdminRole#impliedRoleNames()})를 부여.
 * principal 은 adminId 문자열이다. {@code /api/admin/**} 전용 필터체인에만 등록({@link SecurityConfig}).
 */
@Component
@RequiredArgsConstructor
public class AdminJwtAuthFilter extends OncePerRequestFilter {

    private static final String ROLE_PREFIX = "ROLE_";

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null && jwtProvider.isValid(token)
                && JwtProvider.TYPE_ADMIN_ACCESS.equals(jwtProvider.extractType(token))) {
            AdminRole role = AdminRole.from(jwtProvider.extractRole(token)).orElse(null);
            if (role != null) {
                String adminId = jwtProvider.extractSubject(token);
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + "ADMIN"));
                role.impliedRoleNames().forEach(r -> authorities.add(new SimpleGrantedAuthority(ROLE_PREFIX + r)));

                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(adminId, null, authorities);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
