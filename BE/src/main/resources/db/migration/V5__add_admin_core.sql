-- 관리자(Admin) 웹 대시보드 기반: 관리자 계정 + 감사 로그.
-- 앱 소셜 로그인(members.kakao_id)과 완전 분리된 id/password 인증 주체.
-- 보안: 운영용 최초 SUPER_ADMIN 은 이 마이그레이션에 시드하지 않는다(기본 자격증명 유출 방지).
--        로컬 개발용 계정은 db/seed(V901, local 프로파일 한정)에서만 주입한다.
CREATE TABLE admin_users (
    id            BIGSERIAL     PRIMARY KEY,
    login_id      VARCHAR(50)   NOT NULL UNIQUE,
    password_hash VARCHAR(100)  NOT NULL,                    -- BCrypt
    name          VARCHAR(50)   NOT NULL,
    role          VARCHAR(20)   NOT NULL,                    -- SUPER_ADMIN | OPERATOR | VIEWER
    status        VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE | DISABLED
    last_login_at TIMESTAMP,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 모든 admin 쓰기 액션의 append-only 감사 로그.
-- detail 은 변경 전/후 스냅샷 + 사유를 담은 JSON 문자열(TEXT). 질의 필요 시 향후 JSONB 로 전환 가능.
CREATE TABLE admin_audit_logs (
    id          BIGSERIAL    PRIMARY KEY,
    admin_id    BIGINT       NOT NULL REFERENCES admin_users(id),
    action      VARCHAR(50)  NOT NULL,      -- ADMIN_LOGIN, MEMBER_SUSPEND, POLICY_UPDATE ...
    target_type VARCHAR(30),                -- ADMIN | MEMBER | APP_VERSION_POLICY ...
    target_id   VARCHAR(50),
    detail      TEXT,                       -- 변경 전/후 + reason (JSON 문자열)
    ip          VARCHAR(45),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_admin  ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_target ON admin_audit_logs(target_type, target_id);
