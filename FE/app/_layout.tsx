import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useAppFonts } from '../hooks/useAppFonts';
import { colors } from '../theme';

const queryClient = new QueryClient();

function AuthGate() {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const inAuthRoute = segments[0] === 'login';
    const inInviteRoute = segments[0] === 'invite';

    if (status === 'unauthenticated' && !inAuthRoute && !inInviteRoute) {
      router.replace('/login');
    } else if (status === 'authenticated' && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [status, segments, router]);

  return null;
}

export default function RootLayout() {
  const { loaded } = useAppFonts();

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
