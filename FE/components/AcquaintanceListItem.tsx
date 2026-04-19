import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import type { Acquaintance } from '../types';

interface Props {
  acquaintance: Acquaintance;
  onPress: () => void;
  onIntroPress?: () => void;
  isPaid?: boolean;
}

export function AcquaintanceListItem({ acquaintance, onPress, onIntroPress, isPaid = false }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Avatar nickname={acquaintance.nickname} profileImageUrl={acquaintance.profileImageUrl} size={52} />
      <View style={styles.info}>
        <Text style={styles.nickname}>{acquaintance.nickname}</Text>
      </View>
      {isPaid && acquaintance.hasAcquaintances && (
        <TouchableOpacity style={styles.introBtn} onPress={onIntroPress}>
          <Text style={styles.introBtnText}>소개 보기</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 14,
  },
  info: { flex: 1 },
  nickname: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  introBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FF4B6E',
    borderRadius: 8,
  },
  introBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
});
