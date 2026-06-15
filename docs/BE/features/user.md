# 기능: 유저 프로필 · 지인 (User)

**패키지:** `com.dash.user` · **테이블:** [members](../database/members.md), [profiles](../database/profiles.md), [friendships](../database/friendships.md)

타 유저의 "나를 소개합니다" 프로필 조회와 지인(친구의 친구) 탐색. 읽기 전용.

## 엔드포인트

| 메서드 | 경로 | 요청 | 응답 |
|--------|------|------|------|
| GET | `/api/v1/users/{userId}/profile` | path | `UserProfileResponse` |
| GET | `/api/v1/users/{userId}/acquaintances` | path | `AcquaintanceResponse[]` |

### DTO

```
UserProfileResponse  { userId, nickname, profileImageUrl, introText, hasAcquaintances }
AcquaintanceResponse { id, userId, nickname, profileImageUrl, hasAcquaintances, bio }
```
- `AcquaintanceResponse.id` = userId (목록 키)

## 구성 파일

- `controller/UserController` · `service/UserQueryService`
- `dto/UserProfileResponse`, `AcquaintanceResponse`

## 핵심 로직 (`UserQueryService`)

### getUserProfile(viewerId, userId)
- member 조회(없으면 404), profile 조회(없으면 introText="")
- `hasAcquaintances` = `countFriendsExcluding(userId, viewerId) > 0` (조회자 제외 친구 보유)

### getAcquaintances(viewerId, userId)
- userId 존재 확인(없으면 404)
- `findAllByMemberId(userId)` → 상대 회원 추출 → **viewer 본인은 제외**
- 프로필 일괄 조회
- 각 지인의 `hasAcquaintances` = `countFriendsExcluding(지인id, userId) > 0`
  (= "드릴다운 기준 노드(userId)를 빼고도 더 탐색할 친구가 있는가")

## 탐색 깊이 정책 (API.md)

- 무료(프로토타입): 친구 → 친구의 지인 (2단계)
- 유료(Dash+): 3단계 — `hasAcquaintances=true`면 한 단계 더
- 3촌+ 게이팅은 현재 FE 클라이언트 처리. 서버측 hop 검증/`via`/`acquaintanceCount`는 미제공(추후)

## 에러

| 코드 | HTTP | 상황 |
|------|------|------|
| `MEMBER_NOT_FOUND` | 404 | userId 회원 없음 |

## 메모

- 라우팅: `/users/me/profile`(ProfileController)와 경로 공유하나 리터럴 `me` 우선 → 충돌 없음
- `hasAcquaintances`·지인 목록의 `countFriendsExcluding`는 항목당 1쿼리 (N+1, 프로토타입 허용)
