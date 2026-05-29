import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Float, Pop } from '../components/anim';
import { ChunkyButton } from '../components/ChunkyButton';
import { GradientText } from '../components/GradientText';
import { NameModal } from '../components/NameModal';
import { ScreenBackground } from '../components/ScreenBackground';
import { MAX_STAMPS } from '../data/stamps';
import type { RootStackParamList, ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

interface ModeDef {
  route: keyof RootStackParamList;
  label: string;
  sub: string;
  emoji: string;
  colors: readonly [string, string];
}

const MODES: ModeDef[] = [
  { route: 'Math', label: 'さんすう', sub: 'あなうめ・ぎゃくさんも！', emoji: '🔢', colors: ['#FFB347', '#FF8C00'] },
  { route: 'Kokugo', label: 'こくご', sub: 'ひらがな・カタカナ', emoji: '📖', colors: ['#AB47BC', '#7B1FA2'] },
  { route: 'Nazo', label: 'なぞなぞ', sub: '4グループ・32もん', emoji: '🧩', colors: ['#26C6DA', '#00897B'] },
];

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { name, stamps, setName } = useProfile();
  const [editing, setEditing] = useState(false);
  const totalStamps = Object.keys(stamps).filter((k) => stamps[k]).length;

  return (
    <ScreenBackground>
      <NameModal
        visible={editing}
        initialName={name}
        onCancel={() => setEditing(false)}
        onSave={(n) => {
          setName(n);
          setEditing(false);
        }}
      />

      {/* gear → settings */}
      <Pressable
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => ({ position: 'absolute', top: 6, right: 12, padding: 8, opacity: pressed ? 0.5 : 1, zIndex: 5 })}
        hitSlop={8}
      >
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </Pressable>

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 4 }}>
          <Float>
            <Text style={{ fontSize: 60, marginBottom: 4 }}>🌸</Text>
          </Float>
          <GradientText
            colors={['#F06292', '#E91E63', '#FF8A80']}
            style={{ fontSize: 44, fontFamily: fonts.black, letterSpacing: 1, textAlign: 'center' }}
          >
            {name}ドリル
          </GradientText>
          <Pressable
            onPress={() => setEditing(true)}
            style={({ pressed }) => ({
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: '#E91E63',
              borderRadius: 20,
              paddingVertical: 4,
              paddingHorizontal: 12,
              marginTop: 10,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: '#E91E63', fontSize: 12, fontFamily: fonts.black }}>✏️ なまえを かえる</Text>
          </Pressable>
        </View>

        <View style={{ width: '100%', maxWidth: 440 }}>
          {/* Stamp card summary */}
          <Pop>
            <Pressable onPress={() => navigation.navigate('Stamps')}>
              <View
                style={{
                  backgroundColor: '#FFF0F5',
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 24,
                  marginBottom: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 4,
                  borderColor: '#E91E63',
                  shadowColor: '#E91E63',
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 5,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Float distance={6} duration={1000}>
                    <Text style={{ fontSize: 44 }}>💮</Text>
                  </Float>
                  <View>
                    <Text style={{ fontFamily: fonts.black, color: '#E91E63', fontSize: 20, marginBottom: 2 }}>
                      スタンプカード
                    </Text>
                    <Text style={{ fontSize: 12, color: '#E91E63', fontFamily: fonts.bold }}>
                      ぜんもんせいかいで ゲット！
                    </Text>
                  </View>
                </View>
                <View style={{ backgroundColor: 'white', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 16, borderWidth: 2, borderColor: '#F8BBD0' }}>
                  <Text style={{ fontSize: 32, fontFamily: fonts.black, color: '#E91E63' }}>
                    {totalStamps}
                    <Text style={{ fontSize: 16, color: '#F06292' }}>/{MAX_STAMPS}</Text>
                  </Text>
                </View>
              </View>
            </Pressable>
          </Pop>

          {/* Mode tiles */}
          <View style={{ gap: 16 }}>
            {MODES.map((m, i) => (
              <Pop key={m.route} delay={i * 120}>
                <ChunkyButton
                  colors={m.colors}
                  edgeColor={`${m.colors[1]}cc`}
                  radius={24}
                  depth={8}
                  softShadow={m.colors[0]}
                  onPress={() => navigation.navigate(m.route)}
                  faceStyle={{ flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 20, paddingHorizontal: 24 }}
                >
                  <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 40 }}>{m.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 24, fontFamily: fonts.black, color: 'white', letterSpacing: 1 }}>{m.label}</Text>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: fonts.bold, marginTop: 4 }}>{m.sub}</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22 }}>›</Text>
                </ChunkyButton>
              </Pop>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}
