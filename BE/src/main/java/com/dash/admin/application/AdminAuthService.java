package com.dash.admin.application;

import com.dash.admin.domain.AdminUser;
import com.dash.admin.domain.AdminUserRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.global.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 인증 애플리케이션 서비스 — 앱 소셜 로그인과 완전 분리된 id/password 인증.
 *
 * <p>로그인 성공 시 {@code type=admin_access}(2h) + {@code type=admin_refresh}(24h) JWT 를 발급하며
 * access 토큰에는 role claim 을 실어 권한 파생에 사용한다({@link JwtProvider}). 성공 로그인은
 * 감사 로그에 남긴다. 존재하지 않는 계정·비밀번호 불일치·비활성 계정은 열거(enumeration) 방지를 위해
 * 모두 동일한 {@link ErrorCode#INVALID_ADMIN_CREDENTIALS}(401)로 응답한다.
 */
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private static final String ACTION_LOGIN = "ADMIN_LOGIN";
    private static final String TARGET_ADMIN = "ADMIN";

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AdminAuditService auditService;

    @Transactional
    public AdminLoginResult login(String loginId, String rawPassword, String ip) {
        AdminUser admin = adminUserRepository.findByLoginId(loginId)
            .filter(AdminUser::isActive)
            .filter(a -> passwordEncoder.matches(rawPassword, a.getPasswordHash()))
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_ADMIN_CREDENTIALS));

        auditService.record(admin.getId(), ACTION_LOGIN, TARGET_ADMIN,
            String.valueOf(admin.getId()), null, ip);

        return new AdminLoginResult(
            jwtProvider.generateAdminAccessToken(admin.getId(), admin.getRole().name()),
            jwtProvider.generateAdminRefreshToken(admin.getId()));
    }

    /** admin_refresh 토큰으로 새 admin_access 토큰 발급(리프레시 토큰 회전은 후속). 최신 role 을 반영한다. */
    @Transactional(readOnly = true)
    public AdminLoginResult refresh(String refreshToken) {
        if (!jwtProvider.isValid(refreshToken)
                || !JwtProvider.TYPE_ADMIN_REFRESH.equals(jwtProvider.extractType(refreshToken))) {
            throw new BusinessException(ErrorCode.INVALID_ADMIN_TOKEN);
        }
        AdminUser admin = adminUserRepository.findById(jwtProvider.extractAdminId(refreshToken))
            .filter(AdminUser::isActive)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_ADMIN_TOKEN));

        return new AdminLoginResult(
            jwtProvider.generateAdminAccessToken(admin.getId(), admin.getRole().name()),
            refreshToken);
    }

    @Transactional(readOnly = true)
    public AdminProfile me(Long adminId) {
        AdminUser admin = adminUserRepository.findById(adminId)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_ADMIN_TOKEN));
        return new AdminProfile(admin.getId(), admin.getLoginId(), admin.getName(), admin.getRole());
    }
}
