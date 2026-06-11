import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Phone, Mail } from 'lucide-react-native';
import { Avatar } from '../../components/Avatar';
import { DashButton } from '../../components/DashButton';
import { StatusBadge } from '../../components/StatusBadge';
import { PlusBadge } from '../../components/PlusBadge';
import { PlusUpgradeCard } from '../../components/PlusUpgradeCard';
import { EmptyState } from '../../components/EmptyState';
import { useSentRequests, useReceivedRequests, useMyProfile } from '../../hooks/useFriends';
import { useMembershipStore } from '../../stores/membershipStore';
import { colors, radius, spacing, typography, fontFamily } from '../../theme';

type Tab = 'received' | 'sent';

export default function MyPageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: myProfile } = useMyProfile();
  const { data: received } = useReceivedRequests();
  const { data: sent } = useSentRequests();
  const isPlus = useMembershipStore((s) => s.plan === 'plus');

  const [tab, setTab] = useState<Tab>('received');

  const displayNickname = myProfile?.nickname ?? '나';
  const bioPreview = (myProfile?.introText ?? '').slice(0, 28);
  const receivedCount = received?.length ?? 0;
  const sentCount = sent?.length ?? 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.headerArea, { paddingTop: insets.top + 12 }]}>
          <View style={styles.titleRow}>
            <Text style={[typography.screenTitle, { color: colors.text }]}>마이페이지</Text>
            {isPlus && <PlusBadge variant="soft" size="sm" />}
          </View>

          <View style={styles.profileCard}>
            <Avatar nickname={displayNickname} size={56} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{displayNickname}</Text>
              {bioPreview ? (
                <Text style={styles.profileBio} numberOfLines={1}>
                  {bioPreview}…
                </Text>
              ) : null}
            </View>
            <DashButton
              title="나를 소개합니다 수정"
              variant="outline"
              size="sm"
              onPress={() => router.push('/profile/edit')}
            />
          </View>

          <PlusUpgradeCard />
        </View>

        <View style={styles.softSection}>
          <View style={styles.segmented}>
            <SegTab
              label="받은 요청"
              count={receivedCount}
              active={tab === 'received'}
              onPress={() => setTab('received')}
            />
            <SegTab
              label="보낸 요청"
              count={sentCount}
              active={tab === 'sent'}
              onPress={() => setTab('sent')}
            />
          </View>

          {tab === 'received' ? (
            received && received.length > 0 ? (
              received.map((r) => (
                <RequestCard
                  key={r.id}
                  nickname={r.requesterNickname}
                  via={r.via}
                  status={r.status}
                  contactPhone={r.contactPhone}
                  contactEmail={r.contactEmail}
                  onPress={
                    r.status === 'PENDING'
                      ? () => router.push(`/profile/${r.requesterUserId}?requestId=${r.id}`)
                      : undefined
                  }
                />
              ))
            ) : (
              <EmptyState
                title="받은 요청이 없어요"
                subtitle={'친구의 지인이 나에게 관심이 생기면\n여기로 알려드려요.'}
                icon="inbox"
              />
            )
          ) : sent && sent.length > 0 ? (
            sent.map((r) => (
              <RequestCard
                key={r.id}
                nickname={r.targetNickname}
                via={r.via}
                status={r.status}
                contactPhone={r.contactPhone}
                contactEmail={r.contactEmail}
              />
            ))
          ) : (
            <EmptyState
              title="보낸 요청이 없어요"
              subtitle={'마음에 드는 지인에게 먼저\n연락 요청을 보내볼 수 있어요.'}
              icon="inbox"
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SegTab({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.segment, active && styles.segmentActive]}
    >
      <Text style={[styles.segLabel, { color: active ? '#fff' : colors.textMuted }]}>
        {label}{' '}
        <Text style={{ opacity: active ? 0.85 : 0.6, fontWeight: '600' }}>{count}</Text>
      </Text>
    </TouchableOpacity>
  );
}

interface RequestCardProps {
  nickname: string;
  via?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  contactPhone?: string;
  contactEmail?: string;
  onPress?: () => void;
}

function RequestCard({ nickname, via, status, contactPhone, contactEmail, onPress }: RequestCardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.requestCard} activeOpacity={0.85} {...(onPress ? { onPress } : {})}>
      <View style={styles.requestRow}>
        <Avatar nickname={nickname} size={44} />
        <View style={styles.requestInfo}>
          <View style={styles.nameRow}>
            <Text style={[typography.listItemName, styles.name]} numberOfLines={1}>
              {nickname}
            </Text>
            <StatusBadge status={status} />
          </View>
          {via ? (
            <Text style={styles.via} numberOfLines={1}>
              {via}
            </Text>
          ) : null}
        </View>
        {onPress ? <ChevronRight size={16} color={colors.textFaint} /> : null}
      </View>

      {status === 'ACCEPTED' && (contactPhone || contactEmail) && (
        <View style={styles.contactRow}>
          {contactPhone && (
            <View style={styles.contactLine}>
              <Phone size={15} color={colors.acceptText} />
              <Text style={styles.contactText}>{contactPhone}</Text>
            </View>
          )}
          {contactEmail && (
            <View style={styles.contactLine}>
              <Mail size={15} color={colors.acceptText} />
              <Text style={styles.contactText}>{contactEmail}</Text>
            </View>
          )}
        </View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerArea: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
    gap: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: 16,
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
  },
  profileInfo: { flex: 1, minWidth: 0 },
  profileName: { fontFamily, fontSize: 16, fontWeight: '700', letterSpacing: -0.3, color: colors.text },
  profileBio: { fontFamily, fontSize: 12, color: colors.textMuted, marginTop: 3, letterSpacing: -0.1 },
  softSection: {
    backgroundColor: colors.bgSoft,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
    minHeight: 400,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: spacing.xs,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: colors.primary },
  segLabel: { fontFamily, fontSize: 13, fontWeight: '700', letterSpacing: -0.2 },
  requestCard: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requestInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 0 },
  name: { color: colors.text, flexShrink: 1 },
  via: { fontFamily, fontSize: 12, color: colors.textFaint, marginTop: 3, letterSpacing: -0.1 },
  contactRow: {
    marginTop: 12,
    backgroundColor: colors.acceptSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  contactLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  contactText: { fontFamily, fontSize: 13, fontWeight: '600', color: colors.acceptText, letterSpacing: -0.2 },
});
