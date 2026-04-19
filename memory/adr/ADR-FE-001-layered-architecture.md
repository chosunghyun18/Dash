---
name: ADR-FE-001
description: FE React Native 레이어드 아키텍처 채택 결정
type: project
date: 2026-04-19
---

# ADR-FE-001: React Native 레이어드 아키텍처 채택

## 상황 (Context)

Dash FE는 iOS + Android 크로스플랫폼 앱으로 React Native + Expo를 사용한다.
화면 수가 많아지면서 API 호출, 상태 관리, UI 코드가 뒤섞이지 않도록 구조화가 필요하다.

## 결정 (Decision)

4계층 레이어드 아키텍처를 사용한다:

1. **Presentation Layer** — screens (`app/`), components (UI 렌더링)
2. **Application Layer** — hooks (`hooks/`), stores (`stores/`) (비즈니스 로직, 상태)
3. **Data Layer** — services (`services/`) (API 통신)
4. **Infrastructure Layer** — lib (`lib/`) (MMKV, 알림, 위치)

의존성 방향: Presentation → Application → Data → Infrastructure

## 결과 (Consequences)

### 긍정적
- 화면 컴포넌트가 순수 UI 코드만 포함 → 테스트 및 재사용 용이
- API 변경 시 Data Layer만 수정
- Storybook 등 컴포넌트 독립 개발 가능

### 부정적
- 단순 화면도 hook + service 파일 분리 필요
- 초기 보일러플레이트 코드 증가

## 검토한 대안

- **파일 기반 단순 구조**: 빠르지만 규모 커질수록 유지보수 어려움
- **Feature-Sliced Design**: 더 정교하지만 팀 학습 비용 높음

## 상태: Accepted
## 날짜: 2026-04-19
