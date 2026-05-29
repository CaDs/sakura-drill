// CANON Japanese (こくご) content, ported verbatim from sakura_drill_app.html (kokugoGroups).

export type KokugoTopicType = 'flash' | 'quiz4';

export interface FlashCard {
  char: string;
  word: string;
  emoji: string;
  /** tag used by the mistakes-review screen */
  type?: 'flash';
}

export interface QuizCard {
  question: string;
  answer: string;
  choices: string[];
  hint: string;
  /** tag used by the mistakes-review screen */
  type?: 'quiz';
}

export type KokugoCard = FlashCard | QuizCard;

export interface KokugoTopic {
  key: string;
  emoji: string;
  type: KokugoTopicType;
  color: string;
  cards: KokugoCard[];
}

export interface KokugoGroup {
  groupLabel: string;
  groupEmoji: string;
  groupColor: string;
  topics: KokugoTopic[];
}

export const kokugoGroups: KokugoGroup[] = [
  {
    groupLabel: 'ひらがな',
    groupEmoji: '🔤',
    groupColor: '#E91E63',
    topics: [
      { key: 'あ〜お行', emoji: '🌸', type: 'flash', color: '#E91E63', cards: [ { char: 'あ', word: 'あり', emoji: '🐜' }, { char: 'い', word: 'いぬ', emoji: '🐶' }, { char: 'う', word: 'うさぎ', emoji: '🐰' }, { char: 'え', word: 'えんぴつ', emoji: '✏️' }, { char: 'お', word: 'おに', emoji: '👹' } ] },
      { key: 'か〜こ行', emoji: '🌼', type: 'flash', color: '#FF9800', cards: [ { char: 'か', word: 'かに', emoji: '🦀' }, { char: 'き', word: 'きつね', emoji: '🦊' }, { char: 'く', word: 'くも', emoji: '🕷️' }, { char: 'け', word: 'けむし', emoji: '🐛' }, { char: 'こ', word: 'こあら', emoji: '🐨' } ] },
      { key: 'さ〜そ行', emoji: '🌻', type: 'flash', color: '#FFD600', cards: [ { char: 'さ', word: 'さかな', emoji: '🐟' }, { char: 'し', word: 'しまうま', emoji: '🦓' }, { char: 'す', word: 'すいか', emoji: '🍉' }, { char: 'せ', word: 'せんせい', emoji: '🧑‍🏫' }, { char: 'そ', word: 'そら', emoji: '🌤️' } ] },
      { key: 'た〜と行', emoji: '🍀', type: 'flash', color: '#4CAF50', cards: [ { char: 'た', word: 'たこ', emoji: '🐙' }, { char: 'ち', word: 'ちょうちょ', emoji: '🦋' }, { char: 'つ', word: 'つき', emoji: '🌙' }, { char: 'て', word: 'てんとうむし', emoji: '🐞' }, { char: 'と', word: 'とら', emoji: '🐯' } ] },
      { key: 'な〜の行', emoji: '🌊', type: 'flash', color: '#00BCD4', cards: [ { char: 'な', word: 'なす', emoji: '🍆' }, { char: 'に', word: 'にわとり', emoji: '🐔' }, { char: 'ぬ', word: 'ぬいぐるみ', emoji: '🧸' }, { char: 'ね', word: 'ねこ', emoji: '🐱' }, { char: 'の', word: 'のり', emoji: '🍙' } ] },
      { key: 'は〜ほ行', emoji: '🌈', type: 'flash', color: '#2196F3', cards: [ { char: 'は', word: 'はな', emoji: '🌸' }, { char: 'ひ', word: 'ひよこ', emoji: '🐥' }, { char: 'ふ', word: 'ふね', emoji: '🚢' }, { char: 'へ', word: 'へび', emoji: '🐍' }, { char: 'ほ', word: 'ほん', emoji: '📖' } ] },
      { key: 'ま〜も行', emoji: '🍇', type: 'flash', color: '#9C27B0', cards: [ { char: 'ま', word: 'まめ', emoji: '🫘' }, { char: 'み', word: 'みかん', emoji: '🍊' }, { char: 'む', word: 'むらさき', emoji: '🟣' }, { char: 'め', word: 'めがね', emoji: '👓' }, { char: 'も', word: 'もも', emoji: '🍑' } ] },
      { key: 'や・ゆ・よ行', emoji: '🏔️', type: 'flash', color: '#795548', cards: [ { char: 'や', word: 'やま', emoji: '🏔️' }, { char: 'ゆ', word: 'ゆき', emoji: '❄️' }, { char: 'よ', word: 'ようふく', emoji: '👗' } ] },
      { key: 'ら〜ろ行', emoji: '🦁', type: 'flash', color: '#FF5722', cards: [ { char: 'ら', word: 'らくだ', emoji: '🐪' }, { char: 'り', word: 'りす', emoji: '🐿️' }, { char: 'る', word: 'るーぺ', emoji: '🔍' }, { char: 'れ', word: 'れもん', emoji: '🍋' }, { char: 'ろ', word: 'ろば', emoji: '🫏' } ] },
      { key: 'わ・を・ん', emoji: '🐊', type: 'flash', color: '#607D8B', cards: [ { char: 'わ', word: 'わに', emoji: '🐊' }, { char: 'を', word: 'みちをあるく', emoji: '🚶' }, { char: 'ん', word: 'ぺんぎん', emoji: '🐧' } ] },
    ],
  },
  {
    groupLabel: 'カタカナ',
    groupEmoji: '🔠',
    groupColor: '#009688',
    topics: [
      { key: 'どうぶつ', emoji: '🦁', type: 'quiz4', color: '#FF9800', cards: [
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ライオン', choices: ['ライオン', 'トラ', 'パンダ', 'コアラ'], hint: '🦁' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ペンギン', choices: ['ペンギン', 'イルカ', 'ラッコ', 'クジラ'], hint: '🐧' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'コアラ', choices: ['コアラ', 'ゴリラ', 'パンダ', 'カンガルー'], hint: '🐨' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ゴリラ', choices: ['ゴリラ', 'チンパンジー', 'サル', 'パンダ'], hint: '🦍' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'カンガルー', choices: ['カンガルー', 'ワニ', 'キリン', 'ダチョウ'], hint: '🦘' },
      ] },
      { key: 'たべもの', emoji: '🍔', type: 'quiz4', color: '#E91E63', cards: [
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ハンバーグ', choices: ['ハンバーグ', 'オムライス', 'カレー', 'スパゲティ'], hint: '🍽️' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ケーキ', choices: ['ケーキ', 'クッキー', 'プリン', 'チョコ'], hint: '🍰' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'アイス', choices: ['アイス', 'パフェ', 'ゼリー', 'ジュース'], hint: '🍦' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'パン', choices: ['パン', 'サンドイッチ', 'ピザ', 'クレープ'], hint: '🍞' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'トマト', choices: ['トマト', 'キャベツ', 'レタス', 'ピーマン'], hint: '🍅' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'バナナ', choices: ['バナナ', 'パイナップル', 'マンゴー', 'キウイ'], hint: '🍌' },
      ] },
      { key: 'しょくぶつ', emoji: '🌷', type: 'quiz4', color: '#4CAF50', cards: [
        { question: 'えをみて カタカナで\nこたえよう', answer: 'チューリップ', choices: ['チューリップ', 'ヒマワリ', 'タンポポ', 'コスモス'], hint: '🌷' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'ヒマワリ', choices: ['ヒマワリ', 'アサガオ', 'バラ', 'カーネーション'], hint: '🌻' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'バラ', choices: ['バラ', 'ユリ', 'サクラ', 'ボタン'], hint: '🌹' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'サボテン', choices: ['サボテン', 'アロエ', 'キノコ', 'シダ'], hint: '🌵' },
        { question: 'えをみて カタカナで\nこたえよう', answer: 'キノコ', choices: ['キノコ', 'タケノコ', 'マツタケ', 'シイタケ'], hint: '🍄' },
      ] },
    ],
  },
  {
    groupLabel: 'ことば',
    groupEmoji: '📝',
    groupColor: '#2196F3',
    topics: [
      { key: 'はんたいことば', emoji: '🔄', type: 'quiz4', color: '#FF5722', cards: [
        { question: '「おおきい」のはんたいは？', answer: 'ちいさい', choices: ['ちいさい', 'ながい', 'かるい', 'くらい'], hint: '🐘 ↔️ 🐭' },
        { question: '「たかい」のはんたいは？', answer: 'ひくい', choices: ['ひくい', 'みじかい', 'せまい', 'うすい'], hint: '🦒 ↔️ 🐕' },
        { question: '「あつい」のはんたいは？', answer: 'さむい', choices: ['さむい', 'つめたい', 'ぬるい', 'すずしい'], hint: '☀️ ↔️ ⛄' },
        { question: '「はやい」のはんたいは？', answer: 'おそい', choices: ['おそい', 'よわい', 'かるい', 'やさしい'], hint: '🐇 ↔️ 🐢' },
        { question: '「あける」のはんたいは？', answer: 'しめる', choices: ['しめる', 'おく', 'もつ', 'わたす'], hint: '👐 ↔️ ✊' },
        { question: '「うえ」のはんたいは？', answer: 'した', choices: ['した', 'よこ', 'なか', 'そと'], hint: '⬆️ ↔️ ⬇️' },
        { question: '「まえ」のはんたいは？', answer: 'うしろ', choices: ['うしろ', 'みぎ', 'ひだり', 'よこ'], hint: '➡️ ↔️ ⬅️' },
        { question: '「すき」のはんたいは？', answer: 'きらい', choices: ['きらい', 'こわい', 'たのしい', 'かなしい'], hint: '😍 ↔️ 😫' },
      ] },
      { key: 'どうさことば', emoji: '🏃', type: 'quiz4', color: '#4CAF50', cards: [
        { question: 'えをみて どんな うごき？', answer: 'はしる', choices: ['はしる', 'およぐ', 'とぶ', 'ねる'], hint: '🏃' },
        { question: 'えをみて どんな うごき？', answer: 'およぐ', choices: ['およぐ', 'はしる', 'たべる', 'のむ'], hint: '🏊' },
        { question: 'えをみて どんな うごき？', answer: 'とぶ', choices: ['とぶ', 'あるく', 'ねる', 'よむ'], hint: '🕊️' },
        { question: 'えをみて どんな うごき？', answer: 'たべる', choices: ['たべる', 'のむ', 'つかう', 'みる'], hint: '🍽️' },
        { question: 'えをみて どんな うごき？', answer: 'かく', choices: ['かく', 'よむ', 'きる', 'ぬる'], hint: '✍️' },
        { question: 'えをみて どんな うごき？', answer: 'よむ', choices: ['よむ', 'かく', 'みる', 'きく'], hint: '📖' },
        { question: 'えをみて どんな うごき？', answer: 'うたう', choices: ['うたう', 'はなす', 'きく', 'わらう'], hint: '🎤' },
        { question: 'えをみて どんな うごき？', answer: 'きく', choices: ['きく', 'なく', 'おこる', 'よろこぶ'], hint: '👂' },
      ] },
    ],
  },
  {
    groupLabel: 'くっつき言葉',
    groupEmoji: '🔗',
    groupColor: '#9C27B0',
    topics: [
      { key: 'は・が・を・に', emoji: '🌟', type: 'quiz4', color: '#9C27B0', cards: [
        { question: 'いぬ（　）ほえた。', answer: 'が', choices: ['が', 'は', 'を', 'に'], hint: '🐶' },
        { question: 'ねこ（　）だいすき。', answer: 'が', choices: ['が', 'は', 'を', 'に'], hint: '🐱' },
        { question: 'りんご（　）たべた。', answer: 'を', choices: ['を', 'は', 'が', 'に'], hint: '🍎' },
        { question: 'ほん（　）よんだ。', answer: 'を', choices: ['を', 'は', 'が', 'に'], hint: '📖' },
        { question: 'がっこう（　）いった。', answer: 'に', choices: ['に', 'は', 'が', 'を'], hint: '🏫' },
        { question: 'わたし（　）さくらこ。', answer: 'は', choices: ['は', 'が', 'を', 'に'], hint: '👧' },
        { question: 'きょう（　）いいてんき。', answer: 'は', choices: ['は', 'が', 'を', 'に'], hint: '☀️' },
        { question: 'ともだち（　）あそんだ。', answer: 'と', choices: ['と', 'は', 'が', 'を'], hint: '👫' },
      ] },
      { key: '「は」と「わ」', emoji: '❓', type: 'quiz4', color: '#E91E63', cards: [
        { question: 'わたし（　）がくせいです。\nどちらをつかう？', answer: 'は', choices: ['は', 'わ'], hint: '👧' },
        { question: 'きょう（　）はれです。\nどちらをつかう？', answer: 'は', choices: ['は', 'わ'], hint: '☀️' },
        { question: 'こんにち（　）！\nどちらをつかう？', answer: 'は', choices: ['は', 'わ'], hint: '👋' },
        { question: 'ほん（　）おもしろい。\nどちらをつかう？', answer: 'は', choices: ['は', 'わ'], hint: '📖' },
      ] },
    ],
  },
];
