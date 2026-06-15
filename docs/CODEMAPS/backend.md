# Backend 코드맵 — Spring Boot

**Last Updated:** 2026-06-15

> Spring 컨트롤러·서비스·엔드포인트 라우팅 맵. 코드에서 생성, 수작업 날조 금지.
> 스택: Spring Boot 3.3 + Java 21 + Lombok + PostgreSQL + JWT + Flyway.
> **헥사고날(Ports & Adapters) + DDD** — ADR-BE-002. 컨텍스트별 `{domain, application, infrastructure, presentation}`.

## 패키지 구조 (`com.dash.<context>/{domain, application, infrastructure/persistence, presentation}`)

| 컨텍스트 | 역할 | 레이어 | 상태 |
|----------|------|--------|------|
| `member` | 회원 (kakaoId) — MemberId/Nickname VO | domain+infra (서비스/컨트롤러 없음) | 엔티티/포트 |
| `profile` | 내 프로필 — Contact VO | 4계층 | ✅ |
| `friendship` | 친구 관계·친구 목록 | 4계층 | ✅ |
| `user` | 타 유저 프로필·지인 탐색 (CQRS read) | application+presentation (domain 없음) | ✅ |
| `contactrequest` | 연락 요청 | 4계층 | ✅ |
| `invitation` | 친구 초대 — InvitationToken VO | 4계층 | ✅ |
| `global` | 보안(JWT)·예외(공유 커널)·Swagger | — | — |

> 각 컨텍스트: `domain/`(애그리거트·VO·Repository 포트, 순수 Java) · `application/`(서비스, @Transactional) · `infrastructure/persistence/`(JpaEntity·Spring Data·Mapper·Adapter) · `presentation/`(Controller·DTO).
> 엔드포인트 맵의 "서비스"는 `<context>.application.*Service`, 컨트롤러는 `<context>.presentation.*Controller`.

## 엔드포인트 맵

### Profile — `ProfileController` (`/api/v1/users`)
| 메서드 | 경로 | 서비스 | 비고 |
|--------|------|--------|------|
| GET | `/me/profile` | `ProfileService.getMyProfile` | 프로필 없으면 빈 프로필 생성 |
| PUT | `/me/profile` | `ProfileService.updateMyProfile` | phone XOR email, 닉네임 중복검사 |
| GET | `/nickname-check?nickname=` | `ProfileService.checkNickname` | 본인 닉네임은 available=true |

### Friend — `FriendshipController` (`/api/v1/friends`)
| 메서드 | 경로 | 서비스 | 비고 |
|--------|------|--------|------|
| GET | `` | `FriendshipService.getMyFriends` | bio=상대 introText |

### User — `UserController` (`/api/v1/users`)
| 메서드 | 경로 | 서비스 | 비고 |
|--------|------|--------|------|
| GET | `/{userId}/profile` | `UserQueryService.getUserProfile` | hasAcquaintances=조회자 제외 친구 보유 |
| GET | `/{userId}/acquaintances` | `UserQueryService.getAcquaintances` | 조회자 제외, 1단계 탐색 |

### ContactRequest — `ContactRequestController` (`/api/v1/contact-requests`)
| 메서드 | 경로 | 서비스 | 비고 |
|--------|------|--------|------|
| POST | `` | `ContactRequestService.create` | 자기요청·중복 차단 |
| GET | `/sent` | `ContactRequestService.getSent` | ACCEPTED 시 상대 연락처 |
| GET | `/received` | `ContactRequestService.getReceived` | ACCEPTED 시 요청자 연락처 |
| POST | `/{requestId}/accept` | `ContactRequestService.accept` | 수신자만, 연락처 반환 |
| POST | `/{requestId}/reject` | `ContactRequestService.reject` | 수신자만 |

### Invitation — `InvitationController` (`/api/v1/invitations`)
| 메서드 | 경로 | 서비스 | 비고 |
|--------|------|--------|------|
| POST | `` | `InvitationService.create` | 초대 토큰 생성 |
| GET | `/validate/{token}` | `InvitationService.validate` | 인증 불필요 (permitAll) |
| POST | `/{token}/accept` | `InvitationService.accept` | Friendship 생성 |
| GET | `/mine` | `InvitationService.getMyInvitations` | 내 초대 목록 |

## 인증 / 보안 (`global.security`)

- `JwtAuthFilter` → `Authorization: Bearer <token>` 검증, principal username = memberId 문자열.
- 컨트롤러 공통 패턴: `@PreAuthorize("isAuthenticated()")` + `@AuthenticationPrincipal UserDetails user` → `Long.parseLong(user.getUsername())`.
- `permitAll`: `/api/v1/auth/**`, `/api/v1/invitations/validate/**`, `/actuator/health`, swagger.

## 예외 처리 (`global.exception`)

- `BusinessException(ErrorCode)` → `GlobalExceptionHandler` 가 `ErrorCode.status` + `ErrorResponse(code, message)` 로 변환.
- Bean Validation: `MethodArgumentNotValidException`(@RequestBody), `ConstraintViolationException`(@RequestParam) → 400 `VALIDATION_ERROR`.
- 주요 ErrorCode: `MEMBER_NOT_FOUND`, `NICKNAME_DUPLICATED`(409), `INVALID_CONTACT`(400), `CONTACT_REQUEST_*`(404/409/403/400), `INVITATION_*`, `ALREADY_FRIENDS`.

## 영속성 / DB (헥사고날)

- **포트**: `<context>.domain.XxxRepository` (도메인 객체/VO 시그니처). **어댑터**: `infrastructure.persistence.XxxRepositoryAdapter`(@Repository)가 `XxxJpaRepository`(Spring Data) + `XxxMapper`로 구현.
- **JpaEntity**(`infrastructure.persistence.XxxJpaEntity`)가 `@Entity`로 기존 테이블 매핑. 도메인 모델과 분리. **애그리거트 간 참조는 FK Long 컬럼**(`member_a_id` 등) — `@ManyToOne` 미사용, JOIN FETCH 없음.
- 매핑: `Mapper.toDomain`(reconstitute)/`toEntity`. 변경 후 application 서비스가 명시적 `save()`.
- 마이그레이션: Flyway `src/main/resources/db/migration/` (V1 init, V2 profiles, V3 contact_requests). **스키마 무변경** — ddl-auto=validate가 JpaEntity↔테이블 일치 검증.
- 도메인 애그리거트: `Member`(members), `Profile`(profiles, 공유 PK), `Friendship`(friendships, memberA<memberB), `ContactRequest`(contact_requests), `Invitation`(invitations).

## 미구현 / 보류

- **인증(auth)**: Member가 kakaoId 모델 ↔ API.md email/password ↔ FE Apple/Google 3자 충돌로 보류.
- **Dash+ 멤버십/결제**: members에 plan/plusUntil 컬럼 없음, 결제 연동 TBD.
