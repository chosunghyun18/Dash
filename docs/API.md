# Dash — 필요 API 목록

> **구현 현황** (2026-06-15 기준)
> - ✅ **BE 구현 완료**: 내 프로필, 친구, 지인, 유저 프로필, 연락 요청, 초대
> - ❌ **BE 미구현**: 인증(모델 충돌로 보류), Dash+ 멤버십/결제(결제 연동 TBD)

## 인증 (❌ BE 미구현 — 모델 충돌)

> `Member` 엔티티는 `kakaoId` 기반 소셜 로그인 모델이라 아래 email/password 스펙과 충돌하며,
> FE는 Apple/Google 로그인을 가정한다(3자 불일치). 인증 방식 확정 후 별도 구현 예정.

| 메서드 | 엔드포인트 | 설명 | 요청 바디 | 응답 |
|--------|-----------|------|-----------|------|
| POST | `/api/v1/auth/signup` | 회원가입 | `{ email, password, nickname }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/login` | 로그인 | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 | `{ refreshToken }` | `{ accessToken }` |
| POST | `/api/v1/auth/logout` | 로그아웃 | — | 204 |

---

## 내 프로필 (✅ BE 구현 완료)

> 구현: `com.dash.profile` — 프로필 row 부재 시 빈 프로필 자동 생성. nickname-check는 본인 현재 닉네임을 `available=true`로 처리. phone/email은 정확히 하나만(XOR) 허용.

| 메서드 | 엔드포인트 | 설명 | 요청 바디 | 응답 |
|--------|-----------|------|-----------|------|
| GET | `/api/v1/users/me/profile` | 내 프로필 조회 | — | `MyProfile` |
| PUT | `/api/v1/users/me/profile` | 내 프로필 수정 | `{ nickname, phone?, email?, introText }` | `MyProfile` |
| GET | `/api/v1/users/nickname-check?nickname=xxx` | 닉네임 중복 확인 | — | `{ available: boolean }` |

```typescript
// MyProfile
{
  nickname: string
  phone?: string      // phone OR email 중 하나만
  email?: string
  introText: string
}
```

---

## 친구 (✅ BE 구현 완료)

> 구현: `com.dash.friendship`. `bio`는 상대 프로필의 `introText`, `profileImageUrl`은 프로필 이미지. `id`는 friendship id.

| 메서드 | 엔드포인트 | 설명 | 응답 |
|--------|-----------|------|------|
| GET | `/api/v1/friends` | 내 친구 목록 조회 | `Friend[]` |

```typescript
// Friend
{
  id: number
  userId: number
  nickname: string
  profileImageUrl: string | null
  bio: string | null
}
```

---

## 지인 (탐색 깊이) (✅ BE 구현 완료)

> 구현: `com.dash.user.UserQueryService`. 조회자(viewer)는 결과에서 제외하며, 각 지인의 `hasAcquaintances`는 "해당 유저(드릴다운 기준 노드)를 제외한 추가 친구 보유 여부"로 계산. `bio` 포함. `acquaintanceCount`/`hop`/`via`는 미제공(추후).

| 메서드 | 엔드포인트 | 설명 | 응답 |
|--------|-----------|------|------|
| GET | `/api/v1/users/{userId}/acquaintances` | 특정 유저의 지인 목록 | `Acquaintance[]` |

```typescript
// Acquaintance
{
  id: number
  userId: number
  nickname: string
  profileImageUrl: string | null
  hasAcquaintances: boolean   // 유료: 한 단계 더 탐색 가능 여부
}
```

> **탐색 깊이 정책**
> - 무료(프로토타입): 친구 → 친구의 지인 (2단계)
> - 유료: 친구 → 친구의 지인 → 지인의 지인 (3단계, `hasAcquaintances=true`인 경우 소개 보기 버튼 노출)

---

## 유저 프로필 조회 (✅ BE 구현 완료)

> 구현: `com.dash.user.UserQueryService`. `hasAcquaintances`는 조회자를 제외한 친구 보유 여부.

| 메서드 | 엔드포인트 | 설명 | 응답 |
|--------|-----------|------|------|
| GET | `/api/v1/users/{userId}/profile` | 특정 유저의 나를 소개합니다 조회 | `UserProfile` |

```typescript
// UserProfile
{
  userId: number
  nickname: string
  profileImageUrl: string | null
  introText: string
  hasAcquaintances: boolean
}
```

---

## 연락 요청 (✅ BE 구현 완료)

> 구현: `com.dash.contactrequest`. 연락처는 ACCEPTED 상태에서만 노출되며 양방향 교환(보낸 요청→상대 연락처, 받은 요청→요청자 연락처). 수락/거절은 수신자(target)만 가능. `via`는 미제공(추후). 거절은 200 반환.

| 메서드 | 엔드포인트 | 설명 | 요청 바디 | 응답 |
|--------|-----------|------|-----------|------|
| POST | `/api/v1/contact-requests` | 연락 요청 보내기 | `{ targetUserId }` | `ContactRequest` |
| GET | `/api/v1/contact-requests/sent` | 보낸 연락 요청 목록 | — | `ContactRequest[]` |
| GET | `/api/v1/contact-requests/received` | 받은 연락 요청 목록 | — | `ReceivedContactRequest[]` |
| POST | `/api/v1/contact-requests/{requestId}/accept` | 요청 수락 → 연락처 반환 | — | `AcceptContactResponse` |
| POST | `/api/v1/contact-requests/{requestId}/reject` | 요청 거절 | — | 200 |

```typescript
// ContactRequest (보낸 요청)
{
  id: number
  targetUserId: number
  targetNickname: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string           // ISO 8601
  contactPhone?: string       // ACCEPTED 상태일 때만 포함
  contactEmail?: string       // ACCEPTED 상태일 때만 포함
}

// ReceivedContactRequest (받은 요청)
{
  id: number
  requesterUserId: number
  requesterNickname: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  contactPhone?: string       // ACCEPTED 상태일 때만 포함
  contactEmail?: string       // ACCEPTED 상태일 때만 포함
}

// AcceptContactResponse
{
  requestId: number
  contactPhone?: string       // 상대방이 등록한 연락처 (phone or email 중 하나)
  contactEmail?: string
}
```

---

## 초대 (기존 구현 완료)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/v1/invitations` | 초대 링크 생성 |
| GET | `/api/v1/invitations/validate/{token}` | 초대 토큰 유효성 확인 |
| POST | `/api/v1/invitations/{token}/accept` | 초대 수락 → 친구 등록 |
| GET | `/api/v1/invitations/mine` | 내 초대 목록 |

---

## Dash+ 유료 멤버십 (FE 반영 완료 · BE 미구현)

> 무한 hop 지인 네트워크. 무료는 2촌까지(`FREE_HOP_LIMIT=2`), 3촌+는 Dash+ 전용.
> FE 결정: `memory/adr/ADR-FE-002-dash-plus-membership.md`

| 메서드 | 엔드포인트 | 설명 | 비고 |
|--------|-----------|------|------|
| GET | `/api/v1/users/{userId}/acquaintances` | 노드별 지인 목록 | 항목에 `acquaintanceCount`(드릴다운용) 포함 |
| GET | `/api/v1/users/me/membership` | 내 멤버십 상태 | `{ plan: 'free'\|'plus', plusUntil? }` |
| POST | `/api/v1/billing/plus/checkout` | Dash+ 구독 결제 | 연/월 플랜 · 결제 연동 TBD |

```typescript
// Acquaintance (drill-down 지원 필드)
{ id, userId, nickname, profileImageUrl, hasAcquaintances, bio?, acquaintanceCount? }

// Membership
{ plan: 'free' | 'plus', plusUntil?: ISODate }
```

3촌+ 게이팅은 현재 FE 클라이언트에서 처리. 서버측 권한 검증(예: hop>2 요청 시 403 +
미리보기 카운트) 도입 시 위 응답에 hop/via 메타 추가 권장.

---

## 구현 우선순위 / 현황

| 우선순위 | 도메인 | API | 상태 |
|----------|--------|-----|------|
| 🔴 필수 | 내 프로필 | GET/PUT `/me/profile`, nickname-check | ✅ 완료 |
| 🔴 필수 | 친구 | GET `/friends` | ✅ 완료 |
| 🔴 필수 | 지인 | GET `/users/{userId}/acquaintances` | ✅ 완료 |
| 🔴 필수 | 유저 프로필 | GET `/users/{userId}/profile` | ✅ 완료 |
| 🔴 필수 | 연락 요청 | POST/GET/accept/reject | ✅ 완료 |
| — | 초대 | invitations/* | ✅ 완료 (기존) |
| 🟡 선택 | 인증 | signup, login, refresh | ❌ 보류 (모델 충돌) |
| 🟢 추후 | Dash+ | membership, billing/plus/checkout | ❌ 보류 (결제 TBD) |
