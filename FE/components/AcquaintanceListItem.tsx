import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { DashButton } from './DashButton';
import { colors, radius, spacing, typography } from '../theme';
import type { Acquaintance } from '../types';

interface Props {
  acquaintance: Acquaintance;
  onPress: () => void;
  isPaid?: boolean;
}

export function AcquaintanceListItem({ acquaintance, onPress, isPaid = false }: Props) {
  const bio = acquaintance.bio ?? '';
  const preview = bio.length > 22 ? bio.slice(0, 22) + '…' : bio;

  return (
    <View style={styles.row}>
      <Avatar nickname={acquaintance.nickname} size={44} />
      <View style={styles.info}>
        <Text style={[typography.listItemName, { color: colors.text }]} numberOfLines={1}>
          {acquaintance.nickname}
        </Text>
        {preview ? (
          <Text style={[typography.hint, { color: colors.textFaint, marginTop: 2 }]} numberOfLines={1}>
            {preview}
          </Text>
        ) : null}
      </View>
      <DashButton
        title="소개 보기"
        variant="primary"
        size="sm"
        onPress={onPress}
        leading={isPaid ? undefined : <Lock size={12} color="#fff" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    paddingHorizontal: 12,
    marginHorizontal: spacing.lg,
    marginVertical: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  info: { flex: 1, minWidth: 0 },
});
