package com.dash.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT 발급/검증. 모든 토큰에 {@code type} claim(access | refresh | registration)을 넣어
 * 용도를 구분한다 — registration 토큰은 subject 가 소셜 ID 문자열이므로
 * 인증 필터는 반드시 type=access 만 인증 처리해야 한다({@link JwtAuthFilter} 참조).
 */
@Component
@RequiredArgsConstructor
public class JwtProvider {

    public static final String TYPE_ACCESS = "access";
    public static final String TYPE_REFRESH = "refresh";
    public static final String TYPE_REGISTRATION = "registration";
    public static final String TYPE_ADMIN_ACCESS = "admin_access";
    public static final String TYPE_ADMIN_REFRESH = "admin_refresh";

    private static final String TYPE_CLAIM = "type";
    private static final String ROLE_CLAIM = "role";

    /** 등록 토큰 만료(10분) — 소셜 인증 직후 프로필 등록까지의 단기 창구. */
    private static final long REGISTRATION_EXPIRATION_MS = 600_000L;

    /** 관리자 access 만료(2시간) — 앱 토큰보다 짧게. */
    private static final long ADMIN_ACCESS_EXPIRATION_MS = 7_200_000L;

    /** 관리자 refresh 만료(24시간). */
    private static final long ADMIN_REFRESH_EXPIRATION_MS = 86_400_000L;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateAccessToken(Long memberId) {
        return buildToken(String.valueOf(memberId), TYPE_ACCESS, expiration);
    }

    public String generateRefreshToken(Long memberId) {
        return buildToken(String.valueOf(memberId), TYPE_REFRESH, refreshExpiration);
    }

    /** 미등록 소셜 유저용 단기 등록 토큰. subject = 소셜 ID("provider:subject"). */
    public String generateRegistrationToken(String socialId) {
        return buildToken(socialId, TYPE_REGISTRATION, REGISTRATION_EXPIRATION_MS);
    }

    /** 관리자 access 토큰 — subject=adminId(숫자), type=admin_access, role claim 포함. */
    public String generateAdminAccessToken(Long adminId, String role) {
        return Jwts.builder()
            .subject(String.valueOf(adminId))
            .claim(TYPE_CLAIM, TYPE_ADMIN_ACCESS)
            .claim(ROLE_CLAIM, role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + ADMIN_ACCESS_EXPIRATION_MS))
            .signWith(key)
            .compact();
    }

    public String generateAdminRefreshToken(Long adminId) {
        return buildToken(String.valueOf(adminId), TYPE_ADMIN_REFRESH, ADMIN_REFRESH_EXPIRATION_MS);
    }

    public Long extractMemberId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    /** 관리자 토큰 subject(adminId) 추출. admin 토큰의 subject 는 숫자이므로 파싱 안전. */
    public Long extractAdminId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    /** {@code role} claim 반환(관리자 access 토큰). 없으면 null. */
    public String extractRole(String token) {
        return parseClaims(token).get(ROLE_CLAIM, String.class);
    }

    /** subject 문자열 원본 반환 — registration 토큰의 소셜 ID 추출용(Long 파싱 없음). */
    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    /** {@code type} claim 반환. claim 이 없으면(구버전 토큰) null. */
    public String extractType(String token) {
        return parseClaims(token).get(TYPE_CLAIM, String.class);
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build()
            .parseSignedClaims(token).getPayload();
    }

    private String buildToken(String subject, String type, long expMs) {
        return Jwts.builder()
            .subject(subject)
            .claim(TYPE_CLAIM, type)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expMs))
            .signWith(key)
            .compact();
    }
}
