# 디비 정보 — 개요 (Database Overview)

**Last Updated:** 2026-06-15
**DBMS:** PostgreSQL · **스키마 관리:** Flyway (`ddl-auto: validate`)

> 테이블별 상세는 각 문서 참조. 본 문서는 ERD·연관관계·마이그레이션·설정만 다룬다.

---

## 테이블 목록

| 테이블 | 문서 | 도입 마이그레이션 |
|--------|------|-------------------|
| `members` | [members.md](members.md) | V1 |
| `profiles` | [profiles.md](profiles.md) | V2 |
| `friendships` | [friendships.md](friendships.md) | V1 |
| `invitations` | [invitations.md](invitations.md) | V1 |
| `contact_requests` | [contact_requests.md](contact_requests.md) | V3 |

## ERD (관계 요약)

```
                 ┌──────────┐
                 │ members  │ (회원 — kakaoId)
                 └────┬─────┘
        1:1 ┌─────────┼───────────┬──────────────┬─────────────┐
            │         │           │              │             │
       ┌────┴───┐  ┌──┴────────┐ ┌┴───────────┐ ┌┴────────────────┐
       │profiles│  │friendships│ │invitations │ │ contact_requests │
       └────────┘  └───────────┘ └────────────┘ └──────────────────┘
       member_id   member_a_id   inviter_id      requester_id
       (공유 PK)    member_b_id   invitee_id      target_id
```

## 연관 관계

| 관계 | 카디널리티 | 키 |
|------|-----------|-----|
| members → profiles | 1:1 | profiles.member_id (= members.id, 공유 PK) |
| members → friendships | 1:N (양방향) | member_a_id, member_b_id (항상 a < b) |
| members → invitations | 1:N | inviter_id (보낸), invitee_id (받은, nullable) |
| members → contact_requests | 1:N | requester_id (보낸), target_id (받은) |
| invitations → friendships | 논리적 1:1 | ACCEPTED 전환 시 Friendship 생성 |
| contact_requests ⇢ profiles | JOIN | ACCEPTED 시 연락처 노출 (중복 저장 안 함) |

## Flyway 마이그레이션

| 파일 | 내용 |
|------|------|
| `V1__init_schema.sql` | members, invitations, friendships + 인덱스 |
| `V2__add_profiles.sql` | profiles 테이블, members.nickname → VARCHAR(12) + UNIQUE |
| `V3__add_contact_requests.sql` | contact_requests 테이블 + 인덱스 |

> 위치: `BE/src/main/resources/db/migration/`. 운영/로컬 모두 `ddl-auto: validate` 라 스키마 변경은 **반드시 새 마이그레이션 파일**로.

## DB 설정 (프로파일별)

| 프로파일 | datasource | 비고 |
|----------|-----------|------|
| `local` | `localhost:5432/dash_db` | show-sql=true, 디버그 로그 |
| `docker` | `db:5432/dash_db` | docker-compose |
| `dev` / `prod` | `${DB_HOST}` 환경변수 | prod는 Hikari 풀 20 |

- 공통: `ddl-auto: validate`, Flyway enabled, JWT `expiration=24h` / `refresh=7d`
- `app.base-url` — 초대 공유 URL 생성용

---

## ⚠️ 기존 DB_SCHEMA.md와의 차이 (정확성 메모)

본 문서는 **실제 마이그레이션 + 엔티티 코드 + FE mock** 기준이다. 기존 [../../DB_SCHEMA.md](../../DB_SCHEMA.md)와 다음이 다르니 참고:

1. **profiles의 `CHECK (phone OR email)` 제약** — DB_SCHEMA.md는 DB CHECK가 있다고 적었으나, 실제 V2 마이그레이션엔 **없다**. phone XOR email 검증은 **애플리케이션 레이어**(`ProfileService.validateContact`)에서 수행.
2. **보낸 연락요청(sent)의 연락처 출처** — DB_SCHEMA.md 매핑 표는 "requester 연락처"라고 적었으나, 실제 구현·FE mock은 **target(상대) 연락처**다. (받은 요청은 requester 연락처가 맞음.) 상세는 [contact_requests.md](contact_requests.md) 참조.
