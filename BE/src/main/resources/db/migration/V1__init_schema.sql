CREATE TABLE members (
    id         BIGSERIAL    PRIMARY KEY,
    kakao_id   VARCHAR(255) NOT NULL UNIQUE,
    nickname   VARCHAR(50)  NOT NULL,
    gender     VARCHAR(10)  NOT NULL,
    birth_year INTEGER,
    status     VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    country    VARCHAR(10)  NOT NULL DEFAULT 'KR',
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL
);

CREATE TABLE invitations (
    id          BIGSERIAL    PRIMARY KEY,
    inviter_id  BIGINT       NOT NULL REFERENCES members(id),
    token       VARCHAR(12)  NOT NULL UNIQUE,
    status      VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    expires_at  TIMESTAMP    NOT NULL,
    invitee_id  BIGINT       REFERENCES members(id),
    accepted_at TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL
);

CREATE TABLE friendships (
    id           BIGSERIAL PRIMARY KEY,
    member_a_id  BIGINT    NOT NULL REFERENCES members(id),
    member_b_id  BIGINT    NOT NULL REFERENCES members(id),
    created_at   TIMESTAMP NOT NULL,
    CONSTRAINT uq_friendship UNIQUE (member_a_id, member_b_id),
    CONSTRAINT chk_friendship_order CHECK (member_a_id < member_b_id)
);

CREATE INDEX idx_invitations_token    ON invitations(token);
CREATE INDEX idx_invitations_inviter  ON invitations(inviter_id);
CREATE INDEX idx_friendships_member_a ON friendships(member_a_id);
CREATE INDEX idx_friendships_member_b ON friendships(member_b_id);
