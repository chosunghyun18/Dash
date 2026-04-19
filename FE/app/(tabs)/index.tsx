import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMyFriends } from '../../hooks/useFriends';
import { FriendListItem } from '../../components/FriendListItem';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: friends, isLoading } = useMyFriends();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF4B6E" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Dash</Text>
        <Text style={styles.headerSub}>믿고 가는 지인의 소개</Text>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FriendListItem
            friend={item}
            onPress={() => router.push(`/acquaintances/${item.userId}`)}
            onProfilePress={() => router.push(`/profile/${item.userId}`)}
            onAcquaintancesPress={() => router.push(`/acquaintances/${item.userId}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 추가한 친구가 없어요</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FF4B6E' },
  headerSub: { fontSize: 13, color: '#999', marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: '#999', fontSize: 15 },
});
