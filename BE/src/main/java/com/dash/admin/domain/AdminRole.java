package com.dash.admin.domain;

import java.util.Optional;
import java.util.Set;

/**
 * 관리자 역할(RBAC). 상위 역할은 하위 역할의 권한을 함의한다.
 * 순수 도메인 — Spring Security 타입에 의존하지 않고 역할명 집합만 노출한다.
 */
public enum AdminRole {

    SUPER_ADMIN,   // 전권 — 관리자 계정·버전 정책·점검 모드·Dash+ 수동 부여
    OPERATOR,      // 운영 — 회원 정지/해제, 신고 처리, 초대 강제 만료 등 일상 모더레이션
    VIEWER;        // 읽기 전용

    /** 이 역할이 함의하는 역할명 집합(위계 포함). 예: SUPER_ADMIN → {SUPER_ADMIN, OPERATOR, VIEWER}. */
    public Set<String> impliedRoleNames() {
        return switch (this) {
            case SUPER_ADMIN -> Set.of(SUPER_ADMIN.name(), OPERATOR.name(), VIEWER.name());
            case OPERATOR -> Set.of(OPERATOR.name(), VIEWER.name());
            case VIEWER -> Set.of(VIEWER.name());
        };
    }

    public static Optional<AdminRole> from(String value) {
        if (value == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(AdminRole.valueOf(value));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
