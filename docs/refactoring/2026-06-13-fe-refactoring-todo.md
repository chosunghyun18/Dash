# FE 리팩터링 — 후속 작업 (TODO)

**작성일:** 2026-06-13
**관련 문서:** [완료 작업](./2026-06-13-fe-refactoring-done.md)

2026-06-13 구조·아키텍처 정리에서 다루지 않은, 이어서 진행할 항목 목록.
우선순위: 🔴 높음 · 🟡 중간 · 🟢 낮음

---

## 🔴 1. 화면 내 비즈니스 로직 → 훅 추출

레이어 규칙상 화면(Presentation)은 순수 UI 여야 하나, 아직 분기/검증 로직이 남아 있음.

| 화면 | 위치 | 추출 대상 | 제안 훅 |
|------|------|-----------|---------|
| `profile/[userId].tsx` | mode 분기(`accept`·`accepted`·`requested`·`normal`) + sent 매칭 + acceptedInfo | 다단계 상태 계산 | `useContactRequestMode(userId, requestId)` |
| `profile/[userId].tsx` | `handleContactRequest`·`handleAccept`·`handleReject` (Alert + mutation) | 액션 핸들러 | `useContactActions(userId, requestId)` |
| `profile/edit.tsx` | 닉네임 중복확인 상태 + 저장 검증 체인(닉네임·중복·소개글) | 폼 상태/검증 | `useProfileForm(myProfile)` |
| `acquaintances/[userId].tsx` | `openIntro`·`drillDown`·`getPendingRequestId` 네비게이션 로직 | 네비게이션 헬퍼 | `useAcquaintanceNav(trail, listHop)` |

---

## 🟡 2. 쿼리 키 중앙화

**현재 위험요소:** invalidation 이 prefix 매칭에 의존.
- `useSendContactRequest`/`useAcceptContactRequest`/`useRejectContactRequest` → `invalidateQueries(['contact-requests'])`
- 실제 쿼리 키 → `['contact-requests', 'sent']`, `['contact-requests', 'received']`

**작업:** `hooks/queryKeys.ts` 로 키 팩토리 중앙화하되, **prefix 매칭 동작을 반드시 유지**.
```ts
export const qk = {
  contactRequests: {
    all: ['contact-requests'] as const,
    sent: ['contact-requests', 'sent'] as const,
    received: ['contact-requests', 'received'] as const,
  },
  // ...
};
```
변경 후 받은/보낸 요청이 수락·거절 시 즉시 갱신되는지 회귀 테스트 필수.

---

## 🟡 3. 공통 에러 처리 헬퍼

반복되는 `Alert.alert('오류', '잠시 후 다시 시도해주세요.')` 패턴이 여러 화면에 존재
(`profile/[userId].tsx`, `profile/edit.tsx`, `invite/[token].tsx`, `login.tsx`, `(tabs)/index.tsx`).

**작업:** `lib/alert.ts` 또는 `hooks/useToast` 류로 통합.
- `showError(message?)` — 표준 오류 토스트
- `confirm(title, message, onConfirm)` — 확인 다이얼로그
- 검증 알림(`닉네임을 입력해주세요` 등)도 일관된 헬퍼로

---

## ✅ 4. 코드맵/문서 갱신 — 완료 (2026-06-13)

- `docs/CODEMAPS/frontend.md` — Architecture/Data/Infrastructure·Components 표 갱신 완료
- `memory/architecture.md` — FE 폴더 구조 갱신 완료
- 이후 구조 변경 시 `/update-docs` 커맨드(doc-updater)로 일괄 갱신

---

## 🟢 5. 인증 placeholder 토큰 정리

`hooks/useAuth.ts` 의 `'mock-identity-token'`·`'mock-google-id-token'` 은 실제 SDK 연동 전 placeholder.
- Apple: `expo-apple-authentication` 연동 → 실제 `identityToken`/`authorizationCode` 획득
- Google: `@react-native-google-signin` 등 연동 → 실제 `idToken` 획득
- 연동 시 토큰 획득 로직 위치(훅 vs 별도 service) 결정 필요

---

## 🟢 6. mock 데이터 타입 동기화 점검

`mocks/index.ts` 의 데이터가 `types/index.ts` 및 BE 실제 응답 스키마와 일치하는지
API 연동 시점에 재검증 (특히 `via`, `contactPhone`/`contactEmail` 옵셔널 필드).
