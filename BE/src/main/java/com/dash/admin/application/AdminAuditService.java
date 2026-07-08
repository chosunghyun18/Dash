package com.dash.admin.application;

import com.dash.admin.domain.AdminAuditLog;
import com.dash.admin.domain.AdminAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 쓰기 액션 감사 기록 서비스. 각 관리자 유스케이스가 변경 직후 명시적으로 호출한다
 * (초기 방식 — 향후 AOP/인터셉터로 공통화 가능).
 */
@Service
@RequiredArgsConstructor
public class AdminAuditService {

    private final AdminAuditLogRepository auditLogRepository;

    @Transactional
    public void record(Long adminId, String action, String targetType,
                       String targetId, String detail, String ip) {
        auditLogRepository.save(AdminAuditLog.record(adminId, action, targetType, targetId, detail, ip));
    }
}
