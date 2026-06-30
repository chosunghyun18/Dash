package com.dash.auth.presentation;

import com.dash.global.security.JwtProvider;
import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 개발 전용 로그인. 소셜 SDK/토큰 검증 없이 시드 멤버로 정식 JWT를 발급한다.
 *
 * <p>{@code @Profile("local")} 이므로 운영(prod)·docker·dev 프로파일엔 빈으로 등록되지 않는다.
 * 시드 데이터(`db/seed`, 기본 수지 id=1)가 존재하는 local 환경에서만 의미가 있다.
 * 경로 {@code /api/v1/auth/**} 는 SecurityConfig 에서 permitAll.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Profile("local")
public class DevAuthController {

    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;

    public record DevLoginRequest(Long memberId) {}

    /** FE {@code SocialLoginResponse} 와 동일 형태. */
    public record DevLoginResponse(String accessToken, String refreshToken, String userId, boolean isNewUser) {}

    @PostMapping("/dev")
    public ResponseEntity<DevLoginResponse> devLogin(@RequestBody(required = false) DevLoginRequest req) {
        long memberId = (req != null && req.memberId() != null) ? req.memberId() : 1L;
        if (!memberRepository.existsById(MemberId.of(memberId))) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "seed member not found: " + memberId + " — db/seed(V900) 적용 여부 확인");
        }
        String accessToken = jwtProvider.generateAccessToken(memberId);
        String refreshToken = jwtProvider.generateRefreshToken(memberId);
        return ResponseEntity.ok(new DevLoginResponse(accessToken, refreshToken, String.valueOf(memberId), false));
    }
}
