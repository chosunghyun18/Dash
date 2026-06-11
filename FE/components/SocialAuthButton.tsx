import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

type Provider = 'apple' | 'google';

interface Props {
  provider: Provider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const LABEL: Record<Provider, string> = {
  apple: 'Apple로 계속하기',
  google: 'Google로 계속하기',
};

function AppleLogo({ size = 20, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.8 3l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5a19.5 19.5 0 1 0 0 39c10.7 0 19.5-7.8 19.5-19.5 0-1.3-.1-2.3-.4-3.5z" />
      <Path fill="#FF3D00" d="m6.3 14.7 6.6 4.8a12 12 0 0 1 11.1-7.5c3 0 5.7 1.1 7.8 3l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5a19.5 19.5 0 0 0-17.7 10.2z" />
      <Path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-2 13.2-5.2l-6.1-5.1c-2 1.4-4.5 2.3-7.1 2.3-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 43.5 24 43.5z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.1 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z" />
    </Svg>
  );
}

export function SocialAuthButton({ provider, onPress, loading, disabled, style }: Props) {
  const isDark = provider === 'apple';
  const bg = isDark ? '#000' : '#fff';
  const fg = isDark ? '#fff' : colors.text;
  const border = isDark ? '#000' : colors.border;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.18 : 0.04,
          shadowRadius: isDark ? 16 : 6,
          shadowOffset: { width: 0, height: isDark ? 6 : 2 },
          elevation: isDark ? 4 : 1,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {provider === 'apple' ? <AppleLogo size={20} color={fg} /> : <GoogleLogo size={20} />}
          <Text style={[styles.label, { color: fg }]}>{LABEL[provider]}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 10,
  },
  label: { fontSize: 15, fontWeight: '600', letterSpacing: -0.3 },
});
