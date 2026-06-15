# Dash BE 문서 허브 (Backend Documentation Hub)

**Last Updated:** 2026-06-15
**스택:** Spring Boot 3.3 · Java 21 · Lombok · PostgreSQL · Flyway · JWT

> 백엔드 빠른 참조용 인덱스. 전체를 읽지 말고 아래 표에서 필요한 항목만 여세요.
> 코드에서 생성, 수작업 날조 금지. 변경 시 해당 문서 상단 `Last Updated` 갱신.

---

## 📁 디비 정보 (`database/`)

| 문서 | 내용 |
|------|------|
| [database/README.md](database/README.md) | ERD · 연관관계 · 마이그레이션 · DB 설정 개요 |
| [database/members.md](database/members.md) | `members` — 회원 (kakaoId 기반) |
| [database/profiles.md](database/profiles.md) | `profiles` — 프로필 (1:1, 공유 PK) |
| [database/friendships.md](database/friendships.md) | `friendships` — 친구 관계 (정규화 순서) |
| [database/invitations.md](database/invitations.md) | `invitations` — 초대 토큰 |
| [database/contact_requests.md](database/contact_requests.md) | `contact_requests` — 연락 요청 |

## 📁 기능 (`features/`)

| 문서 | 도메인 패키지 | 상태 |
|------|---------------|------|
| [features/README.md](features/README.md) | 기능 인덱스 · 엔드포인트 전체 맵 | — |
| [features/profile.md](features/profile.md) | `com.dash.profile` — 내 프로필 | ✅ |
| [features/friendship.md](features/friendship.md) | `com.dash.friendship` — 친구 | ✅ |
| [features/user.md](features/user.md) | `com.dash.user` — 유저 프로필·지인 | ✅ |
| [features/contact-request.md](features/contact-request.md) | `com.dash.contactrequest` — 연락 요청 | ✅ |
| [features/invitation.md](features/invitation.md) | `com.dash.invitation` — 초대 | ✅ |
| [features/auth-and-membership.md](features/auth-and-membership.md) | 인증 · Dash+ | ❌ 보류 |

---

## 공통 규약 (모든 기능 공통)

- **레이어:** Controller → Service → Repository → Domain
- **인증:** `@PreAuthorize("isAuthenticated()")` + `@AuthenticationPrincipal UserDetails user` → `Long.parseLong(user.getUsername())` = memberId
- **DTO:** Java `record` + static `of(...)` 팩토리. 요청 DTO는 Bean Validation 어노테이션.
- **예외:** `throw new BusinessException(ErrorCode.XXX)` → `GlobalExceptionHandler` 가 status + `{code, message}` 변환
- **트랜잭션:** 서비스 클래스 `@Transactional(readOnly=true)` 기본, 쓰기 메서드만 `@Transactional`
- **엔티티:** `@Entity` + Lombok `@Getter` + `@NoArgsConstructor(PROTECTED)` + static 팩토리, setter 금지

## 관련 명세 문서 (docs/)

| 문서 | 용도 |
|------|------|
| [../API.md](../API.md) | REST 엔드포인트·요청/응답 스키마 (FE/BE 계약) |
| [../DB_SCHEMA.md](../DB_SCHEMA.md) | 기존 DB 명세 (⚠️ 일부 항목 본 문서와 차이 — README 참조) |
| [../CODEMAPS/backend.md](../CODEMAPS/backend.md) | 컨트롤러·서비스 코드맵 (요약본) |
