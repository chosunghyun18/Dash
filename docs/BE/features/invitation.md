# 기능: 초대 (Invitation)

**패키지:** `com.dash.invitation` · **테이블:** [invitations](../database/invitations.md), [friendships](../database/friendships.md)

초대 링크(토큰) 생성·검증·수락. 수락 시 친구 관계 자동 생성. (기존 구현)

## 엔드포인트

| 메서드 | 경로 | 인증 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/v1/invitations` | ✅ | — | `InvitationCreateResponse` |
| GET | `/api/v1/invitations/validate/{token}` | ❌ public | path | `InvitationValidateResponse` |
| POST | `/api/v1/invitations/{token}/accept` | ✅ | path | `InvitationAcceptResponse` |
| GET | `/api/v1/invitations/mine` | ✅ | — | `InvitationSummary[]` |

### DTO

```
InvitationCreateResponse   { token, shareUrl, expiresAt }
InvitationValidateResponse { token, inviterNickname, expiresAt }
InvitationAcceptResponse   { token, friendshipId, inviterNickname }
InvitationSummary          { id, token, shareUrl, status, inviteeNickname, expiresAt, createdAt }
```
- `shareUrl` = `app.base-url` + `/invite/` + token (computed)

## 구성 파일

- `controller/InvitationController` · `service/InvitationService`
- `dto/` 4종 · `domain/Invitation`, `InvitationStatus` · `repository/InvitationRepository`

## 핵심 로직 (`InvitationService`)

- **create** — 고유 토큰 생성(UUID 12자, 충돌 회피) → PENDING, 만료 now+7일
- **validate** — `findByTokenWithInviter`(없으면 404) → PENDING 아니거나 만료면 `INVITATION_NOT_AVAILABLE`
- **accept** — 토큰 조회 → 자기초대 차단(`CANNOT_INVITE_SELF`) → 이미 친구면 `ALREADY_FRIENDS` → 도메인 `accept()`(상태/만료 검증) → `Friendship` 생성
- **getMyInvitations** — inviter 기준 최신순

## 에러

| 코드 | HTTP | 상황 |
|------|------|------|
| `INVITATION_NOT_FOUND` | 404 | 토큰 없음 |
| `INVITATION_EXPIRED` | 410 | 만료 |
| `INVITATION_NOT_AVAILABLE` | 409 | PENDING 아님 |
| `CANNOT_INVITE_SELF` | 400 | 자기 자신 초대 |
| `ALREADY_FRIENDS` | 409 | 이미 친구 |

## 메모

- `validate`만 public (`SecurityConfig` permitAll) — 딥링크 진입 시 비로그인 검증
- 상태 전환 검증은 도메인(`Invitation.accept`)에 위치
