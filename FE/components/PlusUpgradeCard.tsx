import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Crown, ChevronRight } from 'lucide-react-native';
import { GradientBox } from './GradientBox';
import { useMembershipStore, DASH_PLUS_PRICE } from '../stores/membershipStore';
import { colors, radius, spacing, fontFamily } from '../theme';

function formatBilling(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function PlusUpgradeCard() {
  const router = useRouter();
  const plan = useMembershipStore((s) => s.plan);
  const plusUntil = useMembershipStore((s) => s.plusUntil);
  const open = () => router.push('/upgrade' as Href);

  // 활성 — 보라 그라디언트
  if (plan === 'plus') {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={open}>
        <GradientBox
          borderRadius={radius.lg}
          colorsRange={[colors.plus.accent, '#9B7EFF']}
          style={styles.cardInner}
        >
          <View style={styles.iconBoxActive}>
            <Crown size={18} color="#fff" fill="#fff" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.titleActive}>Dash+ 이용 중</Text>
            <Text style={styles.subActive}>
              무제한 지인 탐색{plusUntil ? ` · 다음 결제 ${formatBilling(plusUntil)}` : ''}
            </Text>
          </View>
          <ChevronRight size={16} color="rgba(255,255,255,0.9)" />
        </GradientBox>
      </TouchableOpacity>
    );
  }

  // 무료 — 업그레이드 유도
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={open}>
      <GradientBox
        borderRadius={radius.lg}
        colorsRange={[colors.plus.accentSoft, colors.primarySoft]}
        style={[styles.cardInner, styles.freeBorder]}
      >
        <View style={styles.iconBoxFree}>
          <Crown size={18} color="#fff" fill="#fff" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.titleFree}>
            Dash<Text style={{ color: colors.plus.accent }}>+</Text>로 업그레이드
          </Text>
          <Text style={styles.subFree}>지인의 지인의 지인까지 · 무제한 탐색</Text>
        </View>
        <View style={styles.pricePill}>
          <Text style={styles.pricePillText}>월 {DASH_PLUS_PRICE.toLocaleString('ko-KR')}원</Text>
        </View>
      </GradientBox>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  freeBorder: { borderWidth: 1, borderColor: colors.plus.accentSoft },
  iconBoxActive: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxFree: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.plus.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleActive: { fontFamily, fontSize: 14, fontWeight: '800', letterSpacing: -0.3, color: '#fff' },
  subActive: { fontFamily, fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  titleFree: { fontFamily, fontSize: 14, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  subFree: { fontFamily, fontSize: 11, color: colors.textMuted, marginTop: 2, letterSpacing: -0.1 },
  pricePill: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  pricePillText: { fontFamily, fontSize: 11, fontWeight: '700', color: colors.plus.accent, letterSpacing: -0.1 },
});
