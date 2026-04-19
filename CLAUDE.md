# CLAUDE.md — Dash Dating App

## 프로젝트 개요

**Dash**는 iOS/Android 크로스플랫폼 모바일 소개팅 앱입니다.

## 구조

```
dash/
├── BE/           Spring Boot 3.3 + Kotlin REST API
├── FE/           React Native + Expo (iOS + Android)
├── memory/       아키텍처 결정사항 및 컨텍스트
└── .claude/      에이전트, 커맨드, 설정
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.3, Kotlin 2.0, PostgreSQL, JWT |
| 프론트엔드 | React Native, Expo Router, TypeScript, Zustand, React Query |

## 아키텍처

### BE — 레이어드 아키텍처 (Layered Architecture)

```
┌──────────────────────────────────┐
│  Presentation  Controller / DTO  │
├──────────────────────────────────┤
│  Business      Service / Validator│
├──────────────────────────────────┤
│  Persistence   Repository / Entity│
├──────────────────────────────────┤
│  Domain        Model / VO (순수Kotlin)│
└──────────────────────────────────┘
```

**핵심 규칙:**
- 의존성 방향: Presentation → Business → Persistence, 모두 Domain 참조
- Domain에 Spring/JPA 어노테이션 절대 금지
- Controller → Repository 직접 호출 금지
- 모든 사용자 엔드포인트에 `@PreAuthorize` 필수
- DB 쓰기 작업에 `@Transactional` 필수

### FE — 레이어드 아키텍처

```
┌──────────────────────────────────┐
│  Presentation  screens / components│
├──────────────────────────────────┤
│  Application   hooks / stores    │
├──────────────────────────────────┤
│  Data          services / API    │
├──────────────────────────────────┤
│  Infrastructure storage / device │
└──────────────────────────────────┘
```

**핵심 규칙:**
- 화면에서 `axios` 직접 호출 금지 — services/ 통해서만
- JWT는 MMKV(encrypted)에 저장 — AsyncStorage 금지
- 서버 상태: React Query / 전역 상태: Zustand

## 에이전트

| 에이전트 | 역할 |
|----------|------|
| `be-architect` | BE 레이어드 아키텍처 설계 및 검토 |
| `fe-architect` | FE React Native 아키텍처 설계 및 검토 |
| `doc-updater` | 코드맵 및 문서 자동 갱신 |
| `planner` | BE+FE 기능 구현 계획 수립 |
| `kotlin-reviewer` | BE Kotlin 코드 리뷰 |
| `security-reviewer` | 보안 취약점 검토 |

## 커맨드

| 커맨드 | 에이전트 | 설명 |
|--------|----------|------|
| `/be-arch` | be-architect | BE 레이어 설계 (새 도메인/기능 전) |
| `/fe-arch` | fe-architect | FE 화면/컴포넌트 설계 (새 기능 전) |
| `/plan` | planner | BE+FE 전체 구현 계획 |
| `/update-docs` | doc-updater | 문서 + 코드맵 갱신 |
| `/review` | kotlin-reviewer + security-reviewer | 코드 리뷰 |

## 개발 워크플로우

```
1. /be-arch 또는 /fe-arch → 아키텍처 설계
2. /plan → 구현 계획 확정 (사용자 승인 필수)
3. 구현
4. /review → 코드 리뷰
5. /update-docs → 문서 갱신
```

- 아키텍처 결정사항은 `memory/adr/` 폴더에 ADR로 기록
