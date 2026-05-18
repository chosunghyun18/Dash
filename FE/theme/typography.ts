import { Platform, TextStyle } from 'react-native';

export const fontFamily = Platform.select({
  ios: 'Pretendard',
  android: 'Pretendard',
  default: 'System',
});

type T = TextStyle;

export const typography = {
  brand: { fontFamily, fontSize: 28, fontWeight: '800', letterSpacing: -0.8, lineHeight: 31 } as T,
  screenTitle: { fontFamily, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 } as T,
  profileName: { fontFamily, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 } as T,
  sectionHeading: { fontFamily, fontSize: 16, fontWeight: '700', letterSpacing: -0.3 } as T,
  listItemName: { fontFamily, fontSize: 15, fontWeight: '700', letterSpacing: -0.3, lineHeight: 18 } as T,
  body: { fontFamily, fontSize: 14, fontWeight: '400', letterSpacing: -0.2, lineHeight: 24 } as T,
  caption: { fontFamily, fontSize: 13, fontWeight: '400', letterSpacing: -0.2, lineHeight: 20 } as T,
  hint: { fontFamily, fontSize: 12, fontWeight: '500', letterSpacing: -0.1, lineHeight: 18 } as T,
  badge: { fontFamily, fontSize: 11, fontWeight: '600', letterSpacing: -0.1, lineHeight: 15 } as T,
  tabLabel: { fontFamily, fontSize: 11, fontWeight: '500', letterSpacing: -0.3 } as T,

  buttonLg: { fontFamily, fontSize: 15, fontWeight: '700', letterSpacing: -0.3 } as T,
  buttonMd: { fontFamily, fontSize: 14, fontWeight: '600', letterSpacing: -0.3 } as T,
  buttonSm: { fontFamily, fontSize: 12, fontWeight: '600', letterSpacing: -0.2 } as T,
};
