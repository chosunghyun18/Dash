package com.dash.admin.application;

import com.dash.admin.domain.AdminRole;
import com.dash.admin.domain.AdminStatus;
import com.dash.admin.domain.AdminUser;
import com.dash.admin.domain.AdminUserRepository;
import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import com.dash.global.security.JwtProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    @Mock AdminUserRepository adminUserRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtProvider jwtProvider;
    @Mock AdminAuditService auditService;
    @InjectMocks AdminAuthService adminAuthService;

    private AdminUser activeSuper() {
        return AdminUser.reconstitute(1L, "super", "hash", "수퍼", AdminRole.SUPER_ADMIN, AdminStatus.ACTIVE);
    }

    @Test
    @DisplayName("로그인 성공 시 access/refresh 토큰을 발급하고 로그인 감사 로그를 남긴다")
    void login_success() {
        when(adminUserRepository.findByLoginId("super")).thenReturn(Optional.of(activeSuper()));
        when(passwordEncoder.matches("pw", "hash")).thenReturn(true);
        when(jwtProvider.generateAdminAccessToken(1L, "SUPER_ADMIN")).thenReturn("access-tok");
        when(jwtProvider.generateAdminRefreshToken(1L)).thenReturn("refresh-tok");

        AdminLoginResult result = adminAuthService.login("super", "pw", "1.2.3.4");

        assertThat(result.accessToken()).isEqualTo("access-tok");
        assertThat(result.refreshToken()).isEqualTo("refresh-tok");
        verify(auditService).record(eq(1L), eq("ADMIN_LOGIN"), eq("ADMIN"), eq("1"), any(), eq("1.2.3.4"));
    }

    @Test
    @DisplayName("존재하지 않는 아이디는 INVALID_ADMIN_CREDENTIALS — 토큰/감사 없음")
    void login_unknownLoginId() {
        when(adminUserRepository.findByLoginId("nobody")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> adminAuthService.login("nobody", "pw", "ip"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.INVALID_ADMIN_CREDENTIALS);

        verify(auditService, never()).record(anyLong(), anyString(), anyString(), anyString(), any(), anyString());
        verify(jwtProvider, never()).generateAdminAccessToken(anyLong(), anyString());
    }

    @Test
    @DisplayName("비밀번호 불일치는 INVALID_ADMIN_CREDENTIALS")
    void login_wrongPassword() {
        when(adminUserRepository.findByLoginId("super")).thenReturn(Optional.of(activeSuper()));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);

        assertThatThrownBy(() -> adminAuthService.login("super", "bad", "ip"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.INVALID_ADMIN_CREDENTIALS);
    }

    @Test
    @DisplayName("비활성(DISABLED) 계정은 비밀번호 대조 없이 INVALID_ADMIN_CREDENTIALS")
    void login_disabledAccount() {
        AdminUser disabled = AdminUser.reconstitute(1L, "super", "hash", "수퍼",
            AdminRole.SUPER_ADMIN, AdminStatus.DISABLED);
        when(adminUserRepository.findByLoginId("super")).thenReturn(Optional.of(disabled));

        assertThatThrownBy(() -> adminAuthService.login("super", "pw", "ip"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.INVALID_ADMIN_CREDENTIALS);

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("refresh: 유효한 admin_refresh 토큰으로 새 access 토큰 발급")
    void refresh_success() {
        when(jwtProvider.isValid("refresh-tok")).thenReturn(true);
        when(jwtProvider.extractType("refresh-tok")).thenReturn(JwtProvider.TYPE_ADMIN_REFRESH);
        when(jwtProvider.extractAdminId("refresh-tok")).thenReturn(1L);
        when(adminUserRepository.findById(1L)).thenReturn(Optional.of(activeSuper()));
        when(jwtProvider.generateAdminAccessToken(1L, "SUPER_ADMIN")).thenReturn("new-access");

        AdminLoginResult result = adminAuthService.refresh("refresh-tok");

        assertThat(result.accessToken()).isEqualTo("new-access");
        assertThat(result.refreshToken()).isEqualTo("refresh-tok");
    }

    @Test
    @DisplayName("refresh: admin_refresh 가 아닌 토큰 타입은 INVALID_ADMIN_TOKEN")
    void refresh_wrongType() {
        when(jwtProvider.isValid("access-tok")).thenReturn(true);
        when(jwtProvider.extractType("access-tok")).thenReturn(JwtProvider.TYPE_ADMIN_ACCESS);

        assertThatThrownBy(() -> adminAuthService.refresh("access-tok"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.INVALID_ADMIN_TOKEN);
    }

    @Test
    @DisplayName("me: adminId 로 프로필 조회")
    void me_success() {
        when(adminUserRepository.findById(1L)).thenReturn(Optional.of(activeSuper()));

        AdminProfile profile = adminAuthService.me(1L);

        assertThat(profile.id()).isEqualTo(1L);
        assertThat(profile.loginId()).isEqualTo("super");
        assertThat(profile.role()).isEqualTo(AdminRole.SUPER_ADMIN);
    }
}
