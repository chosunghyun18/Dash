# 테이블: `contact_requests`

**엔티티:** `com.dash.contactrequest.domain.ContactRequest` · **마이그레이션:** V3

지인에게 연락처 공개를 요청. 연락처 자체는 저장하지 않고 [profiles](profiles.md)에서 JOIN.

## 컬럼

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| requester_id | BIGINT | NO | — | FK → members.id (요청자) |
| target_id | BIGINT | NO | — | FK → members.id (수신자) |
| status | VARCHAR(20) | NO | `PENDING` | `PENDING` \| `ACCEPTED` \| `REJECTED` |
| created_at | TIMESTAMP | NO | now() | 요청 시각 |
| updated_at | TIMESTAMP | NO | now() | 상태 변경 시각 |

## 인덱스 / 제약

- `PRIMARY KEY (id)`
- `UNIQUE (requester_id, target_id)` — 동일 대상 중복 요청 방지
- `CHECK (requester_id <> target_id)` — 자기 자신 요청 불가
- `INDEX (requester_id)`, `INDEX (target_id)`

## enum

- `ContactRequestStatus` = `PENDING`, `ACCEPTED`, `REJECTED`

## 엔티티 메모

- 팩토리: `ContactRequest.create(requester, target)` — status=PENDING
- `accept()`, `reject()`, `isPending()`
- requester/target 모두 `@ManyToOne(LAZY)`

## 연락처 노출 규칙 (중요)

연락처(`phone`/`email`)는 이 테이블에 없고, **`ACCEPTED` 상태일 때만** profiles에서 JOIN하여 노출. 노출 방향은 **상대방 연락처**:

| 조회/액션 | 호출자 | 노출되는 연락처 |
|-----------|--------|-----------------|
| 보낸 목록 `/sent` | 요청자 | **target(상대)** 의 연락처 |
| 받은 목록 `/received` | 수신자 | **requester(상대)** 의 연락처 |
| 수락 `/accept` | 수신자(target) | **requester(상대)** 의 연락처 |

> ⚠️ 기존 [../../DB_SCHEMA.md](../../DB_SCHEMA.md)는 sent도 "requester 연락처"라 적었으나, 실제 구현과 FE mock(`SENT` 항목이 target 박지현의 이메일을 노출)은 위 표가 맞다. 양측이 서로의 연락처를 교환하는 구조.

## 관련 기능

- [features/contact-request.md](../features/contact-request.md)
