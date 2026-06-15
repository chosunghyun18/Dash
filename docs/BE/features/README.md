# 기능 — 인덱스 (Features Index)

**Last Updated:** 2026-06-15

> 도메인 기능별 상세 문서. 각 문서는 엔드포인트·서비스 로직·검증·에러·관련 테이블을 다룬다.

## 기능 목록

| 기능 | 패키지 | base path | 상태 |
|------|--------|-----------|------|
| [내 프로필](profile.md) | `com.dash.profile` | `/api/v1/users` | ✅ |
| [친구](friendship.md) | `com.dash.friendship` | `/api/v1/friends` | ✅ |
| [유저 프로필·지인](user.md) | `com.dash.user` | `/api/v1/users` | ✅ |
| [연락 요청](contact-request.md) | `com.dash.contactrequest` | `/api/v1/contact-requests` | ✅ |
| [초대](invitation.md) | `com.dash.invitation` | `/api/v1/invitations` | ✅ |
| [인증·Dash+](auth-and-membership.md) | — | `/api/v1/auth`, `/billing` | ❌ 보류 |

## 전체 엔드포인트 맵

| 메서드 | 경로 | 인증 | 기능 |
|--------|------|------|------|
| GET | `/api/v1/users/me/profile` | ✅ | 내 프로필 조회 |
| PUT | `/api/v1/users/me/profile` | ✅ | 내 프로필 수정 |
| GET | `/api/v1/users/nickname-check` | ✅ | 닉네임 중복 확인 |
| GET | `/api/v1/users/{userId}/profile` | ✅ | 유저 프로필 조회 |
| GET | `/api/v1/users/{userId}/acquaintances` | ✅ | 지인 목록 |
| GET | `/api/v1/friends` | ✅ | 내 친구 목록 |
| POST | `/api/v1/contact-requests` | ✅ | 연락 요청 보내기 |
| GET | `/api/v1/contact-requests/sent` | ✅ | 보낸 요청 |
| GET | `/api/v1/contact-requests/received` | ✅ | 받은 요청 |
| POST | `/api/v1/contact-requests/{id}/accept` | ✅ | 요청 수락 |
| POST | `/api/v1/contact-requests/{id}/reject` | ✅ | 요청 거절 |
| POST | `/api/v1/invitations` | ✅ | 초대 생성 |
| GET | `/api/v1/invitations/validate/{token}` | ❌ (public) | 토큰 검증 |
| POST | `/api/v1/invitations/{token}/accept` | ✅ | 초대 수락 |
| GET | `/api/v1/invitations/mine` | ✅ | 내 초대 목록 |

> `/api/v1/users` 경로는 `ProfileController`(/me/profile, /nickname-check)와 `UserController`(/{userId}/*)가 공유. `me`(리터럴)가 `{userId}`(패턴)보다 우선 매칭되어 충돌 없음.
