"use client";

import { useState } from "react";
import Link from "next/link";
import { CREATORS, POSTS } from "../data/creators";

export default function FeedPage() {
  const [likes, setLikes] = useState(
    Object.fromEntries(POSTS.map((p) => [p.id, { liked: false, count: p.likes }]))
  );

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

  return (
    <div className="app-shell">
      <header className="top-header">
        <p className="brand">夢のタイムライン</p>
        <p className="tagline">応援している彼たちの、いまの一歩</p>
      </header>

      <div className="page-content">
        {POSTS.map((p) => {
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
                {p.vip && (
                  <span className="vip-badge">👑 VIP限定</span>
                )}
              </Link>
              <p className="post-text">{p.text}</p>
              {p.image && <img className="post-image" src={p.image} alt="" />}
              <div className="post-actions">
                <button
                  className={`like-btn ${likeState.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(p.id)}
                >
                  ❤️ <span>{likeState.count}</span>
                </button>
                <Link className="comment-link" href={`/post/${p.id}`}>
                  💬 <span>{p.comments.length}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
