import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors, radius, typography } from '../theme';

interface Props {
  via: string;
}

export function IntroPathPill({ via }: Props) {
  return (
    <View style={styles.base}>
      <Heart size={12} color={colors.primary} fill={colors.primary} />
      <Text style={[typography.hint, { color: colors.primary }]} numberOfLines={1}>
        {via}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
