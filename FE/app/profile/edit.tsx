import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMyProfile, useUpdateMyProfile, useCheckNickname } from '../../hooks/useFriends';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { data: myProfile, isLoading: isProfileLoading } = useMyProfile();

  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [introText, setIntroText] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [lastCheckedNickname, setLastCheckedNickname] = useState('');
  const [initialized, setInitialized] = useState(false);

  // 프로필 데이터 로드 후 초기값 세팅
  useEffect(() => {
    if (myProfile && !initialized) {
      setNickname(myProfile.nickname);
      setPhone(myProfile.phone ?? '');
      setEmail(myProfile.email ?? '');
      setIntroText(myProfile.introText);
      setLastCheckedNickname(myProfile.nickname);
      setNicknameChecked(true); // 현재 닉네임은 중복 체크 통과 상태
      setInitialized(true);
    }
  }, [myProfile, initialized]);

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
        if (!res.available) {
          Alert.alert('중복 확인', '이미 사용 중인 닉네임이에요.');
        }
      },
      onError: () => Alert.alert('오류', '잠시 후 다시 시도해주세요.'),
    });
  };

  const handleSave = () => {
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
    if (phone.trim() && email.trim()) {
      Alert.alert('알림', '연락처는 휴대폰 번호 또는 이메일 중 하나만 입력해주세요.');
      return;
    }
    if (!introText.trim()) {
      Alert.alert('알림', '소개글을 입력해주세요.');
      return;
    }

    updateProfile(
      {
        nickname: nickname.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        introText: introText.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert('완료', '프로필이 저장됐어요!', [
            { text: '확인', onPress: () => router.back() },
          ]);
        },
        onError: () => Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.'),
      }
    );
  };

  if (isProfileLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF4B6E" size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '프로필 수정',
          headerBackTitle: '',
          headerTintColor: '#FF4B6E',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={isSaving}>
              {isSaving
                ? <ActivityIndicator color="#FF4B6E" size="small" />
                : <Text style={styles.saveBtn}>저장</Text>
              }
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

          {/* 닉네임 */}
          <View style={styles.field}>
            <Text style={styles.label}>닉네임 <Text style={styles.required}>*</Text></Text>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={nickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임 입력"
                maxLength={12}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.checkBtn, isChecking && styles.checkBtnDisabled]}
                onPress={handleCheckNickname}
                disabled={isChecking}
              >
                {isChecking
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.checkBtnText}>중복 확인</Text>
                }
              </TouchableOpacity>
            </View>
            {nicknameChecked === true && (
              <Text style={styles.available}>사용 가능한 닉네임이에요</Text>
            )}
            {nicknameChecked === false && (
              <Text style={styles.unavailable}>이미 사용 중인 닉네임이에요</Text>
            )}
          </View>

          {/* 연락처 */}
          <View style={styles.field}>
            <Text style={styles.label}>연락처</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="휴대폰 번호 (선택)"
              keyboardType="phone-pad"
              returnKeyType="done"
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일 (선택)"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />
            <Text style={styles.hint}>휴대폰 번호 또는 이메일 중 하나만 입력  •  수락한 상대에게만 공개돼요</Text>
          </View>

          {/* 소개글 */}
          <View style={styles.field}>
            <Text style={styles.label}>소개글 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={introText}
              onChangeText={setIntroText}
              placeholder="나를 소개해주세요..."
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{introText.length} / 500</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { fontSize: 16, fontWeight: '700', color: '#FF4B6E', marginRight: 4 },
  field: { marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  required: { color: '#FF4B6E' },
  row: { flexDirection: 'row', gap: 8 },
  inputFlex: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  textArea: { height: 160, paddingTop: 12 },
  checkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FF4B6E',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  checkBtnDisabled: { opacity: 0.6 },
  checkBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  available: { marginTop: 6, fontSize: 13, color: '#52C41A' },
  unavailable: { marginTop: 6, fontSize: 13, color: '#FF4B6E' },
  hint: { marginTop: 6, fontSize: 12, color: '#999' },
  charCount: { marginTop: 6, fontSize: 12, color: '#999', textAlign: 'right' },
});
