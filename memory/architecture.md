---
name: Dash Architecture Overview
description: 프로젝트 전체 아키텍처 결정사항
type: project
date: 2026-06-11
---

# Dash 아키텍처

## 스택

| 레이어 | 기술 |
|--------|------|
| BE | Spring Boot 3.3 + Java 21 + Lombok + PostgreSQL + Flyway |
| FE | React Native (Expo Router) + TypeScript |
| 인증 | JWT (access 24h + refresh 7d) |
| 상태관리 | Zustand + React Query |

## BE 레이어 구조

```
Controller → Service → Repository → Domain
```
- DTO ↔ Domain 변환은 Service 레이어 (DTO는 record + static `of` 팩토리)
- 컨트롤러 공통: `@PreAuthorize("isAuthenticated()")` + `@AuthenticationPrincipal` → memberId
- 엔티티는 JPA 어노테이션 사용(`@Entity`), Lombok `@Getter`/`@NoArgsConstructor(PROTECTED)` + static 팩토리

### BE 패키지 (`com.dash`)

```
member/        회원 엔티티/리포지토리 (kakaoId 기반)
profile/       내 프로필 — GET/PUT /me/profile, nickname-check
friendship/    친구 관계·친구 목록 — GET /friends
user/          타 유저 프로필·지인 탐색 — GET /users/{id}/profile, /acquaintances
contactrequest/ 연락 요청 — POST/GET sent·received/accept/reject
invitation/    친구 초대 링크
global/        보안(JWT)·예외(BusinessException/ErrorCode)·Swagger
```
> 상세 엔드포인트 맵: `docs/CODEMAPS/backend.md`

### 인증 보류 (미구현)
- `Member`는 `kakaoId` 모델인데 API.md는 email/password, FE는 Apple/Google 가정 — 3자 충돌로 auth 엔드포인트 보류.

## FE 폴더 구조

```
app/          Expo Router 페이지 (login, (tabs), profile, acquaintances, invite, upgrade)
services/     API 호출 (axios) — friend, auth, invitation, api
mocks/        개발 모드 mock 데이터 + 구현 (config.USE_MOCK 토글)
hooks/        React Query 훅 + 디바이스 훅 (useFriends, useAuth, useInvite …)
stores/       Zustand 전역 상태 (authStore, membershipStore)
components/   재사용 UI 컴포넌트
lib/          Infrastructure — storage(MMKV), trail 유틸
theme/        색상·타이포·간격 토큰
config.ts     USE_MOCK 전역 토글 (EXPO_PUBLIC_USE_MOCK)
```

## Dash+ 유료 멤버십 (FE)

> 상세 결정: `adr/ADR-FE-002-dash-plus-membership.md`

- 멤버십 상태: `stores/membershipStore.ts` (`plan`, `plusUntil`, `FREE_HOP_LIMIT=2`)
- 무한 hop 지인 네트워크: trail 기반 (`listHop = trail.length + 1`), 3촌+ 무료 잠금
- 그라디언트/블러: 네이티브 의존성 없이 `react-native-svg`(GradientBox) + 오버레이로 구현
- 디자인 정본: `design_handoff_dash/lib/*.jsx` (README 산문보다 우선)

## 주요 결정사항

- 크로스플랫폼: React Native + Expo (iOS + Android 동시 지원)
- DB: PostgreSQL (소개팅 앱 특성상 복잡한 쿼리 고려)
- JWT 저장: MMKV (encrypted) — AsyncStorage 사용 금지
- 프로필 사진: 별도 파일 업로드 서버 예정
- 인증: Apple / Google 소셜 로그인만 (이메일/카카오 미지원)
