package com.dash.admin.domain;

import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 관리자 쓰기 액션 감사 로그(append-only). 누가(adminId)·무엇을(action, target)·
 * 어떻게(detail = 변경 전/후 + 사유 JSON 문자열)·어디서(ip)·언제(createdAt)를 남긴다.
 */
@Getter
public class AdminAuditLog {

    private final Long id;
    private final Long adminId;
    private final String action;
    private final String targetType;
    private final String targetId;
    private final String detail;
    private final String ip;
    private final LocalDateTime createdAt;

    private AdminAuditLog(Long id, Long adminId, String action, String targetType,
                          String targetId, String detail, String ip, LocalDateTime createdAt) {
        this.id = id;
        this.adminId = adminId;
        this.action = action;
        this.targetType = targetType;
        this.targetId = targetId;
        this.detail = detail;
        this.ip = ip;
        this.createdAt = createdAt;
    }

    /** 신규 기록 — id/createdAt 은 영속 시 채워진다. */
    public static AdminAuditLog record(Long adminId, String action, String targetType,
                                       String targetId, String detail, String ip) {
        return new AdminAuditLog(null, adminId, action, targetType, targetId, detail, ip, null);
    }

    /** 영속 데이터로부터 복원. */
    public static AdminAuditLog reconstitute(Long id, Long adminId, String action, String targetType,
                                             String targetId, String detail, String ip, LocalDateTime createdAt) {
        return new AdminAuditLog(id, adminId, action, targetType, targetId, detail, ip, createdAt);
    }
}
