# Dash — Memory Folder

프로젝트 결정사항, 아키텍처, 컨텍스트를 기록합니다.

## 파일 목록

| 파일 | 내용 |
|------|------|
| architecture.md | 기술 스택 및 아키텍처 결정사항 (FE/BE 개요) |
| adr/ADR-BE-001-layered-architecture.md | BE 레이어드 아키텍처 채택 (⚠️ ADR-BE-002로 대체됨) |
| adr/ADR-BE-002-hexagonal-architecture.md | BE 헥사고날(Ports&Adapters)+DDD, JPA 엔티티/도메인 분리 |
| adr/ADR-FE-001-layered-architecture.md | FE 레이어드 아키텍처 채택 |
| adr/ADR-FE-002-dash-plus-membership.md | Dash+ 멤버십·무한 hop·svg/오버레이 결정 |

## 관련 문서 (docs/)

- 전체 문서 인덱스: `docs/CODEMAPS/INDEX.md`
- FE 코드맵: `docs/CODEMAPS/frontend.md`

## 업데이트 방법

`/update-docs` 명령어 실행 시 doc-updater 에이전트가 자동으로 갱신합니다.
