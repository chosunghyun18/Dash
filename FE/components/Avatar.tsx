import { View, Text, StyleSheet } from 'react-native';
import { avatarColor } from '../theme';

interface Props {
  nickname: string;
  profileImageUrl?: string | null;
  size?: number;
}

export function Avatar({ nickname, size = 44 }: Props) {
  const color = avatarColor(nickname);
  const initial = nickname.charAt(0) || '?';
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#fff', fontWeight: '600' },
});
