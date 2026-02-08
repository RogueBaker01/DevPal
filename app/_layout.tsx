import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { AuthStorage } from '@/utils/AuthStorage';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  //Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ✅ Auto-login: Check if user has active session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasSession = await AuthStorage.hasActiveSession();
        const userId = await AuthStorage.getUserId();

        console.log('🔐 Checking auth:', { hasSession, userId });

        if (hasSession && userId) {
          // ✅ Usuario tiene sesión activa, navegar a tabs
          console.log('✅ Active session found, navigating to tabs');
          const inTabsGroup = segments[0] === '(tabs)';
          if (!inTabsGroup) {
            router.replace('/(tabs)');
          }
        } else {
          // No hay sesión, asegurar que esté en auth
          console.log('❌ No session, navigating to auth');
          const inAuthGroup = segments[0] === '(auth)';
          if (!inAuthGroup) {
            router.replace('/(auth)/login');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // No renderizar hasta verificar auth para evitar flickering
  if (!isAuthChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
