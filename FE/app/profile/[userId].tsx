import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useUserProfile, useSendContactRequest, useAcceptContactRequest, useRejectContactRequest } from '../../hooks/useFriends';
import { Avatar } from '../../components/Avatar';

type AcceptedInfo = { phone?: string; email?: string };

export default function ProfileScreen() {
  const router = useRouter();
  const { userId, requestId } = useLocalSearchParams<{ userId: string; requestId?: string }>();
  const isAcceptMode = !!requestId;

  const [acceptedInfo, setAcceptedInfo] = useState<AcceptedInfo | null>(null);

  const { data: profile, isLoading } = useUserProfile(Number(userId));
  const { mutate: sendRequest, isPending: isSending } = useSendContactRequest();
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptContactRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectContactRequest();

  const handleContactRequest = () => {
    if (!profile) return;
    Alert.alert(
      '연락 요청',
      `${profile.nickname}님께 연락 요청을 보낼까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '요청 보내기',
          onPress: () =>
            sendRequest(Number(userId), {
              onSuccess: () => Alert.alert('완료', '연락 요청을 보냈어요!'),
              onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
            }),
        },
      ]
    );
  };

  const handleAccept = () => {
    if (!profile) return;
    Alert.alert(
      '요청 수락',
      `${profile.nickname}님의 연락 요청을 수락할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '수락',
          onPress: () =>
            acceptRequest(Number(requestId), {
              onSuccess: (res) => {
                setAcceptedInfo({ phone: res.contactPhone, email: res.contactEmail });
              },
              onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
            }),
        },
      ]
    );
  };

  const handleReject = () => {
    if (!profile) return;
    Alert.alert(
      '요청 거절',
      `${profile.nickname}님의 연락 요청을 거절할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '거절',
          style: 'destructive',
          onPress: () =>
            rejectRequest(Number(requestId), {
              onSuccess: () => {
                Alert.alert('완료', '거절 처리됐어요.', [
                  { text: '확인', onPress: () => router.back() },
                ]);
              },
              onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
            }),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '나를 소개합니다',
          headerBackTitle: '',
          headerTintColor: '#FF4B6E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FF4B6E" size="large" />
        </View>
      ) : !profile ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>프로필을 찾을 수 없어요</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.imageSection}>
              <Avatar nickname={profile.nickname} size={120} />
              <Text style={styles.nickname}>{profile.nickname}</Text>
            </View>
            <View style={styles.introSection}>
              <Text style={styles.introLabel}>자기소개</Text>
              <Text style={styles.introText}>{profile.introText}</Text>
            </View>
          </ScrollView>

          {/* 하단 액션 영역 */}
          <View style={styles.footer}>
            {/* 수락 모드: 수락 완료 후 연락처 표시 */}
            {isAcceptMode && acceptedInfo ? (
              <View style={styles.contactBox}>
                <Text style={styles.contactBoxLabel}>연락처</Text>
                {acceptedInfo.phone && (
                  <Text style={styles.contactBoxText}>📞 {acceptedInfo.phone}</Text>
                )}
                {acceptedInfo.email && (
                  <Text style={styles.contactBoxText}>✉️ {acceptedInfo.email}</Text>
                )}
              </View>
            ) : isAcceptMode ? (
              /* 수락 모드: 거절(좌) + 수락(우) */
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.rejectBtn, isRejecting && styles.btnDisabled]}
                  onPress={handleReject}
                  disabled={isRejecting || isAccepting}
                >
                  <Text style={styles.rejectBtnText}>
                    {isRejecting ? '처리 중...' : '거절'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.acceptBtn, isAccepting && styles.btnDisabled]}
                  onPress={handleAccept}
                  disabled={isAccepting || isRejecting}
                >
                  <Text style={styles.acceptBtnText}>
                    {isAccepting ? '처리 중...' : '수락'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* 일반 모드: 연락 요청 */
              <TouchableOpacity
                style={[styles.contactBtn, isSending && styles.btnDisabled]}
                onPress={handleContactRequest}
                disabled={isSending}
              >
                <Text style={styles.contactBtnText}>
                  {isSending ? '요청 중...' : '연락 요청'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#999', fontSize: 15 },
  scrollContent: { paddingBottom: 20 },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF5F7',
    gap: 16,
  },
  nickname: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  introSection: { padding: 24 },
  introLabel: { fontSize: 13, fontWeight: '600', color: '#FF4B6E', marginBottom: 12, letterSpacing: 0.5 },
  introText: { fontSize: 16, color: '#333', lineHeight: 26 },
  footer: {
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  actionRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rejectBtnText: { color: '#666', fontSize: 17, fontWeight: '700' },
  acceptBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#52C41A',
  },
  acceptBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  contactBtn: {
    backgroundColor: '#FF4B6E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
  contactBox: {
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#B7EB8F',
  },
  contactBoxLabel: { fontSize: 13, fontWeight: '600', color: '#52C41A', marginBottom: 4 },
  contactBoxText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
});
