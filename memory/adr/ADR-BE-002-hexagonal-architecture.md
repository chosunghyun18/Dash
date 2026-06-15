---
name: ADR-BE-002
description: BE 헥사고날(Ports & Adapters) + DDD 채택 — JPA 엔티티/도메인 모델 분리
type: project
date: 2026-06-15
---

# ADR-BE-002: 헥사고날(Ports & Adapters) + DDD 채택

> **Supersedes [ADR-BE-001](ADR-BE-001-layered-architecture.md)**

## 상황 (Context)

ADR-BE-001은 "순수 도메인 레이어(프레임워크 의존 없음)"를 가진 레이어드 아키텍처를 선언했으나,
실제 코드는 **JPA 엔티티가 곧 도메인 모델**인 3계층 구조였다. `@Entity`·`@ManyToOne` 등 JPA 어노테이션이
도메인 클래스에 직접 붙어 있어 명문 규칙과 코드가 어긋났고, 도메인 단위 테스트가 영속/트랜잭션
경계에 묶이는 문제가 있었다. (문서엔 Kotlin이라 적혔으나 실제는 Java.)

사용자 요구: (1) JPA 엔티티와 도메인 모델 분리, (2) OOP를 최대한 활용한 DDD, (3) 원칙 문서 정합화.

## 결정 (Decision)

**헥사고날(Ports & Adapters) + DDD**를 채택한다. 바운디드 컨텍스트별로 4개 서브패키지:

```
com.dash.<context>/
  domain/          순수 도메인 — 애그리거트 루트, VO, Repository 포트(interface). 프레임워크 의존 0
  application/     유스케이스 서비스, @Transactional 오케스트레이션 (포트에만 의존)
  infrastructure/persistence/  XxxJpaEntity(@Entity), XxxJpaRepository(Spring Data), Mapper, RepositoryAdapter(포트 구현)
  presentation/    Controller, 요청/응답 DTO
```

### 핵심 규칙
1. **도메인은 프레임워크 무관** — 도메인 패키지에 `jakarta.persistence`/`org.springframework` import 금지 (CI grep으로 검증 가능).
2. **Repository 포트는 도메인 소유**, 어댑터가 infrastructure에서 Spring Data + 매퍼로 구현. 포트는 도메인 객체/VO만 주고받음.
3. **애그리거트 간 참조는 ID(VO)로** — JpaEntity는 `@ManyToOne` 대신 FK를 Long 스칼라 컬럼으로 매핑. 부수효과로 JOIN FETCH/lazy proxy 제거, N+1 차단.
4. **도메인 팩토리** `create(...)`(신규) / `reconstitute(...)`(영속 복원) 구분. 매퍼가 변환.
5. **OOP/VO 적극 활용** — 불변식 있는 것만 VO로 승격: `MemberId`(정렬), `Nickname`(1~12자), `Contact`(phone XOR email), `InvitationToken`.
6. **읽기 조합(user)은 CQRS read** — 애그리거트 없이 application query service가 여러 포트를 조합.

### 애그리거트
member(Member) · profile(Profile) · friendship(Friendship) · invitation(Invitation) · contactrequest(ContactRequest). user는 읽기 전용(애그리거트 없음).

### 실용 균형 (과설계 회피)
- 식별자 VO는 **MemberId만** 도입(컨텍스트 간 참조 중심). 나머지 애그리거트 자체 id는 Long.
- `BusinessException`/`ErrorCode`는 **공유 커널(shared kernel)** 로 보고 도메인 사용 허용.
- 도메인 변경 후 영속화는 application 서비스가 명시적으로 `repository.save()` 호출(JPA dirty checking 비의존).

## 결과 (Consequences)

### 긍정적
- 도메인이 순수 Java → 단위 테스트가 영속/트랜잭션과 무관 (35개 서비스 테스트가 포트 mock만으로 동작)
- JPA 어노테이션이 도메인에서 제거되어 명문 규칙과 코드 일치
- ID 참조 매핑으로 JOIN FETCH 제거, lazy proxy 이슈 소멸
- DB 스키마/마이그레이션 무변경(JpaEntity가 기존 테이블/컬럼에 매핑, ddl-auto=validate 통과)

### 부정적
- 컨텍스트당 매퍼/어댑터/JpaEntity 보일러플레이트 증가 (수동 매퍼, MapStruct 미사용)
- 도메인 변경 시 명시적 save 필요 (dirty checking 비의존)

## 검토한 대안
- **레이어드 유지(엔티티=도메인)**: 코드량 적으나 도메인 순수성/테스트성 목표 미달.
- **전(全) 식별자 VO화**: 경계(컨트롤러/시큐리티/매퍼)마다 변환 폭증 → MemberId로 한정.
- **MapStruct 도입**: 새 의존성 → 수동 매퍼로 회피.

## 향후 과제
- 도메인 전용 예외(현재 BusinessException 공유 커널 사용) 분리
- 도메인 이벤트 기반 cross-context 일관성(현재 invitation.accept→friendship은 단일 트랜잭션)

## 상태: Accepted
## 날짜: 2026-06-15
