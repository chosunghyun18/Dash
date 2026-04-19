---
name: Dash Architecture Overview
description: 프로젝트 전체 아키텍처 결정사항
type: project
date: 2026-04-19
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
app/          Expo Router 페이지
services/     API 호출 (axios)
hooks/        React Query 훅
components/   재사용 UI 컴포넌트
constants/    색상, 폰트 등 상수
```

## 주요 결정사항

- 크로스플랫폼: React Native + Expo (iOS + Android 동시 지원)
- DB: PostgreSQL (소개팅 앱 특성상 복잡한 쿼리 고려)
- JWT 저장: MMKV (encrypted) — AsyncStorage 사용 금지
- 프로필 사진: 별도 파일 업로드 서버 예정
