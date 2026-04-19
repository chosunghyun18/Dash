# Dash — 필요 API 목록

## 인증

| 메서드 | 엔드포인트 | 설명 | 요청 바디 | 응답 |
|--------|-----------|------|-----------|------|
| POST | `/api/v1/auth/signup` | 회원가입 | `{ email, password, nickname }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/login` | 로그인 | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 | `{ refreshToken }` | `{ accessToken }` |
| POST | `/api/v1/auth/logout` | 로그아웃 | — | 204 |

---

## 내 프로필

| 메서드 | 엔드포인트 | 설명 | 요청 바디 | 응답 |
|--------|-----------|------|-----------|------|
| GET | `/api/v1/users/me/profile` | 내 프로필 조회 | — | `MyProfile` |
| PUT | `/api/v1/users/me/profile` | 내 프로필 수정 | `{ nickname, phone?, email?, introText }` | 200 |
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

## 친구

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

## 지인 (탐색 깊이)

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

## 유저 프로필 조회

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

## 연락 요청

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

## 구현 우선순위

| 우선순위 | 도메인 | API |
|----------|--------|-----|
| 🔴 필수 | 내 프로필 | GET/PUT `/me/profile`, nickname-check |
| 🔴 필수 | 친구 | GET `/friends` |
| 🔴 필수 | 지인 | GET `/users/{userId}/acquaintances` |
| 🔴 필수 | 유저 프로필 | GET `/users/{userId}/profile` |
| 🔴 필수 | 연락 요청 | POST/GET/accept/reject |
| 🟡 선택 | 인증 | signup, login, refresh |
