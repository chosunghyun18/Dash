# Dash — 문서 인덱스 (Documentation Index)

**Last Updated:** 2026-06-11

> 필요한 문서로 바로 점프하기 위한 라우팅 인덱스. 전체를 읽지 말고 아래 표에서 해당 항목만 여세요.

## 코드맵 (docs/CODEMAPS/)

| 문서 | 무엇을 찾을 때 | 범위 |
|------|----------------|------|
| `INDEX.md` (이 문서) | 어떤 문서를 봐야 할지 모를 때 | 전체 라우팅 |
| `frontend.md` | FE 화면·컴포넌트·스토어·Dash+ 구조 | React Native / Expo |
| `backend.md` | Spring 컨트롤러·서비스·엔드포인트 | Spring Boot (예정) |
| `database.md` | JPA 엔티티 관계 | PostgreSQL (예정) |

## 명세 문서 (docs/)

| 문서 | 무엇을 찾을 때 |
|------|----------------|
| `../API.md` | REST 엔드포인트 목록·요청/응답 스키마 |
| `../UX.md` | 화면별 UX 흐름·기능 명세 |
| `../DB_SCHEMA.md` | 테이블·컬럼·ERD |

## 결정 기록 (memory/)

| 문서 | 무엇을 찾을 때 |
|------|----------------|
| `../../memory/architecture.md` | 스택·폴더구조·핵심 결정 요약 |
| `../../memory/adr/ADR-BE-001-*` | BE 레이어드 아키텍처 근거 |
| `../../memory/adr/ADR-FE-001-*` | FE 레이어드 아키텍처 근거 |
| `../../memory/adr/ADR-FE-002-*` | Dash+ 멤버십·무한 hop·svg/오버레이 근거 |

## 디자인 정본

| 위치 | 비고 |
|------|------|
| `../../design_handoff_dash/lib/*.jsx` | **정본** — README 산문보다 우선 |
| `../../design_handoff_dash/README.md` | 토큰·화면 산문 설명 (참고) |
| `../../design_handoff_dash/screenshots/` | 화면 미리보기 |

## 갱신 규칙

- 코드에서 생성, 수작업 날조 금지 · 각 코드맵 상단에 `Last Updated` 명시
- 각 코드맵 500줄 이하 유지 · `/update-docs`로 자동 갱신
