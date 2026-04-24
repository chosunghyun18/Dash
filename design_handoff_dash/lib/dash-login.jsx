// Dash Login — Apple / Google 만 지원
// - 소셜 로그인 2개만 (카카오 제거)
// - 깔끔한 중앙 정렬 구성, 브랜드 히어로를 위에, 버튼을 아래에
// - Apple을 상단(iOS 기본 권장), Google을 하단 — 플랫폼별 순서는 OS prop으로 조정
// - 검정 Apple 버튼 + 흰색 Google 버튼으로 시각적 위계 명확

// ─────────────────────────────────────────────────────────────
// Logos
// ─────────────────────────────────────────────────────────────
const AppleLogo = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const GoogleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.8 3l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5a19.5 19.5 0 1 0 0 39c10.7 0 19.5-7.8 19.5-19.5 0-1.3-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8a12 12 0 0 1 11.1-7.5c3 0 5.7 1.1 7.8 3l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5a19.5 19.5 0 0 0-17.7 10.2z"/>
    <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-2 13.2-5.2l-6.1-5.1c-2 1.4-4.5 2.3-7.1 2.3-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.1 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Brand mark
// ─────────────────────────────────────────────────────────────
function DashMark({ size = 'lg' }) {
  const t = useDashTokens();
  const m = size === 'lg' ? { box: 64, radius: 20, icon: 32, gap: 14, text: 32 } : { box: 44, radius: 14, icon: 22, gap: 10, text: 22 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: m.gap }}>
      <div style={{
        width: m.box, height: m.box, borderRadius: m.radius,
        background: `linear-gradient(135deg, ${t.primary} 0%, #FF7A8E 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 14px 30px rgba(255,75,110,0.35)',
      }}>
        <svg width={m.icon} height={m.icon} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d="M12 21s-8-5.5-8-11.5a5 5 0 019-3 5 5 0 019 3C20 15.5 12 21 12 21z"/>
        </svg>
      </div>
      <span style={{
        fontSize: m.text, fontWeight: 800, color: t.primary,
        letterSpacing: -1,
      }}>
        Dash
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Social auth button
// ─────────────────────────────────────────────────────────────
function SocialAuthButton({ provider, label, icon, onClick, theme }) {
  const t = useDashTokens();
  const [pressed, setPressed] = React.useState(false);
  const dark = theme === 'dark';
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label={`${label}로 계속하기`}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '15px 18px',
        background: dark ? '#000' : '#fff',
        color: dark ? '#fff' : t.text,
        border: dark ? '1px solid #000' : `1px solid ${t.border}`,
        borderRadius: 12,
        fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: -0.3,
        cursor: 'pointer',
        boxShadow: pressed
          ? 'inset 0 2px 6px rgba(0,0,0,0.12)'
          : (dark ? '0 6px 16px rgba(0,0,0,0.18)' : '0 2px 6px rgba(0,0,0,0.04)'),
        transform: pressed ? 'translateY(1px)' : 'translateY(0)',
        transition: 'transform .08s, box-shadow .12s',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Login Screen
// ─────────────────────────────────────────────────────────────
function ScreenLogin({ onAppleLogin, onGoogleLogin, os = 'ios' }) {
  const t = useDashTokens();

  // iOS에선 Apple을 위에 (Apple 가이드라인), Android는 Google을 위에
  const buttons = os === 'android'
    ? [
        { provider: 'google', label: 'Google로 계속하기', icon: <GoogleLogo size={20} />, onClick: onGoogleLogin, theme: 'light' },
        { provider: 'apple', label: 'Apple로 계속하기', icon: <AppleLogo size={20} color="#fff" />, onClick: onAppleLogin, theme: 'dark' },
      ]
    : [
        { provider: 'apple', label: 'Apple로 계속하기', icon: <AppleLogo size={20} color="#fff" />, onClick: onAppleLogin, theme: 'dark' },
        { provider: 'google', label: 'Google로 계속하기', icon: <GoogleLogo size={20} />, onClick: onGoogleLogin, theme: 'light' },
      ];

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
      background: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* 배경 그라데이션 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(130% 75% at 50% 0%, ${t.primarySoft} 0%, #fff 60%)`,
        pointerEvents: 'none',
      }} />
      {/* 배경 블러 원 */}
      <div style={{
        position: 'absolute', top: 40, left: -50,
        width: 180, height: 180,
        background: t.primary, opacity: 0.07,
        borderRadius: '50%', filter: 'blur(32px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 140, right: -60,
        width: 220, height: 220,
        background: '#FFB1C0', opacity: 0.2,
        borderRadius: '50%', filter: 'blur(44px)',
        pointerEvents: 'none',
      }} />

      {/* 컨텐츠 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '0 28px',
        position: 'relative', zIndex: 1,
        minHeight: 0,
      }}>
        {/* Hero — 중앙 정렬, 브랜드 정체성 강조 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
          <DashMark size="lg" />
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: 26, fontWeight: 800, color: t.text,
              letterSpacing: -1, lineHeight: 1.25,
            }}>
              믿고 가는<br/>
              <span style={{ color: t.primary }}>지인의 소개</span>
            </div>
            <div style={{
              fontSize: 14, color: t.textMuted, lineHeight: 1.6,
              letterSpacing: -0.2,
            }}>
              친구가 직접 등록한 사람들과 만나보세요
            </div>
          </div>
        </div>

        {/* 로그인 버튼 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 14 }}>
          {buttons.map((b) => (
            <SocialAuthButton key={b.provider} {...b} />
          ))}
        </div>

        {/* 개인정보 안내 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontSize: 12, color: t.textFaint, letterSpacing: -0.1,
          marginBottom: 14,
        }}>
          <Icon.lock size={11} />
          <span>연락처와 프로필은 매칭 수락 후에만 공개돼요</span>
        </div>

        {/* 하단 약관 */}
        <div style={{
          padding: os === 'ios' ? '0 0 28px' : '0 0 18px',
          textAlign: 'center',
          fontSize: 11, color: t.textFaint,
          letterSpacing: -0.1, lineHeight: 1.6,
        }}>
          계속하면{' '}
          <span style={{ color: t.text, textDecoration: 'underline', textUnderlineOffset: 2 }}>이용약관</span>
          {' · '}
          <span style={{ color: t.text, textDecoration: 'underline', textUnderlineOffset: 2 }}>개인정보처리방침</span>
          에<br/>동의하는 것으로 간주됩니다
        </div>
      </div>
    </div>
  );
}

// Export to window
Object.assign(window, {
  ScreenLogin,
});
