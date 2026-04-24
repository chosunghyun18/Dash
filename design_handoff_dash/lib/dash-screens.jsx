// Dash screens — Home, MyPage, Connections (지인 리스트), ProfileDetail, ProfileEdit

// ─────────────────────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────────────────────
function ScreenHome({ onOpenProfile, onOpenConnections, friends = MOCK_FRIENDS, empty = false, os = 'ios' }) {
  const t = useDashTokens();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 28, fontWeight: 800, letterSpacing: -0.8, color: t.primary,
            fontFamily: 'inherit', lineHeight: 1.1,
          }}>Dash</span>
          <span style={{ fontSize: 13, color: t.textFaint, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>
            믿고 가는 지인의 소개
          </span>
        </div>
      </div>
      <div style={{ padding: '0 20px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3, whiteSpace: 'nowrap' }}>
          내 친구 <span style={{ color: t.primary }}>{friends.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: t.textFaint, whiteSpace: 'nowrap' }}>
          <Icon.lock size={12} /> 비공개
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 16px' }}>
        {empty || friends.length === 0 ? (
          <EmptyState
            title="아직 등록된 친구가 없어요"
            subtitle={"친구를 추가하면 친구의 지인 중에서\n좋은 사람을 소개받을 수 있어요."}
            cta="친구 초대하기"
          />
        ) : friends.map((f) => (
          <FriendRow key={f.id} friend={f} onProfile={() => onOpenProfile && onOpenProfile(f)} onConnections={() => onOpenConnections && onOpenConnections(f)} />
        ))}
      </div>
    </div>
  );
}

function FriendRow({ friend, onProfile, onConnections }) {
  const t = useDashTokens();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 10px',
      borderRadius: t.radius,
      marginBottom: 2,
    }}>
      <Avatar name={friend.name} size={46} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3, lineHeight: 1.2 }}>
          {friend.name}
        </div>
        <div style={{ fontSize: 12, color: t.textFaint, marginTop: 3, letterSpacing: -0.1 }}>
          {friend.note}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <DashButton size="sm" variant="outline" onClick={onProfile}>프로필</DashButton>
        <DashButton size="sm" variant="primarySoft" onClick={onConnections}>지인 목록</DashButton>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle, cta, icon = 'heart' }) {
  const t = useDashTokens();
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center',
      padding: '60px 24px', minHeight: 360,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: t.primarySoft, color: t.primary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        {icon === 'heart' ? <Icon.heart size={30} /> : <Icon.inbox size={30} />}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: -0.3 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 20 }}>
        {subtitle}
      </div>
      {cta && <DashButton variant="primary" size="md"><Icon.plus size={16} style={{ marginRight: 4 }} /> {cta}</DashButton>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MyPage
// ─────────────────────────────────────────────────────────────
function ScreenMyPage({ onEdit, onOpenRequest, onUpgrade, me = MOCK_ME, received = MOCK_RECEIVED, sent = MOCK_SENT, os = 'ios' }) {
  const t = useDashTokens();
  const [tab, setTab] = React.useState('received');
  const list = tab === 'received' ? received : sent;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: t.bgSoft }}>
      <div style={{ padding: '20px 20px 16px', flexShrink: 0, background: '#fff' }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: -0.5, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          마이페이지
          {t.isPlus && <PlusBadge size="sm" variant="soft" />}
        </div>
        {/* Profile card */}
        <div style={{
          background: t.primarySoft,
          borderRadius: t.radius + 4,
          padding: '16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Avatar name={me.nickname} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>
              {me.nickname}
            </div>
            <div style={{
              fontSize: 12, color: t.textMuted,
              marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {me.bio.slice(0, 28)}…
            </div>
          </div>
          <DashButton size="sm" variant="outline" onClick={onEdit} style={{ background: '#fff' }}>
            나를 소개합니다 수정
          </DashButton>
        </div>

        {/* Dash+ upgrade card — 마이페이지에서 유도 */}
        <div style={{ marginTop: 12 }}>
          <PlusUpgradeCard isPlus={t.isPlus} onUpgrade={onUpgrade} />
        </div>
      </div>

      {/* Segmented control */}
      <div style={{ padding: '16px 20px 12px', background: t.bgSoft, flexShrink: 0 }}>
        <div style={{
          display: 'flex', background: '#fff', borderRadius: t.radius,
          padding: 4, border: `1px solid ${t.border}`,
        }}>
          <SegTab active={tab === 'received'} onClick={() => setTab('received')}
            label="받은 요청" count={received.length} />
          <SegTab active={tab === 'sent'} onClick={() => setTab('sent')}
            label="보낸 요청" count={sent.length} />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        {list.length === 0 ? (
          <EmptyState
            title={tab === 'received' ? '받은 요청이 없어요' : '보낸 요청이 없어요'}
            subtitle={tab === 'received' ? '친구의 지인이 나에게 관심이 생기면\n여기로 알려드려요.' : '마음에 드는 지인에게 먼저\n연락 요청을 보내볼 수 있어요.'}
            icon="inbox"
          />
        ) : list.map((r) => (
          <RequestRow key={r.id} item={r} kind={tab} onClick={() => onOpenRequest && onOpenRequest(r, tab)} />
        ))}
      </div>
    </div>
  );
}

// Dash+ 유도 카드 — 마이페이지에서만 노출
function PlusUpgradeCard({ isPlus, onUpgrade }) {
  const t = useDashTokens();
  if (isPlus) {
    return (
      <div
        onClick={onUpgrade}
        style={{
          borderRadius: t.radius + 2,
          padding: '14px 16px',
          background: `linear-gradient(135deg, ${t.plusAccent} 0%, #9B7EFF 100%)`,
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.crown size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.3 }}>Dash+ 이용 중</div>
          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
            무제한 지인 탐색 · 다음 결제 5/12
          </div>
        </div>
        <Icon.chevron size={14} />
      </div>
    );
  }
  // Free → 유도
  return (
    <div
      onClick={onUpgrade}
      style={{
        borderRadius: t.radius + 2,
        padding: '14px 16px',
        background: `linear-gradient(135deg, ${t.plusAccentSoft} 0%, #FFF5F7 100%)`,
        border: `1px solid ${t.plusAccentSoft}`,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: t.plusAccent, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon.crown size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: t.text, letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 6 }}>
          Dash<span style={{ color: t.plusAccent }}>+</span>로 업그레이드
        </div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, letterSpacing: -0.1 }}>
          지인의 지인의 지인까지 · 무제한 탐색
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: t.plusAccent,
        background: '#fff', padding: '5px 10px', borderRadius: 999,
        letterSpacing: -0.1, flexShrink: 0,
      }}>
        월 9,900원
      </div>
    </div>
  );
}

function SegTab({ active, onClick, label, count }) {
  const t = useDashTokens();
  return (
    <button onClick={onClick}
      style={{
        flex: 1, border: 'none', cursor: 'pointer',
        background: active ? t.primary : 'transparent',
        color: active ? '#fff' : t.textMuted,
        padding: '9px 10px',
        borderRadius: t.radius - 2,
        fontFamily: 'inherit', fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
        transition: 'background .15s, color .15s',
      }}>
      {label} <span style={{ opacity: active ? 0.85 : 0.6, fontWeight: 600, marginLeft: 2 }}>{count}</span>
    </button>
  );
}

function RequestRow({ item, kind, onClick }) {
  const t = useDashTokens();
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', borderRadius: t.radius + 2,
        padding: '14px', marginBottom: 10,
        border: `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={item.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{item.name}</div>
            <StatusBadge status={item.status} />
          </div>
          <div style={{ fontSize: 12, color: t.textFaint, marginTop: 3, letterSpacing: -0.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.via}
          </div>
        </div>
        <Icon.chevron size={14} />
      </div>
      {item.status === 'ACCEPTED' && item.contact && (
        <div style={{
          marginTop: 12, padding: '10px 12px',
          background: t.acceptSoft, borderRadius: t.radius,
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, color: '#389E0D', fontWeight: 600, letterSpacing: -0.2,
        }}>
          {item.contact.includes('@') ? <Icon.mail size={15} /> : <Icon.phone size={15} />}
          {item.contact}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Connections (지인 친구 리스트) — hop-based infinite drilldown
// Instagram-style: 친구 → 친구의 지인(2촌) → 지인의 지인(3촌) → 4촌 → ...
// Props:
//   trail: array of { id, name } — breadcrumb from root friend inward.
//          [friend]        → showing 2촌
//          [friend, c1]    → showing 3촌 (Plus 필요)
//          [friend, c1, c1-1] → 4촌 ...
// ─────────────────────────────────────────────────────────────
function ScreenConnections({ trail = [], friend, onBack, onOpenIntro, onDrillDown, onUpgrade, empty = false, os = 'ios' }) {
  const t = useDashTokens();
  // Back-compat: old callers pass `friend` instead of `trail`.
  const realTrail = trail.length > 0 ? trail : (friend ? [friend] : []);
  const head = realTrail[realTrail.length - 1] || friend;
  // Hop level we're currently VIEWING (i.e. the hop of the people in the list):
  //   trail length N → list shows hop (N+1)
  const listHop = realTrail.length + 1;
  const locked = !t.isPlus && listHop > (t.freeHopLimit || 2);

  // Pick list based on current node in trail
  let list = [];
  if (realTrail.length === 0) list = [];
  else if (realTrail.length === 1) list = MOCK_CONNECTIONS[head.id] || [];
  else list = MOCK_DEEP_CONNECTIONS[head.id] || [];

  const isEmpty = empty || list.length === 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
      <NavHeader title="지인 친구 리스트" onBack={onBack} />

      {/* Breadcrumb + hop indicator */}
      <div style={{ padding: '14px 20px 8px', flexShrink: 0, borderBottom: `1px solid ${t.border}` }}>
        <HopBreadcrumb trail={realTrail} currentHop={listHop} />
      </div>

      {/* Header: whose list this is */}
      <div style={{ padding: '14px 20px 6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={head?.name || '?'} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: t.textFaint, letterSpacing: -0.1 }}>
              {head?.name}님의 지인
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3, display: 'flex', alignItems: 'center', gap: 6 }}>
              총 {list.length}명
              <HopPill hop={listHop} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 16px' }}>
        {/* Locked state = tier exceeded */}
        {locked && !isEmpty && (
          <LockedHopGate hop={listHop} count={list.length} onUpgrade={onUpgrade} sample={list[0]} />
        )}

        {!locked && isEmpty && (
          <EmptyState
            title={`${head?.name || '친구'}님이 아직 지인을 등록하지 않았어요`}
            subtitle={"조금 더 기다리거나\n다른 친구의 지인을 확인해보세요."}
            icon="heart"
          />
        )}

        {!locked && !isEmpty && list.map((c) => {
          const nextHop = listHop + 1;
          const nextLocked = !t.isPlus && nextHop > (t.freeHopLimit || 2);
          const fcount = CONNECTION_FRIEND_COUNTS[c.id] ?? (c.friendCount ?? 0);
          return (
            <ConnectionCard
              key={c.id}
              person={c}
              friendCount={fcount}
              onIntro={() => onOpenIntro && onOpenIntro(c, head, listHop)}
              onDrill={fcount > 0 ? () => onDrillDown && onDrillDown(c) : null}
              nextLocked={nextLocked}
            />
          );
        })}

        {!locked && !isEmpty && (
          <div style={{
            marginTop: 10, padding: '12px 14px',
            background: t.primarySoft, borderRadius: t.radius,
            fontSize: 12, color: '#B8385A', lineHeight: 1.5,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <Icon.sparkle size={16} />
            <div>
              <b>소개 보기는 건당 1,900원이에요.</b><br/>
              진짜 관심 있는 분만 열어보세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Breadcrumb — "나 › 민수 › 재윤" with hop step indicators
function HopBreadcrumb({ trail, currentHop }) {
  const t = useDashTokens();
  const nodes = [{ id: 'me', name: '나' }, ...trail];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 12, color: t.textMuted, letterSpacing: -0.1, lineHeight: 1.5 }}>
      {nodes.map((n, i) => (
        <React.Fragment key={n.id}>
          {i > 0 && <span style={{ color: t.textFaint, fontSize: 10 }}>›</span>}
          <span style={{
            fontWeight: i === nodes.length - 1 ? 700 : 500,
            color: i === nodes.length - 1 ? t.text : t.textMuted,
          }}>{n.name}</span>
        </React.Fragment>
      ))}
      <span style={{ color: t.textFaint, fontSize: 10 }}>›</span>
      <span style={{
        fontSize: 11, fontWeight: 700, color: t.primary,
        background: t.primarySoft, padding: '2px 7px', borderRadius: 999,
        letterSpacing: 0.1,
      }}>{currentHop}촌</span>
    </div>
  );
}

function HopPill({ hop }) {
  const t = useDashTokens();
  const isPlus = hop > (t.freeHopLimit || 2);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 999,
      background: isPlus ? t.plusAccentSoft : t.primarySoft,
      color: isPlus ? t.plusAccent : t.primary,
      fontSize: 10, fontWeight: 700, letterSpacing: 0.1,
    }}>
      {isPlus && <Icon.crown size={9} />}
      {hop}촌
    </span>
  );
}

// Connection card with drill-down affordance (infinite follow)
function ConnectionCard({ person, friendCount, onIntro, onDrill, nextLocked }) {
  const t = useDashTokens();
  return (
    <div style={{
      padding: '12px 12px 12px 12px', borderRadius: t.radius,
      background: '#fff', border: `1px solid ${t.border}`,
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={person.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>
            {person.name}
          </div>
          <div style={{
            fontSize: 12, color: t.textMuted, marginTop: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {person.bio.slice(0, 22)}…
          </div>
        </div>
        <DashButton size="sm" variant="primary" onClick={onIntro}>
          <Icon.lock size={12} style={{ marginRight: 3 }} /> 소개 보기
        </DashButton>
      </div>
      {/* drill-down row: 지인 N명 → */}
      {friendCount > 0 && (
        <div
          onClick={onDrill}
          style={{
            marginTop: 10, padding: '8px 12px',
            background: nextLocked ? t.plusAccentSoft : t.bgSoft,
            borderRadius: t.radius - 4,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, cursor: onDrill ? 'pointer' : 'default',
            color: nextLocked ? t.plusAccent : t.textMuted,
          }}
        >
          <Icon.users size={14} />
          <span style={{ fontWeight: 600, letterSpacing: -0.1 }}>
            {person.name}님의 지인 {friendCount}명 더 보기
          </span>
          {nextLocked && <PlusBadge size="xs" variant="solid" style={{ marginLeft: 'auto' }} />}
          {!nextLocked && <Icon.chevron size={12} style={{ marginLeft: 'auto', color: t.textFaint }} />}
        </div>
      )}
    </div>
  );
}

// Locked-hop gate — shown when free user hits 3촌+
function LockedHopGate({ hop, count, onUpgrade, sample }) {
  const t = useDashTokens();
  return (
    <div style={{
      padding: '28px 20px 24px',
      background: `linear-gradient(180deg, ${t.plusAccentSoft} 0%, #fff 100%)`,
      borderRadius: t.radius + 4,
      border: `1px solid ${t.plusAccentSoft}`,
      textAlign: 'center',
    }}>
      {/* Blurred preview avatars */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: -8, marginBottom: 16, filter: 'blur(6px)', opacity: 0.7 }}>
        {[0, 1, 2].map((i) => (
          <Avatar key={i} name={sample?.name || '?'} size={56} style={{ marginLeft: i === 0 ? 0 : -14, border: '3px solid #fff' }} />
        ))}
      </div>

      <PlusBadge size="sm" variant="solid" style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 17, fontWeight: 800, color: t.text, letterSpacing: -0.4, marginBottom: 6 }}>
        {hop}촌 지인 {count}명을 만나보세요
      </div>
      <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6, marginBottom: 18, whiteSpace: 'pre-line' }}>
        {`Dash+는 ${hop}촌 이상의 지인 소개글도 열람하고\n연락 요청까지 보낼 수 있어요.`}
      </div>
      <DashButton variant="primary" size="md" onClick={onUpgrade}
        style={{ background: t.plusAccent, minWidth: 180 }}>
        <Icon.crown size={14} style={{ marginRight: 4 }} /> Dash+ 시작하기
      </DashButton>
      <div style={{ marginTop: 10, fontSize: 11, color: t.textFaint }}>
        월 9,900원 · 언제든 해지
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile Detail
// ─────────────────────────────────────────────────────────────
function ScreenProfileDetail({ person, mode = 'normal', hop, onBack, onRequest, onAccept, onReject, onUpgrade, os = 'ios' }) {
  // mode: 'normal' | 'accept' | 'accepted' | 'requested'
  const t = useDashTokens();
  const p = person || { name: '재윤', bio: MOCK_CONNECTIONS.f1[0].bio, via: '민수의 소개', contact: '010-2345-6789' };
  const showPlusGate = hop && !t.isPlus && hop > (t.freeHopLimit || 2) && mode === 'normal';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
      <NavHeader title="프로필" onBack={onBack} bg={t.primarySoft} />

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Hero */}
        <div style={{
          background: t.primarySoft,
          padding: '8px 20px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative',
        }}>
          <Avatar name={p.name} size={120} style={{ boxShadow: '0 8px 24px rgba(255,75,110,0.25)', border: '4px solid #fff' }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginTop: 14, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            {p.name}
            {hop && <HopPill hop={hop} />}
          </div>
          {p.via && (
            <div style={{
              marginTop: 8, padding: '5px 12px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 999,
              fontSize: 12, color: t.primary, fontWeight: 600, letterSpacing: -0.2,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon.heart size={11} /> {p.via}
            </div>
          )}
        </div>

        {/* Bio */}
        <div style={{ padding: '22px 20px 12px' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: t.primary,
            letterSpacing: 0.4, marginBottom: 8, textTransform: 'uppercase',
          }}>
            나를 소개합니다
          </div>
          <div style={{
            fontSize: 14, color: t.text, lineHeight: 1.7,
            letterSpacing: -0.2, whiteSpace: 'pre-line',
            filter: showPlusGate ? 'blur(5px)' : 'none',
            userSelect: showPlusGate ? 'none' : 'auto',
            transition: 'filter 0.2s',
          }}>
            {p.bio || MOCK_CONNECTIONS.f1[0].bio}
          </div>
        </div>

        {/* Plus gate overlay on detail page itself */}
        {showPlusGate && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              padding: '18px 20px',
              background: `linear-gradient(135deg, ${t.plusAccentSoft} 0%, #fff 100%)`,
              border: `1px solid ${t.plusAccentSoft}`,
              borderRadius: t.radius + 2,
              textAlign: 'center',
            }}>
              <PlusBadge size="sm" variant="solid" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, letterSpacing: -0.3, marginBottom: 4 }}>
                {hop}촌 소개글은 Dash+ 전용이에요
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, marginBottom: 14 }}>
                업그레이드하면 소개글 전체를 보고<br/>바로 연락 요청까지 보낼 수 있어요.
              </div>
              <DashButton size="md" variant="primary" onClick={onUpgrade}
                style={{ background: t.plusAccent, minWidth: 160 }}>
                <Icon.crown size={14} style={{ marginRight: 4 }} /> Dash+ 시작하기
              </DashButton>
            </div>
          </div>
        )}

        {/* Accepted contact card */}
        {mode === 'accepted' && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              background: t.acceptSoft,
              border: '1px solid #B7EB8F',
              borderRadius: t.radius + 2,
              padding: '16px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, fontWeight: 700, color: '#389E0D',
                letterSpacing: -0.2, marginBottom: 10,
              }}>
                <Icon.check size={14} /> 연락이 수락되었어요
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', background: '#fff',
                borderRadius: t.radius,
              }}>
                {(p.contact || '010-2345-6789').includes('@')
                  ? <Icon.mail size={18} />
                  : <Icon.phone size={18} />}
                <span style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.2 }}>
                  {p.contact || '010-2345-6789'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: os === 'ios' ? 24 : 18,
        background: '#fff',
        borderTop: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        {mode === 'normal' && !showPlusGate && (
          <DashButton variant="primary" size="lg" block onClick={onRequest}>
            <Icon.heart size={16} style={{ marginRight: 4 }} /> 연락 요청하기
          </DashButton>
        )}
        {mode === 'normal' && showPlusGate && (
          <DashButton variant="primary" size="lg" block onClick={onUpgrade}
            style={{ background: t.plusAccent }}>
            <Icon.crown size={16} style={{ marginRight: 4 }} /> Dash+로 연락 요청
          </DashButton>
        )}
        {mode === 'accept' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <DashButton variant="reject" size="lg" onClick={onReject} style={{ flex: 1 }}>
              거절
            </DashButton>
            <DashButton variant="accept" size="lg" onClick={onAccept} style={{ flex: 2 }}>
              <Icon.check size={16} style={{ marginRight: 4 }} /> 수락하기
            </DashButton>
          </div>
        )}
        {mode === 'accepted' && (
          <DashButton variant="secondary" size="lg" block disabled>
            이미 연락처를 공유했어요
          </DashButton>
        )}
        {mode === 'requested' && (
          <DashButton variant="secondary" size="lg" block disabled>
            <Icon.check size={16} style={{ marginRight: 4 }} /> 요청을 보냈어요
          </DashButton>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile Edit
// ─────────────────────────────────────────────────────────────
function ScreenProfileEdit({ onBack, onSave, me = MOCK_ME, os = 'ios' }) {
  const t = useDashTokens();
  const [nickname, setNickname] = React.useState(me.nickname);
  const [nickState, setNickState] = React.useState('idle'); // idle | checking | ok | dup
  const [contactType, setContactType] = React.useState(me.contactType);
  const [contact, setContact] = React.useState(me.contact);
  const [bio, setBio] = React.useState(me.bio);

  const checkDup = () => {
    setNickState('checking');
    setTimeout(() => setNickState(nickname === '민수' ? 'dup' : 'ok'), 600);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
      <NavHeader
        title="프로필 수정"
        onBack={onBack}
        right={
          <button
            onClick={onSave}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: t.primary, fontSize: 15, fontWeight: 700,
              padding: '8px 4px', fontFamily: 'inherit', letterSpacing: -0.2,
            }}
          >저장</button>
        }
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 24px' }}>
        {/* Nickname */}
        <EditField label="닉네임">
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setNickState('idle'); }}
              placeholder="닉네임을 입력하세요"
              style={inputStyle(t)}
            />
            <DashButton size="md" variant="outline" onClick={checkDup}>중복 확인</DashButton>
          </div>
          {nickState !== 'idle' && (
            <div style={{
              marginTop: 6, fontSize: 12,
              color: nickState === 'ok' ? '#389E0D' : nickState === 'dup' ? '#CF1322' : t.textFaint,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {nickState === 'checking' && '확인 중...'}
              {nickState === 'ok' && <><Icon.check size={12} /> 사용 가능한 닉네임이에요</>}
              {nickState === 'dup' && <><Icon.close size={12} /> 이미 사용 중인 닉네임이에요</>}
            </div>
          )}
        </EditField>

        {/* Contact */}
        <EditField label="연락처" hint="수락한 상대에게만 공개됩니다">
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['phone', 'email'].map((k) => (
              <button key={k} onClick={() => setContactType(k)}
                style={{
                  flex: 1, padding: '9px', border: `1px solid ${contactType === k ? t.primary : t.border}`,
                  background: contactType === k ? t.primarySoft : '#fff',
                  color: contactType === k ? t.primary : t.textMuted,
                  fontSize: 13, fontWeight: 600, letterSpacing: -0.2,
                  borderRadius: t.radius,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                {k === 'phone' ? <><Icon.phone size={14}/> 휴대폰</> : <><Icon.mail size={14}/> 이메일</>}
              </button>
            ))}
          </div>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={contactType === 'phone' ? '010-1234-5678' : 'you@email.com'}
            style={inputStyle(t)}
          />
        </EditField>

        {/* Bio */}
        <EditField label="나를 소개합니다">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 500))}
            placeholder="어떤 사람인지, 무엇을 좋아하는지 편하게 써주세요."
            style={{
              ...inputStyle(t),
              height: 140, resize: 'none', paddingTop: 12,
              lineHeight: 1.5,
            }}
          />
          <div style={{
            marginTop: 6, fontSize: 12, color: t.textFaint,
            display: 'flex', justifyContent: 'flex-end',
          }}>
            <span style={{ color: bio.length > 450 ? '#D46B08' : t.textFaint }}>{bio.length}</span> / 500
          </div>
        </EditField>
      </div>
    </div>
  );
}

function EditField({ label, hint, children }) {
  const t = useDashTokens();
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: -0.2 }}>
        {label}
      </div>
      {children}
      {hint && <div style={{ marginTop: 6, fontSize: 11, color: t.textFaint, letterSpacing: -0.1 }}>{hint}</div>}
    </div>
  );
}

function inputStyle(t) {
  return {
    flex: 1, width: '100%', boxSizing: 'border-box',
    padding: '11px 14px',
    background: '#fff', border: `1px solid ${t.border}`,
    borderRadius: t.radius,
    fontFamily: 'inherit', fontSize: 14, color: t.text, letterSpacing: -0.2,
    outline: 'none',
  };
}

// ─────────────────────────────────────────────────────────────
// Dash+ Plans — 유료 회원 업그레이드 페이지 (마이페이지에서 진입)
// ─────────────────────────────────────────────────────────────
function ScreenDashPlus({ onBack, onSubscribe, os = 'ios' }) {
  const t = useDashTokens();
  const [plan, setPlan] = React.useState('monthly');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#fff' }}>
      <NavHeader title="" onBack={onBack} bg="#fff" />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Hero */}
        <div style={{
          padding: '12px 24px 28px',
          background: `radial-gradient(120% 80% at 50% 0%, ${t.plusAccentSoft} 0%, #fff 70%)`,
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16,
            background: t.plusAccent, color: '#fff',
            marginBottom: 14,
            boxShadow: `0 12px 30px ${t.plusAccent}40`,
          }}>
            <Icon.crown size={28} />
          </div>
          <div style={{
            fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: -0.8,
            lineHeight: 1.2, marginBottom: 8,
          }}>
            Dash<span style={{ color: t.plusAccent }}>+</span>
          </div>
          <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6, letterSpacing: -0.2 }}>
            지인의 지인의 지인까지<br/>
            <b style={{ color: t.text }}>무제한으로 탐색</b>하세요
          </div>
        </div>

        {/* Benefits */}
        <div style={{ padding: '8px 20px 24px' }}>
          <BenefitRow
            icon={<Icon.users size={18} />}
            title="무제한 촌수"
            desc="2촌 · 3촌 · 4촌… 필요한 만큼 계속 타고 들어갈 수 있어요."
          />
          <BenefitRow
            icon={<Icon.heart size={16} />}
            title="3촌+ 소개글 열람 & 연락 요청"
            desc="멀리 있는 지인에게도 먼저 다가갈 수 있어요."
          />
          <BenefitRow
            icon={<Icon.sparkle size={16} />}
            title="'소개 보기' 월 5회 무료"
            desc="건당 1,900원 대신 월 5회까지 무료로 열람."
          />
          <BenefitRow
            icon={<Icon.crown size={16} />}
            title="Plus 배지 · 우선 매칭"
            desc="프로필에 Plus 표시 · 관심도 높은 분에게 먼저 노출."
          />
        </div>

        {/* Plan selector */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.textFaint, letterSpacing: 0.3, marginBottom: 10, textTransform: 'uppercase' }}>
            플랜 선택
          </div>
          <PlanOption
            id="yearly"
            selected={plan === 'yearly'}
            onSelect={() => setPlan('yearly')}
            title="연간"
            priceTop="99,000원"
            priceSub="/년 · 월 8,250원"
            badge="2개월 무료"
          />
          <PlanOption
            id="monthly"
            selected={plan === 'monthly'}
            onSelect={() => setPlan('monthly')}
            title="월간"
            priceTop="9,900원"
            priceSub="/월"
          />
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: os === 'ios' ? 24 : 18,
        background: '#fff',
        borderTop: `1px solid ${t.border}`,
        flexShrink: 0,
      }}>
        <DashButton
          variant="primary" size="lg" block
          onClick={onSubscribe}
          style={{ background: t.plusAccent }}
        >
          <Icon.crown size={16} style={{ marginRight: 4 }} /> Dash+ 시작하기
        </DashButton>
        <div style={{ textAlign: 'center', fontSize: 11, color: t.textFaint, marginTop: 8, letterSpacing: -0.1 }}>
          7일 무료 체험 · 언제든 해지 가능
        </div>
      </div>
    </div>
  );
}

function BenefitRow({ icon, title, desc }) {
  const t = useDashTokens();
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 4px', alignItems: 'flex-start' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: t.plusAccentSoft, color: t.plusAccent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, letterSpacing: -0.3, marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, letterSpacing: -0.1 }}>
          {desc}
        </div>
      </div>
    </div>
  );
}

function PlanOption({ selected, onSelect, title, priceTop, priceSub, badge }) {
  const t = useDashTokens();
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px', marginBottom: 10,
        border: `2px solid ${selected ? t.plusAccent : t.border}`,
        borderRadius: t.radius + 2,
        background: selected ? t.plusAccentSoft : '#fff',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 10,
        border: `2px solid ${selected ? t.plusAccent : '#ddd'}`,
        background: selected ? t.plusAccent : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>{title}</span>
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: t.primary,
              background: '#FFF0F2', padding: '2px 7px', borderRadius: 999, letterSpacing: 0.1,
            }}>{badge}</span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: t.text, letterSpacing: -0.3 }}>{priceTop}</div>
        <div style={{ fontSize: 11, color: t.textFaint, marginTop: 1 }}>{priceSub}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenHome, ScreenMyPage, ScreenConnections, ScreenProfileDetail, ScreenProfileEdit,
  ScreenDashPlus,
});
