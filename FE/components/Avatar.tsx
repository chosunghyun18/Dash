import { View, Text, StyleSheet } from 'react-native';

const COLORS = ['#FF4B6E', '#FF7A45', '#FFAA00', '#52C41A', '#1890FF', '#7B5CFA'];

interface Props {
  nickname: string;
  profileImageUrl?: string | null;
  size?: number;
}

export function Avatar({ nickname, size = 52 }: Props) {
  const color = COLORS[nickname.charCodeAt(0) % COLORS.length];
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.initial, { fontSize: size * 0.38 }]}>{nickname.charAt(0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#fff', fontWeight: '700' },
});
