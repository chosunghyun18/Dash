# DB Schema — Dash Dating App

> **v2 — FE 코드 라이프사이클 검증 반영**  
> FE `types/index.ts`, `services/`, `hooks/` 전체 분석 후 Gap을 발견하여 수정

---

## ERD (Entity-Relationship Diagram)

```
┌─────────────────────────────────────────┐
│                 members                  │
├──────────────┬──────────────────────────┤
│ id           │ BIGSERIAL  PK            │
│ kakao_id     │ VARCHAR(255) NOT NULL UQ │
│ nickname     │ VARCHAR(12)  NOT NULL UQ │ ← FE max 12자, 중복확인 API 존재
│ gender       │ VARCHAR(10)  NOT NULL    │ ← MALE | FEMALE
│ birth_year   │ INTEGER      NULL        │
│ status       │ VARCHAR(20)  NOT NULL    │ ← ACTIVE | SUSPENDED | DELETED
│ country      │ VARCHAR(10)  NOT NULL    │ ← default 'KR'
│ created_at   │ TIMESTAMP    NOT NULL    │
│ updated_at   │ TIMESTAMP    NOT NULL    │
└──────┬───────┴──────────────────────────┘
       │ 1                              │ 1
       │                                │
       │ 1 (member_id)                  │ (inviter_id / invitee_id)
┌──────┴───────────────────────────┐    │ N
│              profiles             │  ┌─┴────────────────────────────────────────┐
├─────────────────┬─────────────── ┤  │               invitations                 │
│ member_id       │ BIGINT  PK FK  │  ├─────────────┬─────────────────────────────┤
│ intro_text      │ TEXT    NOT NULL│  │ id          │ BIGSERIAL PK               │
│ profile_image_url│VARCHAR(500) NULL│  │ inviter_id  │ BIGINT    NOT NULL FK      │
│ phone           │ VARCHAR(20) NULL│  │ token       │ VARCHAR(12) NOT NULL UQ    │
│ email           │ VARCHAR(255) NULL│  │ status      │ VARCHAR(20) NOT NULL       │
│ updated_at      │ TIMESTAMP NOT NULL│ │ expires_at  │ TIMESTAMP   NOT NULL       │
└─────────────────┴────────────────┘  │ invitee_id  │ BIGINT    NULL     FK      │
                                       │ accepted_at │ TIMESTAMP NULL             │
CHECK: phone IS NOT NULL               │ created_at  │ TIMESTAMP NOT NULL         │
       OR email IS NOT NULL            └──────┬──────┴────────────────────────────┘
                                              │ ACCEPTED → creates
                                              ↓
       ┌──────────────────────────────────────────────────┐
       │                  friendships                      │
       ├──────────────┬───────────────────────────────────┤
       │ id           │ BIGSERIAL  PK                      │
       │ member_a_id  │ BIGINT     NOT NULL  FK→members.id │ ← 항상 더 작은 ID
       │ member_b_id  │ BIGINT     NOT NULL  FK→members.id │ ← 항상 더 큰 ID
       │ created_at   │ TIMESTAMP  NOT NULL                │
       └──────────────┴───────────────────────────────────┘

UNIQUE(member_a_id, member_b_id)
CHECK(member_a_id < member_b_id)


       ┌──────────────────────────────────────────────────────────┐
       │                   contact_requests                        │
       ├──────────────────┬───────────────────────────────────────┤
       │ id               │ BIGSERIAL  PK                         │
       │ requester_id     │ BIGINT     NOT NULL  FK→members.id    │
       │ target_id        │ BIGINT     NOT NULL  FK→members.id    │
       │ status           │ VARCHAR(20) NOT NULL                   │ ← PENDING|ACCEPTED|REJECTED
       │ created_at       │ TIMESTAMP  NOT NULL                    │
       │ updated_at       │ TIMESTAMP  NOT NULL                    │
       └──────────────────┴───────────────────────────────────────┘

UNIQUE(requester_id, target_id)
CHECK(requester_id <> target_id)
※ 연락처 정보는 profiles 테이블에서 JOIN, contact_requests에 중복 저장 안 함
```

---

## 테이블 상세 정의

### members

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| kakao_id | VARCHAR(255) | NO | — | 카카오 OAuth ID (UQ) |
| nickname | VARCHAR(12) | NO | — | 표시 이름 (UQ) |
| gender | VARCHAR(10) | NO | — | `MALE` \| `FEMALE` |
| birth_year | INTEGER | YES | NULL | 출생 연도 |
| status | VARCHAR(20) | NO | `ACTIVE` | `ACTIVE` \| `SUSPENDED` \| `DELETED` |
| country | VARCHAR(10) | NO | `KR` | ISO 국가 코드 |
| created_at | TIMESTAMP | NO | now() | 생성 시각 (불변) |
| updated_at | TIMESTAMP | NO | now() | 수정 시각 |

**인덱스**
- `PRIMARY KEY (id)`
- `UNIQUE (kakao_id)`
- `UNIQUE (nickname)` ← **v1 누락, FE `/nickname-check` API로 중복확인 하므로 필수**

> **v1→v2 변경:** `VARCHAR(50)` → `VARCHAR(12)` (FE max 12자 강제), UNIQUE 추가

---

### profiles

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| member_id | BIGINT | NO | — | PK, FK → members.id |
| intro_text | TEXT | NO | — | 자기소개 (FE 필수 입력, max 500자) |
| profile_image_url | VARCHAR(500) | YES | NULL | 프로필 이미지 URL |
| phone | VARCHAR(20) | YES | NULL | 연락처 전화번호 |
| email | VARCHAR(255) | YES | NULL | 연락처 이메일 |
| updated_at | TIMESTAMP | NO | now() | 수정 시각 |

**인덱스**
- `PRIMARY KEY (member_id)`

**제약 조건**
- `CHECK (phone IS NOT NULL OR email IS NOT NULL)` — phone/email 중 하나 이상 필수 (FE 강제)

**FK**
- `member_id` → `members(id)`

**비즈니스 규칙**
- `members` 생성 시 동일 트랜잭션에서 같이 생성 (1:1 관계)
- `updateMyProfile` API는 `members.nickname` + `profiles.*` 를 한 트랜잭션에서 업데이트
- FE `MyProfile` 응답 = `members.nickname` + `profiles` JOIN

> **v1 → v2:** "구현 예정"에서 정식 테이블로 격상. `intro_text` NOT NULL로 변경 (FE 필수 필드). `contact_phone`/`contact_email`은 `contact_requests`에 중복 저장하지 않음 — 수락 시 이 테이블에서 JOIN

---

### invitations

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| inviter_id | BIGINT | NO | — | FK → members.id |
| token | VARCHAR(12) | NO | — | URL-safe 공유 토큰 (UQ) |
| status | VARCHAR(20) | NO | `PENDING` | `PENDING` \| `ACCEPTED` \| `EXPIRED` \| `CANCELED` |
| expires_at | TIMESTAMP | NO | — | 만료 시각 (생성+7일) |
| invitee_id | BIGINT | YES | NULL | FK → members.id (수락 시 세팅) |
| accepted_at | TIMESTAMP | YES | NULL | 수락 시각 |
| created_at | TIMESTAMP | NO | now() | 생성 시각 (불변) |

**인덱스**
- `PRIMARY KEY (id)`
- `UNIQUE (token)` → `idx_invitations_token`
- `INDEX (inviter_id)` → `idx_invitations_inviter`

**FK**
- `inviter_id` → `members(id)`
- `invitee_id` → `members(id)`

**비즈니스 규칙**
- `PENDING` 상태만 수락 가능
- 자기 자신 초대 불가 (`inviter_id ≠ invitee_id`)
- 이미 친구인 경우 수락 불가
- 수락 완료 시 `friendships` 레코드 자동 생성

---

### friendships

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| member_a_id | BIGINT | NO | — | FK → members.id (항상 더 작은 ID) |
| member_b_id | BIGINT | NO | — | FK → members.id (항상 더 큰 ID) |
| created_at | TIMESTAMP | NO | now() | 친구 생성 시각 (불변) |

**인덱스**
- `PRIMARY KEY (id)`
- `UNIQUE (member_a_id, member_b_id)`
- `INDEX (member_a_id)` → `idx_friendships_member_a`
- `INDEX (member_b_id)` → `idx_friendships_member_b`

**제약 조건**
- `CHECK (member_a_id < member_b_id)` — ID 순서 강제로 양방향 중복 방지

**FK**
- `member_a_id` → `members(id)`
- `member_b_id` → `members(id)`

**비즈니스 규칙**
- A↔B 관계를 단일 레코드로 표현 (중복 저장 없음)
- 양방향 조회 시 `OR` 조건: `(member_a_id = :me OR member_b_id = :me)`
- `GET /api/v1/friends` 응답에는 friendship.id + 상대방 member.id 둘 다 필요 (FE `Friend` 타입: `id` = friendship ID, `userId` = member ID)

---

### contact_requests

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| requester_id | BIGINT | NO | — | FK → members.id |
| target_id | BIGINT | NO | — | FK → members.id |
| status | VARCHAR(20) | NO | `PENDING` | `PENDING` \| `ACCEPTED` \| `REJECTED` |
| created_at | TIMESTAMP | NO | now() | 요청 시각 |
| updated_at | TIMESTAMP | NO | now() | 상태 변경 시각 |

**인덱스**
- `PRIMARY KEY (id)`
- `UNIQUE (requester_id, target_id)` — 동일 대상에 중복 요청 방지
- `INDEX (requester_id)` → `idx_contact_requests_requester`
- `INDEX (target_id)` → `idx_contact_requests_target`

**제약 조건**
- `CHECK (requester_id <> target_id)` — 자기 자신에게 요청 불가

**FK**
- `requester_id` → `members(id)`
- `target_id` → `members(id)`

**비즈니스 규칙**
- 연락처 정보(`phone`/`email`)는 이 테이블에 저장하지 않음
- `ACCEPTED` 상태 조회 시 `profiles.phone`/`profiles.email` JOIN하여 requester 연락처 반환
- FE `AcceptContactResponse.contactPhone/contactEmail` = `profiles`에서 JOIN

> **v1 → v2:** "구현 예정"에서 정식 테이블로 격상. `contact_phone`/`contact_email` 컬럼 **제거** — profiles 테이블에서 JOIN으로 해결 (중복 저장 불필요)

---

## 연관 관계 요약

```
members ──── profiles           : 1:1 (member 생성 시 동시 생성)
members ──< invitations         : 1:N (inviter_id — 보낸 초대)
members ──< invitations         : 1:N (invitee_id — 받은 초대, nullable)
members ──< friendships         : 1:N (member_a_id)
members ──< friendships         : 1:N (member_b_id)
members ──< contact_requests    : 1:N (requester_id — 보낸 연락 요청)
members ──< contact_requests    : 1:N (target_id — 받은 연락 요청)
invitations ──> friendships     : ACCEPTED 전환 시 1:1 생성 (논리 관계)
contact_requests →JOIN profiles : ACCEPTED 상태에서 requester 연락처 노출
```

---

## Computed Fields (DB 미저장)

API 응답에 포함되지만 DB 컬럼이 아닌 필드들:

| 필드 | 포함 응답 | 계산 방법 |
|------|-----------|-----------|
| `shareUrl` | `InvitationCreateResponse`, `InvitationSummary` | `baseUrl + "/invite/" + token` |
| `hasAcquaintances` | `UserProfile`, `Acquaintance` | 해당 member의 friends가 존재하는지 여부 |
| `bio` | `Friend` | `profiles.intro_text` alias |

---

## FE 응답 타입 → DB 컬럼 매핑

### Friend (GET /api/v1/friends)
| FE 필드 | DB 출처 |
|---------|---------|
| `id` | `friendships.id` |
| `userId` | `members.id` (상대방) |
| `nickname` | `members.nickname` |
| `profileImageUrl` | `profiles.profile_image_url` |
| `bio` | `profiles.intro_text` |

### UserProfile (GET /api/v1/users/{userId}/profile)
| FE 필드 | DB 출처 |
|---------|---------|
| `userId` | `members.id` |
| `nickname` | `members.nickname` |
| `profileImageUrl` | `profiles.profile_image_url` |
| `introText` | `profiles.intro_text` |
| `hasAcquaintances` | computed |

### MyProfile (GET /api/v1/users/me/profile)
| FE 필드 | DB 출처 |
|---------|---------|
| `nickname` | `members.nickname` |
| `phone` | `profiles.phone` |
| `email` | `profiles.email` |
| `introText` | `profiles.intro_text` |

### ContactRequest (sent, GET /api/v1/contact-requests/sent)
| FE 필드 | DB 출처 |
|---------|---------|
| `id` | `contact_requests.id` |
| `targetUserId` | `contact_requests.target_id` |
| `targetNickname` | `members.nickname` (target JOIN) |
| `status` | `contact_requests.status` |
| `createdAt` | `contact_requests.created_at` |
| `contactPhone` | `profiles.phone` (requester, ACCEPTED 시만) |
| `contactEmail` | `profiles.email` (requester, ACCEPTED 시만) |

### ReceivedContactRequest (GET /api/v1/contact-requests/received)
| FE 필드 | DB 출처 |
|---------|---------|
| `id` | `contact_requests.id` |
| `requesterUserId` | `contact_requests.requester_id` |
| `requesterNickname` | `members.nickname` (requester JOIN) |
| `status` | `contact_requests.status` |
| `createdAt` | `contact_requests.created_at` |
| `contactPhone` | `profiles.phone` (requester, ACCEPTED 시만) |
| `contactEmail` | `profiles.email` (requester, ACCEPTED 시만) |

---

## Flyway 마이그레이션 파일

| 파일 | 상태 | 내용 |
|------|------|------|
| `V1__init_schema.sql` | 완료 | members, invitations, friendships |
| `V2__add_profiles.sql` | **구현 필요** | profiles 테이블, members.nickname UNIQUE + VARCHAR(12) |
| `V3__add_contact_requests.sql` | **구현 필요** | contact_requests 테이블 |
