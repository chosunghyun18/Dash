import { View, Text, StyleSheet, Linking } from 'react-native';
import { useAppConfigGate } from '../hooks/useAppConfigGate';
import { DashButton } from './DashButton';
import { colors, radius, spacing, typography } from '../theme';

function openStore(storeUrl: string) {
  if (!storeUrl) return;
  Linking.openURL(storeUrl).catch(() => {
    // 스토어 열기 실패는 무시 — 게이트 상태는 유지
  });
}

/**
 * 앱 버전/점검 게이트 오버레이. _layout.tsx 루트에 마운트한다.
 *
 * - maintenance: 전체 차단 점검 화면
 * - FORCE_UPDATE: 닫기 없는 차단 모달 + 스토어 이동 버튼
 * - SOFT_UPDATE: 닫기 가능한 업데이트 권장 모달 (1일 1회 — useAppConfigGate 에서 제어)
 * - OK/로딩/실패(fail-open): 아무것도 렌더하지 않음
 */
export function UpdateGate() {
  const { gate, dismissSoft } = useAppConfigGate();

  if (gate.kind === 'pass') return null;

  if (gate.kind === 'maintenance') {
    return (
      <View style={styles.fullScreen}>
        <Text style={styles.title}>서비스 점검 중이에요</Text>
        <Text style={styles.body}>
          {gate.message || '더 나은 서비스를 위해 점검하고 있어요.\n잠시 후 다시 이용해 주세요.'}
        </Text>
      </View>
    );
  }

  if (gate.kind === 'force') {
    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>업데이트가 필요해요</Text>
          <Text style={styles.body}>
            {gate.message ||
              `안정적인 이용을 위해 최신 버전(${gate.latestVersion})으로 업데이트해 주세요.`}
          </Text>
          <DashButton
            title="업데이트"
            size="lg"
            block
            onPress={() => openStore(gate.storeUrl)}
          />
        </View>
      </View>
    );
  }

  // soft
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>새 버전이 나왔어요</Text>
        <Text style={styles.body}>
          {gate.message || `최신 버전(${gate.latestVersion})으로 업데이트할 수 있어요.`}
        </Text>
        <DashButton
          title="업데이트"
          size="lg"
          block
          onPress={() => openStore(gate.storeUrl)}
        />
        <DashButton title="나중에 할게요" variant="ghost" size="md" block onPress={dismissSoft} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    zIndex: 1000,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
