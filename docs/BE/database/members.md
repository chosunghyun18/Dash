# 테이블: `members`

**엔티티:** `com.dash.member.domain.Member` · **마이그레이션:** V1 (+ V2에서 nickname 변경)

회원 기본 정보. 인증은 **Kakao OAuth(`kakao_id`)** 모델.

## 컬럼

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|------|------|------|--------|------|
| id | BIGSERIAL | NO | auto | PK |
| kakao_id | VARCHAR(255) | NO | — | 카카오 OAuth ID (UNIQUE) |
| nickname | VARCHAR(12) | NO | — | 표시 이름 (UNIQUE) |
| gender | VARCHAR(10) | NO | — | `MALE` \| `FEMALE` |
| birth_year | INTEGER | YES | NULL | 출생 연도 |
| status | VARCHAR(20) | NO | `ACTIVE` | `ACTIVE` \| `SUSPENDED` \| `DELETED` |
| country | VARCHAR(10) | NO | `KR` | ISO 국가 코드 |
| created_at | TIMESTAMP | NO | now() | 생성 시각 (불변) |
| updated_at | TIMESTAMP | NO | now() | 수정 시각 (`@PreUpdate`) |

## 인덱스 / 제약

- `PRIMARY KEY (id)`
- `UNIQUE (kakao_id)`
- `UNIQUE (nickname)` — V2에서 추가 (닉네임 중복확인 API 지원)

## enum

- `Gender` = `MALE`, `FEMALE`
- `MemberStatus` = `ACTIVE`, `SUSPENDED`, `DELETED`

## 엔티티 메모

- 팩토리: `Member.create(kakaoId, nickname, gender, birthYear, country)` — status=ACTIVE 고정
- `changeNickname(nickname)` — 프로필 수정 시 닉네임 변경 (setter 미노출)
- V1에서 nickname은 VARCHAR(50)·UNIQUE 없음 → V2에서 VARCHAR(12)+UNIQUE

## 사용처

- 모든 도메인이 FK로 참조. 프로필 = [profiles.md](profiles.md)
- ⚠️ 회원가입(signup) 로직 미구현 → members row는 있으나 profiles row가 없을 수 있음 ([profiles.md](profiles.md) 참조)
