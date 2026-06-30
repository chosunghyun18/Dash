import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, ChevronRight } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { DashButton } from './DashButton';
import { colors, radius, spacing, typography } from '../theme';
import type { Acquaintance } from '../types';

interface Props {
  person: Acquaintance;
  onIntro: () => void;
  /** 더 깊은 지인 목록으로 드릴다운 (지인이 있을 때만). 탐색은 전 촌수 무료. */
  onDrill?: () => void;
}

export function ConnectionCard({ person, onIntro, onDrill }: Props) {
  const bio = person.bio ?? '';
  const preview = bio.length > 22 ? bio.slice(0, 22) + '…' : bio;
  const count = person.acquaintanceCount ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Avatar nickname={person.nickname} size={44} />
        <View style={styles.info}>
          <Text style={[typography.listItemName, { color: colors.text }]} numberOfLines={1}>
            {person.nickname}
          </Text>
          {preview ? (
            <Text style={[styles.bio]} numberOfLines={1}>
              {preview}
            </Text>
          ) : null}
        </View>
        <DashButton title="소개 보기" variant="primary" size="sm" onPress={onIntro} />
      </View>

      {count > 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDrill}
          style={[styles.drillRow, { backgroundColor: colors.bgSoft }]}
        >
          <Users size={14} color={colors.textMuted} />
          <Text style={[styles.drillText, { color: colors.textMuted }]} numberOfLines={1}>
            {person.nickname}님의 지인 {count}명 더 보기
          </Text>
          <ChevronRight size={14} color={colors.textFaint} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  bio: { fontSize: 12, color: colors.textMuted, marginTop: 3, letterSpacing: -0.1 },
  drillRow: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm - 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drillText: { fontSize: 12, fontWeight: '600', letterSpacing: -0.1, flexShrink: 1 },
});
