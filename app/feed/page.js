"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CREATORS, POSTS } from "../data/creators";
import { useAuth } from "../AuthContext";

export default function FeedPage() {
  const { user, favorites } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("all"); // "all" | "following"
  const [likes, setLikes] = useState(
    Object.fromEntries(POSTS.map((p) => [p.id, { liked: false, count: p.likes }]))
  );

  // 「応援中」タブ：お気に入りに入っている夢追い人の投稿のみ表示
  const visiblePosts = tab === "following"
    ? POSTS.filter((p) => favorites.includes(p.creatorId))
    : POSTS;

  function toggleLike(postId) {
    setLikes((prev) => {
      const current = prev[postId];
      return {
        ...prev,
        [postId]: {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1,
        },
      };
    });
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
        <p className="brand">夢のタイムライン</p>
        <p className="tagline">応援している彼たちの、いまの一歩</p>
      </header>

      {/* タブ切り替え */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--paper)" }}>
        <button
          onClick={() => setTab("all")}
          style={{
            flex: 1,
            padding: "13px",
            fontSize: "13.5px",
            fontWeight: 700,
            background: "none",
            border: "none",
            borderBottom: tab === "all" ? "2px solid var(--coral)" : "2px solid transparent",
            color: tab === "all" ? "var(--coral)" : "var(--text-faint)",
          }}
        >
          みんな
        </button>
        <button
          onClick={handleFollowingTab}
          style={{
            flex: 1,
            padding: "13px",
            fontSize: "13.5px",
            fontWeight: 700,
            background: "none",
            border: "none",
            borderBottom: tab === "following" ? "2px solid var(--coral)" : "2px solid transparent",
            color: tab === "following" ? "var(--coral)" : "var(--text-faint)",
          }}
        >
          応援中
        </button>
      </div>

      <div className="page-content">
        {tab === "following" && favorites.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 40 }}>
            <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center", lineHeight: 1.8 }}>
              まだお気に入りに追加した夢追い人がいません。<br />
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
            const c = CREATORS[p.creatorId];
            const likeState = likes[p.id];
            return (
              <div className="post" key={p.id}>
                <Link href={`/profile/${c.id}`} className="post-head">
                  <img src={c.avatar} alt="" />
                  <div style={{ flex: 1 }}>
                    <p className="name">{c.name}</p>
                    <p className="time">{p.time}</p>
                  </div>
                  {p.vip && <span className="vip-badge">👑 VIP限定</span>}
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
                    💬 <span>{p.comments.length}</span>
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
