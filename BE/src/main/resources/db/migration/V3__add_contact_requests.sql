-- contact_requests: 지인에게 연락처 공개 요청
-- 연락처 정보(phone/email)는 이 테이블에 저장하지 않음
-- ACCEPTED 상태 조회 시 profiles 테이블 JOIN으로 requester 연락처 반환
CREATE TABLE contact_requests (
    id           BIGSERIAL    PRIMARY KEY,
    requester_id BIGINT       NOT NULL REFERENCES members(id),
    target_id    BIGINT       NOT NULL REFERENCES members(id),
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,
    CONSTRAINT uq_contact_request UNIQUE (requester_id, target_id),
    CONSTRAINT chk_contact_request_no_self CHECK (requester_id <> target_id)
);

CREATE INDEX idx_contact_requests_requester ON contact_requests(requester_id);
CREATE INDEX idx_contact_requests_target    ON contact_requests(target_id);
