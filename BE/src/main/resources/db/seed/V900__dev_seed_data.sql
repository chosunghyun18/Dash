-- ─────────────────────────────────────────────────────────────
-- DEV SEED DATA (local 프로파일 전용)
-- application-local.yml 의 flyway.locations 에 classpath:db/seed 가 포함될 때만 적용.
-- docker/dev/prod 프로파일은 db/migration 만 로드하므로 이 시드는 운영에 들어가지 않는다.
--
-- 그래프(조회자 = 수지, id=1):
--   1촌: 민수(2) · 지은(3) · 도윤(4)
--   2촌: 민수→재윤(6)·서아(7) / 지은→민재(8)·예린(9) / 도윤→가영(13)
--   3촌: 재윤→수민(10)·다인(11)·시우(12) / 서아→하늘(5)
--   4촌: 수민→윤호(14)
--   → 3촌+ 연락 요청 게이팅(열람·탐색은 무료) 확인용.
-- ─────────────────────────────────────────────────────────────

-- 1) members (id 명시 → 시퀀스는 마지막에 setval 로 보정)
INSERT INTO members (id, kakao_id, nickname, gender, birth_year, status, country, created_at, updated_at) VALUES
  (1,  'dev-suzy',  '수지', 'FEMALE', 1996, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (2,  'dev-minsu', '민수', 'MALE',   1994, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (3,  'dev-jieun', '지은', 'FEMALE', 1995, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (4,  'dev-doyun', '도윤', 'MALE',   1993, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (5,  'dev-haneul','하늘', 'FEMALE', 1997, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (6,  'dev-jaeyun','재윤', 'MALE',   1995, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (7,  'dev-seoa',  '서아', 'FEMALE', 1996, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (8,  'dev-minjae','민재', 'MALE',   1992, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (9,  'dev-yerin', '예린', 'FEMALE', 1998, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (10, 'dev-sumin', '수민', 'MALE',   1994, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (11, 'dev-dain',  '다인', 'FEMALE', 1997, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (12, 'dev-siu',   '시우', 'MALE',   1996, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (13, 'dev-gayoung','가영','FEMALE', 1995, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (14, 'dev-yunho', '윤호', 'MALE',   1993, 'ACTIVE', 'KR', TIMESTAMP '2026-06-01 09:00:00', TIMESTAMP '2026-06-01 09:00:00');

SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));

-- 2) profiles (member 1:1). ACCEPTED 요청 상대는 연락처가 노출되므로 phone/email 채움.
INSERT INTO profiles (member_id, intro_text, profile_image_url, phone, email, updated_at) VALUES
  (1,  '평일엔 스타트업에서 일하고 주말엔 클라이밍을 해요. 새로운 사람 만나는 거 좋아합니다.', NULL, '010-1000-0001', 'suzy@dash.dev',   TIMESTAMP '2026-06-01 09:00:00'),
  (2,  '대학 동기. 사진 찍는 걸 좋아하고 주말마다 카페 투어 다녀요.',                       NULL, '010-1000-0002', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (3,  '회사 동료예요. 러닝 크루 운영 중. 같이 뛸 사람 환영!',                              NULL, NULL,            'jieun@dash.dev', TIMESTAMP '2026-06-01 09:00:00'),
  (4,  '오래된 친구. 요리와 와인에 진심입니다.',                                            NULL, '010-1000-0004', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (5,  '여행 좋아하고 외국어 배우는 중이에요.',                                            NULL, '010-1000-0005', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (6,  '백엔드 개발자. 자전거로 한강 따라 출퇴근해요.',                                     NULL, '010-1000-0006', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (7,  '디자이너로 일해요. 전시 보러 다니는 게 취미.',                                      NULL, NULL,            'seoa@dash.dev',  TIMESTAMP '2026-06-01 09:00:00'),
  (8,  '엔지니어. 커피에 진심이고 주말엔 베이킹해요.',                                       NULL, '010-1000-0008', 'minjae@dash.dev',TIMESTAMP '2026-06-01 09:00:00'),
  (9,  '마케터예요. 강아지 두 마리와 살아요.',                                              NULL, '010-1000-0009', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (10, '대학원 다니면서 바리스타 알바. 커피 얘기 많이 해요.',                                NULL, '010-1000-0010', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (11, 'UX 리서처. 요가와 필라테스를 좋아해요.',                                            NULL, '010-1000-0011', 'dain@dash.dev',  TIMESTAMP '2026-06-01 09:00:00'),
  (12, '영상 편집자. 독립영화 자주 보러 다녀요.',                                           NULL, '010-1000-0012', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (13, '제품 매니저. 와인 모임 호스트예요.',                                               NULL, '010-1000-0013', NULL,             TIMESTAMP '2026-06-01 09:00:00'),
  (14, '프론트엔드 개발자. 등산과 캠핑을 즐겨요.',                                          NULL, '010-1000-0014', NULL,             TIMESTAMP '2026-06-01 09:00:00');

-- 3) friendships (member_a_id < member_b_id 제약 준수, 무방향)
INSERT INTO friendships (member_a_id, member_b_id, created_at) VALUES
  (1, 2,  TIMESTAMP '2026-06-01 09:00:00'),  -- 수지-민수 (1촌)
  (1, 3,  TIMESTAMP '2026-06-01 09:00:00'),  -- 수지-지은 (1촌)
  (1, 4,  TIMESTAMP '2026-06-01 09:00:00'),  -- 수지-도윤 (1촌)
  (2, 6,  TIMESTAMP '2026-06-01 09:00:00'),  -- 민수-재윤 (2촌)
  (2, 7,  TIMESTAMP '2026-06-01 09:00:00'),  -- 민수-서아 (2촌)
  (3, 8,  TIMESTAMP '2026-06-01 09:00:00'),  -- 지은-민재 (2촌)
  (3, 9,  TIMESTAMP '2026-06-01 09:00:00'),  -- 지은-예린 (2촌)
  (4, 13, TIMESTAMP '2026-06-01 09:00:00'),  -- 도윤-가영 (2촌)
  (6, 10, TIMESTAMP '2026-06-01 09:00:00'),  -- 재윤-수민 (3촌)
  (6, 11, TIMESTAMP '2026-06-01 09:00:00'),  -- 재윤-다인 (3촌)
  (6, 12, TIMESTAMP '2026-06-01 09:00:00'),  -- 재윤-시우 (3촌)
  (5, 7,  TIMESTAMP '2026-06-01 09:00:00'),  -- 서아-하늘 (3촌)
  (10, 14, TIMESTAMP '2026-06-01 09:00:00'); -- 수민-윤호 (4촌)

-- 4) contact_requests (수지 기준 받은/보낸)
INSERT INTO contact_requests (requester_id, target_id, status, created_at, updated_at) VALUES
  (6, 1, 'PENDING',  TIMESTAMP '2026-06-20 10:00:00', TIMESTAMP '2026-06-20 10:00:00'),  -- 재윤→수지 (받은·대기)
  (7, 1, 'PENDING',  TIMESTAMP '2026-06-21 11:00:00', TIMESTAMP '2026-06-21 11:00:00'),  -- 서아→수지 (받은·대기)
  (8, 1, 'ACCEPTED', TIMESTAMP '2026-06-18 12:00:00', TIMESTAMP '2026-06-19 09:00:00'),  -- 민재→수지 (받은·수락)
  (1, 9, 'PENDING',  TIMESTAMP '2026-06-22 14:00:00', TIMESTAMP '2026-06-22 14:00:00'),  -- 수지→예린 (보낸·대기)
  (1, 11,'ACCEPTED', TIMESTAMP '2026-06-17 15:00:00', TIMESTAMP '2026-06-18 16:00:00');  -- 수지→다인 (보낸·수락)

-- 5) invitations (수지 발급)
INSERT INTO invitations (inviter_id, token, status, expires_at, invitee_id, accepted_at, created_at) VALUES
  (1, 'devtok000002', 'ACCEPTED', TIMESTAMP '2026-12-31 00:00:00', 2,    TIMESTAMP '2026-06-02 09:00:00', TIMESTAMP '2026-06-01 09:00:00'),
  (1, 'devtok000001', 'PENDING',  TIMESTAMP '2026-12-31 00:00:00', NULL, NULL,                            TIMESTAMP '2026-06-25 09:00:00');
