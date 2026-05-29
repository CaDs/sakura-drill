// Renders the pastel gradient + drifting 🌸 ONCE for the whole app, behind the navigator. Previously
// this lived in ScreenBackground and was rebuilt on every screen (N duplicated infinite animations);
// hoisting it here means one gradient and one sakura set regardless of stack depth.

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/theme';
import { FloatingSakura } from './FloatingSakura';

export function RootBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.55, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <FloatingSakura />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
