-- members.nickname: VARCHAR(50) → VARCHAR(12), UNIQUE 추가
-- FE /nickname-check API 존재 및 max 12자 강제 확인으로 수정
ALTER TABLE members ALTER COLUMN nickname TYPE VARCHAR(12);
ALTER TABLE members ADD CONSTRAINT uq_members_nickname UNIQUE (nickname);

-- profiles: members와 1:1, member 생성 시 같은 트랜잭션에서 함께 INSERT
-- phone / email 중 하나 이상 필수는 앱 레벨 검증 (프로필 저장 시점에 FE+BE Service 에서 검증)
CREATE TABLE profiles (
    member_id         BIGINT       PRIMARY KEY REFERENCES members(id),
    intro_text        TEXT         NOT NULL DEFAULT '',
    profile_image_url VARCHAR(500),
    phone             VARCHAR(20),
    email             VARCHAR(255),
    updated_at        TIMESTAMP    NOT NULL
);
