# 테이블: `friendships`

**엔티티:** `com.dash.friendship.domain.Friendship` · **마이그레이션:** V1

A↔B 친구 관계를 **단일 레코드**로 표현. 양방향 중복 방지를 위해 항상 `member_a_id < member_b_id`.

## 컬럼

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| member_a_id | BIGINT | NO | — | FK → members.id (항상 더 작은 ID) |
| member_b_id | BIGINT | NO | — | FK → members.id (항상 더 큰 ID) |
| created_at | TIMESTAMP | NO | now() | 생성 시각 (불변) |

## 인덱스 / 제약

- `PRIMARY KEY (id)`
- `UNIQUE (member_a_id, member_b_id)`
- `CHECK (member_a_id < member_b_id)` — ID 순서 강제
- `INDEX (member_a_id)`, `INDEX (member_b_id)`

## 엔티티 메모

- 팩토리: `Friendship.create(a, b)` — 두 회원 id를 비교해 작은 쪽을 memberA로 자동 정렬
- 두 회원 모두 `@ManyToOne(LAZY)`

## 비즈니스 규칙 / 쿼리

- 양방향 조회: `WHERE member_a_id = :me OR member_b_id = :me`
- `existsBetween(aId, bId)` — 친구 여부 (양방향)
- `findAllByMemberId(id)` — 내 친구 관계 전체 (상대 회원 fetch join)
- `countFriendsExcluding(id, excludeId)` — `excludeId`(탐색해 온 노드) 제외 친구 수 → 지인 `hasAcquaintances` 계산용
- `Friend` 응답: `id`=friendship.id, `userId`=상대 member.id

## 관련 기능

- [features/friendship.md](../features/friendship.md) (친구 목록)
- [features/user.md](../features/user.md) (지인 탐색)
- [features/invitation.md](../features/invitation.md) (수락 시 생성)
