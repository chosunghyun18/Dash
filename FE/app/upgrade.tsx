import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crown, Users, Heart, Sparkles } from 'lucide-react-native';
import { DashButton } from '../components/DashButton';
import {
  useMembershipStore,
  DASH_PLUS_PRICE,
  DASH_PLUS_PRICE_YEARLY,
} from '../stores/membershipStore';
import { colors, radius, spacing, typography, fontFamily } from '../theme';

type PlanId = 'yearly' | 'monthly';

const BENEFITS = [
  { Icon: Users, title: '무제한 촌수', desc: '2촌 · 3촌 · 4촌… 필요한 만큼 계속 타고 들어갈 수 있어요.' },
  { Icon: Heart, title: '3촌+ 소개글 열람 & 연락 요청', desc: '멀리 있는 지인에게도 먼저 다가갈 수 있어요.' },
  { Icon: Sparkles, title: "'소개 보기' 월 5회 무료", desc: '건당 1,900원 대신 월 5회까지 무료로 열람.' },
  { Icon: Crown, title: 'Plus 배지 · 우선 매칭', desc: '프로필에 Plus 표시 · 관심도 높은 분에게 먼저 노출.' },
];

export default function UpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const upgradeToPlus = useMembershipStore((s) => s.upgradeToPlus);
  const [plan, setPlan] = useState<PlanId>('monthly');

  const handleSubscribe = () => {
    upgradeToPlus();
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.bg },
        }}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroMark}>
              <Crown size={28} color="#fff" fill="#fff" />
            </View>
            <Text style={styles.heroTitle}>
              Dash<Text style={{ color: colors.plus.accent }}>+</Text>
            </Text>
            <Text style={styles.heroSub}>
              지인의 지인의 지인까지{'\n'}
              <Text style={{ color: colors.text, fontWeight: '700' }}>무제한으로 탐색</Text>하세요
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefits}>
            {BENEFITS.map(({ Icon, title, desc }) => (
              <View key={title} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Icon size={18} color={colors.plus.accent} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.benefitTitle}>{title}</Text>
                  <Text style={styles.benefitDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Plan selector */}
          <View style={styles.planSection}>
            <Text style={styles.planLabel}>플랜 선택</Text>
            <PlanOption
              selected={plan === 'yearly'}
              onSelect={() => setPlan('yearly')}
              title="연간"
              priceTop={`${DASH_PLUS_PRICE_YEARLY.toLocaleString('ko-KR')}원`}
              priceSub="/년 · 월 8,250원"
              badge="2개월 무료"
            />
            <PlanOption
              selected={plan === 'monthly'}
              onSelect={() => setPlan('monthly')}
              title="월간"
              priceTop={`${DASH_PLUS_PRICE.toLocaleString('ko-KR')}원`}
              priceSub="/월"
            />
          </View>
        </ScrollView>

        {/* Sticky CTA */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <DashButton
            title="Dash+ 시작하기"
            variant="primary"
            size="lg"
            block
            onPress={handleSubscribe}
            leading={<Crown size={16} color="#fff" fill="#fff" />}
            style={{ backgroundColor: colors.plus.accent }}
          />
          <Text style={styles.footerFine}>7일 무료 체험 · 언제든 해지 가능</Text>
        </View>
      </View>
    </>
  );
}

function PlanOption({
  selected,
  onSelect,
  title,
  priceTop,
  priceSub,
  badge,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  priceTop: string;
  priceSub: string;
  badge?: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      style={[
        styles.planOption,
        {
          borderColor: selected ? colors.plus.accent : colors.border,
          backgroundColor: selected ? colors.plus.accentSoft : colors.bg,
        },
      ]}
    >
      <View
        style={[
          styles.radio,
          { borderColor: selected ? colors.plus.accent : '#ddd', backgroundColor: selected ? colors.plus.accent : '#fff' },
        ]}
      >
        {selected && <View style={styles.radioDot} />}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.planTitle}>{title}</Text>
          {badge && (
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.planPrice}>{priceTop}</Text>
        <Text style={styles.planPriceSub}>{priceSub}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.plus.accentSoft,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: 'center',
  },
  heroMark: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.plus.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.plus.accent,
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  heroTitle: { fontFamily, fontSize: 26, fontWeight: '800', letterSpacing: -0.8, color: colors.text, marginBottom: 8 },
  heroSub: { fontFamily, fontSize: 14, color: colors.textMuted, lineHeight: 22, letterSpacing: -0.2, textAlign: 'center' },
  benefits: { paddingHorizontal: spacing.xxl, paddingTop: spacing.xs, paddingBottom: spacing.xxl },
  benefitRow: { flexDirection: 'row', gap: 14, paddingVertical: 14, alignItems: 'flex-start' },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.plus.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: { fontFamily, fontSize: 14, fontWeight: '700', letterSpacing: -0.3, color: colors.text, marginBottom: 3 },
  benefitDesc: { fontFamily, fontSize: 12, color: colors.textMuted, lineHeight: 18, letterSpacing: -0.1 },
  planSection: { paddingHorizontal: spacing.xxl, paddingBottom: spacing.xxl },
  planLabel: {
    fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textFaint,
    letterSpacing: 0.3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: radius.lg,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  planTitle: { fontFamily, fontSize: 15, fontWeight: '700', letterSpacing: -0.3, color: colors.text },
  planBadge: { backgroundColor: '#FFF0F2', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 },
  planBadgeText: { fontFamily, fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.1 },
  planPrice: { fontFamily, fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: colors.text },
  planPriceSub: { fontFamily, fontSize: 11, color: colors.textFaint, marginTop: 1 },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: 12,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerFine: { ...typography.hint, color: colors.textFaint, textAlign: 'center', marginTop: 8 },
});
