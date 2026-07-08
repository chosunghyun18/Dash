package com.dash.admin.infrastructure.persistence;

import com.dash.admin.domain.AdminUser;

final class AdminUserMapper {

    private AdminUserMapper() {
    }

    static AdminUser toDomain(AdminUserJpaEntity e) {
        return AdminUser.reconstitute(
            e.getId(),
            e.getLoginId(),
            e.getPasswordHash(),
            e.getName(),
            e.getRole(),
            e.getStatus()
        );
    }
}
