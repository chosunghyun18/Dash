import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

/** 화면 전체를 채우는 중앙 정렬 로딩 인디케이터. 데이터 로딩 중 공통 사용. */
export function ScreenLoader() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});
