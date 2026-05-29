// The 6 drifting 🌸 in the background (web app's floating deco).

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Float } from './anim';

const PETALS = [0, 1, 2, 3, 4, 5];

// Memoized: positions never change, so it should never re-render once mounted at the root.
export const FloatingSakura = React.memo(function FloatingSakura() {
  return (
    <>
      {PETALS.map((i) => {
        const even = i % 2 === 0;
        return (
          <Float
            key={i}
            distance={12}
            duration={(2.4 + i * 0.35) * 500}
            delay={i * 450}
            style={[
              styles.petal,
              {
                top: `${8 + i * 13}%`,
                ...(even ? { left: `${2 + i * 1.5}%` } : { right: `${2 + i * 1.5}%` }),
              },
            ]}
          >
            <Text style={styles.emoji}>🌸</Text>
          </Float>
        );
      })}
    </>
  );
});

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    opacity: 0.4,
    zIndex: 0,
  },
  emoji: {
    fontSize: 26,
  },
});
