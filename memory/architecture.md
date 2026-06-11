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
| BE | Spring Boot 3.3 + Kotlin + PostgreSQL |
| FE | React Native (Expo Router) + TypeScript |
| 인증 | JWT (access 24h + refresh 7d) |
| 상태관리 | Zustand + React Query |

## BE 레이어 구조

```
Controller → Service → Repository → Domain
```
- Domain은 Spring/JPA 의존성 금지 (순수 Kotlin)
- DTO ↔ Domain 변환은 Service 레이어에서

## FE 폴더 구조

```
app/          Expo Router 페이지 (login, (tabs), profile, acquaintances, invite, upgrade)
services/     API 호출 (axios) — friend, auth, invitation, storage
hooks/        React Query 훅 + 디바이스 훅
stores/       Zustand 전역 상태 (authStore, membershipStore)
components/   재사용 UI 컴포넌트
theme/        색상·타이포·간격 토큰
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
