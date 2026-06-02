import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSound } from '../audio/SoundProvider';
import { FeedbackView, Float, Pop } from '../components/anim';
import { BackButton } from '../components/BackButton';
import { ChunkyButton } from '../components/ChunkyButton';
import { FlipCard } from '../components/FlipCard';
import { ProgressBar } from '../components/ProgressBar';
import { ResultScreen } from '../components/ResultScreen';
import { ScreenBackground } from '../components/ScreenBackground';
import type { Mistake } from '../components/types';
import {
  kokugoGroups,
  type FlashCard,
  type KokugoCard,
  type KokugoGroup,
  type KokugoTopic,
  type QuizCard,
} from '../data/kokugo';
import { kokugoStampId } from '../data/stamps';
import type { ScreenProps } from '../navigation';
import { useProfile } from '../storage/profile';
import { fonts } from '../theme/theme';

const QUIZ_PRAISE = ['せいかい！🎉', 'すごい！✨', 'やった！🌟', 'かんぺき！💯', '天才！🏆'];
type FB = 'correct' | 'wrong' | null;

// Renders a quiz question, turning "（　）" into a fill-in blank box.
function QuizQuestion({ question, answer, filled, color }: { question: string; answer: string; filled: boolean; color: string }) {
  if (question.indexOf('（　）') === -1) {
    return <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#333', lineHeight: 38, textAlign: 'center' }}>{question}</Text>;
  }
  const parts = question.split('（　）');
  return (
    <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#333', lineHeight: 44, textAlign: 'center' }}>
      {parts.map((part, i) => (
        <Text key={i}>
          {part}
          {i < parts.length - 1 ? (
            <Text style={{ color, fontSize: 26 }}>{filled ? `（${answer}）` : '（　）'}</Text>
          ) : null}
        </Text>
      ))}
    </Text>
  );
}

export function KokugoScreen({ navigation }: ScreenProps<'Kokugo'>) {
  const { addStamp } = useProfile();
  const { playCorrect, playWrong } = useSound();

  const [group, setGroup] = useState<KokugoGroup | null>(null);
  const [topicDef, setTopicDef] = useState<KokugoTopic | null>(null);
  const [activeCards, setActiveCards] = useState<KokugoCard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FB>(null);
  const [praise, setPraise] = useState(QUIZ_PRAISE[0]);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cancel any pending answer timeout on every leave-play path (see MathScreen for why).
  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  useEffect(() => () => clearTimer(), [clearTimer]);

  // Shuffle the quiz answer buttons once per card (data has the answer at choices[0]).
  // Keyed on the card so feedback re-renders don't reshuffle. Flash cards have no choices.
  const shuffledChoices = useMemo(() => {
    const c = activeCards[idx] as QuizCard | undefined;
    return c && Array.isArray(c.choices) ? [...c.choices].sort(() => Math.random() - 0.5) : [];
  }, [activeCards, idx]);

  const resetTopic = useCallback((cardList: KokugoCard[]) => {
    if (!cardList || cardList.length === 0) return;
    clearTimer();
    setActiveCards([...cardList]);
    setIdx(0); setFlipped(false); setScore(0);
    setCompleted(false); setFeedback(null); setSelectedAns(null); setMistakes([]);
  }, [clearTimer]);

  const advance = (newScore: number) => {
    timer.current = setTimeout(() => {
      setFeedback(null); setSelectedAns(null); setFlipped(false);
      if (idx + 1 >= activeCards.length) {
        if (newScore === activeCards.length && group && topicDef) addStamp(kokugoStampId(group.groupLabel, topicDef.key));
        setCompleted(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, topicDef?.type === 'flash' ? 700 : 1000);
  };

  const handleFlashAnswer = (isCorrect: boolean) => {
    if (feedback) return;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    const card = activeCards[idx] as FlashCard;
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      playCorrect();
    } else {
      setMistakes((m) => [...m, { type: 'flash', char: card.char, word: card.word, emoji: card.emoji }]);
      playWrong();
    }
    advance(newScore);
  };

  const handleQuizChoice = (choice: string) => {
    if (feedback) return;
    setSelectedAns(choice);
    const card = activeCards[idx] as QuizCard;
    const isCorrect = choice === card.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      setPraise(QUIZ_PRAISE[Math.floor(Math.random() * QUIZ_PRAISE.length)]);
      playCorrect();
    } else {
      setMistakes((m) => [...m, { type: 'quiz', question: card.question, choices: card.choices, answer: card.answer, hint: card.hint }]);
      playWrong();
    }
    advance(newScore);
  };

  const tc = topicDef ? topicDef.color : '#9C27B0';
  const exitToGroups = () => { clearTimer(); setGroup(null); setTopicDef(null); setIdx(0); setScore(0); setCompleted(false); setFeedback(null); setSelectedAns(null); setMistakes([]); };

  // ---- Group / topic select ----
  if (!group) {
    return (
      <ScreenBackground>
        <View style={{ width: '100%', maxWidth: 480, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ fontSize: 22, fontFamily: fonts.black, color: '#555' }}>📖 こくご</Text>
          </View>
          <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            {kokugoGroups.map((g, gi) => (
              <View key={g.groupLabel}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, paddingLeft: 4 }}>
                  <Text style={{ fontSize: 20 }}>{g.groupEmoji}</Text>
                  <Text style={{ fontSize: 15, fontFamily: fonts.black, color: g.groupColor, borderBottomWidth: 3, borderBottomColor: g.groupColor, paddingBottom: 2 }}>
                    {g.groupLabel}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {g.topics.map((t, ti) => (
                    <Pop key={t.key} delay={(gi * 5 + ti) * 40} style={{ width: '48%' }}>
                      <ChunkyButton
                        colors={[t.color, `${t.color}cc`]}
                        edgeColor={`${t.color}66`}
                        radius={18}
                        onPress={() => { setGroup(g); setTopicDef(t); resetTopic(t.cards); }}
                        faceStyle={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 12 }}
                      >
                        <Text style={{ fontSize: 26 }}>{t.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontFamily: fonts.black, color: 'white', lineHeight: 18 }}>{t.key}</Text>
                          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>
                            {t.type === 'flash' ? 'めくり式' : '4たく'} · {t.cards.length}もん
                          </Text>
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
          total={activeCards.length}
          starCount={Math.round((score / activeCards.length) * 5)}
          onRetry={() => topicDef && resetTopic(topicDef.cards)}
          onBack={exitToGroups}
          backLabel="トピックをえらぶ"
          color={tc}
          mistakes={mistakes}
          onRetryMistakes={mistakes.length > 0 ? () => resetTopic(mistakes as unknown as KokugoCard[]) : null}
        />
      </ScreenBackground>
    );
  }

  const card = activeCards[idx];
  if (!card) {
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

  const Header = (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <BackButton onPress={exitToGroups} />
        <Text>
          <Text style={{ fontFamily: fonts.black, color: tc, fontSize: 13 }}>{topicDef?.key}</Text>
          <Text style={{ color: '#aaa', fontSize: 13 }}> ｜ {idx + 1}/{activeCards.length}</Text>
        </Text>
        <Text style={{ fontFamily: fonts.black, color: tc }}>⭐ {score}</Text>
      </View>
      <ProgressBar current={idx} total={activeCards.length} color={tc} />
    </View>
  );

  // ---- Flash card ----
  if (topicDef?.type === 'flash') {
    const f = card as FlashCard;
    return (
      <ScreenBackground>
        <View style={{ width: '100%', maxWidth: 440 }}>
          {Header}
          <FeedbackView feedback={feedback} style={{ height: 290, marginBottom: 18 }}>
            <FlipCard
              flipped={flipped}
              onPress={() => setFlipped((v) => !v)}
              style={{ flex: 1 }}
              front={
                <View style={{ flex: 1, borderRadius: 28, borderWidth: 4, borderColor: tc, backgroundColor: `${tc}33`, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 90, fontFamily: fonts.black, color: tc }}>{f.char}</Text>
                  <Text style={{ color: '#bbb', fontSize: 13, fontFamily: fonts.bold, marginTop: 10 }}>タップして えを みる 👆</Text>
                </View>
              }
              back={
                <View style={{ flex: 1, borderRadius: 28, borderWidth: 4, borderColor: tc, backgroundColor: `${tc}18`, alignItems: 'center', justifyContent: 'center' }}>
                  <Float>
                    <Text style={{ fontSize: 80 }}>{f.emoji}</Text>
                  </Float>
                  <Text style={{ fontSize: 32, fontFamily: fonts.black, color: tc, marginTop: 10, letterSpacing: 1 }}>{f.word}</Text>
                </View>
              }
            />
          </FeedbackView>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            <ChunkyButton
              backgroundColor={feedback === 'wrong' ? '#F44336' : 'white'}
              edgeColor="#F4433633"
              radius={18}
              disabled={!!feedback}
              onPress={() => handleFlashAnswer(false)}
              style={{ flex: 1 }}
              faceStyle={{ paddingVertical: 18, alignItems: 'center', borderWidth: 3, borderColor: '#F44336' }}
            >
              <Text style={{ fontSize: 18, fontFamily: fonts.black, color: feedback === 'wrong' ? 'white' : '#F44336' }}>😢 わからない</Text>
            </ChunkyButton>
            <ChunkyButton
              backgroundColor={feedback === 'correct' ? '#4CAF50' : 'white'}
              edgeColor="#4CAF5033"
              radius={18}
              disabled={!!feedback}
              onPress={() => handleFlashAnswer(true)}
              style={{ flex: 1 }}
              faceStyle={{ paddingVertical: 18, alignItems: 'center', borderWidth: 3, borderColor: '#4CAF50' }}
            >
              <Text style={{ fontSize: 18, fontFamily: fonts.black, color: feedback === 'correct' ? 'white' : '#4CAF50' }}>😊 わかった！</Text>
            </ChunkyButton>
          </View>
        </View>
      </ScreenBackground>
    );
  }

  // ---- Quiz (4-choice) ----
  const q = card as QuizCard;
  return (
    <ScreenBackground>
      <View style={{ width: '100%', maxWidth: 440 }}>
        {Header}
        <FeedbackView
          feedback={feedback}
          style={{
            backgroundColor: 'white',
            borderRadius: 28,
            paddingVertical: 24,
            paddingHorizontal: 20,
            marginBottom: 18,
            borderWidth: 4,
            borderColor: tc,
            alignItems: 'center',
            shadowColor: tc,
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          {q.hint ? (
            <Float style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 60 }}>{q.hint}</Text>
            </Float>
          ) : null}
          <QuizQuestion question={q.question} answer={q.answer} filled={feedback === 'correct'} color={tc} />
          {feedback ? (
            <Text style={{ marginTop: 10, fontSize: 18, fontFamily: fonts.black, color: feedback === 'correct' ? '#4CAF50' : '#F44336' }}>
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
                onPress={() => handleQuizChoice(choice)}
                style={{ width: '48%' }}
                faceStyle={{ paddingVertical: 18, paddingHorizontal: 8, alignItems: 'center', borderWidth: 3, borderColor: bd }}
              >
                <Text style={{ fontSize: 20, fontFamily: fonts.black, color: col }}>{choice}</Text>
              </ChunkyButton>
            );
          })}
        </View>
      </View>
    </ScreenBackground>
  );
}
