package com.dash.admin.presentation;

import com.dash.admin.application.AdminAuthService;
import com.dash.admin.application.AdminLoginResult;
import com.dash.admin.application.AdminProfile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 관리자 인증 API — id/password 로그인, 토큰 갱신, 내 정보.
 * {@code /login}·{@code /refresh} 는 permitAll, {@code /me} 는 admin 인증 필요
 * (SecurityConfig 의 {@code /api/admin/**} 전용 필터체인). 앱 access 토큰으로는 접근 불가(토큰 type 분리).
 */
@Tag(name = "Admin Auth", description = "관리자 인증 API")
@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    public record AdminLoginRequest(@NotBlank String loginId, @NotBlank String password) {}

    public record AdminRefreshRequest(@NotBlank String refreshToken) {}

    public record AdminTokenResponse(String accessToken, String refreshToken) {}

    public record AdminAccessResponse(String accessToken) {}

    public record AdminMeResponse(Long id, String loginId, String name, String role) {}

    @Operation(summary = "관리자 로그인",
        description = "id/password 로 로그인해 admin_access(2h)+admin_refresh(24h) 토큰을 발급합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "로그인 성공"),
        @ApiResponse(responseCode = "401", description = "아이디/비밀번호 불일치 또는 비활성 계정")
    })
    @PostMapping("/login")
    public ResponseEntity<AdminTokenResponse> login(@Valid @RequestBody AdminLoginRequest request,
                                                    HttpServletRequest servletRequest) {
        AdminLoginResult result = adminAuthService.login(
            request.loginId(), request.password(), clientIp(servletRequest));
        return ResponseEntity.ok(new AdminTokenResponse(result.accessToken(), result.refreshToken()));
    }

    @Operation(summary = "관리자 토큰 갱신",
        description = "admin_refresh 토큰으로 새 admin_access 토큰을 발급합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "갱신 성공"),
        @ApiResponse(responseCode = "401", description = "유효하지 않은 refresh 토큰")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AdminAccessResponse> refresh(@Valid @RequestBody AdminRefreshRequest request) {
        AdminLoginResult result = adminAuthService.refresh(request.refreshToken());
        return ResponseEntity.ok(new AdminAccessResponse(result.accessToken()));
    }

    @Operation(summary = "내 관리자 정보", description = "현재 admin_access 토큰의 관리자 정보를 반환합니다.")
    @GetMapping("/me")
    public ResponseEntity<AdminMeResponse> me(@AuthenticationPrincipal String adminId) {
        AdminProfile profile = adminAuthService.me(Long.parseLong(adminId));
        return ResponseEntity.ok(new AdminMeResponse(
            profile.id(), profile.loginId(), profile.name(), profile.role().name()));
    }

    /** 감사 로그용 클라이언트 IP — 프록시(nginx) 뒤를 고려해 X-Forwarded-For 우선. */
    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
