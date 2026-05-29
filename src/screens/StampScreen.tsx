import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Pop } from '../components/anim';
import { BackButton } from '../components/BackButton';
import { ScreenBackground } from '../components/ScreenBackground';
import { STAMP_TARGETS } from '../data/stamps';
import type { ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

export function StampScreen({ navigation }: ScreenProps<'Stamps'>) {
  const { name, stamps } = useProfile();

  return (
    <ScreenBackground>
      <View style={{ width: '100%', maxWidth: 480, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#E91E63' }}>💮 {name}の スタンプ</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 28, paddingVertical: 24, paddingHorizontal: 20, borderWidth: 4, borderColor: '#F48FB1' }}>
            <Text style={{ textAlign: 'center', fontFamily: fonts.bold, color: '#666', marginBottom: 20, lineHeight: 24 }}>
              ぜんもんせいかい して{'\n'}すべての スタンプを あつめよう！
            </Text>

            {STAMP_TARGETS.map((section) => (
              <View key={section.title} style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 18, color: section.color, borderBottomWidth: 2, borderBottomColor: section.color, paddingBottom: 6, marginBottom: 12, fontFamily: fonts.bold }}>
                  {section.title}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {section.items.map((item, ii) => {
                    const hasStamp = !!stamps[item.id];
                    return (
                      <View key={item.id} style={{ width: 76, alignItems: 'center', gap: 4 }}>
                        <Pop delay={hasStamp ? ii * 50 : 0}>
                          <View
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 30,
                              backgroundColor: hasStamp ? `${section.color}22` : '#f5f5f5',
                              borderWidth: 3,
                              borderStyle: hasStamp ? 'solid' : 'dashed',
                              borderColor: hasStamp ? section.color : '#ddd',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 32, opacity: hasStamp ? 0.3 : 0.35 }}>{item.emoji}</Text>
                            {hasStamp ? (
                              <Text style={{ position: 'absolute', fontSize: 50, color: '#E91E63', transform: [{ rotate: '-10deg' }] }}>💮</Text>
                            ) : null}
                          </View>
                        </Pop>
                        <Text style={{ fontSize: 10, fontFamily: fonts.bold, color: hasStamp ? '#333' : '#aaa', textAlign: 'center', lineHeight: 13 }} numberOfLines={2}>
                          {item.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenBackground>
  );
}
