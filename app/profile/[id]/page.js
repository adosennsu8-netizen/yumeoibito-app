"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CREATORS, CREATOR_POSTS } from "../../data/creators";
import { useAuth } from "../../AuthContext";
import { db } from "../../lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { user, toggleFavorite, isFavorite, isVip, registeredCreators, addNotification, addBlock } = useAuth();
  const c = CREATORS[id] || (user?.id === id ? user : null) || (registeredCreators || []).find((r) => r.id === id);
  const favorited = isFavorite(id);
  const vipMember = isVip ? isVip(id) : false;
  const [firestorePosts, setFirestorePosts] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [toast, setToast] = useState("");
  
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("creatorId", "==", id),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setFirestorePosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [id]);

  const posts = [...firestorePosts, ...(CREATOR_POSTS[id] || [])];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  async function handleReport() {
    if (!reportReason.trim()) return;
    try {
      await addDoc(collection(db, "reports"), {
        reporterId: user?.id || "anonymous",
        reporterName: user?.name || "匿名",
        targetId: id,
        targetName: c?.name || "",
        reason: reportReason,
        createdAt: serverTimestamp(),
      });
      setShowReportModal(false);
      setReportReason("");
      showToast("通報しました。ご協力ありがとうございます。");
    } catch (e) {
      showToast("通報に失敗しました");
    }
  }

  async function handleBlock() {
    if (!user) {
      router.push(`/start?redirect=/profile/${id}`);
      return;
    }
    await addBlock(id);
    setShowMenu(false);
    showToast(`${c?.name}さんをブロックしました`);
    setTimeout(() => router.push("/"), 1500);
  }

  if (!c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>夢追い人が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  function handleFavorite() {
    if (!user) {
      router.push(`/start?redirect=/profile/${id}`);
      return;
    }
    if (!favorited) {
      addNotification({
        type: "favorite",
        creatorId: id,
        text: `${c.name}さんをお気に入りに追加しました`,
      });
    }
    toggleFavorite(id);
  }

  const shareUrl = `https://yumeoibito-app.vercel.app/profile/${id}`;
  const shareText = `${c.name}さんを応援しています！`;

  return (
    <div className="app-shell">
      <div style={{ position: "relative", height: 220, background: "var(--border)" }}>
        <img src={c.cover || ""} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(26,21,48,0) 40%, rgba(26,21,48,0.78) 100%)" }} />
        <Link href="/" style={{ position: "absolute", top: 14, left: 14, zIndex: 2, background: "rgba(26,21,48,0.4)", color: "#fff", width: 34, height: 34, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          ←
        </Link>
        <button
          onClick={handleFavorite}
          style={{ position: "absolute", top: 14, right: 56, zIndex: 2, background: favorited ? "var(--coral)" : "rgba(255,255,255,0.85)", color: favorited ? "#fff" : "var(--coral)", width: 38, height: 38, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
        >
          {favorited ? "♥" : "♡"}
        </button>
        {/* メニューボタン */}
        <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2 }}>
          <button
            onClick={() => setShowMenu((v) => !v)}
            style={{ background: "rgba(255,255,255,0.85)", width: 38, height: 38, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer" }}
          >
            ⋯
          </button>
          {showMenu && (
            <div style={{ position: "absolute", top: 44, right: 0, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: 140, zIndex: 10 }}>
              <button
                onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                style={{ width: "100%", padding: "12px 16px", textAlign: "left", fontSize: 13, background: "none", border: "none", cursor: "pointer", color: "var(--coral)" }}
              >
                🚩 通報する
              </button>
              <button
                onClick={handleBlock}
                style={{ width: "100%", padding: "12px 16px", textAlign: "left", fontSize: 13, background: "none", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", color: "var(--text-main)" }}
              >
                🚫 ブロックする
              </button>
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: 18, bottom: 16, zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={c.avatar || ""} alt="" style={{ width: 64, height: 64, borderRadius: "50%", border: "2.5px solid #fff", objectFit: "cover" }} />
          <div>
            <p style={{ color: "#fff", fontSize: 19, fontWeight: 700, margin: 0 }}>
              {c.name}　<span style={{ fontSize: 14, fontWeight: 400 }}>{c.age}歳</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, margin: "3px 0 0" }}>{c.title}</p>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, margin: "3px 0 0", display: "flex", alignItems: "center", gap: 4 }}>📍{c.prefecture}</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div>
          {(c.categoryLabels || []).map((t, i) => (
            <span key={t} className={`tag ${i === 0 ? "tag-coral" : "tag-amber"}`}>{t}</span>
          ))}
        </div>

        <p className="serif" style={{ fontSize: 17, lineHeight: 1.85, margin: "14px 0 16px" }}>「{c.quote}」</p>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--text-sub)", margin: "0 0 18px" }}>{c.bio}</p>

        <div className="vip-count-row">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 12, color: "var(--text-sub)" }}>
            <span style={{ color: "var(--coral)" }}>✅</span>
            <span>本人確認済み（身分証確認）</span>
          </div>
          <span>👑</span>
          <span>VIP {c.vipCount || 0}人が応援中</span>
        </div>

        <div className="card card-pad" style={{ marginBottom: 18 }}>
          <p className="section-title">🏆 応援ランキング</p>
          {(c.ranking || []).length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだ応援者がいません</p>
          ) : (
            (c.ranking || []).map((r, i) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                <span style={{ fontSize: 13, fontWeight: 700, width: 18, color: i === 0 ? "var(--amber)" : "var(--text-faint)" }}>{i + 1}</span>
                <img src={r.avatar} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: 13, flex: 1 }}>{r.name}さん</span>
              </div>
            ))
          )}
          <p className="text-faint" style={{ fontSize: 11, margin: "10px 0 0" }}>※金額は非公開です</p>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Link className="btn btn-coral" style={{ flex: 1 }} href={`/support/${c.id}`}>❤️ 応援する</Link>
          <Link className="btn btn-outline-purple" style={{ flex: 1 }} href={`/vip/${c.id}`}>👑 VIPで話す</Link>
        </div>

        <button onClick={handleFavorite} className={favorited ? "btn btn-coral btn-block" : "btn btn-ghost btn-block"} style={{ marginTop: 10 }}>
          {favorited ? "♥ お気に入り済み" : "♡ お気に入りに追加"}
        </button>

        <div style={{ marginTop: 22 }}>
          <p className="section-title">📢 シェアする</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 70, padding: "10px 0", borderRadius: "var(--radius-md)", background: "#000", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>𝕏</a>
            <a href={`https://line.me/R/msg/text/?${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 70, padding: "10px 0", borderRadius: "var(--radius-md)", background: "#06C755", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>LINE</a>
            <a href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 70, padding: "10px 0", borderRadius: "var(--radius-md)", background: "#000", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>Threads</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 70, padding: "10px 0", borderRadius: "var(--radius-md)", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>Instagram</a>
            <button onClick={() => navigator.clipboard.writeText(shareUrl)} style={{ flex: 1, minWidth: 70, padding: "10px 0", borderRadius: "var(--radius-md)", background: "var(--cream)", color: "var(--text-main)", fontSize: 12, fontWeight: 700, border: "1px solid var(--border)", cursor: "pointer" }}>🔗 コピー</button>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <p className="section-title">📝 最近の投稿</p>
          {posts.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだ投稿がありません</p>
          ) : (
            posts.map((post) => {
              const locked = post.isVip && !vipMember;
              return (
                <Link key={post.id} href={`/post/${post.id}`} className="card card-pad" style={{ marginBottom: 12, display: "block" }}>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "0 0 7px", display: "flex", alignItems: "center", gap: 6 }}>
                    {post.isVip && (
                      <span style={{ background: "var(--purple-light)", color: "var(--purple)", padding: "1px 7px", borderRadius: "var(--radius-pill)", fontSize: 10, fontWeight: 700 }}>👑 VIP限定</span>
                    )}
                    {post.date || (post.createdAt?.toDate?.()?.toLocaleDateString("ja-JP") ?? "")}
                  </p>
                  {locked ? (
                    <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
                      <p style={{ fontSize: 13, color: "var(--text-faint)", margin: "0 0 10px" }}>🔒 VIP会員限定の投稿です</p>
                      <Link href={`/vip/${c.id}`} style={{ fontSize: 12, padding: "7px 18px", borderRadius: "var(--radius-md)", background: "var(--purple-light)", color: "var(--purple)", fontWeight: 700 }}>VIPに加入して読む</Link>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13.5px", lineHeight: 1.8, margin: 0 }}>{post.text}</p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* 通報モーダル */}
      {showReportModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: 24, width: "100%", maxWidth: 320 }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>通報する</p>
            <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 14px" }}>{c.name}さんを通報する理由を教えてください</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {["不適切なコンテンツ", "詐欺・偽アカウント", "スパム", "その他"].map((r) => (
                <button key={r} onClick={() => setReportReason(r)} style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", border: `1.5px solid ${reportReason === r ? "var(--coral)" : "var(--border)"}`, background: reportReason === r ? "var(--coral-light)" : "var(--paper)", color: reportReason === r ? "var(--coral-dark)" : "var(--text-main)", fontSize: 13, textAlign: "left", cursor: "pointer" }}>
                  {r}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setShowReportModal(false); setReportReason(""); }} className="btn btn-ghost" style={{ flex: 1 }}>キャンセル</button>
              <button onClick={handleReport} disabled={!reportReason} className="btn btn-coral" style={{ flex: 1 }}>通報する</button>
            </div>
          </div>
        </div>
      )}

      {/* メニュー背景クリックで閉じる */}
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1 }} onClick={() => setShowMenu(false)} />
      )}

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}