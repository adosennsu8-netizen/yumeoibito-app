/* 夢追い人ごとの投稿（タイムライン用ダミーデータ） */
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
export function getSortedCreators(sortKey) {
  const list = Object.values(CREATORS);
  if (sortKey === "monthly") {
    return list.sort((a, b) => b.monthlySupportCount - a.monthlySupportCount);
  }
  return list;
}

export function getMonthlyRankingTop10() {
  return Object.values(CREATORS)
    .sort((a, b) => b.monthlySupportCount - a.monthlySupportCount)
    .slice(0, 10);
}