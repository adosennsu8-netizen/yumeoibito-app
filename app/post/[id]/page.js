"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CREATORS, POSTS, CREATOR_POSTS } from "../../data/creators";
import { useAuth } from "../../AuthContext";
import { db } from "../../lib/firebase";
import {
  doc, getDoc, collection, onSnapshot, addDoc, runTransaction, serverTimestamp, query, orderBy
} from "firebase/firestore";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [isFirestorePost, setIsFirestorePost] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);

  // 投稿をFirestore優先で取得
  useEffect(() => {
    async function fetchPost() {
      // まずFirestoreで探す
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
        setLikeCount(snap.data().likes || 0);
        setIsFirestorePost(true);
      } else {
        // ダミーデータから探す
        const found =
          POSTS.find((p) => p.id === id) ||
          Object.values(CREATOR_POSTS || {}).flat().find((p) => p.id === id);
        if (found) {
          setPost(found);
          setLikeCount(found.likes || 0);
        }
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  // Firestoreの投稿はコメントをリアルタイム取得
  useEffect(() => {
    if (!isFirestorePost) {
      setComments(post?.comments || []);
      return;
    }
    const q = query(
      collection(db, "posts", id, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [isFirestorePost, id, post]);

  async function toggleLike() {
    const nowLiked = !liked;
    setLiked(nowLiked);
    setLikeCount((prev) => (nowLiked ? prev + 1 : prev - 1));

    if (isFirestorePost) {
      const ref = doc(db, "posts", id);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;
        const cur = snap.data().likes || 0;
        tx.update(ref, { likes: nowLiked ? cur + 1 : cur - 1 });
      });
    }
  }

  async function postComment() {
    const val = commentInput.trim();
    if (!val) return;

    if (isFirestorePost) {
      await addDoc(collection(db, "posts", id, "comments"), {
        name: user?.displayName || user?.name || "ゲスト",
        avatar: user?.photoURL || user?.avatar || "",
        text: val,
        createdAt: serverTimestamp(),
      });
    } else {
      // ダミー投稿はローカルのみ
      setComments((prev) => [
        ...prev,
        { name: user?.displayName || user?.name || "ゲスト", avatar: user?.photoURL || user?.avatar || "", text: val },
      ]);
    }
    setCommentInput("");
  }

  const c = post ? CREATORS[post.creatorId] : null;

  if (loading) {
    return (
      <div className="app-shell">
        <div className="page-content" style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ color: "var(--text-faint)", fontSize: 13 }}>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!post) {
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

  return (
    <div className="app-shell" style={{ paddingBottom: 150 }}>
      <div className="subpage-header">
        <Link className="back-btn" href={c ? `/profile/${c.id}` : "/"}>←</Link>
        <span className="title">投稿</span>
      </div>

      <div className="page-content">
        <div className="post" style={{ borderBottom: "none", paddingTop: 0 }}>
          <Link href={c ? `/profile/${c.id}` : "#"} className="post-head">
            <img src={c ? c.avatar : post.creatorAvatar || ""} alt="" />
            <div style={{ flex: 1 }}>
              <p className="name">{c ? c.name : post.creatorName || ""}</p>
              <p className="time">{post.time || post.date || (post.createdAt?.toDate?.()?.toLocaleDateString("ja-JP") ?? "")}</p>
            </div>
            {(post.vip || post.isVip) && <span className="vip-badge">👑 VIP限定</span>}
          </Link>
          <p className="post-text">{post.text}</p>
          {post.image && <img className="post-image" src={post.image} alt="" />}
          <div className="post-actions">
            <button className={`like-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
              {liked ? "❤️" : "🤍"} <span>{likeCount}</span>
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
              <div key={cm.id || i} style={{ display: "flex", gap: 8, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <img src={cm.avatar} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "11.5px", fontWeight: 700, margin: "0 0 2px" }}>{cm.name}</p>
                  <p style={{ fontSize: 12, margin: 0, color: "var(--text-sub)" }}>{cm.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "var(--bg-page)", borderTop: "1px solid var(--border)", padding: "10px 14px", display: "flex", gap: 9, zIndex: 25 }}>
        <input
          type="text"
          placeholder="コメントを書く"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") postComment(); }}
          style={{ flex: 1, borderRadius: "var(--radius-pill)", border: "1px solid var(--border)", padding: "10px 16px", outline: "none" }}
        />
        <button onClick={postComment} style={{ background: "var(--coral)", color: "#fff", border: "none", borderRadius: "50%", width: 38, height: 38, flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  );
}