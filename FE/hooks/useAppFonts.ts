import { useFonts } from 'expo-font';

export const FONT_ENABLED = false;

const FONT_FILES = FONT_ENABLED
  ? {
      // Pretendard: require('../assets/fonts/Pretendard-Regular.ttf'),
      // 'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
      // 'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
      // 'Pretendard-ExtraBold': require('../assets/fonts/Pretendard-ExtraBold.ttf'),
    }
  : {};

export function useAppFonts(): { loaded: boolean } {
  const [loaded] = useFonts(FONT_FILES);
  return { loaded: !FONT_ENABLED || loaded };
}
