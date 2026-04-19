import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import type { Friend } from '../types';

interface Props {
  friend: Friend;
  onPress: () => void;
  onProfilePress: () => void;
  onAcquaintancesPress: () => void;
}

export function FriendListItem({ friend, onPress, onProfilePress, onAcquaintancesPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Avatar nickname={friend.nickname} profileImageUrl={friend.profileImageUrl} size={52} />
      <View style={styles.info}>
        <Text style={styles.nickname}>{friend.nickname}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.btn} onPress={onProfilePress}>
            <Text style={styles.btnText}>프로필 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={onAcquaintancesPress}>
            <Text style={styles.btnText}>지인 목록</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  nickname: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  buttons: { flexDirection: 'row', gap: 6 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  btnText: { fontSize: 12, color: '#444', fontWeight: '500' },
});
