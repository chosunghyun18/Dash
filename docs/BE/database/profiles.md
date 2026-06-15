# 테이블: `profiles`

**엔티티:** `com.dash.profile.domain.Profile` · **마이그레이션:** V2

`members`와 1:1. `member_id`를 PK이자 FK로 공유(shared PK).

## 컬럼

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| member_id | BIGINT | NO | — | PK, FK → members.id |
| intro_text | TEXT | NO | `''` | 자기소개 ("나를 소개합니다") |
| profile_image_url | VARCHAR(500) | YES | NULL | 프로필 이미지 URL |
| phone | VARCHAR(20) | YES | NULL | 연락처 전화번호 |
| email | VARCHAR(255) | YES | NULL | 연락처 이메일 |
| updated_at | TIMESTAMP | NO | now() | 수정 시각 (`@PrePersist`/`@PreUpdate`) |

## 인덱스 / 제약

- `PRIMARY KEY (member_id)` · `FK member_id → members(id)`
- ⚠️ **DB CHECK 제약 없음.** phone/email "정확히 하나" 규칙은 앱 레이어(`ProfileService`)에서 검증 (`INVALID_CONTACT` 400).

## 엔티티 메모

- 팩토리: `Profile.empty(memberId)` — intro_text="" 인 빈 프로필
- `update(introText, phone, email)` — 수정
- 공유 PK라 `@GeneratedValue` 없음 (`@Id @Column(name="member_id") Long memberId`)

## 비즈니스 규칙

- 원래 members 생성 시 동시 INSERT 의도였으나 signup 미구현 → **프로필 row 부재 가능**
- 조회/수정 시 row 없으면 `getOrCreate`로 빈 프로필 자동 생성 (404 아님)
- `MyProfile` 응답 = `members.nickname` + `profiles.*` 조합
- 연락처(phone/email)는 [contact_requests.md](contact_requests.md) ACCEPTED 시 JOIN으로 노출 (contact_requests에 중복 저장 안 함)

## 관련 기능

- [features/profile.md](../features/profile.md)
