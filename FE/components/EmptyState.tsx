import { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Inbox } from 'lucide-react-native';
import { colors, radius, typography } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  icon?: 'heart' | 'inbox';
  cta?: ReactNode;
}

export function EmptyState({ title, subtitle, icon = 'heart', cta }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        {icon === 'heart' ? (
          <Heart size={30} color={colors.primary} />
        ) : (
          <Inbox size={30} color={colors.primary} />
        )}
      </View>
      <Text style={[typography.sectionHeading, { color: colors.text, marginTop: 18 }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle]}>{subtitle}</Text>
      ) : null}
      {cta ? <View style={{ marginTop: 20 }}>{cta}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
    minHeight: 360,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
});
