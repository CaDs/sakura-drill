import React from 'react';
import { Alert, Text, View } from 'react-native';
import { BackButton } from '../components/BackButton';
import { ChunkyButton } from '../components/ChunkyButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { MAX_STAMPS } from '../data/stamps';
import type { ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

export function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const { name, stamps, wipeAll } = useProfile();
  const totalStamps = Object.keys(stamps).filter((k) => stamps[k]).length;

  const confirmWipe = () => {
    Alert.alert(
      'データを ぜんぶ けしますか？',
      'なまえと スタンプが すべて きえます。\nこの そうさは もとに もどせません。',
      [
        { text: 'やめる', style: 'cancel' },
        {
          text: 'けす',
          style: 'destructive',
          onPress: () => {
            wipeAll();
            Alert.alert('けしました', 'データを ぜんぶ けしました。', [
              { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
          },
        },
      ]
    );
  };

  return (
    <ScreenBackground>
      <View style={{ width: '100%', maxWidth: 440 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#555' }}>⚙️ せってい</Text>
        </View>

        <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, borderWidth: 4, borderColor: '#E0E0E0', marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: '#666', marginBottom: 8 }}>いま あそんでいる ひと</Text>
          <Text style={{ fontSize: 26, fontFamily: fonts.black, color: '#E91E63', marginBottom: 16 }}>{name}</Text>
          <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: '#666' }}>
            あつめた スタンプ：<Text style={{ color: '#E91E63', fontSize: 20 }}>{totalStamps}</Text> / {MAX_STAMPS}
          </Text>
        </View>

        <View style={{ backgroundColor: '#FFF5F5', borderRadius: 24, padding: 24, borderWidth: 4, borderColor: '#FFCDD2' }}>
          <Text style={{ fontSize: 18, fontFamily: fonts.black, color: '#F44336', marginBottom: 8 }}>🗑️ データを けす</Text>
          <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: '#999', lineHeight: 22, marginBottom: 20 }}>
            なまえと スタンプを ぜんぶ けして、さいしょから やりなおせます。
          </Text>
          <ChunkyButton
            colors={['#EF5350', '#C62828']}
            edgeColor="#B71C1C"
            radius={18}
            onPress={confirmWipe}
            faceStyle={{ paddingVertical: 16, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 17, fontFamily: fonts.black, color: 'white' }}>すべての データを けす</Text>
          </ChunkyButton>
        </View>
      </View>
    </ScreenBackground>
  );
}
