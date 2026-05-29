import React from 'react';
import { Pressable, Text } from 'react-native';
import { backBtnStyle, backBtnTextStyle } from '../theme/theme';

export function BackButton({ onPress, label = '← もどる' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [backBtnStyle, pressed && { opacity: 0.6 }]}>
      <Text style={backBtnTextStyle}>{label}</Text>
    </Pressable>
  );
}
