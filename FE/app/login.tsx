import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { DashMark } from '../components/DashMark';
import { SocialAuthButton } from '../components/SocialAuthButton';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import { colors, typography } from '../theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const startAuthenticating = useAuthStore((s) => s.startAuthenticating);
  const setSession = useAuthStore((s) => s.setSession);
  const cancelAuthenticating = useAuthStore((s) => s.cancelAuthenticating);

  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleApple = async () => {
    try {
      setAppleLoading(true);
      startAuthenticating('apple');
      const res = await authService.loginWithApple({
        identityToken: 'mock-identity-token',
        authorizationCode: 'mock-auth-code',
      });
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
        provider: 'apple',
      });
      if (res.isNewUser) {
        router.replace('/profile/edit');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      cancelAuthenticating();
      Alert.alert('연결 실패', '연결에 실패했어요. 다시 시도해주세요.');
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      startAuthenticating('google');
      const res = await authService.loginWithGoogle({ idToken: 'mock-google-id-token' });
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        userId: res.userId,
        provider: 'google',
      });
      if (res.isNewUser) {
        router.replace('/profile/edit');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      cancelAuthenticating();
      Alert.alert('연결 실패', '연결에 실패했어요. 다시 시도해주세요.');
    } finally {
      setGoogleLoading(false);
    }
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
