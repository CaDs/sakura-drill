// Gradient-filled text (the "さくらドリル" title). RN can't do WebKit background-clip, so we mask a
// LinearGradient with the text.

import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

export function GradientText({
  children,
  colors,
  style,
}: {
  children: React.ReactNode;
  colors: readonly [string, string, ...string[]];
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>{children}</Text>
      }
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* Invisible copy sizes the gradient to the text */}
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

// Convenience wrapper so callers don't import View just for layout.
export function Center({ children }: { children: React.ReactNode }) {
  return <View style={{ alignItems: 'center' }}>{children}</View>;
}
