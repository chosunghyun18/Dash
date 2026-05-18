import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors } from '../theme';

type Size = 'lg' | 'md';

interface Props {
  size?: Size;
  showWordmark?: boolean;
  style?: ViewStyle;
}

const SPEC: Record<Size, { box: number; radius: number; icon: number; word: number; shadowR: number }> = {
  lg: { box: 64, radius: 20, icon: 32, word: 32, shadowR: 30 },
  md: { box: 44, radius: 14, icon: 22, word: 22, shadowR: 20 },
};

export function DashMark({ size = 'lg', showWordmark = true, style }: Props) {
  const s = SPEC[size];
  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.box,
          {
            width: s.box,
            height: s.box,
            borderRadius: s.radius,
            shadowColor: '#FF4B6E',
            shadowOpacity: 0.35,
            shadowRadius: s.shadowR,
            shadowOffset: { width: 0, height: 14 },
            elevation: 8,
          },
        ]}
      >
        <Heart size={s.icon} color="#fff" fill="#fff" />
      </View>
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize: s.word }]}>Dash</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14 },
  box: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
});
