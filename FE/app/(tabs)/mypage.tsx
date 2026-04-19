import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { useSentRequests, useReceivedRequests, useMyProfile } from '../../hooks/useFriends';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
};

export default function MyPageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: myProfile } = useMyProfile();
  const { data: received } = useReceivedRequests();
  const { data: sent } = useSentRequests();

  const displayNickname = myProfile?.nickname ?? '나';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Avatar nickname={displayNickname} size={64} />
        <View style={styles.profileInfo}>
          <Text style={styles.nickname}>{displayNickname}</Text>
          {myProfile?.phone && (
            <Text style={styles.profileContact}>📞 {myProfile.phone}</Text>
          )}
          {myProfile?.email && (
            <Text style={styles.profileContact}>✉️ {myProfile.email}</Text>
          )}
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/profile/edit')}>
            <Text style={styles.editBtnText}>나를 소개합니다 수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 받은 연락 요청 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>받은 연락 요청</Text>
        {!received?.length ? (
          <Text style={styles.emptyText}>받은 요청이 없어요</Text>
        ) : (
          received.map((r) => {
            const isPending = r.status === 'PENDING';
            return (
              <TouchableOpacity
                key={r.id}
                style={styles.requestItem}
                onPress={isPending ? () => router.push(`/profile/${r.requesterUserId}?requestId=${r.id}`) : undefined}
                activeOpacity={isPending ? 0.7 : 1}
              >
                <Avatar nickname={r.requesterNickname} size={40} />
                <View style={styles.requestInfo}>
                  <Text style={styles.requestNickname}>{r.requesterNickname}</Text>
                  {r.status === 'ACCEPTED' && (r.contactPhone || r.contactEmail) && (
                    <View style={styles.contactReveal}>
                      {r.contactPhone && <Text style={styles.contactText}>📞 {r.contactPhone}</Text>}
                      {r.contactEmail && <Text style={styles.contactText}>✉️ {r.contactEmail}</Text>}
                    </View>
                  )}
                </View>
                <View style={styles.statusWrap}>
                  <Text style={[
                    styles.requestStatus,
                    r.status === 'ACCEPTED' && styles.statusAccepted,
                    r.status === 'REJECTED' && styles.statusRejected,
                    r.status === 'PENDING' && styles.statusPending,
                  ]}>
                    {STATUS_LABEL[r.status]}
                  </Text>
                  {isPending && <Text style={styles.chevron}>›</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.divider} />

      {/* 보낸 연락 요청 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>보낸 연락 요청</Text>
        {!sent?.length ? (
          <Text style={styles.emptyText}>보낸 요청이 없어요</Text>
        ) : (
          sent.map((r) => (
            <View key={r.id} style={styles.requestItem}>
              <Avatar nickname={r.targetNickname} size={40} />
              <View style={styles.requestInfo}>
                <Text style={styles.requestNickname}>{r.targetNickname}</Text>
                {r.status === 'ACCEPTED' && (r.contactPhone || r.contactEmail) && (
                  <View style={styles.contactReveal}>
                    {r.contactPhone && <Text style={styles.contactText}>📞 {r.contactPhone}</Text>}
                    {r.contactEmail && <Text style={styles.contactText}>✉️ {r.contactEmail}</Text>}
                  </View>
                )}
              </View>
              <Text style={[
                styles.requestStatus,
                r.status === 'ACCEPTED' && styles.statusAccepted,
                r.status === 'REJECTED' && styles.statusRejected,
                r.status === 'PENDING' && styles.statusPending,
              ]}>
                {STATUS_LABEL[r.status]}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 40 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1A1A1A' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 16,
  },
  profileInfo: { flex: 1 },
  nickname: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  profileContact: { fontSize: 13, color: '#555', marginBottom: 2 },
  editBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editBtnText: { fontSize: 13, color: '#444', fontWeight: '500' },
  divider: { height: 8, backgroundColor: '#F8F8F8' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  emptyText: { color: '#999', fontSize: 14 },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  requestInfo: { flex: 1 },
  requestNickname: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  contactReveal: { marginTop: 4, gap: 2 },
  contactText: { fontSize: 13, color: '#333' },
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  requestStatus: { fontSize: 13, fontWeight: '500' },
  statusPending: { color: '#FAAD14' },
  statusAccepted: { color: '#52C41A' },
  statusRejected: { color: '#FF4B6E' },
  chevron: { fontSize: 18, color: '#CCC', lineHeight: 20 },
});
