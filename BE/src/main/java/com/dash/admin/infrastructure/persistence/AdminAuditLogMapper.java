package com.dash.admin.infrastructure.persistence;

import com.dash.admin.domain.AdminAuditLog;

final class AdminAuditLogMapper {

    private AdminAuditLogMapper() {
    }

    static AdminAuditLogJpaEntity toEntity(AdminAuditLog log) {
        return new AdminAuditLogJpaEntity(
            log.getAdminId(),
            log.getAction(),
            log.getTargetType(),
            log.getTargetId(),
            log.getDetail(),
            log.getIp()
        );
    }

    static AdminAuditLog toDomain(AdminAuditLogJpaEntity e) {
        return AdminAuditLog.reconstitute(
            e.getId(),
            e.getAdminId(),
            e.getAction(),
            e.getTargetType(),
            e.getTargetId(),
            e.getDetail(),
            e.getIp(),
            e.getCreatedAt()
        );
    }
}
