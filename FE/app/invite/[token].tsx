import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Check } from 'lucide-react-native';
import { invitationService } from '../../services/invitation';
import { useAuthStore } from '../../stores/authStore';
import { DashMark } from '../../components/DashMark';
import { DashButton } from '../../components/DashButton';
import { Avatar } from '../../components/Avatar';
import { colors, radius, spacing, typography } from '../../theme';

export default function InviteAcceptScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const status = useAuthStore((s) => s.status);
  const [accepted, setAccepted] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['invitation', 'validate', token],
    queryFn: () => invitationService.validate(String(token)),
    enabled: !!token,
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () => invitationService.accept(String(token)),
    onSuccess: () => {
      setAccepted(true);
    },
    onError: () => {
      Alert.alert('오류', '초대를 수락하지 못했어요. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleAccept = () => {
    if (status !== 'authenticated') {
      router.replace('/login');
      return;
    }
    acceptMutation.mutate();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '초대',
          headerBackTitle: '',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.primarySoft },
          headerTitleStyle: { fontSize: 16, fontWeight: '700' },
        }}
      />
      <View style={[styles.container, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.hero}>
          <DashMark size="lg" />
        </View>

        <View style={styles.body}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : error || !data ? (
            <View style={styles.errorBlock}>
              <Text style={[typography.profileName, { color: colors.text, textAlign: 'center' }]}>
                만료되었거나{'\n'}유효하지 않은 초대 링크예요
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center', marginTop: 12 }]}>
                초대한 친구에게 링크를 다시 받아주세요.
              </Text>
            </View>
          ) : accepted ? (
            <View style={styles.acceptedBlock}>
              <View style={styles.checkCircle}>
                <Check size={40} color={colors.acceptText} strokeWidth={3} />
              </View>
              <Text style={[typography.profileName, { color: colors.text, marginTop: 16 }]}>
                {data.inviterNickname}님과 친구가 되었어요
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 8, textAlign: 'center' }]}>
                이제 서로의 지인 목록에서{'\n'}좋은 사람을 소개받을 수 있어요.
              </Text>
            </View>
          ) : (
            <View style={styles.inviteBlock}>
              <Avatar nickname={data.inviterNickname} size={84} />
              <Text style={[typography.profileName, { color: colors.text, marginTop: 16, textAlign: 'center' }]}>
                {data.inviterNickname}님이{'\n'}Dash에 초대했어요
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted, marginTop: 12, textAlign: 'center' }]}>
                수락하면 서로의 친구 목록에 추가되고{'\n'}지인 네트워크가 연결됩니다.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {accepted ? (
            <DashButton
              title="홈으로 가기"
              variant="primary"
              size="lg"
              block
              onPress={() => router.replace('/(tabs)')}
            />
          ) : data && !isLoading && !error ? (
            <DashButton
              title="수락하기"
              variant="primary"
              size="lg"
              block
              onPress={handleAccept}
              loading={acceptMutation.isPending}
              leading={acceptMutation.isPending ? undefined : <Check size={18} color="#fff" />}
            />
          ) : (
            <DashButton
              title="홈으로 가기"
              variant="outline"
              size="lg"
              block
              onPress={() => router.replace(status === 'authenticated' ? '/(tabs)' : '/login')}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.primarySoft,
    paddingTop: 8,
    paddingBottom: 36,
    alignItems: 'center',
  },
  body: { flex: 1, padding: spacing.xxl, justifyContent: 'center', alignItems: 'center' },
  errorBlock: { alignItems: 'center' },
  inviteBlock: { alignItems: 'center' },
  acceptedBlock: { alignItems: 'center' },
  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.acceptSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.acceptBorder,
  },
  footer: {
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
});
