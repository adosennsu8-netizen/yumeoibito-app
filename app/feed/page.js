"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CREATORS, POSTS } from "../data/creators";
import { useAuth } from "../AuthContext";
import { db } from "../lib/firebase";
import {
  collection, onSnapshot, doc, runTransaction, serverTimestamp, query, orderBy
} from "firebase/firestore";

export default function FeedPage() {
  const { user, supportHistory, vipList, addNotification } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [firestorePosts, setFirestorePosts] = useState([]);
  const [likes, setLikes] = useState({});

  // Firestoreから投稿をリアルタイム取得
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setFirestorePosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const allPosts = [...firestorePosts, ...POSTS];

  // likesの初期化（新投稿が増えた時も対応）
  useEffect(() => {
    setLikes((prev) => {
      const next = { ...prev };
      allPosts.forEach((p) => {
        if (!next[p.id]) next[p.id] = { liked: false, count: p.likes || 0 };
      });
      return next;
    });
  }, [firestorePosts]);

  const visiblePosts = tab === "following"
    ? allPosts.filter((p) =>
        supportHistory.some((s) => s.creatorId === p.creatorId) ||
        vipList.some((v) => v.creatorId === p.creatorId)
      )
    : allPosts;

  async function toggleLike(postId) {
    const current = likes[postId];
    if (!current) return;
    const nowLiked = !current.liked;

    // UIを即時更新
    setLikes((prev) => ({
      ...prev,
      [postId]: { liked: nowLiked, count: nowLiked ? current.count + 1 : current.count - 1 },
    }));

    // Firestoreの投稿だけ保存（ダミーPOSTSはスキップ）
    const isFirestorePost = firestorePosts.some((p) => p.id === postId);
    if (isFirestorePost) {
      const ref = doc(db, "posts", postId);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;
        const cur = snap.data().likes || 0;
        tx.update(ref, { likes: nowLiked ? cur + 1 : cur - 1 });
      });
    }

    if (nowLiked) {
      const post = allPosts.find((p) => p.id === postId);
      if (post) {
        addNotification({
          type: "like",
          creatorId: post.creatorId,
          text: `${post.creatorName || CREATORS[post.creatorId]?.name || ""}さんの投稿にいいねしました`,
        });
      }
    }
  }

  function handleFollowingTab() {
    if (!user) {
      router.push("/start?redirect=/feed");
      return;
    }
    setTab("following");
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <p className="brand">タイムライン</p>
        <p className="tagline">応援している彼たちの、いまの一歩</p>
      </header>

      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--paper)" }}>
        <button
          onClick={() => setTab("all")}
          style={{ flex: 1, padding: "13px", fontSize: "13.5px", fontWeight: 700, background: "none", border: "none", borderBottom: tab === "all" ? "2px solid var(--coral)" : "2px solid transparent", color: tab === "all" ? "var(--coral)" : "var(--text-faint)" }}
        >
          みんな
        </button>
        <button
          onClick={handleFollowingTab}
          style={{ flex: 1, padding: "13px", fontSize: "13.5px", fontWeight: 700, background: "none", border: "none", borderBottom: tab === "following" ? "2px solid var(--coral)" : "2px solid transparent", color: tab === "following" ? "var(--coral)" : "var(--text-faint)" }}
        >
          応援中
        </button>
      </div>

      <div className="page-content">
        {tab === "following" && supportHistory.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 40 }}>
            <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", lineHeight: 1.8 }}>
              まだ応援した夢追い人がいません。<br />
              <Link href="/" style={{ color: "var(--coral)", fontWeight: 700 }}>夢追い人を探す</Link>
            </p>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 40 }}>
            <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", lineHeight: 1.8 }}>
              応援中の夢追い人の投稿がありません
            </p>
          </div>
        ) : (
          visiblePosts.map((p) => {
            const c = p.creatorId && CREATORS[p.creatorId];
            const likeState = likes[p.id] || { liked: false, count: p.likes || 0 };
            return (
              <div className="post" key={p.id}>
                <Link href={c ? `/profile/${c.id}` : "#"} className="post-head">
                  <img src={c ? c.avatar : p.creatorAvatar} alt="" />
                  <div style={{ flex: 1 }}>
                    <p className="name">{c ? c.name : p.creatorName}</p>
                    <p className="time">{p.time || (p.createdAt?.toDate?.()?.toLocaleDateString("ja-JP") ?? "")}</p>
                  </div>
                  {p.isVip && <span className="vip-badge">👑 VIP限定</span>}
                </Link>
                <p className="post-text">{p.text}</p>
                {p.image && <img className="post-image" src={p.image} alt="" />}
                <div className="post-actions">
                  <button
                    className={`like-btn ${likeState.liked ? "liked" : ""}`}
                    onClick={() => toggleLike(p.id)}
                    style={{ color: likeState.liked ? "var(--coral)" : "var(--text-faint)" }}
                  >
                    {likeState.liked ? "❤️" : "🤍"} <span>{likeState.count}</span>
                  </button>
                  <Link className="comment-link" href={`/post/${p.id}`}>
                    💬 <span>{p.comments?.length ?? 0}</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}