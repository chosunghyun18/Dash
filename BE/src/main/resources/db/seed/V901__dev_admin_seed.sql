-- ─────────────────────────────────────────────────────────────
-- DEV ADMIN SEED (local 프로파일 전용 — db/seed)
-- application-local.yml 의 flyway.locations 에 classpath:db/seed 가 포함될 때만 적용.
-- docker/dev/prod 프로파일은 db/migration 만 로드하므로 이 계정은 운영에 들어가지 않는다.
-- 운영의 최초 SUPER_ADMIN 은 배포 시 별도로 안전하게 프로비저닝할 것.
--
-- 로그인: super / dashadmin!23   (BCryptPasswordEncoder, 개발 전용 임시 비밀번호)
-- ─────────────────────────────────────────────────────────────
INSERT INTO admin_users (login_id, password_hash, name, role, status, created_at, updated_at) VALUES
  ('super', '$2a$10$O9PpruY3jqvtpggO63QtsOhuaMvdDLvi.s91nke8Ci/7kbow/zJJS', '수퍼관리자', 'SUPER_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
