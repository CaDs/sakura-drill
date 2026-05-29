// 3D flip card for the こくご flash topics. Tap to flip between front (char) and back (emoji/word).

import React, { useEffect } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function FlipCard({
  flipped,
  onPress,
  front,
  back,
  style,
}: {
  flipped: boolean;
  onPress: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(flipped ? 1 : 0, { duration: 550 });
    return () => cancelAnimation(progress);
  }, [flipped, progress]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${progress.value * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${progress.value * 180 + 180}deg` }],
  }));

  return (
    <Pressable onPress={onPress} style={style}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.face, frontStyle]}>{front}</Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styles.face, backStyle]}>{back}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    backfaceVisibility: 'hidden',
  },
});
