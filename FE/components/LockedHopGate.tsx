import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import { Avatar } from './Avatar';
import { DashButton } from './DashButton';
import { PlusBadge } from './PlusBadge';
import { GradientBox } from './GradientBox';
import { DASH_PLUS_PRICE } from '../stores/membershipStore';
import { colors, radius, spacing, fontFamily, typography } from '../theme';

interface Props {
  hop: number;
  count: number;
  sampleName?: string;
  onUpgrade: () => void;
}

export function LockedHopGate({ hop, count, sampleName = '?', onUpgrade }: Props) {
  return (
    <GradientBox
      vertical
      colorsRange={[colors.plus.accentSoft, '#FFFFFF']}
      borderRadius={radius.lg}
      style={styles.wrap}
    >
      {/* 블러 대체: 겹친 아바타 + 반투명 오버레이 */}
      <View style={styles.avatars}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.avatarWrap, { marginLeft: i === 0 ? 0 : -14, opacity: 0.5 }]}
          >
            <Avatar nickname={sampleName + i} size={56} />
          </View>
        ))}
        <View style={styles.avatarsOverlay} pointerEvents="none" />
      </View>

      <PlusBadge variant="solid" size="sm" style={{ marginBottom: 12 }} />
      <Text style={styles.title}>
        {hop}촌 지인 {count}명을 만나보세요
      </Text>
      <Text style={styles.desc}>
        {`Dash+는 ${hop}촌 이상의 지인 소개글도 열람하고\n연락 요청까지 보낼 수 있어요.`}
      </Text>
      <DashButton
        title="Dash+ 시작하기"
        variant="primary"
        size="md"
        onPress={onUpgrade}
        leading={<Crown size={14} color="#fff" fill="#fff" />}
        style={{ backgroundColor: colors.plus.accent, minWidth: 180 }}
      />
      <Text style={styles.fine}>월 {DASH_PLUS_PRICE.toLocaleString('ko-KR')}원 · 언제든 해지</Text>
    </GradientBox>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: colors.plus.accentSoft,
    alignItems: 'center',
    marginTop: 4,
  },
  avatars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  avatarWrap: { borderWidth: 3, borderColor: '#fff', borderRadius: 999 },
  avatarsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.plus.lockOverlay,
  },
  title: {
    fontFamily,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: 6,
    textAlign: 'center',
  },
  desc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 18,
  },
  fine: { ...typography.hint, color: colors.textFaint, marginTop: 10 },
});
