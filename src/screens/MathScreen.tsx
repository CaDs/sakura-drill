import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSound } from '../audio/SoundProvider';
import { FeedbackView, Pop } from '../components/anim';
import { BackButton } from '../components/BackButton';
import { ChunkyButton } from '../components/ChunkyButton';
import { ProgressBar } from '../components/ProgressBar';
import { ResultScreen } from '../components/ResultScreen';
import { ScreenBackground } from '../components/ScreenBackground';
import type { Mistake } from '../components/types';
import {
  generateMathProblems,
  isHardLevel,
  makeMathChoices,
  MATH_GROUPS,
  type MathLevel,
  type MathProblem,
} from '../data/math';
import { mathStampId } from '../data/stamps';
import type { ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

const TOTAL = 10;
const PRAISE = ['すごい！✨', 'せいかい！🎉', 'やった！⭐', 'かんぺき！💯', '天才！🌟'];
const FRUIT_PAIRS: [string, string][] = [
  ['🍎', '🍏'],
  ['🍊', '🍋'],
  ['🍇', '🍓'],
  ['🍑', '🍒'],
  ['🫐', '🍈'],
];

type FB = 'correct' | 'wrong' | null;

export function MathScreen({ navigation }: ScreenProps<'Math'>) {
  const { addStamp } = useProfile();
  const { playCorrect, playWrong, playHard } = useSound();

  const [levelDef, setLevelDef] = useState<MathLevel | null>(null);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<FB>(null);
  const [praise, setPraise] = useState(PRAISE[0]);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [choiceList, setChoiceList] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel any pending answer timeout. Must run on every path that leaves play WITHOUT unmounting
  // (in-game back, retry, new level) — otherwise the timeout fires setCompleted/setIdx on the
  // level-select view and wrongly jumps to a result screen.
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const startLevel = useCallback((def: MathLevel) => {
    clearTimer();
    setLevelDef(def);
    setProblems(generateMathProblems(def, TOTAL));
    setIdx(0); setScore(0); setStreak(0);
    setCompleted(false); setSelected(null); setFeedback(null); setMistakes([]);
  }, [clearTimer]);

  const startMistakeRetry = useCallback(() => {
    clearTimer();
    setProblems(mistakes.map((m) => ({ ...(m as MathProblem) })));
    setIdx(0); setScore(0); setStreak(0);
    setCompleted(false); setSelected(null); setFeedback(null); setMistakes([]);
  }, [clearTimer, mistakes]);

  // Return to the level-select view, cancelling any in-flight answer timeout.
  const goToLevelSelect = useCallback(() => {
    clearTimer();
    setLevelDef(null);
    setCompleted(false);
    setFeedback(null);
    setSelected(null);
  }, [clearTimer]);

  const current: MathProblem | undefined = problems[idx];

  useEffect(() => {
    if (current && current.answer !== undefined && !feedback) setChoiceList(makeMathChoices(current.answer));
  }, [idx, feedback, problems]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoice = (val: number) => {
    if (feedback || !current) return;
    setSelected(val);
    const isCorrect = val === current.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      setStreak((s) => s + 1);
      setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      isHardLevel(levelDef) ? playHard() : playCorrect();
    } else {
      setStreak(0);
      setMistakes((m) => [...m, { ...current, type: 'math' }]);
      playWrong();
    }

    timer.current = setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (idx + 1 >= problems.length) {
        if (newScore === problems.length && levelDef) addStamp(mathStampId(levelDef.id));
        setCompleted(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 1000);
  };

  const lc = levelDef ? levelDef.color : '#FF6B9D';

  // ---- Level select ----
  if (!levelDef) {
    return (
      <ScreenBackground>
        <View style={{ width: '100%', maxWidth: 480, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#555' }}>🔢 さんすう ドリル</Text>
          </View>
          <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            {MATH_GROUPS.map((group, gi) => (
              <View key={group.groupLabel}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, paddingLeft: 4 }}>
                  <Text style={{ fontSize: 20 }}>{group.groupEmoji}</Text>
                  <Text style={{ fontSize: 15, fontFamily: fonts.black, color: group.groupColor, borderBottomWidth: 3, borderBottomColor: group.groupColor, paddingBottom: 2 }}>
                    {group.groupLabel}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {group.levels.map((lv, i) => (
                    <Pop key={lv.id} delay={(gi * 4 + i) * 50} style={{ width: '48%' }}>
                      <ChunkyButton
                        colors={[lv.color, `${lv.color}cc`]}
                        edgeColor={`${lv.color}77`}
                        radius={18}
                        onPress={() => startLevel(lv)}
                        faceStyle={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 12 }}
                      >
                        <Text style={{ fontSize: 28 }}>{lv.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 15, fontFamily: fonts.black, color: 'white' }}>{lv.label}</Text>
                          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{lv.sub}</Text>
                        </View>
                      </ChunkyButton>
                    </Pop>
                  ))}
                </View>
              </View>
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
          total={problems.length}
          starCount={Math.round((score / problems.length) * 5)}
          onRetry={() => startLevel(levelDef)}
          onBack={goToLevelSelect}
          backLabel="レベルをえらぶ"
          color={lc}
          mistakes={mistakes}
          onRetryMistakes={mistakes.length > 0 ? startMistakeRetry : null}
        />
      </ScreenBackground>
    );
  }

  if (!current || current.answer === undefined) {
    return (
      <ScreenBackground>
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 40, marginBottom: 10 }}>⚠️</Text>
          <Text style={{ fontFamily: fonts.bold, color: '#666', marginBottom: 20 }}>データの じゅんびちゅう です…</Text>
          <BackButton onPress={goToLevelSelect} />
        </View>
      </ScreenBackground>
    );
  }

  // ---- Play ----
  const isSub = current.op === '－';
  const showDots = current.a <= 10 && current.b <= 10 && current.missing === 'c' && current.format === 'normal';
  const [dotEmoji, dotEmojiB] = FRUIT_PAIRS[levelDef.id % FRUIT_PAIRS.length];

  const DotRow = ({ n, em }: { n: number; em: string }) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center', maxWidth: 180 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Text key={i} style={{ fontSize: 24 }}>
          {em}
        </Text>
      ))}
    </View>
  );

  const Hole = () => (
    <Text
      style={{
        color: feedback === 'correct' ? lc : '#bbb',
        minWidth: 44,
        textAlign: 'center',
        ...(feedback === 'correct' ? {} : { borderBottomWidth: 4, borderBottomColor: lc }),
      }}
    >
      {feedback === 'correct' ? current.answer : '?'}
    </Text>
  );

  const num = (v: number) => <Text>{v}</Text>;

  return (
    <ScreenBackground>
      <View style={{ width: '100%', maxWidth: 440 }}>
        <View style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <BackButton onPress={goToLevelSelect} />
            <Text style={{ textAlign: 'center' }}>
              <Text style={{ fontFamily: fonts.black, color: lc, fontSize: 13 }}>{levelDef.label}</Text>
              <Text style={{ color: '#aaa', fontSize: 13 }}> ｜ {idx + 1}/{TOTAL}もん</Text>
            </Text>
            <Text style={{ fontFamily: fonts.black, fontSize: 15, color: lc }}>
              ⭐{score}
              {streak >= 3 ? <Text style={{ color: '#FF5722', fontSize: 13 }}> 🔥{streak}</Text> : null}
            </Text>
          </View>
          <ProgressBar current={idx} total={TOTAL} color={lc} />
        </View>

        <FeedbackView
          feedback={feedback}
          style={{
            backgroundColor: 'white',
            borderRadius: 28,
            paddingVertical: 30,
            paddingHorizontal: 20,
            marginBottom: 18,
            borderWidth: 4,
            borderColor: lc,
            alignItems: 'center',
            shadowColor: lc,
            shadowOpacity: 0.27,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          {showDots ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#bbb', fontFamily: fonts.bold, marginBottom: 4 }}>{current.a}こ</Text>
                <DotRow n={current.a} em={dotEmoji} />
              </View>
              <Text style={{ fontSize: 30, fontFamily: fonts.black, color: lc }}>{isSub ? '－' : '＋'}</Text>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#bbb', fontFamily: fonts.bold, marginBottom: 4 }}>{current.b}こ</Text>
                <DotRow n={current.b} em={isSub ? '❌' : dotEmojiB} />
              </View>
              <Text style={{ fontSize: 30, fontFamily: fonts.black, color: '#aaa' }}>＝</Text>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: feedback === 'correct' ? `${lc}22` : '#F5F5F5',
                  borderWidth: 3,
                  borderStyle: 'dashed',
                  borderColor: feedback === 'correct' ? lc : '#ddd',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 26, fontFamily: fonts.black, color: lc }}>{feedback === 'correct' ? current.answer : '？'}</Text>
              </View>
            </View>
          ) : null}

          <Text style={{ fontSize: 52, fontFamily: fonts.black, color: '#333', letterSpacing: 4 }}>
            {current.format === 'reverse' ? (
              <>
                {current.missing === 'c' ? <Hole /> : num(current.c)} <Text style={{ color: '#aaa' }}>＝</Text>{' '}
                {current.missing === 'a' ? <Hole /> : num(current.a)} <Text style={{ color: lc }}>{current.op}</Text>{' '}
                {current.missing === 'b' ? <Hole /> : num(current.b)}
              </>
            ) : (
              <>
                {current.missing === 'a' ? <Hole /> : num(current.a)} <Text style={{ color: lc }}>{current.op}</Text>{' '}
                {current.missing === 'b' ? <Hole /> : num(current.b)} <Text style={{ color: '#aaa' }}>＝</Text>{' '}
                {current.missing === 'c' ? <Hole /> : num(current.c)}
              </>
            )}
          </Text>

          {feedback ? (
            <Text style={{ marginTop: 10, fontSize: 19, fontFamily: fonts.black, color: feedback === 'correct' ? '#4CAF50' : '#F44336' }}>
              {feedback === 'correct' ? praise : 'ざんねん！ちがうよ！'}
            </Text>
          ) : null}
        </FeedbackView>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}>
          {choiceList.map((val) => {
            const isSel = selected === val;
            let bg = 'white';
            let bd = '#e0e0e0';
            let col = '#333';
            if (isSel && feedback === 'correct') { bg = '#4CAF50'; bd = '#4CAF50'; col = 'white'; }
            else if (isSel && feedback === 'wrong') { bg = '#F44336'; bd = '#F44336'; col = 'white'; }
            return (
              <ChunkyButton
                key={val}
                backgroundColor={bg}
                edgeColor="#ddd"
                radius={18}
                depth={feedback ? 0 : 5}
                disabled={!!feedback}
                onPress={() => handleChoice(val)}
                style={{ width: '48%' }}
                faceStyle={{ paddingVertical: 20, alignItems: 'center', borderWidth: 3, borderColor: bd }}
              >
                <Text style={{ fontSize: 34, fontFamily: fonts.black, color: col }}>{val}</Text>
              </ChunkyButton>
            );
          })}
        </View>
      </View>
    </ScreenBackground>
  );
}
