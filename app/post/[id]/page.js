"use client";

import { useState } from "react";
import { CREATORS, POSTS } from "../../data/creators";
import { useAuth } from "../../AuthContext";
import { useParams } from "next/navigation";



export default function PostDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id;
  const post = POSTS.find((p) => p.id === id);
  const c = post ? CREATORS[post.creatorId] : null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post ? post.likes : 0);
  const [comments, setComments] = useState(post ? post.comments : []);
  const [commentInput, setCommentInput] = useState("");

  if (!post || !c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>投稿が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  function toggleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  function postComment() {
    const val = commentInput.trim();
    if (!val) return;
    setComments((prev) => [
      ...prev,
      {
        name: user?.name || "ゲスト",
        avatar: user?.avatar || "",
        text: val,
      },
    ]);
    setCommentInput("");
  }

  return (
    <div className="app-shell" style={{ paddingBottom: 150 }}>
      <div className="subpage-header">
        <Link className="back-btn" href={`/profile/${c.id}`}>
          ←
        </Link>
        <span className="title">投稿</span>
      </div>

      <div className="page-content">
        <div className="post" style={{ borderBottom: "none", paddingTop: 0 }}>
          <Link href={`/profile/${c.id}`} className="post-head">
            <img src={c.avatar} alt="" />
            <div style={{ flex: 1 }}>
              <p className="name">{c.name}</p>
              <p className="time">{post.time}</p>
            </div>
            {post.vip && <span className="vip-badge">👑 VIP限定</span>}
          </Link>
          <p className="post-text">{post.text}</p>
          {post.image && <img className="post-image" src={post.image} alt="" />}
          <div className="post-actions">
            <button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
              ❤️ <span>{likeCount}</span>
            </button>
            <span className="comment-link">💬 <span>{comments.length}</span></span>
          </div>
        </div>

        <div className="card card-pad" style={{ marginTop: 14 }}>
          <p className="section-title">コメント</p>
          {comments.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>
              まだコメントがありません。最初のコメントを書いてみましょう。
            </p>
          ) : (
            comments.map((cm, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <img
                  src={cm.avatar}
                  alt=""
                  style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontSize: "11.5px", fontWeight: 700, margin: "0 0 2px" }}>{cm.name}</p>
                  <p style={{ fontSize: 12, margin: 0, color: "var(--text-sub)" }}>{cm.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 76,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "var(--bg-page)",
          borderTop: "1px solid var(--border)",
          padding: "10px 14px",
          display: "flex",
          gap: 9,
          zIndex: 25,
        }}
      >
        <input
          type="text"
          placeholder="コメントを書く"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") postComment();
          }}
          style={{
            flex: 1,
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border)",
            padding: "10px 16px",
            outline: "none",
          }}
        />
        <button
          onClick={postComment}
          style={{
            background: "var(--coral)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
