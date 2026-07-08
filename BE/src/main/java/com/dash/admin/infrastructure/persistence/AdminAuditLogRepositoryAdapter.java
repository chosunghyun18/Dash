package com.dash.admin.infrastructure.persistence;

import com.dash.admin.domain.AdminAuditLog;
import com.dash.admin.domain.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AdminAuditLogRepositoryAdapter implements AdminAuditLogRepository {

    private final AdminAuditLogJpaRepository jpa;

    @Override
    public AdminAuditLog save(AdminAuditLog log) {
        return AdminAuditLogMapper.toDomain(jpa.save(AdminAuditLogMapper.toEntity(log)));
    }
}
