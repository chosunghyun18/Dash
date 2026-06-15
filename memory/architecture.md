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

## BE 아키텍처 — 헥사고날(Ports & Adapters) + DDD

> ADR: `adr/ADR-BE-002-hexagonal-architecture.md` (ADR-BE-001 레이어드 대체)

```
presentation → application → domain ← infrastructure(adapter)
```
- **domain**: 애그리거트·VO·Repository 포트. 순수 Java(프레임워크 의존 0). `create`/`reconstitute` 팩토리
- **application**: 유스케이스 서비스, `@Transactional`, 포트에만 의존. 변경 후 명시적 `save()`
- **infrastructure/persistence**: `XxxJpaEntity`(@Entity)·Spring Data·Mapper·RepositoryAdapter(포트 구현). 애그리거트 간 참조는 FK Long 컬럼(JOIN FETCH 없음)
- **presentation**: Controller·DTO(record + static `of`). `@PreAuthorize` + `@AuthenticationPrincipal` → memberId
- VO: `MemberId`(정렬), `Nickname`(1~12자), `Contact`(phone XOR email), `InvitationToken`

### BE 패키지 (`com.dash.<context>/{domain,application,infrastructure,presentation}`)

```
member/        회원 (kakaoId 기반) — 잎 애그리거트, MemberId/Nickname VO
profile/       내 프로필 — /me/profile, nickname-check. Contact VO
friendship/    친구 관계·친구 목록 — /friends
user/          타 유저 프로필·지인 탐색 — /users/{id}/profile, /acquaintances (CQRS read, domain 없음)
contactrequest/ 연락 요청 — /contact-requests/*
invitation/    친구 초대 링크 — /invitations/*. InvitationToken VO
global/        보안(JWT)·예외(BusinessException/ErrorCode = 공유 커널)·Swagger
```
> 상세 엔드포인트 맵: `docs/CODEMAPS/backend.md` · BE 문서 허브: `docs/BE/INDEX.md`

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
