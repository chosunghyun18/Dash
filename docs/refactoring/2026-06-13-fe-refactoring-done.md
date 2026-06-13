# FE 리팩터링 — 완료 작업

**작성일:** 2026-06-13
**범위:** FE 전체 (React Native + Expo)
**방향:** mock 데이터 단일화 + 레이어드 아키텍처(ADR-FE-001) 정리

---

## 1. Mock 데이터 단일 파일화 + API 토글

### 배경
`services/friend.ts`, `services/auth.ts` 에 mock 데이터가 하드코딩되어 있었고,
`const USE_MOCK = true` / `USE_MOCK_AUTH = true` 처럼 플래그가 코드에 박혀 있었다.

### 변경
| 구분 | 파일 | 내용 |
|------|------|------|
| 신설 | `config.ts` | `USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true'` 전역 토글 |
| 신설 | `mocks/index.ts` | 모든 mock 데이터(friends·acquaintances·profiles·contact·requests·my-profile·auth) + mock 구현(`friendMocks`, `authMocks`)을 한 곳에 통합 |
| 수정 | `services/friend.ts` | mock 데이터/로직 제거 → `if (USE_MOCK) return friendMocks.x(); else api.x()` |
| 수정 | `services/auth.ts` | 인라인 mock 제거, `USE_MOCK_AUTH` 삭제 후 공통 `USE_MOCK` 사용 |
| 수정 | `.env.example` | `EXPO_PUBLIC_USE_MOCK` 플래그 문서화 |

### 동작 모드
- **개발 모드**: `EXPO_PUBLIC_USE_MOCK=true` → `mocks/index.ts` 의 mock 반환
- **개발 및 운영 모드**: 미설정/`false`(기본값) → 항상 BE API 호출
- 기본값을 `false` 로 둬 운영 빌드에서 mock 이 실수로 켜지지 않도록 방지

---

## 2. 구조·아키텍처 정리

ADR-FE-001 의 레이어 규칙(`Presentation → Application → Data → Infrastructure`)을
실제 코드에 맞춰 정리.

### 2-1. 레이어 위반 수정 (화면 → services 직접 호출 제거)

| 흐름 | 변경 전 | 변경 후 |
|------|---------|---------|
| 인증 | `login.tsx` 가 `authService` 직접 호출 + 세션/라우팅 배선 | `hooks/useAuth.ts`(`useSocialLogin`) 로 이전 → 화면은 순수 UI |
| 초대 | `invite/[token].tsx` 가 `invitationService` 직접 호출 + 인라인 `useQuery/useMutation` | `hooks/useInvite.ts` 의 `useValidateInvitation`/`useAcceptInvitation` 로 이전 |

### 2-2. Infrastructure 레이어 정립 (`lib/`)

ADR 이 명시한 `lib/` 레이어가 없어 인프라 코드가 `services/` 에 섞여 있던 문제 해결.

| 구분 | 파일 | 내용 |
|------|------|------|
| 이동 | `services/storage.ts` → `lib/storage.ts` | MMKV/보안 저장소는 Data 가 아닌 Infrastructure |
| 신설 | `lib/trail.ts` | 지인 trail 인코딩/파싱 유틸 (`encodeTrail`·`trailFromNode`·`appendTrail`·`parseTrail`). index/acquaintances 의 중복 `JSON.stringify`/`parseTrail` 통합 |

### 2-3. 공통 컴포넌트 추출 (DRY)

| 구분 | 파일 | 내용 |
|------|------|------|
| 신설 | `components/ScreenLoader.tsx` | 4개 화면에 반복되던 `ActivityIndicator` + 중앙정렬 `View` + `styles.center` 패턴 통합 |

적용 화면: `(tabs)/index.tsx`, `profile/[userId].tsx`, `profile/edit.tsx`, `acquaintances/[userId].tsx`

---

## 검증
- `npx tsc --noEmit` 통과
- 미사용 import · 잔존 참조(`services/storage`, `USE_MOCK_AUTH` 등) 없음

## 의도적으로 제외한 항목
- **쿼리 키 중앙화**: `useSendContactRequest` 가 `['contact-requests']` 로 invalidate 하고
  쿼리는 `['contact-requests', 'sent']` 처럼 prefix 매칭에 의존 → 잘못 건드리면 캐시 무효화가
  깨질 위험이 있어 이번 범위에서 제외. (후속 작업 문서 참조)

## 영향받은 문서 (갱신 완료)
- `docs/CODEMAPS/frontend.md` — Architecture/Data/Infrastructure·Components 표 갱신 (lib/·mocks/·config.ts·ScreenLoader·useAuth·useInvite 반영)
- `memory/architecture.md` — FE 폴더 구조에 mocks/·lib/·config.ts 반영, services 목록에서 storage 제거
