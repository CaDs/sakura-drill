// Catches render errors anywhere below it so a crash shows a friendly, on-brand reset screen instead
// of the red error overlay — important for a kids' app that may run unattended.

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { fonts } from '../theme/theme';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surface to the dev console; in production this is where a crash reporter would hook in.
    console.error('ErrorBoundary caught:', error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 72, marginBottom: 16 }}>🌸</Text>
        <Text style={{ fontSize: 24, fontFamily: fonts.black, color: '#E91E63', textAlign: 'center', marginBottom: 8 }}>
          ごめんね！
        </Text>
        <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: '#666', textAlign: 'center', lineHeight: 26, marginBottom: 28 }}>
          なにか へんに なっちゃった。{'\n'}もういちど やってみよう！
        </Text>
        <Pressable
          onPress={this.reset}
          style={({ pressed }) => ({
            backgroundColor: '#E91E63',
            paddingVertical: 16,
            paddingHorizontal: 36,
            borderRadius: 18,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontSize: 18, fontFamily: fonts.black, color: 'white' }}>🔄 もういちど</Text>
        </Pressable>
      </View>
    );
  }
}
