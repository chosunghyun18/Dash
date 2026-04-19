---
description: BE 레이어드 아키텍처 설계 검토. 새 도메인/기능 구현 전 be-architect 에이전트 호출.
---

# /be-arch

be-architect 에이전트를 호출하여 Spring Boot 레이어드 아키텍처 관점에서 설계합니다.

## 실행 내용
1. 요청된 기능의 레이어별 클래스 설계
2. 생성할 파일 목록 및 순서 제시
3. 레이어 위반 위험 요소 사전 탐지
4. 필요 시 ADR 작성 (`memory/adr/`)

## 레이어 구조
```
Presentation (Controller/DTO)
    ↓
Business (Service/Validator)
    ↓
Persistence (Repository/Entity)
    ↓
Domain (Model/VO) — 모든 레이어 참조 가능
```
