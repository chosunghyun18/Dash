// Shared Dash primitives: Avatar, Badge, Button, Icons, mock data, design tokens.

const DASH_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#FF4B6E",
  "primarySoft": "#FFF5F7",
  "radius": 14,
  "isPlus": false,
  "freeHopLimit": 2
}/*EDITMODE-END*/;

// Mutable tokens: Tweaks panel updates these, screens read them.
const DashTokens = {
  primary: DASH_DEFAULTS.primary,
  primarySoft: DASH_DEFAULTS.primarySoft,
  radius: DASH_DEFAULTS.radius,
  accept: '#52C41A',
  acceptSoft: '#F0F9EB',
  text: '#1A1A1A',
  textMuted: '#666',
  textFaint: '#999',
  border: '#F0EEEE',
  bg: '#FFFFFF',
  bgSoft: '#FAFAFA',
  // Dash+ (유료 회원)
  isPlus: DASH_DEFAULTS.isPlus,
  freeHopLimit: DASH_DEFAULTS.freeHopLimit,
  plusAccent: '#7B5CFA',     // 보라 — Plus 브랜딩 컬러 (핑크와 구분)
  plusAccentSoft: '#F4F0FF',
};

const _subs = new Set();
function useDashTokens() {
  const [, set] = React.useState(0);
  React.useEffect(() => {
    const f = () => set((n) => n + 1);
    _subs.add(f);
    return () => _subs.delete(f);
  }, []);
  return DashTokens;
}
function setDashTokens(patch) {
  Object.assign(DashTokens, patch);
  _subs.forEach((f) => f());
}

// Avatar — color derived deterministically from nickname
const AVATAR_PALETTE = ['#FF4B6E', '#FF7A45', '#FFAA00', '#52C41A', '#1890FF', '#7B5CFA'];
function avatarColor(name) {
  if (!name) return AVATAR_PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function Avatar({ name, size = 44, style = {} }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 600, fontSize: size * 0.42,
      flexShrink: 0,
      ...style,
    }}>{initial}</div>
  );
}

// Status badge
function StatusBadge({ status }) {
  const map = {
    PENDING: { label: '대기중', bg: '#FFF7E6', fg: '#D46B08', dot: '#FA8C16' },
    ACCEPTED: { label: '수락됨', bg: '#F0F9EB', fg: '#389E0D', dot: '#52C41A' },
    REJECTED: { label: '거절됨', bg: '#F5F5F5', fg: '#8C8C8C', dot: '#BFBFBF' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      background: s.bg, color: s.fg,
      fontSize: 11, fontWeight: 600, letterSpacing: -0.1,
      lineHeight: 1.4, flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>
  );
}

// Button
function DashButton({
  children, variant = 'primary', size = 'md', block = false,
  onClick, disabled = false, style = {},
}) {
  const t = useDashTokens();
  const palettes = {
    primary: { bg: t.primary, fg: '#fff', border: 'transparent' },
    primarySoft: { bg: t.primarySoft, fg: t.primary, border: 'transparent' },
    secondary: { bg: '#F5F5F5', fg: '#333', border: 'transparent' },
    outline: { bg: '#fff', fg: t.text, border: t.border },
    reject: { bg: '#F5F5F5', fg: '#595959', border: 'transparent' },
    accept: { bg: t.accept, fg: '#fff', border: 'transparent' },
    ghost: { bg: 'transparent', fg: t.primary, border: 'transparent' },
  };
  const p = palettes[variant] || palettes.primary;
  const sizes = {
    sm: { pad: '7px 12px', fs: 13, h: 32 },
    md: { pad: '10px 16px', fs: 14, h: 40 },
    lg: { pad: '14px 20px', fs: 16, h: 52 },
  };
  const s = sizes[size] || sizes.md;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: s.pad, height: s.h,
        background: p.bg, color: p.fg,
        border: p.border === 'transparent' ? 'none' : `1px solid ${p.border}`,
        borderRadius: t.radius,
        fontFamily: 'inherit', fontSize: s.fs, fontWeight: 600, letterSpacing: -0.2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        width: block ? '100%' : 'auto',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform .08s, filter .15s',
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

// Icons (line, 24px default)
const Icon = {
  home: (p = {}) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V10z"/></svg>
  ),
  homeFill: (p = {}) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 24 24" fill="currentColor"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2V10z"/></svg>
  ),
  user: (p = {}) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></svg>
  ),
  userFill: (p = {}) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7H4z"/></svg>
  ),
  chevron: (p = {}) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5"/></svg>
  ),
  chevronLeft: (p = {}) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
  ),
  heart: (p = {}) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-8-5.5-8-11.5a5 5 0 019-3 5 5 0 019 3C20 15.5 12 21 12 21z"/></svg>
  ),
  lock: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
  ),
  phone: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L7.9 9.7a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/></svg>
  ),
  mail: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
  ),
  check: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
  ),
  close: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
  ),
  sparkle: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14zM5 14l.7 2 2 .7-2 .7L5 19.4l-.7-2-2-.7 2-.7L5 14z"/></svg>
  ),
  plus: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  search: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  inbox: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 5h14l3 7v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6l3-7z"/></svg>
  ),
  send: (p = {}) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
  ),
  // Plus (crown) — Dash+ 브랜딩 아이콘
  crown: (p = {}) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-7 5 7 4-3-2 12H5L3 8zm2 14h14v-2H5v2z"/></svg>
  ),
  users: (p = {}) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3 3-5 7-5s7 2 7 5"/><circle cx="17" cy="7" r="2.5"/><path d="M17 12c3 0 5 1.7 5 4"/></svg>
  ),
};

// Dash+ badge — 2 variants
function PlusBadge({ size = 'xs', variant = 'solid', style = {} }) {
  const t = useDashTokens();
  const sizes = {
    xs: { fs: 9, pad: '2px 5px', gap: 3, icon: 8, r: 4 },
    sm: { fs: 11, pad: '3px 7px', gap: 4, icon: 10, r: 5 },
    md: { fs: 12, pad: '4px 9px', gap: 4, icon: 12, r: 6 },
  };
  const s = sizes[size] || sizes.xs;
  const palette = variant === 'solid'
    ? { bg: t.plusAccent, fg: '#fff' }
    : { bg: t.plusAccentSoft, fg: t.plusAccent };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      padding: s.pad, borderRadius: s.r,
      background: palette.bg, color: palette.fg,
      fontSize: s.fs, fontWeight: 800, letterSpacing: 0.1,
      lineHeight: 1, flexShrink: 0,
      fontFamily: 'inherit',
      ...style,
    }}>
      <Icon.crown size={s.icon} />
      Plus
    </span>
  );
}

// Mock data (realistic Korean names/bios)
const MOCK_ME = {
  nickname: '수지',
  contact: 'suji0421@email.com',
  contactType: 'email',
  bio: '평일엔 스타트업에서 기획일 하고, 주말엔 러닝크루랑 한강 달려요. 좋아하는 카페 하나 정해두고 오래 앉아있는 걸 좋아해요. 비슷한 속도로 대화할 수 있는 사람을 찾고 있어요 :)',
};

const MOCK_FRIENDS = [
  { id: 'f1', name: '민수', note: '대학 동기' },
  { id: 'f2', name: '지은', note: '회사 동료' },
  { id: 'f3', name: '현우', note: '고등학교 친구' },
  { id: 'f4', name: '소영', note: '러닝크루' },
  { id: 'f5', name: '태현', note: '동아리 선배' },
];

const MOCK_CONNECTIONS = {
  f1: [
    { id: 'c1', name: '재윤', bio: '주말엔 주로 등산하거나 카페에서 책 읽어요. 사진 찍는 것도 좋아해서 필름카메라 들고 다녀요. 자연스럽게 대화가 잘 되는 편이에요.' },
    { id: 'c2', name: '예린', bio: '디자이너로 일하고 있어요. 러닝과 요리가 취미이고, 집 근처 작은 동네 탐방하는 걸 좋아합니다.' },
    { id: 'c3', name: '도윤', bio: '개발자. 조용한 성격이지만 친해지면 말 많아요. 영화관보단 OTT파.' },
  ],
  f2: [
    { id: 'c4', name: '서아', bio: '마케팅 일 하고 있어요. 여행 좋아하고 새로운 카페 찾아다니는 걸 즐겨요.' },
    { id: 'c5', name: '준호', bio: '대학원생. 주말엔 클라이밍이나 보드게임.' },
  ],
  f3: [
    { id: 'c6', name: '하늘', bio: '프리랜서 일러스트레이터. 고양이 두 마리와 살아요.' },
  ],
  f4: [],
  f5: [
    { id: 'c7', name: '민재', bio: '엔지니어. 커피에 진심이고 주말엔 핸드드립 연습해요.' },
    { id: 'c8', name: '유진', bio: '홍보대행사 근무. 뮤지컬 자주 보러 다녀요.' },
  ],
};

const MOCK_RECEIVED = [
  { id: 'r1', name: '재윤', bio: '주말엔 주로 등산하거나 카페에서 책 읽어요...', via: '민수의 소개', status: 'PENDING', contact: null },
  { id: 'r2', name: '서아', bio: '마케팅 일 하고 있어요...', via: '지은의 소개', status: 'ACCEPTED', contact: 'seo.ah@email.com' },
  { id: 'r3', name: '하늘', bio: '프리랜서 일러스트레이터...', via: '현우의 소개', status: 'REJECTED', contact: null },
];

const MOCK_SENT = [
  { id: 's1', name: '예린', bio: '디자이너로 일하고 있어요...', via: '민수를 통해', status: 'PENDING', contact: null },
  { id: 's2', name: '민재', bio: '엔지니어. 커피에 진심...', via: '태현을 통해', status: 'ACCEPTED', contact: '010-2345-6789' },
];

// Deeper hops (Instagram-follow-style infinite network)
// Keyed by connection id — so after tapping 재윤(c1)'s "지인 목록" we show c1's friends.
// 3촌부터는 Plus 전용 (freeHopLimit = 2).
const MOCK_DEEP_CONNECTIONS = {
  // 재윤(c1)의 지인 = 3촌
  c1: [
    { id: 'c1-1', name: '수민', bio: '백엔드 개발자. 자전거로 한강 따라 출퇴근해요.', friendCount: 32 },
    { id: 'c1-2', name: '다인', bio: '대학원 다니면서 바리스타 알바. 커피 얘기 많이 해요.', friendCount: 18 },
    { id: 'c1-3', name: '시우', bio: '영상 편집자. 독립영화 자주 보러 다녀요.', friendCount: 41 },
  ],
  // 예린(c2)의 지인 = 3촌
  c2: [
    { id: 'c2-1', name: '가영', bio: 'UX 리서처. 요가와 필라테스.', friendCount: 26 },
    { id: 'c2-2', name: '윤호', bio: '제품 매니저. 와인 모임 호스트.', friendCount: 53 },
  ],
  // 서아(c4)의 지인 = 3촌
  c4: [
    { id: 'c4-1', name: '해린', bio: '브랜드 기획자. 제주도 한달살이 다녀왔어요.', friendCount: 38 },
    { id: 'c4-2', name: '정우', bio: '스타트업 CEO. 주말엔 서핑.', friendCount: 72 },
    { id: 'c4-3', name: '채원', bio: '카피라이터. 독서모임 운영 중.', friendCount: 29 },
  ],
  // 민재(c7)의 지인 = 3촌
  c7: [
    { id: 'c7-1', name: '현서', bio: '데이터 분석가. 등산과 캠핑.', friendCount: 22 },
  ],
  // 수민(c1-1)의 지인 = 4촌 (무한 확장 예시)
  'c1-1': [
    { id: 'c1-1-1', name: '지호', bio: '보드게임 카페 운영. 주말엔 대회 참가.', friendCount: 14 },
    { id: 'c1-1-2', name: '연우', bio: '수의사. 유기동물 봉사활동.', friendCount: 31 },
  ],
  // 정우(c4-2)의 지인 = 4촌
  'c4-2': [
    { id: 'c4-2-1', name: '리아', bio: '패션 에디터. 빈티지 편집샵 자주 가요.', friendCount: 48 },
  ],
};

// Which hop is this id at? Root friends = 1촌, their connections = 2촌, deeper = 3+.
function hopForId(id) {
  // MOCK_FRIENDS ids are f* = 1촌
  if (!id) return 1;
  if (id.startsWith('f')) return 1;
  // count dashes in c-ids — c1 = 2촌, c1-1 = 3촌, c1-1-1 = 4촌 ...
  const parts = id.split('-');
  return parts.length + 1; // c1 -> 2, c1-1 -> 3
}

// Friend-count for MOCK_CONNECTIONS entries too (for "N명의 지인" label on 2촌 cards)
const CONNECTION_FRIEND_COUNTS = {
  c1: 3, c2: 2, c3: 0,
  c4: 3, c5: 0,
  c6: 0,
  c7: 1, c8: 0,
};

Object.assign(window, {
  DashTokens, DASH_DEFAULTS, useDashTokens, setDashTokens,
  Avatar, StatusBadge, DashButton, Icon, PlusBadge,
  avatarColor,
  MOCK_ME, MOCK_FRIENDS, MOCK_CONNECTIONS, MOCK_RECEIVED, MOCK_SENT,
  MOCK_DEEP_CONNECTIONS, CONNECTION_FRIEND_COUNTS, hopForId,
});
