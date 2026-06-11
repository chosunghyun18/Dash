import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { colors, radius, typography } from '../theme';

type Variant = 'primary' | 'primarySoft' | 'secondary' | 'outline' | 'reject' | 'accept' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leading?: ReactNode;
  style?: ViewStyle;
}

const HEIGHT: Record<Size, number> = { sm: 32, md: 40, lg: 52 };
const PAD_H: Record<Size, number> = { sm: 12, md: 16, lg: 20 };

const VARIANT_STYLE: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: '#fff' },
  primarySoft: { bg: colors.primarySoft, fg: colors.primary },
  secondary: { bg: '#F5F5F5', fg: '#333' },
  outline: { bg: '#fff', fg: colors.text, border: colors.border },
  reject: { bg: colors.reject, fg: colors.rejectText },
  accept: { bg: colors.accept, fg: '#fff' },
  ghost: { bg: 'transparent', fg: colors.primary },
};

export function DashButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  block,
  disabled,
  loading,
  leading,
  style,
}: Props) {
  const v = VARIANT_STYLE[variant];
  const buttonText: TextStyle =
    size === 'lg' ? typography.buttonLg : size === 'md' ? typography.buttonMd : typography.buttonSm;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PAD_H[size],
          backgroundColor: v.bg,
          borderRadius: radius.md,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          alignSelf: block ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
        block && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {leading}
          <Text numberOfLines={1} style={[buttonText, { color: v.fg }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
