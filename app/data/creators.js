/* ===========================================================
   BLOSSOM — 夢追い人データ
   本番ではAPI/DBから取得する想定。今は固定データで動作確認用。
   ※20人以上のダミーデータは無限スクロールの動作確認用。
=========================================================== */

// アバター（シルエット・後ろ姿・物）
const A = {
  a1: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop", // 陶器
  a2: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&h=200&fit=crop", // ギター
  a3: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop", // カフェ
  a4: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop", // 山
  a5: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=200&h=200&fit=crop", // カメラ
  a6: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop", // ペン
  a7: "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=200&h=200&fit=crop", // マイク
  a8: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200&h=200&fit=crop", // サッカー
  a9: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop", // パン
  a10: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop", // イラスト
  a11: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&h=200&fit=crop", // ジャズ
  a12: "https://images.unsplash.com/photo-1611251135345-18c56206b863?w=200&h=200&fit=crop", // 卓球
  a13: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=200&fit=crop", // 宿
  a14: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=200&h=200&fit=crop", // 彫刻
  a15: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&h=200&fit=crop", // ボクシング
  a16: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop", // ビール
  a17: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=200&h=200&fit=crop", // クライミング
  a18: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop", // コーヒー
  a19: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop", // 古着
  a20: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=200&h=200&fit=crop", // 野球
  a21: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=200&h=200&fit=crop", // DJ
  a22: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop", // 版画
  a23: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", // 歌
  a24: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop", // スポーツ
};

const F = {
  f1: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop",
  f2: "https://images.unsplash.com/photo-1549492423-400259a2e574?w=80&h=80&fit=crop",
  f3: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=80&h=80&fit=crop",
  f4: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=80&h=80&fit=crop",
  f5: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop",
};

// カバー画像
const C = {
  pottery: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=500&fit=crop",
  music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&h=500&fit=crop",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&h=500&fit=crop",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=500&fit=crop",
  photo: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&h=500&fit=crop",
  writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900&h=500&fit=crop",
  rock: "https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?w=900&h=500&fit=crop",
  soccer: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&h=500&fit=crop",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&h=500&fit=crop",
  illustration: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=500&fit=crop",
  jazz: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=900&h=500&fit=crop",
  tabletennis: "https://images.unsplash.com/photo-1611251135345-18c56206b863?w=900&h=500&fit=crop",
  guesthouse: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=500&fit=crop",
  sculpture: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=900&h=500&fit=crop",
  singer: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=500&fit=crop",
  boxing: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&h=500&fit=crop",
  brewery: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=900&h=500&fit=crop",
  climbing: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=900&h=500&fit=crop",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&h=500&fit=crop",
  vintage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=500&fit=crop",
  guitar: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&h=500&fit=crop",
  baseball: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=900&h=500&fit=crop",
  printmaking: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=500&fit=crop",
  dj: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=900&h=500&fit=crop",
};

export const CREATORS = {
  mizuno: {
    id: "mizuno",
    name: "水野 蒼",
    age: 28,
    title: "陶芸家を目指して 5年目",
    quote: "割れても、もう一度焼く。土も自分も、何度でもやり直せると思ってます。",
    bio: "会社員を辞めて陶芸の道へ。窯を借りるお金を貯めながら、来年春の個展開催を目標に作品を作り続けています。応援してくれる人の声が、土をこねる手の支えになっています。",
    categories: ["art"],
    categoryLabels: ["陶芸", "個展準備中"],
    prefecture: "東京都",
    vipCount: 23,
    monthlySupportCount: 41,
    createdAt: "2021年4月",
    cover: C.pottery,
    avatar: A.a12,
    ranking: [
      { name: "はな", avatar: F.f1 },
      { name: "りょう", avatar: F.f2 },
      { name: "みさき", avatar: F.f3 },
    ],
  },
  hashimoto: {
    id: "hashimoto",
    name: "橋本 凜",
    age: 31,
    title: "弾き語りで全国を回る 2年目",
    quote: "届く声があるなら、どこまでも歌う。",
    bio: "駅前やライブハウスで弾き語りを続けて2年。最近は地方のライブハウスからも声がかかるようになりました。次の目標は、自分の曲だけで1本ライブをやること。",
    categories: ["music"],
    categoryLabels: ["音楽", "弾き語り"],
    prefecture: "大阪府",
    vipCount: 38,
    monthlySupportCount: 67,
    createdAt: "2024年2月",
    cover: C.music,
    avatar: A.a2,
    ranking: [
      { name: "ゆうき", avatar: F.f4 },
      { name: "さき", avatar: F.f1 },
      { name: "たくみ", avatar: F.f2 },
    ],
  },
  otsuka: {
    id: "otsuka",
    name: "大塚 健",
    age: 35,
    title: "古民家カフェ開業準備中",
    quote: "人が集まる場所を、自分の手で作る。",
    bio: "築60年の古民家を借りて、夫婦でカフェを開く準備をしています。床も壁も自分たちで手を入れて、開業資金はコツコツ貯めながら。秋のオープンを目指しています。",
    categories: ["biz"],
    categoryLabels: ["起業", "カフェ"],
    prefecture: "長野県",
    vipCount: 12,
    monthlySupportCount: 19,
    createdAt: "2025年9月",
    cover: C.cafe,
    avatar: A.a3,
    ranking: [
      { name: "みき", avatar: F.f3 },
      { name: "あおい", avatar: F.f1 },
      { name: "れい", avatar: F.f2 },
    ],
  },
  nakamura: {
    id: "nakamura",
    name: "中村 樹",
    age: 26,
    title: "プロ登山ガイド目指して 3年目",
    quote: "山は、登るたびに違う顔を見せてくれる。",
    bio: "会社員をしながら週末は山へ。来月、ガイド資格の実技試験を受けます。いつか自分が案内する側になって、山の魅力をもっと多くの人に伝えたいです。",
    categories: ["sports"],
    categoryLabels: ["スポーツ", "登山"],
    prefecture: "北海道",
    vipCount: 8,
    monthlySupportCount: 14,
    createdAt: "2026年6月",
    cover: C.mountain,
    avatar: A.a4,
    ranking: [
      { name: "なお", avatar: F.f5 },
      { name: "ひろき", avatar: F.f2 },
      { name: "ゆい", avatar: F.f3 },
    ],
  },
  photography: {
    id: "photography",
    name: "佐藤 翔",
    age: 24,
    title: "写真家を目指して 1年目",
    quote: "シャッターを切るたび、世界の見え方が変わる。",
    bio: "都会の片隅で見つけた光を切り取る日々。来年は初めての個展を開きたいと思っています。",
    categories: ["art"],
    categoryLabels: ["写真", "個展準備中"],
    prefecture: "神奈川県",
    vipCount: 1,
    monthlySupportCount: 2,
    createdAt: "2026年1月",
    cover: C.photo,
    avatar: A.a5,
    ranking: [
      { name: "ファン1", avatar: F.f1 },
      { name: "ファン2", avatar: F.f2 },
      { name: "ファン3", avatar: F.f3 },
    ],
  },
  writing: {
    id: "writing",
    name: "田中 蓮",
    age: 25,
    title: "脚本家を目指して 4年目",
    quote: "言葉にできない感情を、台詞に変えていく。",
    bio: "コンクールに応募し続けて4年目。最近ようやく最終選考に残れるようになりました。",
    categories: ["art"],
    categoryLabels: ["脚本", "コンクール挑戦中"],
    prefecture: "東京都",
    vipCount: 4,
    monthlySupportCount: 7,
    createdAt: "2026年2月",
    cover: C.writing,
    avatar: A.a6,
    ranking: [
      { name: "ファン1", avatar: F.f2 },
      { name: "ファン2", avatar: F.f3 },
      { name: "ファン3", avatar: F.f4 },
    ],
  },
  rock: {
    id: "rock",
    name: "伊藤 駿",
    age: 26,
    title: "ロックバンドのボーカル 3年目",
    quote: "声が枯れるまで、伝えたいことがある。",
    bio: "メンバー4人で地道にライブハウスを回っています。来月初の東名阪ツアーです。",
    categories: ["music"],
    categoryLabels: ["バンド", "ツアー中"],
    prefecture: "愛知県",
    vipCount: 7,
    monthlySupportCount: 12,
    createdAt: "2026年3月",
    cover: C.rock,
    avatar: A.a7,
    ranking: [
      { name: "ファン1", avatar: F.f3 },
      { name: "ファン2", avatar: F.f4 },
      { name: "ファン3", avatar: F.f5 },
    ],
  },
  soccer: {
    id: "soccer",
    name: "渡辺 翼",
    age: 27,
    title: "プロサッカー選手を目指して 2年目",
    quote: "ピッチに立てる日まで、走り続ける。",
    bio: "クラブの練習生としてトライアウトに挑戦中。プロ契約まであと一歩です。",
    categories: ["sports"],
    categoryLabels: ["サッカー", "トライアウト中"],
    prefecture: "千葉県",
    vipCount: 10,
    monthlySupportCount: 17,
    createdAt: "2026年4月",
    cover: C.soccer,
    avatar: A.a8,
    ranking: [
      { name: "ファン1", avatar: F.f4 },
      { name: "ファン2", avatar: F.f5 },
      { name: "ファン3", avatar: F.f1 },
    ],
  },
  bakery: {
    id: "bakery",
    name: "山本 颯",
    age: 28,
    title: "ベーカリー開業準備中",
    quote: "焼きたてのパンで、朝を変えたい。",
    bio: "修行先のパン屋を卒業し、独立に向けて物件を探しています。来春オープン予定。",
    categories: ["biz"],
    categoryLabels: ["パン屋", "開業準備中"],
    prefecture: "兵庫県",
    vipCount: 13,
    monthlySupportCount: 22,
    createdAt: "2026年5月",
    cover: C.bakery,
    avatar: A.a9,
    ranking: [
      { name: "ファン1", avatar: F.f5 },
      { name: "ファン2", avatar: F.f1 },
      { name: "ファン3", avatar: F.f2 },
    ],
  },
  illustration: {
    id: "illustration",
    name: "中島 陸",
    age: 29,
    title: "イラストレーターを目指して 2年目",
    quote: "描くことでしか伝えられないものがある。",
    bio: "SNSでの発信を続けながら、出版社への持ち込みを重ねています。",
    categories: ["art"],
    categoryLabels: ["イラスト", "持ち込み中"],
    prefecture: "福岡県",
    vipCount: 16,
    monthlySupportCount: 27,
    createdAt: "2026年6月",
    cover: C.illustration,
    avatar: A.a2,
    ranking: [
      { name: "ファン1", avatar: F.f1 },
      { name: "ファン2", avatar: F.f2 },
      { name: "ファン3", avatar: F.f3 },
    ],
  },
  jazz: {
    id: "jazz",
    name: "小林 大和",
    age: 30,
    title: "ジャズピアニストを目指して 6年目",
    quote: "一音一音に、これまでの人生を込めて。",
    bio: "ジャズバーで週末演奏を続けながら、自主企画ライブの準備をしています。",
    categories: ["music"],
    categoryLabels: ["ジャズ", "ライブ準備中"],
    prefecture: "京都府",
    vipCount: 19,
    monthlySupportCount: 32,
    createdAt: "2026年1月",
    cover: C.jazz,
    avatar: A.a3,
    ranking: [
      { name: "ファン1", avatar: F.f2 },
      { name: "ファン2", avatar: F.f3 },
      { name: "ファン3", avatar: F.f4 },
    ],
  },
  tabletennis: {
    id: "tabletennis",
    name: "加藤 悠真",
    age: 31,
    title: "プロ卓球選手を目指して 4年目",
    quote: "小さな白い球に、すべてを賭けている。",
    bio: "実業団入りを目指して練習中。来月の全国大会が大きな分岐点です。",
    categories: ["sports"],
    categoryLabels: ["卓球", "大会前"],
    prefecture: "静岡県",
    vipCount: 2,
    monthlySupportCount: 2,
    createdAt: "2026年2月",
    cover: C.tabletennis,
    avatar: A.a4,
    ranking: [
      { name: "ファン1", avatar: F.f3 },
      { name: "ファン2", avatar: F.f4 },
      { name: "ファン3", avatar: F.f5 },
    ],
  },
  guesthouse: {
    id: "guesthouse",
    name: "吉田 陽翔",
    age: 32,
    title: "ゲストハウス開業準備中",
    quote: "旅人が帰りたくなる場所を作りたい。",
    bio: "古い旅館をリノベーションして、地域に根ざした宿を準備しています。",
    categories: ["biz"],
    categoryLabels: ["ゲストハウス", "改装中"],
    prefecture: "沖縄県",
    vipCount: 5,
    monthlySupportCount: 7,
    createdAt: "2026年3月",
    cover: C.guesthouse,
    avatar: A.a13,
    ranking: [
      { name: "ファン1", avatar: F.f4 },
      { name: "ファン2", avatar: F.f5 },
      { name: "ファン3", avatar: F.f1 },
    ],
  },
  sculpture: {
    id: "sculpture",
    name: "山田 拓海",
    age: 33,
    title: "彫刻家を目指して 5年目",
    quote: "木の中に眠る形を、掘り出していく。",
    bio: "工房を構えて5年。来年は美術館での展示が決まりました。",
    categories: ["art"],
    categoryLabels: ["彫刻", "展示準備中"],
    prefecture: "岐阜県",
    vipCount: 8,
    monthlySupportCount: 12,
    createdAt: "2026年4月",
    cover: C.sculpture,
    avatar: A.a14,
    ranking: [
      { name: "ファン1", avatar: F.f5 },
      { name: "ファン2", avatar: F.f1 },
      { name: "ファン3", avatar: F.f2 },
    ],
  },
  singer: {
    id: "singer",
    name: "佐々木 湊",
    age: 34,
    title: "シンガーソングライター 2年目",
    quote: "弾き語りに乗せて、本当の気持ちを届ける。",
    bio: "ストリートライブから始めて、最近は小さなホールでも歌わせてもらえるようになりました。",
    categories: ["music"],
    categoryLabels: ["弾き語り", "路上ライブ"],
    prefecture: "広島県",
    vipCount: 11,
    monthlySupportCount: 17,
    createdAt: "2026年5月",
    cover: C.singer,
    avatar: A.a23,
    ranking: [
      { name: "ファン1", avatar: F.f1 },
      { name: "ファン2", avatar: F.f2 },
      { name: "ファン3", avatar: F.f3 },
    ],
  },
  boxing: {
    id: "boxing",
    name: "山口 蒼太",
    age: 35,
    title: "プロボクサーを目指して 3年目",
    quote: "リングの上で、誰かを勇気づけたい。",
    bio: "ジムでの練習に加え、来月プロテストを受けます。",
    categories: ["sports"],
    categoryLabels: ["ボクシング", "プロテスト前"],
    prefecture: "大阪府",
    vipCount: 14,
    monthlySupportCount: 22,
    createdAt: "2026年6月",
    cover: C.boxing,
    avatar: A.a15,
    ranking: [
      { name: "ファン1", avatar: F.f2 },
      { name: "ファン2", avatar: F.f3 },
      { name: "ファン3", avatar: F.f4 },
    ],
  },
  brewery: {
    id: "brewery",
    name: "松本 颯太",
    age: 36,
    title: "クラフトビール醸造所開業準備中",
    quote: "地元の水と麦で、新しい一杯を作る。",
    bio: "醸造免許の取得を目指して、試作を重ねています。",
    categories: ["biz"],
    categoryLabels: ["クラフトビール", "免許申請中"],
    prefecture: "山梨県",
    vipCount: 17,
    monthlySupportCount: 27,
    createdAt: "2026年1月",
    cover: C.brewery,
    avatar: A.a16,
    ranking: [
      { name: "ファン1", avatar: F.f3 },
      { name: "ファン2", avatar: F.f4 },
      { name: "ファン3", avatar: F.f5 },
    ],
  },
  ceramics2: {
    id: "ceramics2",
    name: "井上 樹生",
    age: 37,
    title: "陶芸家を目指して 2年目",
    quote: "土と炎が生む、偶然の美しさに惹かれて。",
    bio: "師匠の窯を間借りしながら、自分の作品づくりに励んでいます。",
    categories: ["art"],
    categoryLabels: ["陶芸", "修行中"],
    prefecture: "佐賀県",
    vipCount: 20,
    monthlySupportCount: 32,
    createdAt: "2026年2月",
    cover: C.pottery,
    avatar: A.a2,
    ranking: [
      { name: "ファン1", avatar: F.f4 },
      { name: "ファン2", avatar: F.f5 },
      { name: "ファン3", avatar: F.f1 },
    ],
  },
  guitar: {
    id: "guitar",
    name: "木村 一颯",
    age: 24,
    title: "アコースティックギタリスト 4年目",
    quote: "指先の震えごと、音楽になる。",
    bio: "インストゥルメンタル中心の楽曲をSNSで発信しながら、ライブ活動も続けています。",
    categories: ["music"],
    categoryLabels: ["ギター", "インスト"],
    prefecture: "宮城県",
    vipCount: 3,
    monthlySupportCount: 2,
    createdAt: "2026年3月",
    cover: C.guitar,
    avatar: A.a20,
    ranking: [
      { name: "ファン1", avatar: F.f5 },
      { name: "ファン2", avatar: F.f1 },
      { name: "ファン3", avatar: F.f2 },
    ],
  },
  baseball: {
    id: "baseball",
    name: "林 大翔",
    age: 25,
    title: "プロ野球選手を目指して 5年目",
    quote: "白球を追いかけて、ここまで来た。",
    bio: "独立リーグでプレーしながら、NPBのトライアウトに挑戦し続けています。",
    categories: ["sports"],
    categoryLabels: ["野球", "独立リーグ"],
    prefecture: "福島県",
    vipCount: 6,
    monthlySupportCount: 7,
    createdAt: "2026年4月",
    cover: C.baseball,
    avatar: A.a19,
    ranking: [
      { name: "ファン1", avatar: F.f1 },
      { name: "ファン2", avatar: F.f2 },
      { name: "ファン3", avatar: F.f3 },
    ],
  },
  vintage: {
    id: "vintage",
    name: "斎藤 陽斗",
    age: 26,
    title: "古着屋開業準備中",
    quote: "誰かの記憶が詰まった服に、新しい物語を。",
    bio: "全国を回って買い付けた古着を、オンラインで少しずつ販売しています。",
    categories: ["biz"],
    categoryLabels: ["古着", "オンライン販売中"],
    prefecture: "栃木県",
    vipCount: 9,
    monthlySupportCount: 12,
    createdAt: "2026年5月",
    cover: C.vintage,
    avatar: A.a22,
    ranking: [
      { name: "ファン1", avatar: F.f2 },
      { name: "ファン2", avatar: F.f3 },
      { name: "ファン3", avatar: F.f4 },
    ],
  },
  printmaking: {
    id: "printmaking",
    name: "清水 悠人",
    age: 27,
    title: "版画家を目指して 3年目",
    quote: "彫り重ねるたびに、輪郭がはっきりしていく。",
    bio: "版画コンクールへの出品を続けながら、個人ワークショップも始めました。",
    categories: ["art"],
    categoryLabels: ["版画", "ワークショップ"],
    prefecture: "石川県",
    vipCount: 12,
    monthlySupportCount: 17,
    createdAt: "2026年6月",
    cover: C.printmaking,
    avatar: A.a21,
    ranking: [
      { name: "ファン1", avatar: F.f3 },
      { name: "ファン2", avatar: F.f4 },
      { name: "ファン3", avatar: F.f5 },
    ],
  },
  dj: {
    id: "dj",
    name: "森 隼人",
    age: 28,
    title: "DJ・トラックメイカー 3年目",
    quote: "ビートに乗せて、夜の街に物語を流す。",
    bio: "クラブイベントへの出演を重ねながら、楽曲リリースの準備をしています。",
    categories: ["music"],
    categoryLabels: ["DJ", "楽曲制作中"],
    prefecture: "北海道",
    vipCount: 15,
    monthlySupportCount: 22,
    createdAt: "2026年1月",
    cover: C.dj,
    avatar: A.a17,
    ranking: [
      { name: "ファン1", avatar: F.f4 },
      { name: "ファン2", avatar: F.f5 },
      { name: "ファン3", avatar: F.f1 },
    ],
  },
  climbing: {
    id: "climbing",
    name: "橋本 蒼介",
    age: 29,
    title: "プロクライマーを目指して 2年目",
    quote: "壁を登るたび、見える景色が変わる。",
    bio: "ボルダリングジムで腕を磨きながら、国内大会への出場を目指しています。",
    categories: ["sports"],
    categoryLabels: ["クライミング", "大会出場予定"],
    prefecture: "長野県",
    vipCount: 18,
    monthlySupportCount: 27,
    createdAt: "2026年2月",
    cover: C.climbing,
    avatar: A.a18,
    ranking: [
      { name: "ファン1", avatar: F.f5 },
      { name: "ファン2", avatar: F.f1 },
      { name: "ファン3", avatar: F.f2 },
    ],
  },
  coffee: {
    id: "coffee",
    name: "阿部 蒼空",
    age: 30,
    title: "コーヒー焙煎所開業準備中",
    quote: "一粒の豆に、世界の風景を込めて焙煎する。",
    bio: "焙煎技術を学びながら、移動販売からスタートする準備を進めています。",
    categories: ["biz"],
    categoryLabels: ["コーヒー", "移動販売準備中"],
    prefecture: "鹿児島県",
    vipCount: 1,
    monthlySupportCount: 32,
    createdAt: "2026年3月",
    cover: C.coffee,
    avatar: A.a24,
    ranking: [
      { name: "ファン1", avatar: F.f1 },
      { name: "ファン2", avatar: F.f2 },
      { name: "ファン3", avatar: F.f3 },
    ],
  },
};

/* 都道府県リスト（絞り込みUI用） */
export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export const CATEGORY_LABELS = {
  all: "すべて",
  美容: "美容",
  音楽: "音楽",
  スポーツ: "スポーツ",
  アート: "アート・ものづくり",
  料理: "料理",
  芸能: "芸能",
  起業: "起業",
  クリエイター: "クリエイター",
  テクノロジー: "テクノロジー",
  ファッション: "ファッション",
  "執筆・文学": "執筆・文学",
  "教育・指導": "教育・指導",
  "農業・自然": "農業・自然",
  伝統工芸: "伝統工芸",
  "旅・冒険": "旅・冒険",
};

export function getMonthlyRankingTop10() {
  return Object.values(CREATORS)
    .slice()
    .sort((a, b) => b.monthlySupportCount - a.monthlySupportCount)
    .slice(0, 10);
}

function parseCreatedAt(label) {
  const m = label.match(/(\d+)年(\d+)月/);
  if (!m) return 0;
  return Number(m[1]) * 12 + Number(m[2]);
}

export function getSortedCreators(sortBy = "new") {
  const list = Object.values(CREATORS);
  if (sortBy === "popular") {
    return list.slice().sort((a, b) => b.monthlySupportCount - a.monthlySupportCount);
  }
  return list.slice().sort((a, b) => parseCreatedAt(b.createdAt) - parseCreatedAt(a.createdAt));
}

export const POSTS = [
  {
    id: "p1",
    creatorId: "mizuno",
    time: "3時間前",
    text: "今日の窯入れ、無事に終わりました。次に開けるのは3日後。それまでずっとそわそわしてます。",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&h=480&fit=crop",
    vip: false,
    likes: 12,
    comments: [
      { name: "はな", avatar: F.f1, text: "次に開ける日も教えてください、楽しみにしてます！" },
      { name: "りょう", avatar: F.f2, text: "そわそわする気持ち、わかります。応援してます。" },
      { name: "みさき", avatar: F.f3, text: "良い焼き上がりになりますように" },
    ],
  },
  {
    id: "p2",
    creatorId: "hashimoto",
    time: "昨日",
    text: "来月のライブハウス出演が決まりました。まだ誰にも言ってなかったけど、ここで一番に報告させてください。",
    image: null,
    vip: true,
    likes: 28,
    comments: [
      { name: "ゆうき", avatar: F.f4, text: "おめでとうございます！絶対行きます" },
    ],
  },
  {
    id: "p3",
    creatorId: "otsuka",
    time: "2日前",
    text: "古民家の床、自分たちで張り替えました。手は傷だらけですが、少しずつ「お店」になってきています。",
    image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=900&h=480&fit=crop",
    vip: false,
    likes: 19,
    comments: [
      { name: "みき", avatar: F.f3, text: "床、すごく綺麗です！オープン楽しみです" },
    ],
  },
  {
    id: "p4",
    creatorId: "nakamura",
    time: "4日前",
    text: "来月、初めてガイド資格の実技試験を受けます。今日も山に登って、体に道を覚えさせてきました。",
    image: null,
    vip: false,
    likes: 7,
    comments: [],
  },
];

export const CURRENT_USER = {
  name: "はな",
  avatar: F.f1,
  joinedLabel: "2025年8月から応援を始めました",
  vip: [
    { creatorId: "mizuno", nextBilling: "2026年7月15日", price: 500 },
  ],
  supportHistory: [
    { creatorId: "mizuno", date: "2026年6月18日" },
    { creatorId: "hashimoto", date: "2026年6月10日" },
    { creatorId: "otsuka", date: "2026年5月28日" },
    { creatorId: "nakamura", date: "2026年5月12日" },
  ],
};

export const NOTIFICATIONS = [
  { type: "support", creatorId: "mizuno", text: "水野蒼さんから応援メッセージへの返信が届きました", time: "10分前", read: false },
  { type: "post", creatorId: "hashimoto", text: "橋本凜さんが新しい投稿をしました（VIP限定）", time: "1時間前", read: false },
  { type: "vip", creatorId: "mizuno", text: "水野蒼さんのVIPプランが来月も自動更新されます", time: "昨日", read: true },
  { type: "like", creatorId: "otsuka", text: "あなたのコメントに「いいね」がつきました", time: "2日前", read: true },
];

export const PLATFORM_FEE_RATE = 0.20;

export const CREATOR_EARNINGS = {
  creatorId: "mizuno",
  payoutAccountRegistered: true,
  nextPayoutDate: "2026年7月1日",
  thisMonthSupportHistory: [
    { supporterName: "はな", date: "2026年6月18日", amount: 3000 },
    { supporterName: "りょう", date: "2026年6月12日", amount: 1000 },
    { supporterName: "みさき", date: "2026年6月5日", amount: 5000 },
    { supporterName: "ゆうき", date: "2026年6月2日", amount: 300 },
  ],
  pastMonthsTotalReceived: 48200,
};

export function calcPayout(amount) {
  return Math.round(amount * (1 - PLATFORM_FEE_RATE));
}

export const CREATOR_POSTS = {
  mizuno: [
    { id: "m1", date: "2026年6月20日", text: "今日は初めて自分の窯で焼き上げた茶碗が完成しました。ひびも割れもなく、思ったよりずっと良い出来で…思わず声を上げてしまいました。", isVip: false },
    { id: "m2", date: "2026年6月14日", text: "【VIP限定】個展のラフデザインを公開します。来てくれる方に喜んでもらえるレイアウトを考えています。", isVip: true },
    { id: "m3", date: "2026年6月8日", text: "土を選ぶのに3時間かかりました。素材選びは妥協したくない性格で、いつも時間がかかってしまいます。", isVip: false },
    { id: "m4", date: "2026年5月30日", text: "今月の制作メモを公開。月間15点を目標にしていましたが、今月は12点。来月こそ。", isVip: false },
  ],
  hashimoto: [
    { id: "h1", date: "2026年6月19日", text: "昨日の大阪ライブ、ありがとうございました！アンコールをもらえたのは初めてで、泣きそうになりながら歌いました。", isVip: false },
    { id: "h2", date: "2026年6月12日", text: "【VIP限定】次のライブで初披露する新曲の弾き語り動画を載せます。荒削りですがぜひ聴いてください。", isVip: true },
    { id: "h3", date: "2026年6月5日", text: "練習量を増やすために早起きを始めました。朝6時に1時間ギターを弾くのが最近の習慣です。", isVip: false },
  ],
  otsuka: [
    { id: "o1", date: "2026年6月21日", text: "今日は床の張り替えが完成しました！築60年の古民家が少しずつカフェらしくなってきています。", isVip: false },
    { id: "o2", date: "2026年6月10日", text: "【VIP限定】完成後のカフェのメニュー案をお見せします。コーヒーだけで7種類の予定です。", isVip: true },
    { id: "o3", date: "2026年6月1日", text: "開業まで残り3ヶ月。融資の審査が通りました！これで開業資金が揃いました。本当にありがとうございます。", isVip: false },
  ],
  nakamura: [
    { id: "n1", date: "2026年6月18日", text: "ガイド資格の実技試験、合格しました！報告が遅くなりましたが、ご支援してくださった皆様のおかげです。", isVip: false },
    { id: "n2", date: "2026年6月9日", text: "【VIP限定】試験コースの詳細ルートと私なりの攻略メモを共有します。登山好きの方はぜひ。", isVip: true },
    { id: "n3", date: "2026年5月25日", text: "今月3回目の山行。雨の中でしたが視界が開けた瞬間の景色が最高でした。山は何度来ても飽きません。", isVip: false },
  ],
};