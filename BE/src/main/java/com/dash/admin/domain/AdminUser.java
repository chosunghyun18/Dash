package com.dash.admin.domain;

import lombok.Getter;

/**
 * 관리자 계정 애그리거트 (순수 도메인 — 프레임워크 의존 없음).
 * 비밀번호는 해시만 보관하며, 대조(match)는 인프라(PasswordEncoder) 관심사이므로
 * 애플리케이션 서비스에서 수행한다. 타임스탬프(created/updated/lastLogin)는 인프라 관심사.
 */
@Getter
public class AdminUser {

    private final Long id;
    private final String loginId;
    private final String passwordHash;
    private final String name;
    private final AdminRole role;
    private final AdminStatus status;

    private AdminUser(Long id, String loginId, String passwordHash, String name,
                      AdminRole role, AdminStatus status) {
        this.id = id;
        this.loginId = loginId;
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
        this.status = status;
    }

    /** 영속 데이터로부터 복원. */
    public static AdminUser reconstitute(Long id, String loginId, String passwordHash,
                                         String name, AdminRole role, AdminStatus status) {
        return new AdminUser(id, loginId, passwordHash, name, role, status);
    }

    public boolean isActive() {
        return status == AdminStatus.ACTIVE;
    }
}
