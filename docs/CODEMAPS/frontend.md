# Frontend Codemap

**Last Updated:** 2026-06-13
**Stack:** React Native · Expo Router · TypeScript · Zustand · React Query · react-native-svg

## Architecture (레이어드)

```
Presentation   app/ (screens) · components/
Application    hooks/ · stores/
Data           services/ (axios) · mocks/ (개발 모드 mock)
Infrastructure lib/ (storage·trail) · theme/ (tokens) · config.ts
```

의존성 방향: Presentation → Application → Data → Infrastructure (ADR-FE-001)

**개발/운영 모드:** `config.ts` 의 `USE_MOCK`(`EXPO_PUBLIC_USE_MOCK`)이 true 면
services 가 `mocks/index.ts` 반환, false(기본)면 BE API 호출.

## Screens (app/)

| 화면 | 경로 | 설명 |
|------|------|------|
| 로그인 | `login.tsx` | Apple/Google 소셜 로그인, 신규 → 프로필 초기설정 |
| 홈 | `(tabs)/index.tsx` | 내 친구(1촌) 목록 → 프로필 / 지인 목록 진입 |
| 마이페이지 | `(tabs)/mypage.tsx` | 프로필 카드 · PlusUpgradeCard · 받은/보낸 요청(SegTab) |
| 탭 레이아웃 | `(tabs)/_layout.tsx` | 홈/마이페이지 탭바 (home/user 아이콘, 활성 fill) |
| 지인 리스트 | `acquaintances/[userId].tsx` | trail 브레드크럼 · 드릴다운 · 3촌+ LockedHopGate |
| 프로필 상세 | `profile/[userId].tsx` | hero/hop/via · normal·accept·accepted·requested · Plus 게이트 |
| 프로필 수정 | `profile/edit.tsx` | 닉네임 중복확인 · 연락처 토글 · bio(500자) |
| 초대 | `invite/[token].tsx` | 딥링크 초대 수락 |
| Dash+ 플랜 | `upgrade.tsx` | 히어로 · 혜택 4 · 연/월 플랜 · 스티키 CTA |
| 루트 | `_layout.tsx` | QueryClient · SafeArea · AuthGate(인증 라우팅) |

## Components

| 컴포넌트 | 용도 |
|----------|------|
| `Avatar` | 닉네임 해시 컬러 원형 아바타 |
| `DashButton` | 버튼 (primary/primarySoft/secondary/outline/reject/accept/ghost · sm/md/lg) |
| `DashMark` | Dash 브랜드 마크 (lg/md) |
| `SocialAuthButton` | Apple(검정)/Google(컬러 SVG 로고) 로그인 버튼 |
| `FriendListItem` | 홈 친구 행 (프로필/지인 목록 버튼) |
| `ConnectionCard` | 지인 카드 + "지인 N명 더 보기" 드릴다운 (nextLocked 시 Plus 배지) |
| `StatusBadge` | PENDING/ACCEPTED/REJECTED 상태 칩 |
| `IntroPathPill` | "♡ 민수의 소개" 소개 경로 핀 |
| `EmptyState` | 빈 상태 (heart/inbox 아이콘 + CTA) |
| `ScreenLoader` | 화면 전체 중앙정렬 로딩 인디케이터 (공통) |
| **`PlusBadge`** | Dash+ 배지 (크라운 + "Plus", solid/soft, xs/sm/md) |
| **`PlusUpgradeCard`** | 마이페이지 Dash+ 카드 (무료=업셀 / 활성=결제일) |
| **`HopIndicators`** | `HopPill`(촌수) + `HopBreadcrumb`(나 › 민수 › …) |
| **`LockedHopGate`** | 3촌+ 무료 잠금 게이트 (블러 아바타 + 업셀) |
| **`GradientBox`** | svg LinearGradient 배경 (expo-linear-gradient 대체) |

## State (stores/)

| 스토어 | 상태 |
|--------|------|
| `authStore` | status · provider · accessToken · bootstrap/setSession/signOut |
| `membershipStore` | plan · plusUntil · `FREE_HOP_LIMIT=2` · `DASH_PLUS_PRICE` · upgradeToPlus |

## Data (services/ · hooks/)

| 서비스 | 책임 | 훅 |
|--------|------|------|
| `friend` | 친구·지인·요청·내프로필 (config.USE_MOCK 토글) | `useFriends`: useMyFriends, useAcquaintances, useUserProfile, useSent/ReceivedRequests, useSend/Accept/RejectContactRequest, useMyProfile, useUpdateMyProfile, useCheckNickname |
| `auth` | Apple/Google 로그인 | `useAuth`: useSocialLogin (세션 저장·라우팅 포함) |
| `invitation` | 초대 생성·검증·수락 | `useInvite`: useCreateInvitation, useShareInvitation, useMyInvitations, useValidateInvitation, useAcceptInvitation |
| `api` | axios 인스턴스 + JWT 인터셉터 | — |

`mocks/index.ts` — 개발 모드 mock 데이터 + 구현(`friendMocks`·`authMocks`) 통합 (Data 보조)

## Infrastructure (lib/)

| 모듈 | 책임 |
|------|------|
| `lib/storage` | MMKV 보안 저장 (Expo Go/웹은 메모리 폴백) + `STORAGE_KEYS` |
| `lib/trail` | 지인 trail 인코딩/파싱 (`encodeTrail`·`trailFromNode`·`appendTrail`·`parseTrail`) |
| `config.ts` | `USE_MOCK` 전역 토글 (`EXPO_PUBLIC_USE_MOCK`) |

## Dash+ 무한 hop 모델 (핵심)

```
홈(1촌) → 지인 리스트(2촌) → [드릴다운] 지인의 지인(3촌, 무료 잠금) → 4촌 …
listHop = trail.length + 1        trail = [루트친구 … head]  (?trail=<JSON>)
무료 잠금 = !isPlus && listHop > FREE_HOP_LIMIT(2)
```
- 2촌: 무료 열람 · 3촌+: `LockedHopGate` / 프로필 Plus 게이트 / 드릴다운 Plus 배지
- 그라디언트·블러는 `react-native-svg` + 오버레이로 처리 (네이티브 의존성 없음)
- 상세 결정: `memory/adr/ADR-FE-002-dash-plus-membership.md`

## 테마 토큰 (theme/)

`colors`(primary `#FF4B6E` · plusAccent `#7B5CFA` · plusAccentSoft `#F4F0FF`) ·
`typography`(Pretendard) · `spacing`/`radius`/`shadow` · `avatarColor()`
