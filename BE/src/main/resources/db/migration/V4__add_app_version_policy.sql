-- app_version_policy: 플랫폼별 앱 바이너리 버전 정책 (강제/권장 업데이트 + 점검 모드)
-- 서버가 X-App-Version / X-Platform 헤더로 상태(OK/SOFT_UPDATE/FORCE_UPDATE)를 판단
CREATE TABLE app_version_policy (
    platform              VARCHAR(10)  PRIMARY KEY,          -- 'ios' | 'android'
    min_supported_version VARCHAR(20)  NOT NULL,
    latest_version        VARCHAR(20)  NOT NULL,
    store_url             VARCHAR(500) NOT NULL DEFAULT '',
    message               VARCHAR(500) NOT NULL DEFAULT '',
    maintenance           BOOLEAN      NOT NULL DEFAULT FALSE,
    updated_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 기본 정책(모든 환경 시드 — 운영도 동작해야 하므로 migration에 포함)
INSERT INTO app_version_policy (platform, min_supported_version, latest_version, store_url, message, maintenance, updated_at)
VALUES
 ('ios',     '1.0.0', '1.0.0', 'https://apps.apple.com/app/id000000000', '', FALSE, CURRENT_TIMESTAMP),
 ('android', '1.0.0', '1.0.0', 'https://play.google.com/store/apps/details?id=com.dash', '', FALSE, CURRENT_TIMESTAMP);
