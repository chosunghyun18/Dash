---
name: ADR-FE-002
description: Dash+ 유료 멤버십 및 무한 hop 지인 네트워크 FE 구현 결정
type: project
date: 2026-06-11
---

# ADR-FE-002: Dash+ 멤버십 · 무한 hop 지인 네트워크

## 상황 (Context)

디자인 핸드오프(`design_handoff_dash/lib/*.jsx`)에 정의된 **Dash+ 유료 멤버십**과
**인스타그램 팔로우식 무한 hop 지인 네트워크**를 FE에 반영해야 했다.
초기에는 README 산문만 보고 "hop 필터 탭 + 바텀시트 페이월"로 추측 구현했으나,
원본 디자인 코드는 **브레드크럼 trail + 드릴다운 + 풀페이지 플랜 화면** 구조였다.

## 결정 (Decision)

### 1. 멤버십 상태 — 전역 스토어
`stores/membershipStore.ts`(Zustand)에 `plan: 'free' | 'plus'`, `plusUntil`,
`FREE_HOP_LIMIT = 2`, `DASH_PLUS_PRICE(9,900)/_YEARLY(99,000)`를 둔다.
실제 결제(`POST /billing/plus/checkout`)는 TBD — 현재는 `upgradeToPlus()`가
클라이언트 상태만 갱신한다.

### 2. 무한 hop 네트워크 — trail 기반
지인 목록은 단일 레벨이 아니라 **무한 깊이**다. 화면이 데이터가 아니라
**trail(루트 친구→현재 head 경로) 길이**로 촌수를 계산한다.
- `listHop = trail.length + 1`
- 라우팅: `/acquaintances/[userId]?trail=<JSON>` — 드릴다운 시 trail에 노드 push
- `friendService.getAcquaintances(userId)`는 노드별 지인 + `acquaintanceCount` 반환

### 3. 무료 게이팅 — `FREE_HOP_LIMIT = 2`
- 2촌: 무료 열람
- 3촌+: `LockedHopGate`(블러 아바타 + 업셀), 드릴다운 행 `Dash+` 배지,
  프로필 상세 소개글 가림 + Plus 게이트

### 4. 네이티브 의존성 회피 — svg + 오버레이
`expo-linear-gradient` / `expo-blur` 미설치. 새 네이티브 모듈 추가 대신
**이미 설치된 `react-native-svg`**로 처리한다.
- 그라디언트: `components/GradientBox.tsx`(svg `LinearGradient`)
- 블러: `lockOverlay`(반투명 흰색) + opacity + 텍스트 마스킹으로 대체

### 5. 디자인 토큰 — 원본 jsx 기준
README(`#7C4DFF` + gradient)가 아닌 **원본 lib 토큰**을 정본으로 삼는다.
`plusAccent #7B5CFA`, `plusAccentSoft #F4F0FF`. `PlusBadge`는 크라운 + "Plus".

## 결과 (Consequences)

### 긍정적
- 무한 깊이 탐색을 데이터 스키마 변경 없이 trail로 표현
- 새 네이티브 빌드 불필요 (svg 재사용) → Expo Go/EAS 빌드 영향 없음
- 디자인 정본을 lib jsx로 고정 → README-코드 불일치 재발 방지

### 부정적
- 진짜 가우시안 블러가 아니라 오버레이 근사 (디자인 `blur(6px)`과 미세 차이)
- trail을 쿼리 파라미터(JSON)로 직렬화 → URL 길이 증가
- 결제 연동 전까지 `upgradeToPlus()`는 목업 동작

## 검토한 대안
- **hop 평탄화(2촌+3촌 flatten) + 필터 탭**: 1차 추측안. 무한 깊이 표현 불가로 폐기.
- **expo-blur / expo-linear-gradient 추가**: 네이티브 재빌드 비용 → svg로 회피.
- **바텀시트 페이월**: 디자인은 풀페이지 플랜 화면(연/월 선택) → 풀페이지로 전환.

## 상태: Accepted
## 날짜: 2026-06-11
