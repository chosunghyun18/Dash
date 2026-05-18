import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../theme';

type Status = 'PENDING' | 'ACCEPTED' | 'REJECTED';

const LABEL: Record<Status, string> = {
  PENDING: '대기중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
};

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  const c = colors.status[status.toLowerCase() as 'pending' | 'accepted' | 'rejected'];
  return (
    <View style={[styles.base, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[typography.badge, { color: c.fg }]}>{LABEL[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
});
