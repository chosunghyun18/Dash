import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Heart, Check, Phone, Mail } from 'lucide-react-native';
import {
  useUserProfile,
  useSendContactRequest,
  useAcceptContactRequest,
  useRejectContactRequest,
  useSentRequests,
} from '../../hooks/useFriends';
import { Avatar } from '../../components/Avatar';
import { DashButton } from '../../components/DashButton';
import { colors, radius, shadow, spacing, typography } from '../../theme';

type AcceptedInfo = { phone?: string; email?: string };

export default function ProfileScreen() {
  const router = useRouter();
  const { userId, requestId } = useLocalSearchParams<{ userId: string; requestId?: string }>();

  const [acceptedInfo, setAcceptedInfo] = useState<AcceptedInfo | null>(null);

  const { data: profile, isLoading } = useUserProfile(Number(userId));
  const { data: sent } = useSentRequests();
  const { mutate: sendRequest, isPending: isSending } = useSendContactRequest();
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptContactRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectContactRequest();

  const sentForUser = useMemo(
    () => sent?.find((r) => r.targetUserId === Number(userId)),
    [sent, userId]
  );

  const mode: 'accept' | 'accepted' | 'requested' | 'normal' = useMemo(() => {
    if (requestId) {
      return acceptedInfo ? 'accepted' : 'accept';
    }
    if (sentForUser?.status === 'ACCEPTED') return 'accepted';
    if (sentForUser?.status === 'PENDING') return 'requested';
    return 'normal';
  }, [requestId, acceptedInfo, sentForUser]);

  const acceptedDisplay: AcceptedInfo | null =
    acceptedInfo ??
    (sentForUser?.status === 'ACCEPTED'
      ? { phone: sentForUser.contactPhone, email: sentForUser.contactEmail }
      : null);

  const handleContactRequest = () => {
    if (!profile) return;
    Alert.alert('연락 요청', `${profile.nickname}님께 연락 요청을 보낼까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '요청 보내기',
        onPress: () =>
          sendRequest(Number(userId), {
            onSuccess: () => Alert.alert('완료', '연락 요청을 보냈어요!'),
            onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
          }),
      },
    ]);
  };

  const handleAccept = () => {
    if (!profile || !requestId) return;
    Alert.alert('요청 수락', `${profile.nickname}님의 연락 요청을 수락할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '수락',
        onPress: () =>
          acceptRequest(Number(requestId), {
            onSuccess: (res) =>
              setAcceptedInfo({ phone: res.contactPhone, email: res.contactEmail }),
            onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
          }),
      },
    ]);
  };

  const handleReject = () => {
    if (!profile || !requestId) return;
    Alert.alert('요청 거절', `${profile.nickname}님의 연락 요청을 거절할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '거절',
        style: 'destructive',
        onPress: () =>
          rejectRequest(Number(requestId), {
            onSuccess: () =>
              Alert.alert('완료', '거절 처리됐어요.', [
                { text: '확인', onPress: () => router.back() },
              ]),
            onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
          }),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '프로필',
          headerBackTitle: '',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.primarySoft },
          headerTitleStyle: { fontSize: 16, fontWeight: '700' },
        }}
      />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !profile ? (
        <View style={styles.center}>
          <Text style={[typography.caption, { color: colors.textFaint }]}>
            프로필을 찾을 수 없어요
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.hero}>
              <View style={[styles.avatarRing, shadow.heroAvatar]}>
                <Avatar nickname={profile.nickname} size={120} />
              </View>
              <Text style={[typography.profileName, { color: colors.text, marginTop: 14 }]}>
                {profile.nickname}
              </Text>

              {acceptedDisplay && mode === 'accepted' && (
                <View style={styles.acceptedCard}>
                  <View style={styles.acceptedTitleRow}>
                    <Check size={14} color={colors.acceptText} />
                    <Text style={styles.acceptedTitle}>연락이 수락되었어요</Text>
                  </View>
                  <View style={styles.acceptedInner}>
                    {acceptedDisplay.phone && (
                      <View style={styles.contactLine}>
                        <Phone size={14} color={colors.text} />
                        <Text style={styles.acceptedContact}>{acceptedDisplay.phone}</Text>
                      </View>
                    )}
                    {acceptedDisplay.email && (
                      <View style={styles.contactLine}>
                        <Mail size={14} color={colors.text} />
                        <Text style={styles.acceptedContact}>{acceptedDisplay.email}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.bioSection}>
              <Text style={styles.bioLabel}>나를 소개합니다</Text>
              <Text style={[typography.body, { color: colors.text, marginTop: 10 }]}>
                {profile.introText}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {mode === 'accept' ? (
              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <DashButton
                  title={isRejecting ? '처리 중...' : '거절'}
                  variant="reject"
                  size="lg"
                  onPress={handleReject}
                  disabled={isRejecting || isAccepting}
                  style={{ flex: 1 }}
                />
                <DashButton
                  title={isAccepting ? '처리 중...' : '수락하기'}
                  variant="accept"
                  size="lg"
                  onPress={handleAccept}
                  disabled={isAccepting || isRejecting}
                  leading={isAccepting ? undefined : <Check size={18} color="#fff" />}
                  style={{ flex: 2 }}
                />
              </View>
            ) : mode === 'accepted' ? (
              <DashButton
                title="이미 연락처를 공유했어요"
                variant="secondary"
                size="lg"
                block
                disabled
              />
            ) : mode === 'requested' ? (
              <DashButton
                title="요청을 보냈어요"
                variant="secondary"
                size="lg"
                block
                disabled
                leading={<Check size={16} color={colors.textMuted} />}
              />
            ) : (
              <DashButton
                title={isSending ? '요청 중...' : '연락 요청하기'}
                variant="primary"
                size="lg"
                block
                onPress={handleContactRequest}
                loading={isSending}
                leading={isSending ? undefined : <Heart size={18} color="#fff" fill="#fff" />}
              />
            )}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: {
    backgroundColor: colors.primarySoft,
    paddingTop: 8,
    paddingBottom: 36,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  avatarRing: {
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 999,
  },
  acceptedCard: {
    marginTop: spacing.xl,
    width: '100%',
    backgroundColor: colors.acceptSoft,
    borderColor: colors.acceptBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  acceptedTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  acceptedTitle: { fontSize: 12, fontWeight: '700', color: colors.acceptText, letterSpacing: -0.2 },
  acceptedInner: {
    backgroundColor: '#fff',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  contactLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  acceptedContact: { fontSize: 15, fontWeight: '700', color: colors.text, letterSpacing: -0.3 },
  bioSection: { padding: spacing.xxl, paddingTop: spacing.xxl + 4 },
  bioLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  footer: {
    padding: spacing.xxl,
    paddingBottom: spacing.xxl + 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
