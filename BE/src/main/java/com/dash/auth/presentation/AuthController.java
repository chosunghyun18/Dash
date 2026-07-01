package com.dash.auth.presentation;

import com.dash.auth.application.RegisterCommand;
import com.dash.auth.application.SocialAuthService;
import com.dash.auth.application.SocialLoginResult;
import com.dash.auth.domain.SocialProvider;
import com.dash.member.domain.Gender;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * 소셜 인증 API — Apple/Google 로그인, 신규 회원 등록, 로그아웃.
 * 경로 {@code /api/v1/auth/**} 는 SecurityConfig 에서 permitAll.
 * (개발 전용 {@code /dev} 는 {@link DevAuthController} — local 프로파일 한정, 경로 충돌 없음.)
 */
@Tag(name = "Auth", description = "소셜 인증 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final SocialAuthService socialAuthService;

    public record AppleLoginRequest(String identityToken, String authorizationCode,
                                    String fullName, String email) {}

    public record GoogleLoginRequest(String idToken) {}

    public record RegisterRequest(

        @NotBlank
        @Size(min = 1, max = 12, message = "닉네임은 1~12자여야 합니다")
        String nickname,

        @NotNull(message = "성별은 필수입니다")
        Gender gender,

        Integer birthYear,

        @Size(max = 20)
        @Pattern(regexp = "^[0-9+\\-]*$", message = "전화번호 형식이 올바르지 않습니다")
        String phone,

        @Email(message = "이메일 형식이 올바르지 않습니다")
        @Size(max = 255)
        String email,

        @Size(max = 500, message = "소개글은 500자 이하여야 합니다")
        String introText
    ) {}

    /** FE {@code SocialLoginResponse} 와 동일 형태. */
    public record AuthResponse(String accessToken, String refreshToken, String userId, boolean isNewUser) {}

    @Operation(summary = "Apple 로그인", description = "Apple identityToken 으로 로그인합니다. 미등록 소셜 ID 면 registration 토큰과 isNewUser=true 를 반환합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "로그인 성공 또는 등록 토큰 발급"),
        @ApiResponse(responseCode = "400", description = "유효하지 않은 소셜 토큰")
    })
    @PostMapping("/apple")
    public ResponseEntity<AuthResponse> loginWithApple(@RequestBody AppleLoginRequest request) {
        return ResponseEntity.ok(toResponse(
            socialAuthService.login(SocialProvider.APPLE, request.identityToken())));
    }

    @Operation(summary = "Google 로그인", description = "Google idToken 으로 로그인합니다. 미등록 소셜 ID 면 registration 토큰과 isNewUser=true 를 반환합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "로그인 성공 또는 등록 토큰 발급"),
        @ApiResponse(responseCode = "400", description = "유효하지 않은 소셜 토큰")
    })
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(toResponse(
            socialAuthService.login(SocialProvider.GOOGLE, request.idToken())));
    }

    @Operation(summary = "신규 회원 등록", description = "소셜 로그인에서 발급된 registration 토큰(Authorization: Bearer)과 프로필 정보로 회원을 생성하고 정식 JWT 를 발급합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "등록 성공"),
        @ApiResponse(responseCode = "400", description = "헤더 누락/형식 오류 또는 유효하지 않은 등록 토큰"),
        @ApiResponse(responseCode = "409", description = "닉네임 중복")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody RegisterRequest request) {
        String registrationToken = extractBearer(authorization);
        RegisterCommand cmd = new RegisterCommand(
            request.nickname(), request.gender(), request.birthYear(),
            request.phone(), request.email(), request.introText());
        return ResponseEntity.ok(toResponse(socialAuthService.register(registrationToken, cmd)));
    }

    /**
     * 로그아웃 — JWT stateless 라 클라이언트가 토큰을 폐기한다.
     * 서버 세션/리프레시 토큰 스토어가 없어 서버 측은 무상태 no-op(200)이다.
     */
    @Operation(summary = "로그아웃", description = "JWT stateless — 클라이언트가 토큰을 폐기합니다. 서버는 no-op 200.")
    @PostMapping("/sign-out")
    public ResponseEntity<Void> signOut() {
        return ResponseEntity.ok().build();
    }

    private static String extractBearer(String authorization) {
        if (authorization == null
                || !authorization.startsWith(BEARER_PREFIX)
                || authorization.length() <= BEARER_PREFIX.length()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Authorization: Bearer <registrationToken> 헤더가 필요합니다");
        }
        return authorization.substring(BEARER_PREFIX.length());
    }

    private static AuthResponse toResponse(SocialLoginResult result) {
        return new AuthResponse(result.accessToken(), result.refreshToken(),
            result.userId(), result.isNewUser());
    }
}
