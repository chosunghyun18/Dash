# Dash 관리자 웹 (admin-web)

Dash 운영 관리 콘솔. 앱(FE)·소셜 로그인과 **완전 분리**된 관리자 전용 웹.
설계 정본: `Obsidian Vault/Projects/MobileWork/dash/task/admin-dashboard-design.md`.

## 스택
- React 18 + TypeScript + **Vite**
- **Ant Design** v5 (한국어 로케일 `ko_KR`, 다크모드 미지원 — 제품 v1 정책 준용)
- **React Query**(서버 상태) · **Zustand**(세션, sessionStorage 유지)
- axios — 화면에서 직접 호출 금지, `services/` 경유만 (앱 FE 규칙 준용)

## 구조
```
src/
  config.ts            API 베이스 URL·버전
  rbac.ts              AdminRole 위계(SUPER_ADMIN>OPERATOR>VIEWER) + hasRole
  nav.ts               사이드바 IA(메뉴별 minRole)
  services/
    api.ts             axios 인스턴스(X-API-Version + Bearer + 401 자동 refresh 1회)
    adminAuth.ts       /api/admin/auth (login·me)
  stores/authStore.ts  세션(access/refresh/admin) — sessionStorage
  routes/ProtectedRoute.tsx  인증 가드(+ /me 하이드레이트)
  components/AppLayout.tsx    사이드바 GNB + 헤더(이름·역할배지·로그아웃)
  features/
    auth/LoginPage.tsx        중앙 카드 id/pw 로그인
    dashboard/DashboardPage.tsx  랜딩(스탯 타일 자리표시자)
    common/PlaceholderPage.tsx   후속 화면 자리표시자
```

## 실행
```bash
npm install
npm run dev        # http://localhost:5173
```
BE(`dash/BE`)를 `local` 프로파일로 띄우고(:8080, CORS localhost:* 허용됨),
로컬 dev 관리자 계정으로 로그인: **`super` / `dashadmin!23`** (BE `db/seed/V901`, local 전용).

```bash
npm run build      # tsc --noEmit + vite build → dist/
npm run typecheck  # 타입만 검사
```

## 현황 (2026-07-08)
- ✅ P0 뼈대: 로그인 → 세션 → 사이드바 레이아웃 + RBAC 메뉴 가시성 + 대시보드/스텁 라우팅. `tsc`·`vite build` green, dev 서버 서빙 확인.
- ⬜ 후속: 앱 버전 정책 관리 화면(§9), 회원 관리(§5), 대시보드 지표 API 연동(§4), 공통 테이블/필터 컴포넌트, 쓰기 액션 확인 모달+사유(감사 로그).
- ⬜ 배포: docker-compose 에 admin 정적 웹(nginx) 서비스 추가(설계 §1).
