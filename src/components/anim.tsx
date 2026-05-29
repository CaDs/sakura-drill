// Reanimated equivalents of the web app's CSS keyframes: pop (entrance), float (looping bob),
// and the bounce/shake feedback on the question card.

import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Feedback = 'correct' | 'wrong' | null;

// @keyframes pop { 0% scale .4 opacity 0; 70% scale 1.08; 100% scale 1 }
export function Pop({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(delay, withSequence(withTiming(1.08, { duration: 210 }), withTiming(1, { duration: 120 })));
    opacity.value = withDelay(delay, withTiming(1, { duration: 180 }));
  }, [delay, opacity, scale]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

// @keyframes float { 0%,100% translateY 0; 50% translateY -dist } — full cycle ≈ duration*2
export function Float({
  children,
  distance = 12,
  duration = 1500,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(-distance, { duration, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, [delay, distance, duration, y]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

// Runs a bounce (correct) or shake (wrong) once whenever `feedback` becomes non-null.
export function FeedbackView({
  feedback,
  children,
  style,
}: {
  feedback: Feedback;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  useEffect(() => {
    if (feedback === 'correct') {
      scale.value = withSequence(
        withTiming(1.14, { duration: 150 }),
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 150 })
      );
      rot.value = withSequence(
        withTiming(-2, { duration: 150 }),
        withTiming(2, { duration: 200 }),
        withTiming(0, { duration: 150 })
      );
    } else if (feedback === 'wrong') {
      tx.value = withSequence(
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(-7, { duration: 100 }),
        withTiming(7, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [feedback, rot, scale, tx]);
  const anim = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { scale: scale.value }, { rotateZ: `${rot.value}deg` }],
  }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
