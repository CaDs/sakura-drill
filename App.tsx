// Import only the 3 weights we use (subpaths) so we don't bundle all ~25 MB of font files.
import { MPLUSRounded1c_400Regular } from '@expo-google-fonts/m-plus-rounded-1c/400Regular';
import { MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c/700Bold';
import { MPLUSRounded1c_900Black } from '@expo-google-fonts/m-plus-rounded-1c/900Black';
import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { enableFreeze } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SoundProvider } from './src/audio/SoundProvider';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootBackground } from './src/components/RootBackground';
import type { RootStackParamList } from './src/navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { KokugoScreen } from './src/screens/KokugoScreen';
import { MathScreen } from './src/screens/MathScreen';
import { NazoScreen } from './src/screens/NazoScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { StampScreen } from './src/screens/StampScreen';
import { ProfileProvider, useProfile } from './src/storage/profile';

// Freeze (suspend) backgrounded screens so their looping animations stop consuming CPU/battery.
enableFreeze(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

// Transparent so the single root gradient (RootBackground) shows through every screen.
const navTheme: Theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

function Loading() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 64 }}>🌸</Text>
    </View>
  );
}

function Navigator() {
  const { ready } = useProfile();
  if (!ready) return <Loading />;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Math" component={MathScreen} />
      <Stack.Screen name="Kokugo" component={KokugoScreen} />
      <Stack.Screen name="Nazo" component={NazoScreen} />
      <Stack.Screen name="Stamps" component={StampScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    MPLUSRounded1c_400Regular,
    MPLUSRounded1c_700Bold,
    MPLUSRounded1c_900Black,
  });

  // If fonts fail to load, fall back to the system font rather than hanging on the splash forever.
  React.useEffect(() => {
    if (fontError) console.warn('Font load failed, using system font:', fontError);
  }, [fontError]);
  const fontsReady = fontsLoaded || !!fontError;

  return (
    <SafeAreaProvider>
      <RootBackground>
        <StatusBar style="dark" />
        <ErrorBoundary>
          <ProfileProvider>
            <SoundProvider>
              <NavigationContainer theme={navTheme}>
                {fontsReady ? <Navigator /> : <Loading />}
              </NavigationContainer>
            </SoundProvider>
          </ProfileProvider>
        </ErrorBoundary>
      </RootBackground>
    </SafeAreaProvider>
  );
}
