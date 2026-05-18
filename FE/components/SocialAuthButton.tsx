import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Apple } from 'lucide-react-native';
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

const GOOGLE_LOGO = 'G';

export function SocialAuthButton({ provider, onPress, loading, disabled, style }: Props) {
  const isDark = provider === 'apple';
  const bg = isDark ? '#000' : '#fff';
  const fg = isDark ? '#fff' : colors.text;
  const border = isDark ? 'transparent' : colors.border;

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
          borderWidth: isDark ? 0 : 1,
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
          {provider === 'apple' ? (
            <Apple size={20} color={fg} fill={fg} />
          ) : (
            <Text style={[styles.icon, { color: '#4285F4' }]}>{GOOGLE_LOGO}</Text>
          )}
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
  icon: { fontSize: 20, fontWeight: '700' },
  label: { fontSize: 15, fontWeight: '600', letterSpacing: -0.3 },
});
