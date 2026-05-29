// The signature chunky 3D button. Replicates the web app's `boxShadow: 0 Npx 0 color` — a solid
// colored "edge" under the face — plus an optional soft ambient shadow for the big home tiles.
// Pressing sinks the face onto the edge.

import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import { GestureResponderEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ChunkyButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  /** gradient face (135deg). Provide this OR backgroundColor. */
  colors?: readonly [string, string, ...string[]];
  backgroundColor?: string;
  /** color of the 3D bottom edge */
  edgeColor: string;
  radius?: number;
  depth?: number;
  disabled?: boolean;
  /** soft drop shadow color (for prominent tiles) */
  softShadow?: string;
  /** style applied to the face (padding, alignItems, etc.) */
  faceStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function ChunkyButton({
  onPress,
  colors,
  backgroundColor,
  edgeColor,
  radius = 18,
  depth = 5,
  disabled = false,
  softShadow,
  faceStyle,
  style,
  children,
}: ChunkyButtonProps) {
  const pressed = useSharedValue(0);
  const onIn = useCallback(() => {
    pressed.value = withTiming(1, { duration: 40 });
  }, [pressed]);
  const onOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: 90 });
  }, [pressed]);
  // Cancel any in-flight press animation if the button unmounts mid-press.
  useEffect(() => () => cancelAnimation(pressed), [pressed]);

  const faceAnim = useAnimatedStyle(() => ({ transform: [{ translateY: pressed.value * depth }] }));

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut} disabled={disabled} style={style}>
      <View
        style={[
          { borderRadius: radius, backgroundColor: edgeColor },
          softShadow
            ? {
                shadowColor: softShadow,
                shadowOpacity: 0.35,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              }
            : null,
        ]}
      >
        <Animated.View
          style={[
            { borderRadius: radius, marginBottom: depth, overflow: 'hidden', backgroundColor },
            faceAnim,
            faceStyle,
          ]}
        >
          {colors ? (
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}
