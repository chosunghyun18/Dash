import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Crown } from 'lucide-react-native';
import { colors, fontFamily } from '../theme';

type Variant = 'solid' | 'soft';
type Size = 'xs' | 'sm' | 'md';

interface Props {
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
}

const SIZES: Record<Size, { fs: number; padV: number; padH: number; gap: number; icon: number; r: number }> = {
  xs: { fs: 9, padV: 2, padH: 5, gap: 3, icon: 8, r: 4 },
  sm: { fs: 11, padV: 3, padH: 7, gap: 4, icon: 10, r: 5 },
  md: { fs: 12, padV: 4, padH: 9, gap: 4, icon: 12, r: 6 },
};

export function PlusBadge({ variant = 'solid', size = 'xs', style }: Props) {
  const s = SIZES[size];
  const solid = variant === 'solid';
  const bg = solid ? colors.plus.accent : colors.plus.accentSoft;
  const fg = solid ? '#fff' : colors.plus.accent;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, paddingVertical: s.padV, paddingHorizontal: s.padH, gap: s.gap, borderRadius: s.r },
        style,
      ]}
    >
      <Crown size={s.icon} color={fg} fill={fg} />
      <Text style={[styles.text, { color: fg, fontSize: s.fs }]}>Plus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  text: { fontFamily, fontWeight: '800', letterSpacing: 0.1 },
});
