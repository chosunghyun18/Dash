import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { DashMark } from '../components/DashMark';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { useSocialLogin } from '../hooks/useAuth';
import { colors, typography } from '../theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithApple, loginWithGoogle, devLogin, appleLoading, googleLoading } = useSocialLogin();

  const handleApple = async () => {
    const ok = await loginWithApple();
    if (!ok) Alert.alert('연결 실패', '연결에 실패했어요. 다시 시도해주세요.');
  };

  const handleGoogle = async () => {
    const ok = await loginWithGoogle();
    if (!ok) Alert.alert('연결 실패', '연결에 실패했어요. 다시 시도해주세요.');
  };

  const buttons =
    Platform.OS === 'ios'
      ? [
          <SocialAuthButton key="apple" provider="apple" onPress={handleApple} loading={appleLoading} disabled={googleLoading} />,
          <SocialAuthButton key="google" provider="google" onPress={handleGoogle} loading={googleLoading} disabled={appleLoading} />,
        ]
      : [
          <SocialAuthButton key="google" provider="google" onPress={handleGoogle} loading={googleLoading} disabled={appleLoading} />,
          <SocialAuthButton key="apple" provider="apple" onPress={handleApple} loading={appleLoading} disabled={googleLoading} />,
        ];

  const bottomPad = Platform.select({ ios: 28, android: 18, default: 20 });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.bgGlow1} />
        <View style={styles.bgGlow2} />

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 24, paddingBottom: insets.bottom + (bottomPad ?? 20) },
          ]}
        >
          <View style={styles.heroBlock}>
            <DashMark size="lg" />
            <View style={{ marginTop: 28, alignItems: 'center' }}>
              <Text style={styles.copy}>믿고 가는</Text>
              <Text style={[styles.copy, { color: colors.primary }]}>지인의 소개</Text>
            </View>
            <Text style={styles.subCopy}>친구가 직접 등록한 사람들과 만나보세요</Text>
          </View>

          <View style={styles.buttonsBlock}>
            {buttons[0]}
            {buttons[1]}
            {__DEV__ && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={devLogin}
                style={styles.devButton}
              >
                <Text style={styles.devButtonText}>개발 모드로 건너뛰기</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.privacyRow}>
            <Lock size={12} color={colors.textFaint} />
            <Text style={styles.privacy}>연락처와 프로필은 매칭 수락 후에만 공개돼요</Text>
          </View>
          <Text style={styles.terms}>
            계속하면 <Text style={styles.link}>이용약관</Text> · <Text style={styles.link}>개인정보처리방침</Text>에 동의하는 것으로 간주됩니다
          </Text>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primarySoft },
  bgGlow1: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: 'rgba(255,75,110,0.15)',
  },
  bgGlow2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  heroBlock: { alignItems: 'center', marginTop: 48 },
  copy: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
    lineHeight: 32,
  },
  subCopy: {
    marginTop: 14,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: -0.2,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonsBlock: { gap: 10, marginTop: 36 },
  devButton: {
    marginTop: 4,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  devButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: -0.2,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  privacy: {
    fontSize: 12,
    color: colors.textFaint,
    letterSpacing: -0.1,
  },
  terms: {
    ...typography.hint,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 11,
  },
  link: { textDecorationLine: 'underline', color: colors.textMuted },
});
