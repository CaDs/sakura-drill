// CANON riddle content, ported verbatim from sakura_drill_app.html (nazozoGroups).

export interface Riddle {
  question: string;
  answer: string;
  choices: string[];
  hint: string;
  /** tag used by the mistakes-review screen */
  type?: 'quiz';
}

export interface NazoGroup {
  groupLabel: string;
  groupEmoji: string;
  groupColor: string;
  riddles: Riddle[];
}

export const nazozoGroups: NazoGroup[] = [
  {
    groupLabel: 'かんたん（★☆☆）',
    groupEmoji: '🌱',
    groupColor: '#4CAF50',
    riddles: [
      { question: 'たべると あまくて\nちいさくて あかい\nくだもの な〜んだ？', answer: 'いちご', choices: ['いちご', 'りんご', 'みかん', 'ぶどう'], hint: '🍓' },
      { question: 'くびが とっても\nながくて たかい\nどうぶつ な〜んだ？', answer: 'きりん', choices: ['きりん', 'ぞう', 'らくだ', 'うま'], hint: '🦒' },
      { question: 'まるくて きいろくて\nかじると すっぱい\nくだものは な〜んだ？', answer: 'レモン', choices: ['レモン', 'みかん', 'バナナ', 'メロン'], hint: '🍋' },
      { question: 'みずの なかに すんでいて\nひれで およぐ\nいきものは な〜んだ？', answer: 'さかな', choices: ['さかな', 'かめ', 'かに', 'たこ'], hint: '🐟' },
      { question: 'きいろくて ながくて\nかわを むいて\nたべるものは な〜んだ？', answer: 'バナナ', choices: ['バナナ', 'きゅうり', 'にんじん', 'とうもろこし'], hint: '🍌' },
      { question: 'よるの そらに\nたくさん ひかって\nみえる ものは な〜んだ？', answer: 'ほし', choices: ['ほし', 'つき', 'たいよう', 'くも'], hint: '⭐' },
      { question: 'ふわふわで しろくて\nそらに うかんでいる\nものは な〜んだ？', answer: 'くも', choices: ['くも', 'ゆき', 'けむり', 'わた'], hint: '☁️' },
      { question: 'みどりで ながくて\nかじると シャキシャキ\nするやさいは な〜んだ？', answer: 'きゅうり', choices: ['きゅうり', 'ねぎ', 'アスパラ', 'ピーマン'], hint: '🥒' },
    ],
  },
  {
    groupLabel: 'ふつう（★★☆）',
    groupEmoji: '🌿',
    groupColor: '#FF9800',
    riddles: [
      { question: 'はるになると\nピンクの おはなを\nさかせる きは な〜んだ？', answer: 'さくら', choices: ['さくら', 'うめ', 'もも', 'バラ'], hint: '🌸' },
      { question: 'あしが 4ほん あるのに\nいつも たっている\nものは な〜んだ？', answer: 'いす', choices: ['いす', 'テーブル', 'ベッド', 'ソファ'], hint: '🪑' },
      { question: 'かおは ひとつ\nてが ２ぽん ある\nじかんを おしえてくれる ものは？', answer: 'とけい', choices: ['とけい', 'めがね', 'ハサミ', 'コンパス'], hint: '⏰' },
      { question: 'うえから よんでも\nしたから よんでも\nおなじ なまえの あかい やさいは？', answer: 'トマト', choices: ['トマト', 'たけのこ', 'すいか', 'なすび'], hint: '🍅' },
      { question: 'くうきを いれると\nふくらんで\nそらに とぶものは な〜んだ？', answer: 'ふうせん', choices: ['ふうせん', 'バケツ', 'かばん', 'はこ'], hint: '🎈' },
      { question: 'さかさまに ぶらさがって\nねむる どうぶつは な〜んだ？', answer: 'こうもり', choices: ['こうもり', 'なまけもの', 'コアラ', 'サル'], hint: '🦇' },
      { question: 'しろくろの もようで\nササの はっぱが だいすきな\nどうぶつは な〜んだ？', answer: 'パンダ', choices: ['パンダ', 'シマウマ', 'スカンク', 'たぬき'], hint: '🐼' },
      { question: 'じぶんの せなかの\nいえを しょって\nあるく いきものは な〜んだ？', answer: 'かたつむり', choices: ['かたつむり', 'かめ', 'やどかり', 'はりねずみ'], hint: '🐌' },
    ],
  },
  {
    groupLabel: 'むずかしい（★★★）',
    groupEmoji: '🔥',
    groupColor: '#F44336',
    riddles: [
      { question: 'みずに ぬれても\nぜったいに ぬれない\nものは な〜んだ？', answer: 'かげ', choices: ['かげ', 'いし', 'かみ', 'きんぞく'], hint: '🌑' },
      { question: 'あなたの かおを\nそのまま うつす\nぴかぴか なものは な〜んだ？', answer: 'かがみ', choices: ['かがみ', 'えほん', 'しんぶん', 'テレビ'], hint: '🪞' },
      { question: 'きのうの つぎのひ で\nあしたの まえのひ は\nな〜んだ？', answer: 'きょう', choices: ['きょう', 'あさ', 'よる', 'じかん'], hint: '📅' },
      { question: 'みがけば みがくほど\nきれいに なるものは な〜んだ？', answer: 'は（歯）', choices: ['は（歯）', 'くつ', 'まど', 'かみ'], hint: '🦷' },
      { question: 'ひるは みじかく\nふゆに なると\nながくなるものは な〜んだ？', answer: 'よる', choices: ['よる', 'かげ', 'ひ', 'ゆき'], hint: '🌙' },
      { question: 'あしが ８ぽん あって\nよこに あるく いきものは な〜んだ？', answer: 'かに', choices: ['かに', 'たこ', 'いか', 'クモ'], hint: '🦀' },
      { question: 'おもければ おもいほど\nたかく とびあがる\nこうえんの ゆうぐは な〜んだ？', answer: 'シーソー', choices: ['シーソー', 'ブランコ', 'すべりだい', 'てつぼう'], hint: '⚖️' },
      { question: 'あめが ふると ひらいて\nはれると とじる\nものは な〜んだ？', answer: 'かさ', choices: ['かさ', 'ほん', 'ドア', 'まど'], hint: '☂️' },
    ],
  },
  {
    groupLabel: 'どうぶつなぞなぞ',
    groupEmoji: '🐾',
    groupColor: '#9C27B0',
    riddles: [
      { question: 'しましまで アフリカに いる\nうまに にた\nどうぶつは な〜んだ？', answer: 'しまうま', choices: ['しまうま', 'とら', 'きりん', 'ハイエナ'], hint: '🦓' },
      { question: 'はなが ながくて\nみずを はなから\nふける どうぶつは な〜んだ？', answer: 'ぞう', choices: ['ぞう', 'さい', 'かば', 'サイ'], hint: '🐘' },
      { question: 'くびが いちばん\nながい どうぶつは な〜んだ？', answer: 'きりん', choices: ['きりん', 'らくだ', 'ダチョウ', 'うま'], hint: '🦒' },
      { question: 'ふゆの あいだ\nあなの なかで\nねむる どうぶつは な〜んだ？', answer: 'くま', choices: ['くま', 'たぬき', 'りす', 'かえる'], hint: '🐻' },
      { question: 'せなかに こぶが あって\nさばくを あるく どうぶつは？', answer: 'らくだ', choices: ['らくだ', 'サソリ', 'トカゲ', 'きつね'], hint: '🐪' },
      { question: 'うみに すんでいて\nあしが 8ほんの\nいきものは な〜んだ？', answer: 'たこ', choices: ['たこ', 'いか', 'かに', 'えび'], hint: '🐙' },
      { question: 'きいろと くろの しましまで\nはなの みつが だいすきな\nむしは な〜んだ？', answer: 'みつばち', choices: ['みつばち', 'ちょうちょ', 'とんぼ', 'かぶとむし'], hint: '🐝' },
      { question: 'ながい みみを もっていて\nぴょんぴょん とねる\nいきものは？', answer: 'うさぎ', choices: ['うさぎ', 'かえる', 'カンガルー', 'ばった'], hint: '🐰' },
    ],
  },
];
