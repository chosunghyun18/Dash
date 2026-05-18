import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Phone, Mail } from 'lucide-react-native';
import { Avatar } from '../../components/Avatar';
import { DashButton } from '../../components/DashButton';
import { StatusBadge } from '../../components/StatusBadge';
import { useSentRequests, useReceivedRequests, useMyProfile } from '../../hooks/useFriends';
import { colors, radius, spacing, typography } from '../../theme';

type Tab = 'received' | 'sent';

export default function MyPageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: myProfile } = useMyProfile();
  const { data: received } = useReceivedRequests();
  const { data: sent } = useSentRequests();

  const [tab, setTab] = useState<Tab>('received');

  const displayNickname = myProfile?.nickname ?? '나';
  const bioPreview = (myProfile?.introText ?? '').slice(0, 28);
  const receivedCount = received?.length ?? 0;
  const sentCount = sent?.length ?? 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.headerArea, { paddingTop: insets.top + 12 }]}>
          <Text style={[typography.screenTitle, { color: colors.text }]}>마이페이지</Text>

          <View style={styles.profileCard}>
            <Avatar nickname={displayNickname} size={56} />
            <View style={styles.profileInfo}>
              <Text style={[typography.listItemName, { color: colors.text }]}>{displayNickname}</Text>
              {bioPreview ? (
                <Text style={[typography.hint, { color: colors.textMuted, marginTop: 4 }]} numberOfLines={1}>
                  {bioPreview}
                </Text>
              ) : null}
              <DashButton
                title="나를 소개합니다 수정"
                variant="outline"
                size="sm"
                onPress={() => router.push('/profile/edit')}
                style={{ marginTop: 10 }}
              />
            </View>
          </View>
        </View>

        <View style={styles.softSection}>
          <View style={styles.segmented}>
            <Segment
              label={`받은 요청 ${receivedCount}`}
              active={tab === 'received'}
              onPress={() => setTab('received')}
            />
            <Segment
              label={`보낸 요청 ${sentCount}`}
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
              <EmptyText label="받은 요청이 없어요" />
            )
          ) : sent && sent.length > 0 ? (
            sent.map((r) => (
              <RequestCard
                key={r.id}
                nickname={r.targetNickname}
                status={r.status}
                contactPhone={r.contactPhone}
                contactEmail={r.contactEmail}
              />
            ))
          ) : (
            <EmptyText label="보낸 요청이 없어요" />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.segment, active && styles.segmentActive]}
    >
      <Text
        style={[
          typography.buttonMd,
          { color: active ? '#fff' : colors.textMuted, textAlign: 'center' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface RequestCardProps {
  nickname: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  contactPhone?: string;
  contactEmail?: string;
  onPress?: () => void;
}

function RequestCard({ nickname, status, contactPhone, contactEmail, onPress }: RequestCardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={styles.requestCard}
      activeOpacity={0.85}
      {...(onPress ? { onPress } : {})}
    >
      <View style={styles.requestRow}>
        <Avatar nickname={nickname} size={44} />
        <View style={styles.requestInfo}>
          <Text style={[typography.listItemName, { color: colors.text }]} numberOfLines={1}>
            {nickname}
          </Text>
          <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
            <StatusBadge status={status} />
          </View>
        </View>
        {onPress ? <ChevronRight size={20} color={colors.textFaint} /> : null}
      </View>

      {status === 'ACCEPTED' && (contactPhone || contactEmail) && (
        <View style={styles.contactRow}>
          {contactPhone && (
            <View style={styles.contactLine}>
              <Phone size={14} color={colors.acceptText} />
              <Text style={[typography.caption, { color: colors.acceptText }]}>{contactPhone}</Text>
            </View>
          )}
          {contactEmail && (
            <View style={styles.contactLine}>
              <Mail size={14} color={colors.acceptText} />
              <Text style={[typography.caption, { color: colors.acceptText }]}>{contactEmail}</Text>
            </View>
          )}
        </View>
      )}
    </Wrapper>
  );
}

function EmptyText({ label }: { label: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40 }}>
      <Text style={[typography.caption, { color: colors.textFaint }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerArea: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg,
    gap: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
  },
  profileInfo: { flex: 1, minWidth: 0 },
  softSection: {
    backgroundColor: colors.bgSoft,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
    minHeight: 400,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: colors.primary },
  requestCard: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  requestInfo: { flex: 1, minWidth: 0 },
  contactRow: {
    backgroundColor: colors.acceptSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  contactLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
