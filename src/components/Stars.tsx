import React from 'react';
import { Text, View } from 'react-native';

export const Stars = React.memo(function Stars({ count, total = 5 }: { count: number; total?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < count;
        return (
          <Text
            key={i}
            style={{
              fontSize: 28,
              opacity: filled ? 1 : 0.25,
              transform: [{ scale: filled ? 1.1 : 1 }],
            }}
          >
            ⭐
          </Text>
        );
      })}
    </View>
  );
});
