import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors, fontFamily } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#BFBFBF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily,
          letterSpacing: -0.3,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: 24, android: 14 }),
          height: Platform.select({ ios: 80, android: 64 }),
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="mypage" options={{ title: '마이페이지' }} />
    </Tabs>
  );
}
