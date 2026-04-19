import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAcquaintances, useReceivedRequests } from '../../hooks/useFriends';
import { AcquaintanceListItem } from '../../components/AcquaintanceListItem';

const IS_PAID = false;

export default function AcquaintancesScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { data: acquaintances, isLoading } = useAcquaintances(Number(userId));
  const { data: received } = useReceivedRequests();

  // 해당 인원이 나에게 PENDING 요청을 보냈는지 확인
  const getPendingRequestId = (profileUserId: number) =>
    received?.find(r => r.requesterUserId === profileUserId && r.status === 'PENDING')?.id;

  const navigateToProfile = (profileUserId: number) => {
    const requestId = getPendingRequestId(profileUserId);
    if (requestId) {
      router.push(`/profile/${profileUserId}?requestId=${requestId}`);
    } else {
      router.push(`/profile/${profileUserId}`);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '지인 친구 리스트',
          headerBackTitle: '',
          headerTintColor: '#FF4B6E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#FF4B6E" size="large" />
          </View>
        ) : (
          <FlatList
            data={acquaintances}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <AcquaintanceListItem
                acquaintance={item}
                onPress={() => navigateToProfile(item.userId)}
                onIntroPress={() => router.push(`/acquaintances/${item.userId}`)}
                isPaid={IS_PAID}
              />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>소개해줄 지인이 없어요</Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: '#999', fontSize: 15 },
});
