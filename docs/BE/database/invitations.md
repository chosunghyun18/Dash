# 테이블: `invitations`

**엔티티:** `com.dash.invitation.domain.Invitation` · **마이그레이션:** V1

친구 초대 링크(토큰). 수락 시 [friendships](friendships.md) 생성.

## 컬럼

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| inviter_id | BIGINT | NO | — | FK → members.id (초대자) |
| token | VARCHAR(12) | NO | — | URL-safe 공유 토큰 (UNIQUE) |
| status | VARCHAR(20) | NO | `PENDING` | `PENDING` \| `ACCEPTED` \| `EXPIRED` \| `CANCELED` |
| expires_at | TIMESTAMP | NO | — | 만료 시각 (생성 + 7일) |
| invitee_id | BIGINT | YES | NULL | FK → members.id (수락 시 세팅) |
| accepted_at | TIMESTAMP | YES | NULL | 수락 시각 |
| created_at | TIMESTAMP | NO | now() | 생성 시각 (불변) |

## 인덱스 / 제약

- `PRIMARY KEY (id)` · `UNIQUE (token)` → `idx_invitations_token`
- `INDEX (inviter_id)` → `idx_invitations_inviter`
- FK: `inviter_id`, `invitee_id` → members(id)

## enum

- `InvitationStatus` = `PENDING`, `ACCEPTED`, `EXPIRED`, `CANCELED`

## 엔티티 메모

- 팩토리: `Invitation.create(inviter, token)` — status=PENDING, expiresAt = now+7일
- `isExpired()`, `accept(invitee)` (도메인에서 상태/만료 검증 후 ACCEPTED 전환)
- 토큰: `UUID` 12자 대문자, `existsByToken`로 충돌 회피

## 비즈니스 규칙

- `PENDING` 상태만 수락 가능, 만료 시 EXPIRED 전환 + 예외
- 자기 자신 초대 불가, 이미 친구면 수락 불가
- 수락 시 `friendships` 자동 생성

## 관련 기능

- [features/invitation.md](../features/invitation.md)
