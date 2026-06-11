import { useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, type Href } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { useAcquaintances, useReceivedRequests, useUserProfile } from '../../hooks/useFriends';
import { useMembershipStore, FREE_HOP_LIMIT } from '../../stores/membershipStore';
import { ConnectionCard } from '../../components/ConnectionCard';
import { LockedHopGate } from '../../components/LockedHopGate';
import { EmptyState } from '../../components/EmptyState';
import { HopPill, HopBreadcrumb, TrailNode } from '../../components/HopIndicators';
import { Avatar } from '../../components/Avatar';
import { colors, radius, spacing, typography } from '../../theme';

function parseTrail(raw?: string): TrailNode[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((n) => n && n.id && n.name);
  } catch {
    /* ignore */
  }
  return [];
}

export default function AcquaintancesScreen() {
  const { userId, trail: trailParam } = useLocalSearchParams<{ userId: string; trail?: string }>();
  const router = useRouter();
  const headUserId = Number(userId);

  const { data: acquaintances, isLoading } = useAcquaintances(headUserId);
  const { data: headProfile } = useUserProfile(headUserId);
  const { data: received } = useReceivedRequests();
  const isPlus = useMembershipStore((s) => s.plan === 'plus');

  // trail = 루트 친구부터 현재 head까지의 전체 경로 (head 포함)
  const trail = useMemo<TrailNode[]>(() => {
    const parsed = parseTrail(trailParam);
    if (parsed.length > 0) return parsed;
    // 홈에서 trail 없이 들어온 경우 head 단독으로 구성
    return headProfile ? [{ id: String(headUserId), name: headProfile.nickname }] : [];
  }, [trailParam, headProfile, headUserId]);

  const head = trail[trail.length - 1];
  const listHop = trail.length + 1; // 보고 있는 사람들의 촌수
  const locked = !isPlus && listHop > FREE_HOP_LIMIT;

  const list = acquaintances ?? [];
  const isEmpty = list.length === 0;

  const openPaywall = () => router.push('/upgrade' as Href);

  const getPendingRequestId = (profileUserId: number) =>
    received?.find((r) => r.requesterUserId === profileUserId && r.status === 'PENDING')?.id;

  const openIntro = (personUserId: number) => {
    const via = encodeURIComponent(`${head?.name ?? ''}의 소개`);
    const requestId = getPendingRequestId(personUserId);
    const base = `/profile/${personUserId}?hop=${listHop}&via=${via}`;
    router.push((requestId ? `${base}&requestId=${requestId}` : base) as Href);
  };

  const drillDown = (person: { userId: number; nickname: string }) => {
    const nextTrail = [...trail, { id: String(person.userId), name: person.nickname }];
    router.push(
      `/acquaintances/${person.userId}?trail=${encodeURIComponent(JSON.stringify(nextTrail))}` as Href
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '지인 친구 리스트',
          headerBackTitle: '',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { fontSize: 16, fontWeight: '700' },
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={locked ? [] : list}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const nextLocked = !isPlus && listHop + 1 > FREE_HOP_LIMIT;
              const hasDeeper = (item.acquaintanceCount ?? 0) > 0;
              return (
                <ConnectionCard
                  person={item}
                  onIntro={() => openIntro(item.userId)}
                  onDrill={
                    hasDeeper
                      ? () => (nextLocked ? openPaywall() : drillDown(item))
                      : undefined
                  }
                  nextLocked={nextLocked}
                />
              );
            }}
            contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.xl }}
            ListHeaderComponent={
              <>
                <View style={styles.breadcrumb}>
                  <HopBreadcrumb trail={trail} currentHop={listHop} />
                </View>
                <View style={styles.contextRow}>
                  <Avatar nickname={head?.name ?? '?'} size={36} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[typography.hint, { color: colors.textFaint }]}>
                      {head?.name ? `${head.name}님의 지인` : '지인'}
                    </Text>
                    <View style={styles.countRow}>
                      <Text style={[typography.listItemName, { color: colors.text }]}>
                        총 {list.length}명
                      </Text>
                      <HopPill hop={listHop} />
                    </View>
                  </View>
                </View>
                {locked && !isEmpty && (
                  <LockedHopGate
                    hop={listHop}
                    count={list.length}
                    sampleName={list[0]?.nickname}
                    onUpgrade={openPaywall}
                  />
                )}
              </>
            }
            ListFooterComponent={
              !locked && !isEmpty ? (
                <View style={styles.pricingBox}>
                  <Sparkles size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pricingTitle}>소개 보기는 건당 1,900원이에요.</Text>
                    <Text style={styles.pricingDesc}>진짜 관심 있는 분만 열어보세요.</Text>
                  </View>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !locked ? (
                <EmptyState
                  title={`${head?.name ?? '친구'}님이 아직 지인을 등록하지 않았어요`}
                  subtitle={'조금 더 기다리거나\n다른 친구의 지인을 확인해보세요.'}
                  icon="heart"
                />
              ) : null
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  breadcrumb: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  pricingBox: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primarySoft,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  pricingTitle: { ...typography.body, color: '#B8385A', fontWeight: '700' },
  pricingDesc: { ...typography.caption, color: '#B8385A', marginTop: 1 },
});
