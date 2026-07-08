package com.dash.admin.domain;

/**
 * 관리자 감사 로그 저장소 포트(append-only). 도메인이 소유하며 인프라가 구현한다.
 */
public interface AdminAuditLogRepository {

    AdminAuditLog save(AdminAuditLog log);
}
