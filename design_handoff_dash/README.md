# Handoff: Dash (지인 네트워크 소개팅 앱)

> **React Native (iOS/Android)** 앱을 위한 하이파이 디자인 핸드오프 패키지.

---

## Overview

**Dash**는 "믿고 가는 지인의 소개"를 핵심 가치로 하는 **지인 네트워크 기반 소개팅 앱**입니다. 사용자는 본인의 친구가 등록한 지인 목록 중에서 관심 있는 사람에게 "연락 요청"을 보내고, 수락되면 서로의 연락처가 공개되는 구조입니다.

- **플랫폼**: iOS / Android (React Native 권장)
- **언어**: 한국어 전용 (다크 모드 미지원)
- **인증**: Apple / Google 소셜 로그인 (자체 회원가입, 카카오, 이메일/비밀번호 없음)
- **핵심 플로우**:
  0. 로그인 (Apple 또는 Google) → 최초 진입 시 프로필 초기 설정
  1. 홈 → 친구의 지인 리스트 → 프로필 상세 → 연락 요청
  2. 마이페이지 → 받은 요청 확인 → 수락/거절
  3. 마이페이지 → 프로필 수정 → 저장

---

## About the Design Files

이 번들의 `Dash App Design.html` 및 `lib/*.jsx` 파일들은 **디자인 레퍼런스**입니다.
React 컴포넌트 형태로 구현되어 있지만, 이는 웹에서 하이파이 시안을 실시간으로 보여주기 위한 프로토타입일 뿐, **그대로 프로덕션 코드로 복사하지 말아주세요.**

작업 방식:
- 이미 React Native 프로젝트가 있다면, 해당 프로젝트의 기존 컴포넌트 라이브러리/패턴을 활용해 디자인을 **재현**해주세요 (예: `TouchableOpacity`, `FlatList`, `SafeAreaView` 등).
- 프로젝트가 아직 없다면 **React Native + TypeScript**로 새로 구성하는 것을 권장합니다.
- 폰트는 **Pretendard**를 React Native에 설치하여 사용 (`react-native-pretendard` 또는 커스텀 폰트 등록).
- 아이콘은 SVG 기반 라이브러리(`react-native-svg` + `lucide-react-native` 등) 사용을 권장합니다.

---

## Fidelity

**High-fidelity (하이파이)** — 최종 컬러, 타이포, 간격, 모서리 라운드까지 픽셀 단위로 정의되어 있습니다. 시각적으로는 이 시안을 충실히 재현하되, 인터랙션은 React Native의 네이티브 플랫폼 관습(iOS 백 스와이프, Android 하드웨어 뒤로가기 등)을 따라주세요.

---

## Design Tokens

### Colors

| Token | Value | 용도 |
|---|---|---|
| `primary` | `#FF4B6E` | 메인 핑크/코랄 — CTA, 브랜드 |
| `primarySoft` | `#FFF5F7` | 연분홍 서브 — 프로필 히어로 배경, 강조 카드 |
| `accept` | `#52C41A` | 수락 버튼 · 성공 상태 |
| `acceptSoft` | `#F0F9EB` | 수락 완료 카드 배경 |
| `reject` | `#F5F5F5` (bg) / `#595959` (fg) | 거절 버튼 |
| `text` | `#1A1A1A` | 본문 |
| `textMuted` | `#666666` | 보조 텍스트 |
| `textFaint` | `#999999` | 힌트 · 캡션 |
| `border` | `#F0EEEE` | 구분선 · 카드 테두리 |
| `bg` | `#FFFFFF` | 기본 배경 |
| `bgSoft` | `#FAFAFA` | 섹션 배경 (마이페이지 등) |

### Status Badge Colors

| 상태 | bg | fg | dot |
|---|---|---|---|
| PENDING (대기중) | `#FFF7E6` | `#D46B08` | `#FA8C16` |
| ACCEPTED (수락됨) | `#F0F9EB` | `#389E0D` | `#52C41A` |
| REJECTED (거절됨) | `#F5F5F5` | `#8C8C8C` | `#BFBFBF` |

### Avatar Palette (6색, 닉네임 해시로 자동 할당)

`#FF4B6E`, `#FF7A45`, `#FFAA00`, `#52C41A`, `#1890FF`, `#7B5CFA`

결정 방식: 닉네임 문자 코드 누적 해시(31진수) % 6 → 팔레트 인덱스. 같은 닉네임은 항상 같은 색.

```js
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}
```

### Typography

- **Family**: Pretendard Variable (fallback: `-apple-system`, `Apple SD Gothic Neo`, `Noto Sans KR`, system-ui)
- **Smoothing**: `-webkit-font-smoothing: antialiased`
- **Letter-spacing**: 한글에 맞춰 거의 모든 텍스트에 `-0.1 ~ -0.5` 사이의 음수값 적용

| Role | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| 브랜드 로고 "Dash" | 28px | 800 | -0.8 | 1.1 |
| 화면 타이틀 (마이페이지) | 20px | 800 | -0.5 | — |
| 프로필 이름 (상세) | 22px | 800 | -0.5 | — |
| 섹션 헤딩 | 16px | 700 | -0.3 | — |
| 리스트 아이템 이름 | 15px | 700 | -0.3 | 1.2 |
| 본문 (bio) | 14px | 400 | -0.2 | 1.7 |
| 캡션 / 힌트 | 12–13px | 400–500 | -0.1 ~ -0.2 | 1.5 |
| 뱃지 | 11px | 600 | -0.1 | 1.4 |
| 탭 라벨 | 11px | 500–700 | -0.3 | — |

### Spacing & Radius

- **Base radius**: `14px` (버튼, 인풋, 카드)
- 프로필 카드, 카드 컨테이너: `radius + 2` = 16px
- 세그먼트 컨트롤 내부: `radius - 2` = 12px
- Pill (뱃지, 태그): `999px`
- Avatar: `50%` (원형)
- Shadow (카드): `0 30px 70px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)` (프레임 레벨)
- Shadow (히어로 아바타): `0 8px 24px rgba(255,75,110,0.25)` + `4px solid #fff` 테두리

### Mobile Safe Area

- **iOS 하단 인셋**: 24px (홈 인디케이터)
- **Android 하단 인셋**: 14px (제스처 바)
- 탭바 위쪽 패딩: 8px, 하단 패딩은 OS별로 위 값 사용

---

## Dash+ (유료 멤버십)

**가설**: 무료 회원은 지인의 지인(2촌)까지 탐색 가능. **유료(Dash+) 회원은 지인의 지인의 지인(3촌)까지** 프로필 상세 확인 및 연락 요청 가능.

### Gating Rules

| Hop | 라벨 | 무료 | Dash+ |
|---|---|---|---|
| **1촌** | 내 지인 | 직접 소개 (등록 플로우) | 동일 |
| **2촌** | 친구의 지인 | ✅ 프로필 열람 + 요청 | ✅ |
| **3촌** | 친구의 친구의 지인 | 🔒 잠금 · 블러 + 업셀 | ✅ 열람 + 요청 |

### UI Patterns

- **홈 필터 탭**: `전체 / 2촌 / 3촌 🔒` — 무료에게 `🔒` 표시, 탭 시 페이월 시트.
- **카드 블러**: 3촌 카드는 무료에게 `filter: blur(6px) + opacity(0.6)`, 우상단 `Dash+` 배지.
- **페이월 시트** (`ScreenUpgrade`): 바텀 시트, 가치 제안 3가지 + 가격 + `업그레이드` CTA.
- **3촌 경로**: 열람 가능한 3촌 프로필은 "친구 → 친구 → OOO" 경로 표시 (`via`).
- **마이페이지 Plus 카드**: 활성 시 보라 그라디언트 배너 (`Dash+ 이용 중` + 다음 결제일).

### New Tokens

| Token | Value | 용도 |
|---|---|---|
| `plusAccent` | `#7C4DFF` | Dash+ 보라 — 배지, 그라디언트 |
| `plusGradient` | `linear-gradient(135deg, #7C4DFF 0%, #9B7EFF 100%)` | Plus 배너 배경 |
| `lockOverlay` | `rgba(255,255,255,0.55)` | 잠긴 카드 오버레이 |

### State & API

```ts
user: {
  plan: 'free' | 'plus',
  plusUntil?: ISODate,
}
connection: {
  hop: 2 | 3,
  via: string,  // "김친구 → 이지인" or "김친구 → 박지인 → 최지인"
}
```

- `GET /connections?hop=2` — 무료 가능
- `GET /connections?hop=3` — 무료는 403 (미리보기 카운트만)
- `POST /billing/plus/checkout` — 결제 연동

---

## Authentication

**Apple 로그인 + Google 로그인만 지원합니다.** 이메일/비밀번호, 카카오, 네이버, 전화번호 인증 등은 구현 범위에 포함하지 않습니다.

### Provider 결정

| Platform | 1순위 | 2순위 | 비고 |
|---|---|---|---|
| iOS | Apple | Google | Apple App Store 심사 정책상, 다른 소셜 로그인을 제공하는 앱은 Apple 로그인도 반드시 제공해야 함 |
| Android | Google | Apple | Android에서도 Apple 로그인 제공 — 일관된 크로스플랫폼 식별자 |

### Implementation

- **iOS**: `@invertase/react-native-apple-authentication` (Sign in with Apple) + `@react-native-google-signin/google-signin`
- **Android**: `@invertase/react-native-apple-authentication` (web flow 사용) + `@react-native-google-signin/google-signin`
- 백엔드: OAuth provider가 반환한 `identityToken` (Apple) / `idToken` (Google)을 서버로 POST → 서버에서 검증 후 자체 세션 발급

### State & API

```ts
// Session
auth: {
  status: 'unauthenticated' | 'authenticating' | 'authenticated',
  provider?: 'apple' | 'google',
  userId?: string,
  accessToken?: string,
}

// Me (로그인 후)
me: {
  nickname, contactType, contact, bio,
  provider: 'apple' | 'google',
  providerSub: string,  // Apple sub or Google sub
  email?: string,       // Apple은 첫 로그인에만 제공됨 (캐시 필수)
}
```

- `POST /auth/apple` — body: `{ identityToken, authorizationCode, fullName?, email? }`
- `POST /auth/google` — body: `{ idToken }`
- 응답: `{ accessToken, refreshToken, isNewUser: boolean, me }`
- `isNewUser: true` → 앱에서 프로필 초기 설정 화면으로 이동 (닉네임, 연락처, bio 입력)
- `isNewUser: false` → 홈으로 이동

### Apple 주의사항

- Apple은 `email`과 `fullName`을 **최초 인증 1회만** 반환합니다. 클라이언트에서 반드시 서버로 전송하고, 서버에서 `providerSub`에 묶어 영구 저장해야 합니다.
- 사용자가 "이메일 숨기기"를 선택하면 `@privaterelay.appleid.com` 릴레이 주소가 내려옴 — 정상으로 처리.
- Sign in with Apple은 **logout 시 token revoke API 호출 필수** (App Store 심사 체크 항목).

### Session Persistence

- `accessToken`은 Keychain (iOS) / Encrypted SharedPreferences (Android)에 저장.
- 앱 실행 시 토큰 존재 여부 → 자동 재인증 → 홈으로 직행.
- 토큰 없음 / 만료 → 로그인 화면.

---

## Screens

### 0. 로그인 (Login)

- **위치**: 세션 없을 때 앱 최초 진입
- **목적**: Apple 또는 Google 계정으로 서비스 시작
- **레이아웃**:
  - 배경: `primarySoft`(핑크)에서 흰색으로 향하는 라디얼 그라데이션 + 흐린 블러 원 2개 (장식, 과하지 않게)
  - 중앙 히어로 (수직 센터 정렬):
    - Dash 브랜드 마크: 64×64 gradient 박스 (primary → `#FF7A8E`) + 흰색 heart 아이콘, 그림자 `0 14px 30px rgba(255,75,110,0.35)`
    - "Dash" 워드마크 (32/800/primary, letter-spacing -1)
    - 메인 카피 (26/800, letter-spacing -1, line-height 1.25):
      - "믿고 가는" (text 컬러)
      - "지인의 소개" (primary 컬러)
    - 서브 카피 (14/textMuted, letter-spacing -0.2, line-height 1.6): "친구가 직접 등록한 사람들과 만나보세요"
  - 하단 버튼 영역 (gap 10):
    - **iOS**: Apple 버튼 (상단, 검정) → Google 버튼 (하단, 흰색)
    - **Android**: Google 버튼 (상단, 흰색) → Apple 버튼 (하단, 검정)
  - 개인정보 안내 (12/textFaint): 🔒 "연락처와 프로필은 매칭 수락 후에만 공개돼요"
  - 하단 약관 (11/textFaint, 센터 정렬): "계속하면 **이용약관** · **개인정보처리방침**에 동의하는 것으로 간주됩니다"
    - iOS 하단 여백 28px, Android 18px
- **버튼 스펙** (둘 다 width 100%, padding `15 18`, radius 12, 15/600, letter-spacing -0.3):
  - **Apple**: bg `#000`, fg `#fff`, 그림자 `0 6px 16px rgba(0,0,0,0.18)`, Apple 로고(20px, 흰색)
  - **Google**: bg `#fff`, fg `text`, border `1px solid ${border}`, 그림자 `0 2px 6px rgba(0,0,0,0.04)`, 컬러 Google 로고(20px)
- **프레스 피드백**: `translateY(1px)` + `inset 0 2px 6px rgba(0,0,0,0.12)` box-shadow
- **빈 상태 / 에러**:
  - OAuth 취소 → 조용히 원상복귀 (토스트 없음)
  - 네트워크 에러 → 하단 토스트 "연결에 실패했어요. 다시 시도해주세요."
  - Apple/Google 계정 연동 실패 → 동일 토스트
- **신규 유저 분기**: 로그인 성공 후 서버 응답 `isNewUser: true` → 프로필 초기 설정 화면 (닉네임, 연락처, bio) — 기존 `ScreenProfileEdit`과 같은 폼을 "첫 프로필 만들기" 헤더로 재사용 권장

### 1. 홈 (Home)

- **위치**: 탭 1
- **목적**: 내 친구 목록을 보고, 각 친구의 지인에게 닿기
- **레이아웃**:
  - 헤더 (padding `20 20 14`):
    - "Dash" 로고 (28px/800, `#FF4B6E`)
    - 부제 "믿고 가는 지인의 소개" (13px, `textFaint`, nowrap)
  - 서브 헤더 (padding `0 20 10`):
    - 왼쪽: "내 친구 **N**" (숫자는 primary 컬러)
    - 오른쪽: 🔒 비공개 태그 (12px, `textFaint`)
  - 친구 리스트 (세로 스크롤):
    - 각 행: Avatar(46px) · 이름(15/700) + 관계 메모(12/faint) · \[프로필\] outline 버튼 · \[지인 목록\] primarySoft 버튼
    - 행 padding `12 10`, `gap: 12`, border-radius `14`
  - 하단 탭바
- **빈 상태**:
  - 원형 아이콘 컨테이너 72px (`primarySoft` bg, `primary` heart 아이콘 30px)
  - "아직 등록된 친구가 없어요" (16/700)
  - "친구를 추가하면 친구의 지인 중에서\n좋은 사람을 소개받을 수 있어요." (13/`textMuted`, line-height 1.6)
  - CTA: \[+ 친구 초대하기\] (primary)

### 2. 마이페이지 (MyPage)

- **위치**: 탭 2
- **목적**: 내 프로필 관리 + 받은/보낸 연락 요청 확인
- **레이아웃**:
  - 흰색 상단 영역:
    - "마이페이지" 타이틀 (20/800)
    - 프로필 카드 (`primarySoft` bg, radius 16): Avatar(56) + 닉네임 + bio 프리뷰 28자 + \[나를 소개합니다 수정\] outline 버튼
  - `bgSoft` 섹션 배경 시작
  - 세그먼트 컨트롤 (radius 14, border, padding 4, 흰색 bg):
    - \[받은 요청 N\] / \[보낸 요청 N\] — active는 primary bg + 흰 텍스트
  - 요청 리스트:
    - 각 카드 (`#fff`, radius 16, border, padding 14):
      - 상단 행: Avatar(44) · 이름(15/700) + 상태 뱃지 + via 텍스트("민수의 소개") · chevron
      - 이름 영역은 `min-width:0`, `overflow:hidden`, `text-overflow:ellipsis`로 뱃지 공간 보호
    - ACCEPTED일 때: 하단에 연락처 박스 (`acceptSoft` bg, radius 14, 📞 또는 ✉️ + 연락처, 초록색 텍스트)
- **빈 상태**: 탭별로 다른 카피 (받은: "받은 요청이 없어요", 보낸: "보낸 요청이 없어요")

### 3. 지인 리스트 (Connections)

- **네비 헤더**: ←  "지인 친구 리스트"  (42 높이 52, border-bottom)
- **상단 컨텍스트**: Avatar(36) + "민수님의 지인" / "총 N명"
- **리스트**:
  - 각 행 (radius 14, border, padding `14 12`):
    - Avatar(44) + 이름(15/700) + bio 프리뷰 22자(생략) + \[🔒 소개 보기\] primary 버튼
- **하단 유료 안내 박스** (리스트 아래):
  - `primarySoft` bg, radius 14, padding `12 14`
  - ✨ 아이콘 + "**소개 보기는 건당 1,900원이에요.**\n진짜 관심 있는 분만 열어보세요."
- **빈 상태**: "친구님이 아직 지인을 등록하지 않았어요"

### 4. 프로필 상세 (ProfileDetail) — 3가지 모드

- **네비 헤더**: ←  "프로필" (배경은 `primarySoft`로 히어로와 연결)
- **히어로 영역** (`primarySoft` bg, padding `8 20 36`):
  - Avatar 120px, 4px 흰 테두리, 그림자 `0 8px 24px rgba(255,75,110,0.25)`
  - 이름 (22/800)
  - 소개 경로 pill: `rgba(255,255,255,0.7)` bg, primary 텍스트, ♡ + "민수의 소개"
- **Bio**:
  - 섹션 라벨 "나를 소개합니다" (11/700/primary, uppercase, letter-spacing 0.4)
  - 본문 (14/400, line-height 1.7, `pre-line`)
- **액션 바** (하단 고정, 흰색 bg, border-top):
  - **Mode: normal** — `[♡ 연락 요청하기]` primary lg, 100% width
  - **Mode: accept** — `[거절]` reject lg (flex: 1) + `[✓ 수락하기]` accept lg (flex: 2)
  - **Mode: accepted** — 히어로 하단에 연락처 카드 (`acceptSoft` bg, `#B7EB8F` border, radius 16):
    - "✓ 연락이 수락되었어요" (12/700/`#389E0D`)
    - 흰색 이너 박스에 📞/✉️ + 연락처 (15/700)
    - 액션 바는 disabled secondary "이미 연락처를 공유했어요"
  - **Mode: requested** — disabled secondary "✓ 요청을 보냈어요"

### 5. 프로필 수정 (ProfileEdit)

- **네비 헤더**: ←  "프로필 수정"  \[저장\] (우측 primary 텍스트 버튼 15/700)
- **필드 구조**: 라벨(13/700) + 컨트롤 + 선택적 힌트(11/faint)
- **닉네임**:
  - input + \[중복 확인\] outline 버튼
  - 피드백 (6px margin-top, 12px):
    - idle: 없음
    - checking: "확인 중..."
    - ok: ✓ "사용 가능한 닉네임이에요" (`#389E0D`)
    - dup: ✕ "이미 사용 중인 닉네임이에요" (`#CF1322`)
- **연락처**:
  - 타입 토글 (2-segment pill, radius 14): `[📞 휴대폰]` / `[✉️ 이메일]` (active는 `primarySoft` bg + primary border/text)
  - input (placeholder가 타입에 따라 변경)
  - 힌트: "수락한 상대에게만 공개됩니다"
- **나를 소개합니다**:
  - textarea height 140, resize none, line-height 1.5, max 500자
  - 우측 하단 카운터: `N / 500` — 450 초과 시 주황(`#D46B08`)
- **Input 스타일 공통**: 흰색 bg, `border: 1px solid #F0EEEE`, radius 14, padding `11 14`, 14px 텍스트

---

## Components

### SocialAuthButton (Login 전용)
- Width 100%, padding `15 18`, radius 12
- Font 15/600, letter-spacing -0.3, gap 10
- Variants:
  - `dark` (Apple): bg `#000`, fg `#fff`, shadow `0 6px 16px rgba(0,0,0,0.18)`
  - `light` (Google): bg `#fff`, fg `text`, border `1px solid border`, shadow `0 2px 6px rgba(0,0,0,0.04)`
- Press: `translateY(1px)` + inset shadow
- Props: `provider` (`'apple' | 'google'`), `label`, `icon`, `onClick`, `theme` (`'dark' | 'light'`)

### DashMark (Login 전용)
- Size `lg`: 64×64 gradient box (radius 20), icon 32px, wordmark 32/800
- Size `md`: 44×44 box (radius 14), icon 22px, wordmark 22/800 — 다른 화면(헤더 등)에서 재사용 가능
- Gradient: `linear-gradient(135deg, ${primary} 0%, #FF7A8E 100%)`
- Shadow: `0 14px 30px rgba(255,75,110,0.35)` (lg) / `0 8px 20px rgba(255,75,110,0.32)` (md)

### Avatar
- 원형, `background: avatarColor(name)`, 흰 텍스트 `font-weight: 600`, 텍스트 크기는 `size * 0.42`
- Prop: `name`, `size` (default 44)

### StatusBadge
- `display: inline-flex`, gap 5, padding `3 9`, radius 999, **whiteSpace: nowrap, flexShrink: 0**
- 좌측에 5px 원형 dot
- Prop: `status` ∈ `PENDING | ACCEPTED | REJECTED`

### DashButton
- Variants: `primary` | `primarySoft` | `secondary` | `outline` | `reject` | `accept` | `ghost`
- Sizes: `sm` (height 32) / `md` (40) / `lg` (52)
- **whiteSpace: nowrap, flexShrink: 0** (긴 한글 버튼 라벨이 2줄로 쪼개지는 것 방지 — 필수)
- `block` prop으로 100% width
- mousedown 시 `scale(0.98)` 피드백

### TabBar (하단)
- `flex: 1` 컬럼, 아이콘(24) + 라벨(11)
- Active: icon fill + primary 컬러 + 라벨 weight 700
- Inactive: icon stroke + `#BFBFBF`

### NavHeader
- 높이 52, 좌측 40×40 back 버튼, 중앙 타이틀(16/700), 우측 40 영역(옵셔널 우측 버튼)

---

## Interactions & Behavior

- **로그인 플로우**:
  - 앱 실행 → 토큰 검사 → 있으면 홈, 없으면 로그인 화면
  - Apple/Google 버튼 탭 → 네이티브 OAuth 시트 → 성공 시 서버 검증 → `isNewUser` 판단
  - 신규: 프로필 초기 설정 폼 → 저장 → 홈
  - 기존: 바로 홈으로 이동
  - 로그아웃: 마이페이지 → 설정 → 로그아웃 (Apple 토큰 revoke 필수)
- **탭바**: 하단 고정, 스크롤 영향 받지 않음. 홈/마이페이지 간 즉시 스위치 (애니메이션 없음)
- **백 네비게이션**:
  - 지인 리스트/프로필 상세에서 ← 탭 → 이전 스크린
  - iOS: edge swipe 지원 권장
  - Android: 하드웨어 뒤로가기 지원
- **프로필 상세 진입점**:
  - 홈 → \[프로필\] → normal mode
  - 홈 → \[지인 목록\] → 지인 리스트 → \[소개 보기\] → normal mode
  - 마이페이지 → 받은 요청(PENDING) 탭 → accept mode
  - 마이페이지 → 받은/보낸 요청(ACCEPTED) 탭 → accepted mode
- **연락 요청 플로우**: normal → \[연락 요청\] 탭 → requested (disabled) 상태
- **수락 플로우**: accept → \[수락\] 탭 → accepted (연락처 공개) 상태
- **닉네임 중복 확인**: 버튼 탭 → 600ms 로딩 → ok / dup 결과
- **글자수 카운터**: input 시 500자 hard limit (`slice(0, 500)`)
- **버튼 프레스 피드백**: `transform: scale(0.98)` + 80ms transition
- **유료 "소개 보기"**: 실제 결제/권한 로직은 TBD — 현재는 탭 → 프로필 상세(normal)로 진입

---

## State Management

최소 상태 모델 (전역/리듀서로 들어올 후보들):

```ts
// Session
auth: {
  status: 'unauthenticated' | 'authenticating' | 'authenticated',
  provider?: 'apple' | 'google',
  accessToken?: string,
}

// Me (로그인 후)
me: {
  nickname, contactType: 'phone'|'email', contact, bio,
  provider: 'apple' | 'google', providerSub: string, email?: string,
}

// Friends (내가 등록한 지인 네트워크)
friends: Array<{ id, name, note }>

// 친구별 지인 목록
connections: Record<friendId, Array<{ id, name, bio }>>

// 받은/보낸 요청
receivedRequests: Array<{ id, name, bio, via, status: 'PENDING'|'ACCEPTED'|'REJECTED', contact? }>
sentRequests: Array<Same shape>
```

**State transitions**:
- `loginWithApple(identityToken)` / `loginWithGoogle(idToken)` → 서버 검증 → `auth.status = authenticated` + `me` 세팅
- `logout()` → 토큰 삭제 + Apple revoke (provider가 apple일 때) + `auth.status = unauthenticated`
- `sendRequest(personId)` → sent에 PENDING 추가
- `acceptRequest(reqId)` → received의 항목 status=ACCEPTED + contact 공개
- `rejectRequest(reqId)` → status=REJECTED
- `updateProfile(patch)` → me 병합 + 서버 PATCH

---

## Screenshots

각 화면의 미리보기는 `screenshots/` 폴더에서 확인할 수 있습니다. (캡처 도구의 뷰포트 제한으로 상단부만 보이지만, 각 화면의 첫인상과 주요 레이아웃을 파악하기에는 충분합니다. 전체 화면과 스크롤은 `Dash App Design.html`을 브라우저에서 열어서 확인해주세요.)

| 파일 | 화면 |
|---|---|
| `01-home.png` | 홈 (iOS) |
| `02-mypage.png` | 마이페이지 |
| `03-connections.png` | 지인 리스트 |
| `04a-profile-normal.png` | 프로필 상세 · 일반 모드 |
| `04b-profile-accept.png` | 프로필 상세 · 수락 모드 |
| `04c-profile-accepted.png` | 프로필 상세 · 수락 후 |
| `05-profile-edit.png` | 프로필 수정 |
| `06-home-empty.png` | 홈 · 빈 상태 |
| `07-connections-empty.png` | 지인 리스트 · 빈 상태 |
| `08-home-android.png` | 홈 (Android) |
| `09-mypage-android.png` | 마이페이지 (Android) |

---

## Files in this Bundle

```
design_handoff_dash/
├── README.md                    ← 이 파일
├── Dash App Design.html          ← 전체 시안 (브라우저에서 열기)
├── design-canvas.jsx             ← 캔버스 뷰어 (참고용)
└── lib/
    ├── dash-primitives.jsx       ← Avatar, StatusBadge, DashButton, Icon, 토큰, 모크 데이터
    ├── dash-frame.jsx            ← PhoneFrame, PhoneStatusBar, TabBar, NavHeader
    ├── dash-login.jsx            ← ScreenLogin, SocialAuthButton, DashMark (Apple/Google)
    └── dash-screens.jsx          ← 5개 화면 + 서브 컴포넌트
```

`Dash App Design.html`을 브라우저에서 열면 전체 화면을 캔버스에서 훑어볼 수 있고, 각 아트보드를 클릭하면 확대해서 볼 수 있습니다. 우측 하단 **Tweaks** 토글로 메인/서브 컬러와 모서리 라운드를 실시간으로 바꿔볼 수도 있어요.

---

## Mock Data

`lib/dash-primitives.jsx` 하단에 `MOCK_ME`, `MOCK_FRIENDS`, `MOCK_CONNECTIONS`, `MOCK_RECEIVED`, `MOCK_SENT` 형태로 실제 한국어 샘플 데이터가 들어있습니다. 초기 API 스키마나 테스트 픽스처로 활용 가능합니다.

---

## Assets & Icons

- **Icons**: 시안에서는 커스텀 인라인 SVG (Lucide 스타일 24×24 stroke-width 2). React Native에서는 `lucide-react-native`의 같은 이름 아이콘을 사용하는 것을 권장:
  - `Home`, `User`, `ChevronLeft`, `ChevronRight`, `Heart`, `Lock`, `Phone`, `Mail`, `Check`, `X`, `Sparkles`, `Plus`, `Search`, `Inbox`, `Send`
- **이미지**: 사용 없음 (아바타는 이니셜 + 컬러로 생성)
- **Pretendard 폰트**: https://github.com/orioncactus/pretendard — Variable 또는 Static weight 400/600/700/800 필요

---

## 질문 / 명확히 해야 할 것

- 친구 초대 플로우 (딥링크 공유? QR?) — 빈 상태 CTA 동작 미정
- "소개 보기" 결제 연동 방식 (IAP? 자체 크레딧?)
- 거절 시 사용자에게 알림 전송 여부
- 프로필 사진 업로드 지원 여부 (현재는 이니셜 기반만)
- 차단/신고 기능
- 로그인 후 신규 사용자 온보딩: 닉네임/연락처/bio를 한 화면에서 받을지, 단계별로 나눌지
- Apple "이메일 숨기기" 선택 시 알림 이메일 전달 정책
- 계정 탈퇴 (Apple App Store 필수 요건) 플로우 설계
