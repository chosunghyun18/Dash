import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { useAcquaintances, useReceivedRequests, useUserProfile } from '../../hooks/useFriends';
import { AcquaintanceListItem } from '../../components/AcquaintanceListItem';
import { Avatar } from '../../components/Avatar';
import { colors, radius, spacing, typography } from '../../theme';

const IS_PAID = false;

export default function AcquaintancesScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { data: acquaintances, isLoading } = useAcquaintances(Number(userId));
  const { data: friend } = useUserProfile(Number(userId));
  const { data: received } = useReceivedRequests();

  const getPendingRequestId = (profileUserId: number) =>
    received?.find((r) => r.requesterUserId === profileUserId && r.status === 'PENDING')?.id;

  const navigateToProfile = (profileUserId: number) => {
    const requestId = getPendingRequestId(profileUserId);
    router.push(
      requestId ? `/profile/${profileUserId}?requestId=${requestId}` : `/profile/${profileUserId}`
    );
  };

  const totalCount = acquaintances?.length ?? 0;

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
            data={acquaintances ?? []}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <AcquaintanceListItem
                acquaintance={item}
                onPress={() => navigateToProfile(item.userId)}
                isPaid={IS_PAID}
              />
            )}
            ListHeaderComponent={
              <View style={styles.contextRow}>
                <Avatar nickname={friend?.nickname ?? '?'} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.listItemName, { color: colors.text }]}>
                    {friend?.nickname ? `${friend.nickname}님의 지인` : '지인'}
                  </Text>
                  <Text style={[typography.hint, { color: colors.textFaint, marginTop: 2 }]}>
                    총 {totalCount}명
                  </Text>
                </View>
              </View>
            }
            ListFooterComponent={
              totalCount > 0 ? (
                <View style={styles.pricingBox}>
                  <View style={styles.pricingTitleRow}>
                    <Sparkles size={16} color={colors.primary} />
                    <Text style={[typography.body, styles.pricingTitle]}>소개 보기는 건당 1,900원이에요.</Text>
                  </View>
                  <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                    진짜 관심 있는 분만 열어보세요.
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={[typography.caption, { color: colors.textFaint }]}>
                  {friend?.nickname ?? '친구'}님이 아직 지인을 등록하지 않았어요
                </Text>
              </View>
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
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  pricingBox: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    backgroundColor: colors.primarySoft,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  pricingTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pricingTitle: { color: colors.text, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80 },
});
