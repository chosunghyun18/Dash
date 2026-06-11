export const colors = {
  primary: '#FF4B6E',
  primarySoft: '#FFF5F7',
  accept: '#52C41A',
  acceptSoft: '#F0F9EB',
  acceptBorder: '#B7EB8F',
  acceptText: '#389E0D',
  reject: '#F5F5F5',
  rejectText: '#595959',
  text: '#1A1A1A',
  textMuted: '#666666',
  textFaint: '#999999',
  border: '#F0EEEE',
  bg: '#FFFFFF',
  bgSoft: '#FAFAFA',

  status: {
    pending: { bg: '#FFF7E6', fg: '#D46B08', dot: '#FA8C16' },
    accepted: { bg: '#F0F9EB', fg: '#389E0D', dot: '#52C41A' },
    rejected: { bg: '#F5F5F5', fg: '#8C8C8C', dot: '#BFBFBF' },
  },

  avatarPalette: ['#FF4B6E', '#FF7A45', '#FFAA00', '#52C41A', '#1890FF', '#7B5CFA'],

  plus: {
    accent: '#7B5CFA',
    accentSoft: '#F4F0FF',
    gradientStart: '#7B5CFA',
    gradientEnd: '#9B7EFF',
    lockOverlay: 'rgba(255,255,255,0.55)',
  },
} as const;

export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors.avatarPalette[h % colors.avatarPalette.length];
}
