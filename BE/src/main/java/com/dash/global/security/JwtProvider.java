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

    private static final String TYPE_CLAIM = "type";

    /** 등록 토큰 만료(10분) — 소셜 인증 직후 프로필 등록까지의 단기 창구. */
    private static final long REGISTRATION_EXPIRATION_MS = 600_000L;

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

    public Long extractMemberId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
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
