// Shared theme: fonts, colors, and small style helpers mirroring the web app's inline styles.
// Custom fonts in RN don't respond to fontWeight, so we map weights to explicit family names.

import { TextStyle, ViewStyle } from 'react-native';

export const fonts = {
  regular: 'MPLUSRounded1c_400Regular',
  bold: 'MPLUSRounded1c_700Bold',
  black: 'MPLUSRounded1c_900Black',
} as const;

export const colors = {
  pink: '#E91E63',
  pinkLight: '#F06292',
  text: '#333',
  subtext: '#666',
  muted: '#999',
  faint: '#aaa',
  green: '#4CAF50',
  red: '#F44336',
  orange: '#FF5722',
  border: '#e0e0e0',
  white: '#FFFFFF',
  // home background gradient (160deg #FFF9C4 → #FCE4EC → #E8EAF6)
  bgGradient: ['#FFF9C4', '#FCE4EC', '#E8EAF6'] as const,
} as const;

// Matches backBtnStyle in the web app.
export const backBtnStyle: ViewStyle = {
  backgroundColor: colors.white,
  borderWidth: 2,
  borderColor: '#ddd',
  borderRadius: 12,
  paddingVertical: 6,
  paddingHorizontal: 14,
};

export const backBtnTextStyle: TextStyle = {
  fontSize: 13,
  fontFamily: fonts.bold,
  color: '#777',
};
