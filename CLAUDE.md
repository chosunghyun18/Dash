# CLAUDE.md — Dash Dating App

## 프로젝트 개요

**Dash**는 iOS/Android 크로스플랫폼 모바일 소개팅 앱입니다.

## 구조

```
dash/
├── BE/           Spring Boot 3.3 + Java 21 REST API
├── FE/           React Native + Expo (iOS + Android)
├── memory/       아키텍처 결정사항 및 컨텍스트
└── .claude/      에이전트, 커맨드, 설정
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.3, Java 21, Lombok, PostgreSQL, JWT, Flyway |
| 프론트엔드 | React Native, Expo Router, TypeScript, Zustand, React Query |

## 아키텍처

### BE — 헥사고날 (Ports & Adapters) + DDD

> ADR: `memory/adr/ADR-BE-002-hexagonal-architecture.md` (ADR-BE-001 레이어드를 대체)

바운디드 컨텍스트별 4개 서브패키지 (`com.dash.<context>/`):

```
┌───────────────────────────────────────────────┐
│  presentation    Controller / DTO              │
├───────────────────────────────────────────────┤
│  application     UseCase Service (@Transactional)│
├───────────────────────────────────────────────┤
│  domain          애그리거트 / VO / Repository 포트  │ ← 순수 Java, 프레임워크 의존 0
├───────────────────────────────────────────────┤
│  infrastructure  JpaEntity / Adapter / Mapper   │ ← 포트 구현
└───────────────────────────────────────────────┘
       presentation → application → domain ← infrastructure(adapter)
```

**핵심 규칙:**
- **Domain에 Spring/JPA 어노테이션 절대 금지** (이번엔 실제 강제 — domain 패키지에 `jakarta.persistence`/`org.springframework` import 0)
- **Repository 포트는 domain 소유**, 어댑터가 infrastructure에서 Spring Data + 매퍼로 구현
- **애그리거트 간 참조는 ID/VO로** (`MemberId`). JpaEntity는 FK를 Long 컬럼으로 매핑 (JOIN FETCH 금지)
- 도메인 팩토리 `create`(신규)/`reconstitute`(복원) 구분. 변경 후 application이 명시적 `repository.save()`
- OOP/VO 적극 활용: `Nickname`, `Contact`(phone XOR email), `InvitationToken`
- Controller → Repository 직접 호출 금지 (controller → application service)
- 모든 사용자 엔드포인트에 `@PreAuthorize` 필수
- DB 쓰기 작업에 `@Transactional` 필수
- 읽기 조합(user)은 CQRS read — application query service가 여러 포트 조합

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
| `java-reviewer` | BE Java 코드 리뷰 |
| `security-reviewer` | 보안 취약점 검토 |

## 커맨드

| 커맨드 | 에이전트 | 설명 |
|--------|----------|------|
| `/be-arch` | be-architect | BE 레이어 설계 (새 도메인/기능 전) |
| `/fe-arch` | fe-architect | FE 화면/컴포넌트 설계 (새 기능 전) |
| `/plan` | planner | BE+FE 전체 구현 계획 |
| `/update-docs` | doc-updater | 문서 + 코드맵 갱신 |
| `/review` | java-reviewer + security-reviewer | 코드 리뷰 |

## 개발 워크플로우

```
1. /be-arch 또는 /fe-arch → 아키텍처 설계
2. /plan → 구현 계획 확정 (사용자 승인 필수)
3. 구현
4. /review → 코드 리뷰
5. /update-docs → 문서 갱신
```

- 아키텍처 결정사항은 `memory/adr/` 폴더에 ADR로 기록
