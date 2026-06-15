# 기능: 인증 · Dash+ (보류, 미구현)

두 기능 모두 BE 미구현 상태이며 각각 블로커가 있다. 착수 전 결정 필요.

---

## 1. 인증 (Auth) — ❌ 보류 (모델 충돌)

API.md 명세:

| 메서드 | 경로 | 요청 | 응답 |
|--------|------|------|------|
| POST | `/api/v1/auth/signup` | `{ email, password, nickname }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/login` | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/api/v1/auth/refresh` | `{ refreshToken }` | `{ accessToken }` |
| POST | `/api/v1/auth/logout` | — | 204 |

### 블로커: 3자 불일치

| 소스 | 가정하는 인증 방식 |
|------|-------------------|
| `Member` 엔티티 | **kakaoId** (소셜 로그인) — password/email 컬럼 없음 |
| `docs/API.md` | **email / password** |
| FE (`useAuth`, architecture.md) | **Apple / Google** 소셜 로그인 |

→ email/password를 구현하려면 members 스키마 + 엔티티 변경 필요. 인증 방식을 먼저 확정해야 함.

### 이미 존재하는 인프라 (`global.security`)

- `JwtProvider` — access(24h)/refresh(7d) 토큰 생성·검증, subject=memberId
- `JwtAuthFilter`, `CustomUserDetailsService`, `SecurityConfig`(`/api/v1/auth/**` permitAll, `BCryptPasswordEncoder` 빈)
- 즉, 토큰 발급 토대는 있고 **로그인/가입 진입점(컨트롤러·자격검증)만 없음**

---

## 2. Dash+ 멤버십 / 결제 — ❌ 보류 (결제 TBD)

API.md 명세:

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/v1/users/me/membership` | `{ plan: 'free'\|'plus', plusUntil? }` |
| POST | `/api/v1/billing/plus/checkout` | Dash+ 구독 결제 (연/월) |

### 블로커

- members에 `plan`/`plusUntil` 컬럼 없음 → 멤버십 조회도 마이그레이션 필요
- 결제(PG) 연동이 TBD → checkout 실제 구현 불가
- FE는 반영 완료 (`stores/membershipStore`, `FREE_HOP_LIMIT=2`), 3촌+ 게이팅은 현재 클라이언트 처리

### 착수 시 작업

1. `V4__add_membership.sql` — members에 plan/plus_until 또는 별도 memberships 테이블
2. `GET /me/membership` 구현 (기본 free)
3. checkout은 PG 결정 후 — 또는 stub(즉시 plus 전환)으로 선개발

> 참고: `memory/adr/ADR-FE-002-dash-plus-membership.md`
