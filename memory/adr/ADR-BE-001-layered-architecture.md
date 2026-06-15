---
name: ADR-BE-001
description: BE 레이어드 아키텍처 채택 결정
type: project
date: 2026-04-19
---

# ADR-BE-001: Spring Boot 레이어드 아키텍처 채택

> ⚠️ **Superseded by [ADR-BE-002](ADR-BE-002-hexagonal-architecture.md)** (2026-06-15)
> 회고: 본 ADR은 "순수 도메인 레이어"를 선언했으나 실제 코드는 JPA 엔티티=도메인 모델이었고,
> 언어도 Kotlin이 아닌 **Java**였다. 헥사고날+DDD(ADR-BE-002)로 전환하며 두 괴리를 해소했다.

## 상황 (Context)

Dash BE는 소개팅 앱의 핵심 비즈니스 로직(매칭, 채팅, 프로필)을 Spring Boot + Java로 구현한다.
팀이 빠르게 기능을 개발하면서도 레이어간 책임을 명확히 분리할 구조가 필요하다.

## 결정 (Decision)

4계층 레이어드 아키텍처를 사용한다:

1. **Presentation Layer** — Controller, DTO (HTTP 경계)
2. **Business Layer** — Service, Validator (비즈니스 로직)
3. **Persistence Layer** — Repository, Entity (데이터 접근)
4. **Domain Layer** — Model, Value Object (순수 Java, 프레임워크 의존성 없음)

의존성 방향: Presentation → Business → Persistence, 전 레이어 → Domain

## 결과 (Consequences)

### 긍정적
- 레이어별 책임이 명확해 신규 개발자가 쉽게 파악
- Domain이 순수 Java라 단위 테스트 용이
- 레이어 교체 시 영향 범위 최소화

### 부정적
- 간단한 CRUD도 DTO ↔ Domain 변환 코드 필요
- 레이어 수가 많아 파일 수 증가

## 검토한 대안

- **헥사고날(Ports & Adapters)**: 더 강한 분리지만 팀 학습 비용 높음
- **단순 2레이어(Controller + Service)**: 빠르지만 규모 커질수록 혼란

## 상태: Superseded by ADR-BE-002
## 날짜: 2026-04-19 (2026-06-15 Superseded)
