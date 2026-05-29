// Shared end-of-round result screen (math / kokugo / nazo). Mirrors the web ResultScreen, including
// the result/mistakes tabs and the per-type mistake rendering.

import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { fonts } from '../theme/theme';
import { Float, Pop } from './anim';
import { BackButton } from './BackButton';
import { ChunkyButton } from './ChunkyButton';
import { Stars } from './Stars';
import { Mistake } from './types';

interface ResultScreenProps {
  score: number;
  total: number;
  starCount: number;
  onRetry: () => void;
  onBack: () => void;
  backLabel: string;
  color: string;
  mistakes?: Mistake[];
  onRetryMistakes?: (() => void) | null;
}

function PillButton({
  label,
  colors,
  edgeColor,
  onPress,
}: {
  label: string;
  colors: readonly [string, string];
  edgeColor: string;
  onPress: () => void;
}) {
  return (
    <ChunkyButton
      colors={colors}
      edgeColor={edgeColor}
      radius={18}
      onPress={onPress}
      faceStyle={{ paddingVertical: 16, alignItems: 'center' }}
    >
      <Text style={{ fontSize: 17, fontFamily: fonts.black, color: 'white' }}>{label}</Text>
    </ChunkyButton>
  );
}

function MistakeRow({ m, index }: { m: Mistake; index: number }) {
  return (
    <Pop delay={index * 50}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderWidth: 3,
          borderColor: '#FFCDD2',
        }}
      >
        {m.type === 'math' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 28 }}>🔢</Text>
            <View>
              <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#333' }}>
                {m.format === 'reverse'
                  ? `${m.missing === 'c' ? '?' : m.c} ＝ ${m.missing === 'a' ? '?' : m.a} ${m.op} ${m.missing === 'b' ? '?' : m.b}`
                  : `${m.missing === 'a' ? '?' : m.a} ${m.op} ${m.missing === 'b' ? '?' : m.b} ＝ ${m.missing === 'c' ? '?' : m.c}`}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: '#888' }}>
                こたえ：<Text style={{ color: '#4CAF50', fontSize: 18 }}>{m.answer}</Text>
              </Text>
            </View>
          </View>
        )}
        {m.type === 'quiz' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              {m.hint ? <Text style={{ fontSize: 30 }}>{m.hint}</Text> : null}
              <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.black, color: '#333', lineHeight: 26 }}>
                {m.question}
              </Text>
            </View>
            <Text style={{ marginTop: 6, fontSize: 14, fontFamily: fonts.bold, color: '#888' }}>
              こたえ：<Text style={{ color: '#4CAF50', fontSize: 18, fontFamily: fonts.black }}>「{m.answer}」</Text>
            </Text>
          </View>
        )}
        {m.type === 'flash' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Text style={{ fontSize: 44 }}>{m.emoji}</Text>
            <View>
              <Text style={{ fontSize: 20, fontFamily: fonts.black, color: '#333' }}>{m.char}</Text>
              <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: '#888' }}>
                よみ：<Text style={{ color: '#4CAF50', fontSize: 18, fontFamily: fonts.black }}>{m.word}</Text>
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pop>
  );
}

export function ResultScreen({
  score,
  total,
  starCount,
  onRetry,
  onBack,
  backLabel,
  color,
  mistakes = [],
  onRetryMistakes,
}: ResultScreenProps) {
  const [tab, setTab] = useState<'result' | 'mistakes'>('result');
  const wrongCount = total - score;
  // Defensive clamp: never let a NaN (e.g. total 0) or out-of-range value reach the UI.
  const stars = Number.isFinite(starCount) ? Math.max(0, Math.min(5, starCount)) : 0;

  if (tab === 'mistakes') {
    return (
      <View style={{ width: '100%', maxWidth: 480, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <BackButton onPress={() => setTab('result')} label="← けっか" />
          <Text style={{ fontSize: 18, fontFamily: fonts.black, color: '#F44336' }}>
            ❌ まちがえた もんだい（{mistakes.length}もん）
          </Text>
        </View>
        <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          {mistakes.map((m, i) => (
            <MistakeRow key={i} m={m} index={i} />
          ))}
          {onRetryMistakes ? (
            <View style={{ marginTop: 6 }}>
              <PillButton
                label="🔁 まちがいだけ もう一かい"
                colors={['#FF5722', '#F44336']}
                edgeColor="#D32F2F"
                onPress={onRetryMistakes}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ width: '100%', maxWidth: 440 }}
      contentContainerStyle={{ paddingVertical: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <Pop>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 32,
            paddingVertical: 36,
            paddingHorizontal: 28,
            alignItems: 'center',
          }}
        >
          {stars >= 5 ? (
            <Text style={{ position: 'absolute', top: -30, right: -6, fontSize: 100, transform: [{ rotate: '15deg' }] }}>
              💮
            </Text>
          ) : null}
          <Float>
            <Text style={{ fontSize: 80, marginBottom: 12 }}>{stars >= 5 ? '🏆' : stars >= 3 ? '🎉' : '💪'}</Text>
          </Float>
          <Text style={{ fontSize: 30, fontFamily: fonts.black, color, marginBottom: 8 }}>
            {stars >= 5 ? 'かんぺき！' : stars >= 3 ? 'よくできました！' : 'がんばったね！'}
          </Text>
          <Text style={{ color: '#999', fontSize: 15, fontFamily: fonts.bold, marginBottom: 12 }}>
            {total}もんちゅう <Text style={{ color, fontSize: 28, fontFamily: fonts.black }}>{score}</Text>もん せいかい
          </Text>
          {stars >= 5 ? (
            <Text style={{ color: '#E91E63', fontFamily: fonts.black, fontSize: 18, marginBottom: 16 }}>
              ✨ スタンプ ゲット！ ✨
            </Text>
          ) : null}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <View style={{ backgroundColor: '#E8F5E9', borderWidth: 2, borderColor: '#4CAF50', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 18 }}>
              <Text style={{ fontFamily: fonts.black, fontSize: 16, color: '#4CAF50' }}>✅ {score}もん せいかい</Text>
            </View>
            {wrongCount > 0 ? (
              <View style={{ backgroundColor: '#FFEBEE', borderWidth: 2, borderColor: '#F44336', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 18 }}>
                <Text style={{ fontFamily: fonts.black, fontSize: 16, color: '#F44336' }}>❌ {wrongCount}もん まちがい</Text>
              </View>
            ) : null}
          </View>
          <View style={{ marginBottom: 20 }}>
            <Stars count={stars} />
          </View>
          <View style={{ width: '100%', gap: 10 }}>
            {mistakes.length > 0 ? (
              <PillButton
                label={`❌ まちがいを みる（${mistakes.length}もん）`}
                colors={['#FF8A65', '#FF5722']}
                edgeColor="#E64A19"
                onPress={() => setTab('mistakes')}
              />
            ) : null}
            {onRetryMistakes && mistakes.length > 0 ? (
              <PillButton
                label="🔁 まちがいだけ もう一かい"
                colors={['#EF5350', '#C62828']}
                edgeColor="#B71C1C"
                onPress={onRetryMistakes}
              />
            ) : null}
            <PillButton label="🔄 もう一かいやる" colors={[color, `${color}bb`]} edgeColor={`${color}88`} onPress={onRetry} />
            <ChunkyButton
              backgroundColor="white"
              edgeColor="#e0e0e0"
              radius={18}
              onPress={onBack}
              faceStyle={{ paddingVertical: 13, alignItems: 'center', borderWidth: 3, borderColor: '#e0e0e0' }}
            >
              <Text style={{ fontSize: 15, fontFamily: fonts.black, color: '#888' }}>📚 {backLabel}</Text>
            </ChunkyButton>
          </View>
        </View>
      </Pop>
    </ScrollView>
  );
}
