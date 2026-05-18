import { View, FlatList, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Lock, Plus } from 'lucide-react-native';
import { useMyFriends, useMyProfile } from '../../hooks/useFriends';
import { FriendListItem } from '../../components/FriendListItem';
import { DashButton } from '../../components/DashButton';
import { useCreateInvitation, useShareInvitation } from '../../hooks/useInvite';
import { colors, spacing, typography } from '../../theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: friends, isLoading } = useMyFriends();
  const { data: myProfile } = useMyProfile();
  const { mutateAsync: createInvitation, isPending: isCreatingInvite } = useCreateInvitation();
  const share = useShareInvitation();

  const handleInvite = async () => {
    try {
      const inv = await createInvitation();
      const inviter = myProfile?.nickname ?? 'Dash';
      await share(inviter, inv.shareUrl);
    } catch {
      Alert.alert('오류', '초대 링크를 만들지 못했어요.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const count = friends?.length ?? 0;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[typography.brand, { color: colors.primary }]}>Dash</Text>
        <Text style={[styles.headerSub, { color: colors.textFaint }]}>믿고 가는 지인의 소개</Text>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.friendCount}>
          내 친구 <Text style={{ color: colors.primary }}>{count}</Text>
        </Text>
        <View style={styles.privacyTag}>
          <Lock size={12} color={colors.textFaint} />
          <Text style={styles.privacyText}>비공개</Text>
        </View>
      </View>

      <FlatList
        data={friends ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FriendListItem
            friend={item}
            onProfilePress={() => router.push(`/profile/${item.userId}`)}
            onAcquaintancesPress={() => router.push(`/acquaintances/${item.userId}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        contentContainerStyle={{ paddingVertical: 4 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Heart size={30} color={colors.primary} />
            </View>
            <Text style={[typography.sectionHeading, { color: colors.text, marginTop: 16 }]}>
              아직 등록된 친구가 없어요
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.textMuted, textAlign: 'center', marginTop: 6 },
              ]}
            >
              친구를 추가하면 친구의 지인 중에서{'\n'}좋은 사람을 소개받을 수 있어요.
            </Text>
            <DashButton
              title="친구 초대하기"
              variant="primary"
              size="md"
              onPress={handleInvite}
              loading={isCreatingInvite}
              leading={<Plus size={16} color="#fff" />}
              style={{ marginTop: 20 }}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  subHeader: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    minHeight: 360,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSub: { fontSize: 13, letterSpacing: -0.2, marginTop: 2 },
  friendCount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  privacyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textFaint,
    letterSpacing: -0.1,
  },
});
