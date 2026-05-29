import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

export const ProgressBar = React.memo(function ProgressBar({
  current,
  total,
  color = '#FF6B9D',
}: {
  current: number;
  total: number;
  color?: string;
}) {
  const pct = total > 0 ? Math.max(0, Math.min(1, current / total)) : 0;
  return (
    <View
      style={{
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={[color, `${color}aa`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: '100%', width: `${pct * 100}%`, borderRadius: 8 }}
      />
    </View>
  );
});
