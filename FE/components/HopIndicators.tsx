import { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import { colors, fontFamily } from '../theme';
import { FREE_HOP_LIMIT } from '../stores/membershipStore';

export interface TrailNode {
  id: string;
  name: string;
}

export function HopPill({ hop }: { hop: number }) {
  const isPlus = hop > FREE_HOP_LIMIT;
  const bg = isPlus ? colors.plus.accentSoft : colors.primarySoft;
  const fg = isPlus ? colors.plus.accent : colors.primary;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      {isPlus && <Crown size={9} color={fg} fill={fg} />}
      <Text style={[styles.pillText, { color: fg }]}>{hop}촌</Text>
    </View>
  );
}

export function HopBreadcrumb({ trail, currentHop }: { trail: TrailNode[]; currentHop: number }) {
  const nodes: TrailNode[] = [{ id: 'me', name: '나' }, ...trail];
  return (
    <View style={styles.crumbWrap}>
      {nodes.map((n, i) => (
        <Fragment key={n.id}>
          {i > 0 && <Text style={styles.sep}>›</Text>}
          <Text
            style={[
              styles.crumb,
              {
                color: i === nodes.length - 1 ? colors.text : colors.textMuted,
                fontWeight: i === nodes.length - 1 ? '700' : '500',
              },
            ]}
          >
            {n.name}
          </Text>
        </Fragment>
      ))}
      <Text style={styles.sep}>›</Text>
      <View style={[styles.pill, { backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.pillText, { color: colors.primary }]}>{currentHop}촌</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillText: { fontFamily, fontSize: 10, fontWeight: '700', letterSpacing: 0.1 },
  crumbWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  crumb: { fontFamily, fontSize: 12, letterSpacing: -0.1 },
  sep: { fontFamily, color: colors.textFaint, fontSize: 10 },
});
