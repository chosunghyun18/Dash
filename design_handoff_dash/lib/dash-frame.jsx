// Generic mobile frame used for both iOS & Android variants of Dash.
// Keeps it minimal — Dash's UI itself is the star.

function PhoneFrame({
  children, width = 390, height = 780, os = 'ios', dark = false,
  noRadius = false,
}) {
  const radius = noRadius ? 0 : (os === 'ios' ? 48 : 36);
  const border = os === 'ios' ? '1px solid rgba(0,0,0,0.12)' : '6px solid #1b1b1b';
  return (
    <div style={{
      width, height, borderRadius: radius, overflow: 'hidden',
      background: dark ? '#000' : '#fff',
      boxShadow: '0 30px 70px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
      fontFamily: '"Pretendard", "Pretendard Variable", -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
      WebkitFontSmoothing: 'antialiased',
      position: 'relative',
      border,
      boxSizing: 'border-box',
    }}>
      {os === 'ios' && !noRadius && (
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 50,
        }} />
      )}
      {os === 'android' && !noRadius && (
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 10, height: 10, borderRadius: '50%', background: '#000', zIndex: 50,
        }} />
      )}
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {/* home indicator / gesture bar */}
      {!noRadius && (
        <div style={{
          position: 'absolute', bottom: os === 'ios' ? 7 : 6, left: '50%', transform: 'translateX(-50%)',
          width: os === 'ios' ? 134 : 108, height: os === 'ios' ? 5 : 4, borderRadius: 100,
          background: 'rgba(0,0,0,0.28)', zIndex: 60, pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

function PhoneStatusBar({ dark = false, os = 'ios' }) {
  const c = dark ? '#fff' : '#000';
  if (os === 'android') {
    return (
      <div style={{
        height: 36, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 22px 0 20px',
        fontSize: 13, fontWeight: 500, color: c, flexShrink: 0,
      }}>
        <span>9:30</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill={c}><path d="M1 8.5L6.5 2.5c.3-.3.7-.3 1 0L13 8.5c.5.5.1 1.3-.5 1.3H1.5c-.6 0-1-.8-.5-1.3z" opacity="0.9"/></svg>
          <svg width="16" height="10" viewBox="0 0 16 10" fill={c}><rect x="0" y="7" width="3" height="3" rx="0.5"/><rect x="4" y="5" width="3" height="5" rx="0.5"/><rect x="8" y="2.5" width="3" height="7.5" rx="0.5"/><rect x="12" y="0" width="3" height="10" rx="0.5"/></svg>
          <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="19" height="9" rx="2" fill="none" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="6" rx="1" fill={c}/><rect x="20" y="3.5" width="1.5" height="3" rx="0.5" fill={c}/></svg>
        </div>
      </div>
    );
  }
  // iOS
  return (
    <div style={{
      height: 48, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 28px',
      fontFamily: '-apple-system, "SF Pro", system-ui', color: c,
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>9:41</span>
      <div style={{ width: 120 }} />
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={c}><path d="M8 2.8c2.2 0 4.2.8 5.6 2.3l1-1A8.8 8.8 0 008 1.4 8.8 8.8 0 001.4 4l1 1C3.8 3.6 5.8 2.8 8 2.8z"/><path d="M8 6c1.3 0 2.4.5 3.3 1.3l1-1A6 6 0 008 4.6 6 6 0 003.7 6.3l1 1C5.6 6.5 6.7 6 8 6z"/><circle cx="8" cy="9.5" r="1.5"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="18" height="8" rx="2" fill={c}/><rect x="22.5" y="3.5" width="1.5" height="5" rx="0.5" fill={c}/></svg>
      </div>
    </div>
  );
}

function TabBar({ active, onChange, os = 'ios' }) {
  const t = useDashTokens();
  const tabs = [
    { id: 'home', label: '홈', icon: Icon.home, iconFill: Icon.homeFill },
    { id: 'mypage', label: '마이페이지', icon: Icon.user, iconFill: Icon.userFill },
  ];
  return (
    <div style={{
      borderTop: `1px solid ${t.border}`,
      background: '#fff',
      display: 'flex',
      paddingTop: 8,
      paddingBottom: os === 'ios' ? 26 : 14,
      flexShrink: 0,
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const IconComp = isActive ? tab.iconFill : tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange && onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '6px 0',
              color: isActive ? t.primary : '#BFBFBF',
              fontFamily: 'inherit',
            }}
          >
            <IconComp size={24} />
            <span style={{
              fontSize: 11, fontWeight: isActive ? 700 : 500,
              letterSpacing: -0.3, whiteSpace: 'nowrap',
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Back-button header (used on profile detail, friends-of-friend, edit)
function NavHeader({ title, onBack, right, os = 'ios', bg = '#fff' }) {
  const t = useDashTokens();
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center',
      padding: '0 8px 0 8px',
      background: bg,
      borderBottom: bg === '#fff' ? `1px solid ${t.border}` : 'none',
      flexShrink: 0,
    }}>
      <button
        onClick={onBack}
        style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer', color: t.text,
          padding: 0,
        }}
      >
        <Icon.chevronLeft size={22} />
      </button>
      <div style={{
        flex: 1, textAlign: 'center',
        fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: -0.3,
      }}>{title}</div>
      <div style={{ width: 40, minWidth: 40, display: 'flex', justifyContent: 'flex-end', paddingRight: 6 }}>
        {right}
      </div>
    </div>
  );
}

Object.assign(window, { PhoneFrame, PhoneStatusBar, TabBar, NavHeader });
