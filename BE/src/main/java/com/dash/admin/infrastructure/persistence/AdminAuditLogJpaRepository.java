package com.dash.admin.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

interface AdminAuditLogJpaRepository extends JpaRepository<AdminAuditLogJpaEntity, Long> {
}
