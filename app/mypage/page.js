"use client";

import Link from "next/link";
import { CREATORS } from "../data/creators";
import { useAuth } from "../AuthContext";

export default function MyPage() {
  const { user, favorites, toggleFavorite, vipList, supportHistory, logout } = useAuth();

  if (!user) {
    return (
      <div className="app-shell">
        <div
          className="page-content text-center"
          style={{ paddingTop: 80, display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--coral-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
              fontSize: 26,
            }}
          >
            👤
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
            まだログインしていません
          </p>
          <p
            className="text-sub"
            style={{ fontSize: "13.5px", margin: "0 0 26px", lineHeight: 1.8, maxWidth: 280 }}
          >
            応援履歴やVIP状況を確認するには、ログインまたは新規登録が必要です。
          </p>
          <Link href="/start" className="btn btn-coral" style={{ width: "100%", maxWidth: 280 }}>
            ログイン / 新規登録
          </Link>
        </div>
      </div>
    );
  }

  const favoriteCreators = favorites.map((id) => CREATORS[id]).filter(Boolean);

  return (
    <div className="app-shell">
      <div style={{ display: "flex", alignItems: "center", gap: 13, padding: 18, background: "var(--paper)", borderBottom: "1px solid var(--border)" }}>
        <img
          src={user.avatar}
          alt=""
          style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "15.5px", fontWeight: 700, margin: 0 }}>{user.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-sub)", margin: "3px 0 0" }}>
            {user.isCreator ? `夢追い人 · ${user.title || ""}` : user.joinedLabel}
          </p>
        </div>
        {user.isCreator ? (
          <Link href="/creator-earnings" className="btn btn-outline-purple" style={{ fontSize: 12, padding: "7px 14px" }}>
            管理画面
          </Link>
        ) : (
          <Link href="/creator-signup" className="btn btn-outline-coral" style={{ fontSize: 12, padding: "7px 14px" }}>
            夢追い人になる
          </Link>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: "16px 16px 0" }}>
        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "13px 15px" }}>
          <p style={{ fontSize: "11.5px", color: "var(--text-sub)", margin: "0 0 4px" }}>応援した人数</p>
          <p style={{ fontSize: 21, fontWeight: 700, margin: 0 }}>{supportHistory.length}人</p>
        </div>
        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "13px 15px" }}>
          <p style={{ fontSize: "11.5px", color: "var(--text-sub)", margin: "0 0 4px" }}>VIP加入中</p>
          <p style={{ fontSize: 21, fontWeight: 700, margin: 0 }}>{vipList.length}人</p>
        </div>
        <div style={{ background: "var(--paper)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "13px 15px" }}>
          <p style={{ fontSize: "11.5px", color: "var(--text-sub)", margin: "0 0 4px" }}>お気に入り</p>
          <p style={{ fontSize: 21, fontWeight: 700, margin: 0 }}>{favorites.length}人</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card card-pad" style={{ marginTop: 16 }}>
          <p className="section-title">♥ お気に入り</p>
          {favoriteCreators.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだお気に入りに追加した夢追い人がいません</p>
          ) : (
            favoriteCreators.map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                <Link href={`/profile/${c.id}`} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <img src={c.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <p style={{ fontSize: "13.5px", margin: 0 }}>{c.name}　{c.age}歳</p>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "1px 0 0" }}>{c.title}　・　{c.prefecture}</p>
                  </div>
                </Link>
                <button onClick={() => toggleFavorite(c.id)} style={{ background: "none", border: "none", color: "var(--coral)", fontSize: 20, padding: "4px 8px", flexShrink: 0 }}>
                  ♥
                </button>
              </div>
            ))
          )}
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <p className="section-title">👑 VIP加入中</p>
          {vipList.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだVIP加入している夢追い人がいません</p>
          ) : (
            vipList.map((v) => {
              const c = CREATORS[v.creatorId];
              return (
                <div key={v.creatorId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <Link href={`/profile/${c.id}`}>
                    <img src={c.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link href={`/profile/${c.id}`} style={{ fontSize: "13.5px", margin: 0, display: "block" }}>{c.name}</Link>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "1px 0 0" }}>次回更新日 {v.nextBilling} ・ ¥{v.price}/月</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link href={`/vip/${c.id}`} style={{ fontSize: 12, padding: "6px 13px", borderRadius: "var(--radius-md)", background: "var(--purple-light)", color: "var(--purple)" }}>チャット</Link>
                    <Link href={`/vip-cancel/${c.id}`} style={{ fontSize: 12, padding: "6px 13px", borderRadius: "var(--radius-md)", background: "var(--cream)", color: "var(--text-faint)" }}>解約</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="card card-pad" style={{ marginTop: 16 }}>
          <p className="section-title">❤️ 応援履歴</p>
          {supportHistory.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだ応援した夢追い人がいません</p>
          ) : (
            supportHistory.map((s, i) => {
              const c = CREATORS[s.creatorId];
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <Link href={`/profile/${c.id}`}>
                    <img src={c.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <Link href={`/profile/${c.id}`} style={{ fontSize: "13.5px", margin: 0, display: "block" }}>{c.name}</Link>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "1px 0 0" }}>{s.date}</p>
                  </div>
                  <span style={{ color: "var(--coral)", fontSize: 14 }}>✓</span>
                </div>
              );
            })
          )}
          <p className="text-faint text-center" style={{ fontSize: 11, margin: "12px 0 0" }}>
            金額の合計は表示されません。応援は記録のみ残ります。
          </p>
        </div>

        <Link
          className="card card-pad"
          href="/help"
          style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}
        >
          <button
          onClick={async () => { await logout(); }}
          className="card card-pad"
          style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--paper)", cursor: "pointer" }}
        >
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--cream)", color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            🚪
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 2px" }}>ログアウト</p>
            <p style={{ fontSize: "11.5px", color: "var(--text-faint)", margin: 0 }}>アカウントからサインアウトします</p>
          </div>
        </button>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--cream)", color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            ❓
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 2px" }}>ヘルプ・お問い合わせ</p>
            <p style={{ fontSize: "11.5px", color: "var(--text-faint)", margin: 0 }}>よくある質問・アカウント削除</p>
          </div>
          <span style={{ color: "var(--text-faint)" }}>›</span>
        </Link>
      </div>
    </div>
  );
}