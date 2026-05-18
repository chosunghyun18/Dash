import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { DashButton } from './DashButton';
import { colors, radius, spacing, typography } from '../theme';
import type { Friend } from '../types';

interface Props {
  friend: Friend;
  onProfilePress: () => void;
  onAcquaintancesPress: () => void;
}

export function FriendListItem({ friend, onProfilePress, onAcquaintancesPress }: Props) {
  return (
    <View style={styles.row}>
      <Avatar nickname={friend.nickname} size={46} />
      <View style={styles.info}>
        <Text style={[typography.listItemName, { color: colors.text }]} numberOfLines={1}>
          {friend.nickname}
        </Text>
        {friend.bio ? (
          <Text style={styles.note} numberOfLines={1}>
            {friend.bio}
          </Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <DashButton title="프로필" variant="outline" size="sm" onPress={onProfilePress} />
        <DashButton title="지인 목록" variant="primarySoft" size="sm" onPress={onAcquaintancesPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  info: { flex: 1, minWidth: 0 },
  actions: { flexDirection: 'row', gap: 6, flexShrink: 0 },
  note: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textFaint,
    letterSpacing: -0.1,
    marginTop: 3,
  },
});
