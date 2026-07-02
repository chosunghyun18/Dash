import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Phone, Mail, Check, X } from 'lucide-react-native';
import { useMyProfile, useUpdateMyProfile, useCheckNickname } from '../../hooks/useFriends';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../stores/authStore';
import { DashButton } from '../../components/DashButton';
import { ScreenLoader } from '../../components/ScreenLoader';
import { colors, radius, spacing, typography } from '../../theme';

type ContactType = 'phone' | 'email';

export default function ProfileEditScreen() {
  const router = useRouter();
  const pendingRegistration = useAuthStore((s) => s.pendingRegistration);
  const setSession = useAuthStore((s) => s.setSession);
  const registrationMode = !!pendingRegistration;

  const { data: myProfile, isLoading: isProfileLoading } = useMyProfile({
    enabled: !registrationMode,
  });

  const [nickname, setNickname] = useState('');
  const [contactType, setContactType] = useState<ContactType>('phone');
  const [contact, setContact] = useState('');
  const [introText, setIntroText] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [lastCheckedNickname, setLastCheckedNickname] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (myProfile && !registrationMode && !initialized) {
      setNickname(myProfile.nickname);
      if (myProfile.email) {
        setContactType('email');
        setContact(myProfile.email);
      } else {
        setContactType('phone');
        setContact(myProfile.phone ?? '');
      }
      setIntroText(myProfile.introText);
      setLastCheckedNickname(myProfile.nickname);
      setNicknameChecked(true);
      setInitialized(true);
    }
  }, [myProfile, registrationMode, initialized]);

  const { mutate: updateProfile, isPending: isSaving } = useUpdateMyProfile();
  const { mutate: checkNickname, isPending: isChecking } = useCheckNickname();

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setNicknameChecked(null);
  };

  const handleCheckNickname = () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    checkNickname(nickname.trim(), {
      onSuccess: (res) => {
        setNicknameChecked(res.available);
        setLastCheckedNickname(nickname.trim());
      },
      onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
    });
  };

  const handleSave = async () => {
    if (registrationMode) {
      if (!nickname.trim()) {
        Alert.alert('알림', '닉네임을 입력해주세요.');
        return;
      }
      if (!gender) {
        Alert.alert('알림', '성별을 선택해주세요.');
        return;
      }
      if (!introText.trim()) {
        Alert.alert('알림', '소개글을 입력해주세요.');
        return;
      }
      setIsRegistering(true);
      try {
        const res = await authService.register(pendingRegistration!.token, {
          nickname: nickname.trim(),
          gender,
          phone: contactType === 'phone' && contact.trim() ? contact.trim() : undefined,
          email: contactType === 'email' && contact.trim() ? contact.trim() : undefined,
          introText: introText.trim(),
        });
        setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          userId: res.userId,
          provider: pendingRegistration!.provider,
        });
        router.replace('/(tabs)');
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 409) {
          setNicknameChecked(false);
          Alert.alert('알림', '이미 사용 중인 닉네임이에요.');
        } else if (status === 400) {
          // 등록 토큰 만료/무효 → 로그인부터 다시
          Alert.alert('세션 만료', '다시 로그인해주세요.', [
            {
              text: '확인',
              onPress: () => {
                useAuthStore.getState().cancelAuthenticating();
                router.replace('/login');
              },
            },
          ]);
        } else {
          Alert.alert('오류', '등록에 실패했어요. 다시 시도해주세요.');
        }
      } finally {
        setIsRegistering(false);
      }
      return;
    }

    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    if (nicknameChecked === null && nickname.trim() !== lastCheckedNickname) {
      Alert.alert('알림', '닉네임 중복 확인을 해주세요.');
      return;
    }
    if (nicknameChecked === false) {
      Alert.alert('알림', '사용할 수 없는 닉네임이에요.');
      return;
    }
    if (!introText.trim()) {
      Alert.alert('알림', '소개글을 입력해주세요.');
      return;
    }

    const payload = {
      nickname: nickname.trim(),
      phone: contactType === 'phone' && contact.trim() ? contact.trim() : undefined,
      email: contactType === 'email' && contact.trim() ? contact.trim() : undefined,
      introText: introText.trim(),
    };

    updateProfile(payload, {
      onSuccess: () => {
        Alert.alert('완료', '프로필이 저장됐어요!', [
          { text: '확인', onPress: () => router.back() },
        ]);
      },
      onError: () => Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.'),
    });
  };

  if (!registrationMode && isProfileLoading) {
    return <ScreenLoader />;
  }

  const counterColor = introText.length > 450 ? '#D46B08' : colors.textFaint;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: registrationMode ? '첫 프로필 만들기' : '프로필 수정',
          headerBackTitle: '',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.bg },
          headerTitleStyle: { fontSize: 16, fontWeight: '700' },
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={isSaving || isRegistering}>
              {isSaving || isRegistering ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Text style={[typography.listItemName, { color: colors.primary }]}>저장</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* 성별 — 등록 모드에서만 */}
          {registrationMode && (
            <View style={styles.field}>
              <Text style={styles.label}>성별 <Text style={{ color: colors.primary }}>*</Text></Text>
              <View style={styles.toggleRow}>
                <GenderToggle
                  label="남성"
                  active={gender === 'MALE'}
                  onPress={() => setGender('MALE')}
                />
                <GenderToggle
                  label="여성"
                  active={gender === 'FEMALE'}
                  onPress={() => setGender('FEMALE')}
                />
              </View>
              <Text style={styles.hint}>가입 후 변경할 수 없어요</Text>
            </View>
          )}

          {/* 닉네임 */}
          <View style={styles.field}>
            <Text style={styles.label}>닉네임 <Text style={{ color: colors.primary }}>*</Text></Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={nickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임 입력"
                placeholderTextColor={colors.textFaint}
                maxLength={12}
                returnKeyType="done"
              />
              {!registrationMode && (
                <DashButton
                  title="중복 확인"
                  variant="outline"
                  size="md"
                  onPress={handleCheckNickname}
                  loading={isChecking}
                />
              )}
            </View>
            {nicknameChecked === true && (
              <View style={styles.feedbackRow}>
                <Check size={14} color={colors.acceptText} />
                <Text style={[styles.feedback, { color: colors.acceptText }]}>사용 가능한 닉네임이에요</Text>
              </View>
            )}
            {nicknameChecked === false && (
              <View style={styles.feedbackRow}>
                <X size={14} color="#CF1322" />
                <Text style={[styles.feedback, { color: '#CF1322' }]}>이미 사용 중인 닉네임이에요</Text>
              </View>
            )}
          </View>

          {/* 연락처 */}
          <View style={styles.field}>
            <Text style={styles.label}>연락처</Text>
            <View style={styles.toggleRow}>
              <ContactToggle
                label="휴대폰"
                icon="phone"
                active={contactType === 'phone'}
                onPress={() => {
                  setContactType('phone');
                  setContact('');
                }}
              />
              <ContactToggle
                label="이메일"
                icon="email"
                active={contactType === 'email'}
                onPress={() => {
                  setContactType('email');
                  setContact('');
                }}
              />
            </View>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={setContact}
              placeholder={contactType === 'phone' ? '010-0000-0000' : 'name@example.com'}
              placeholderTextColor={colors.textFaint}
              keyboardType={contactType === 'phone' ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              returnKeyType="done"
            />
            <Text style={styles.hint}>수락한 상대에게만 공개됩니다</Text>
          </View>

          {/* 소개글 */}
          <View style={styles.field}>
            <Text style={styles.label}>나를 소개합니다 <Text style={{ color: colors.primary }}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={introText}
              onChangeText={(t) => setIntroText(t.slice(0, 500))}
              placeholder="나를 소개해주세요..."
              placeholderTextColor={colors.textFaint}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={[styles.counter, { color: counterColor }]}>
              {introText.length} / 500
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function ContactToggle({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: 'phone' | 'email';
  active: boolean;
  onPress: () => void;
}) {
  const fg = active ? colors.primary : colors.textMuted;
  const Ico = icon === 'phone' ? Phone : Mail;
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.toggle,
        {
          backgroundColor: active ? colors.primarySoft : colors.bg,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Ico size={16} color={fg} />
      <Text style={[typography.buttonMd, { color: fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function GenderToggle({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.toggle,
        {
          backgroundColor: active ? colors.primarySoft : colors.bg,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={[typography.buttonMd, { color: active ? colors.primary : colors.textMuted }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xxl, paddingBottom: 60 },
  field: { marginBottom: 24 },
  label: { ...typography.caption, color: colors.text, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
  },
  textArea: { height: 140, paddingTop: 12 },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  feedback: { fontSize: 12, letterSpacing: -0.1 },
  hint: { ...typography.hint, color: colors.textFaint, marginTop: 6 },
  counter: { marginTop: 6, fontSize: 12, textAlign: 'right' },
  toggleRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
