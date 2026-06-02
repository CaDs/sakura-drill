import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSound } from '../audio/SoundProvider';
import { FeedbackView, Float, Pop } from '../components/anim';
import { BackButton } from '../components/BackButton';
import { ChunkyButton } from '../components/ChunkyButton';
import { ProgressBar } from '../components/ProgressBar';
import { ResultScreen } from '../components/ResultScreen';
import { ScreenBackground } from '../components/ScreenBackground';
import type { Mistake } from '../components/types';
import { nazozoGroups, type NazoGroup, type Riddle } from '../data/nazo';
import { nazoStampId } from '../data/stamps';
import type { ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

const PRAISE = ['せいかい！🎉', 'すごい！✨', 'やった！🌟', 'かんぺき！💯', '天才！🏆'];
type FB = 'correct' | 'wrong' | null;

export function NazoScreen({ navigation }: ScreenProps<'Nazo'>) {
  const { addStamp } = useProfile();
  const { playCorrect, playWrong } = useSound();

  const [group, setGroup] = useState<NazoGroup | null>(null);
  const [activeRiddles, setActiveRiddles] = useState<Riddle[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FB>(null);
  const [praise, setPraise] = useState(PRAISE[0]);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [showHint, setShowHint] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cancel any pending answer timeout on every leave-play path (see MathScreen for why).
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  useEffect(() => () => clearTimer(), [clearTimer]);

  // Shuffle the answer buttons once per question (data has the answer at choices[0]).
  // Keyed on the riddle so feedback re-renders don't reshuffle and make buttons jump.
  const shuffledChoices = useMemo(() => {
    const r = activeRiddles[idx];
    return r ? [...r.choices].sort(() => Math.random() - 0.5) : [];
  }, [activeRiddles, idx]);

  const startGroup = useCallback((g: NazoGroup) => {
    clearTimer();
    setGroup(g);
    setActiveRiddles([...g.riddles].sort(() => Math.random() - 0.5));
    setIdx(0); setScore(0); setFeedback(null);
    setSelectedAns(null); setCompleted(false); setMistakes([]); setShowHint(false);
  }, [clearTimer]);

  const startMistakeRetry = useCallback(() => {
    clearTimer();
    setActiveRiddles(mistakes.map((m) => m as unknown as Riddle));
    setIdx(0); setScore(0); setFeedback(null);
    setSelectedAns(null); setCompleted(false); setMistakes([]); setShowHint(false);
  }, [clearTimer, mistakes]);

  // Return to the group-select view, cancelling any in-flight answer timeout.
  const exitToGroups = useCallback(() => {
    clearTimer();
    setGroup(null);
    setCompleted(false);
    setFeedback(null);
    setSelectedAns(null);
    setShowHint(false);
  }, [clearTimer]);

  const handleChoice = (choice: string) => {
    if (feedback) return;
    setSelectedAns(choice);
    const riddle = activeRiddles[idx];
    const isCorrect = choice === riddle.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      playCorrect();
    } else {
      setMistakes((m) => [...m, { type: 'quiz', question: riddle.question, choices: riddle.choices, answer: riddle.answer, hint: riddle.hint }]);
      playWrong();
    }

    timer.current = setTimeout(() => {
      setFeedback(null); setSelectedAns(null); setShowHint(false);
      if (idx + 1 >= activeRiddles.length) {
        if (newScore === activeRiddles.length && group) addStamp(nazoStampId(group.groupLabel));
        setCompleted(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1200);
  };

  const gc = group ? group.groupColor : '#FF9800';

  // ---- Group select ----
  if (!group) {
    return (
      <ScreenBackground>
        <View style={{ width: '100%', maxWidth: 480, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#555' }}>🧩 なぞなぞ</Text>
          </View>
          <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            {nazozoGroups.map((g, gi) => (
              <Pop key={g.groupLabel} delay={gi * 80}>
                <ChunkyButton
                  colors={[g.groupColor, `${g.groupColor}cc`]}
                  edgeColor={`${g.groupColor}66`}
                  radius={22}
                  depth={6}
                  onPress={() => startGroup(g)}
                  faceStyle={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 20, paddingHorizontal: 22 }}
                >
                  <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 36 }}>{g.groupEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontFamily: fonts.black, color: 'white' }}>{g.groupLabel}</Text>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>{g.riddles.length}もん</Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22 }}>›</Text>
                </ChunkyButton>
              </Pop>
            ))}
          </ScrollView>
        </View>
      </ScreenBackground>
    );
  }

  // ---- Result ----
  if (completed) {
    return (
      <ScreenBackground>
        <ResultScreen
          score={score}
          total={activeRiddles.length}
          starCount={Math.round((score / activeRiddles.length) * 5)}
          onRetry={() => startGroup(group)}
          onBack={exitToGroups}
          backLabel="レベルをえらぶ"
          color={gc}
          mistakes={mistakes}
          onRetryMistakes={mistakes.length > 0 ? startMistakeRetry : null}
        />
      </ScreenBackground>
    );
  }

  const riddle = activeRiddles[idx];
  if (!riddle) {
    return (
      <ScreenBackground>
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>⚠️</Text>
          <Text style={{ fontFamily: fonts.bold, color: '#666', marginBottom: 20 }}>データの じゅんびちゅう です…</Text>
          <BackButton onPress={exitToGroups} />
        </View>
      </ScreenBackground>
    );
  }

  // ---- Play ----
  return (
    <ScreenBackground>
      <View style={{ width: '100%', maxWidth: 440 }}>
        <View style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <BackButton onPress={exitToGroups} />
            <Text style={{ fontFamily: fonts.black, color: '#666', fontSize: 14 }}>{idx + 1} / {activeRiddles.length}もん</Text>
            <Text style={{ fontFamily: fonts.black, color: gc }}>⭐ {score}</Text>
          </View>
          <ProgressBar current={idx} total={activeRiddles.length} color={gc} />
        </View>

        <FeedbackView
          feedback={feedback}
          style={{
            backgroundColor: 'white',
            borderRadius: 28,
            paddingVertical: 28,
            paddingHorizontal: 22,
            marginBottom: 18,
            borderWidth: 4,
            borderColor: gc,
            alignItems: 'center',
            shadowColor: gc,
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          <Float style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 48 }}>🧩</Text>
          </Float>
          <View style={{ backgroundColor: `${gc}11`, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16, width: '100%' }}>
            <Text style={{ fontSize: 20, fontFamily: fonts.black, color: '#333', lineHeight: 36, textAlign: 'center' }}>{riddle.question}</Text>
          </View>

          {!feedback ? (
            <View style={{ marginBottom: 8 }}>
              {showHint ? (
                <Pop>
                  <Text style={{ fontSize: 44 }}>{riddle.hint}</Text>
                </Pop>
              ) : (
                <Pressable
                  onPress={() => setShowHint(true)}
                  style={({ pressed }) => ({ borderWidth: 2, borderStyle: 'dashed', borderColor: gc, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 18, opacity: pressed ? 0.6 : 1 })}
                >
                  <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: gc }}>💡 ヒントをみる</Text>
                </Pressable>
              )}
            </View>
          ) : null}

          {feedback ? (
            <Text style={{ fontSize: 20, fontFamily: fonts.black, color: feedback === 'correct' ? '#4CAF50' : '#F44336' }}>
              {feedback === 'correct' ? praise : 'ざんねん！ちがうよ！'}
            </Text>
          ) : null}
        </FeedbackView>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
          {shuffledChoices.map((choice) => {
            const isSel = selectedAns === choice;
            let bg = 'white';
            let bd = '#e0e0e0';
            let col = '#333';
            if (isSel && feedback === 'correct') { bg = '#4CAF50'; bd = '#4CAF50'; col = 'white'; }
            else if (isSel && feedback === 'wrong') { bg = '#F44336'; bd = '#F44336'; col = 'white'; }
            return (
              <ChunkyButton
                key={choice}
                backgroundColor={bg}
                edgeColor="#e0e0e0"
                radius={18}
                depth={feedback ? 0 : 5}
                disabled={!!feedback}
                onPress={() => handleChoice(choice)}
                style={{ width: '48%' }}
                faceStyle={{ paddingVertical: 18, paddingHorizontal: 8, alignItems: 'center', borderWidth: 3, borderColor: bd }}
              >
                <Text style={{ fontSize: 18, fontFamily: fonts.black, color: col }}>{choice}</Text>
              </ChunkyButton>
            );
          })}
        </View>
      </View>
    </ScreenBackground>
  );
}
