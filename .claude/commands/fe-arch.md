---
description: FE React Native 아키텍처 설계 검토. 새 화면/기능 구현 전 fe-architect 에이전트 호출.
---

# /fe-arch

fe-architect 에이전트를 호출하여 React Native 레이어드 아키텍처 관점에서 설계합니다.

## 실행 내용
1. 화면 구조 및 네비게이션 설계
2. Smart/Dumb 컴포넌트 분리 계획
3. 상태 관리 전략 (React Query + Zustand)
4. 생성할 파일 목록 및 우선순위 제시

## 레이어 구조
```
Presentation (screens, components)
    ↓
Application (hooks, stores)
    ↓
Data (services, API)
    ↓
Infrastructure (storage, notifications)
```
