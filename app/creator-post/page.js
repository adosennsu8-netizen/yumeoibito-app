"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorTabs from "../CreatorTabs";
import { useAuth } from "../AuthContext";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function CreatorNewPostPage() {
  const { user, addNotification } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [vipOnly, setVipOnly] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const creatorId = user?.uid || user?.id;

  useEffect(() => {
    if (!creatorId) return;
    const q = query(
      collection(db, "posts"),
      where("creatorId", "==", creatorId),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMyPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [creatorId]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  async function handlePost() {
    if (!text.trim()) {
      showToast("本文を入力してください");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        creatorId: creatorId || "unknown",
        creatorName: user?.displayName || user?.name || "",
        creatorAvatar: user?.photoURL || user?.avatar || "",
        title,
        text,
        isVip: vipOnly,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
      });
      addNotification({
        type: "post",
        creatorId: creatorId || "unknown",
        text: `${user?.displayName || user?.name || ""}さんが新しく投稿しました`,
      });
      setTitle("");
      setText("");
      setVipOnly(false);
      showToast("投稿しました");
    } catch (e) {
      console.error(e);
      showToast("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId) {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setDeleteConfirm(null);
      showToast("削除しました");
    } catch (e) {
      console.error(e);
      showToast("削除に失敗しました");
    }
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>✍</span>
        <span className="title">新規投稿</span>
      </div>

      <CreatorTabs active="post" />

      <div className="page-content">
        <div className="field">
          <label>タイトル</label>
          <input type="text" placeholder="例：今日の練習メニュー" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="field">
          <label>本文</label>
          <textarea rows={5} placeholder="今日の出来事や夢への進捗を書いてみましょう" value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 2px" }}>VIP限定で公開</p>
            <p style={{ fontSize: "11.5px", color: "var(--text-faint)", margin: 0 }}>VIPメンバーだけが読める投稿にする</p>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={vipOnly} onChange={(e) => setVipOnly(e.target.checked)} />
            <span className="track"></span>
            <span className="knob"></span>
          </label>
        </div>

        <button onClick={handlePost} disabled={loading} className="btn btn-coral btn-block">
          {loading ? "投稿中..." : "投稿する"}
        </button>

        {/* 投稿一覧 */}
        {myPosts.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <p className="section-title">📝 自分の投稿</p>
            {myPosts.map((post) => (
              <div key={post.id} className="card card-pad" style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    {post.isVip && (
                      <span style={{ fontSize: 10, background: "var(--purple-light)", color: "var(--purple)", padding: "2px 7px", borderRadius: "var(--radius-pill)", fontWeight: 700, marginBottom: 6, display: "inline-block" }}>
                        👑 VIP限定
                      </span>
                    )}
                    {post.title && <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 4px" }}>{post.title}</p>}
                    <p style={{ fontSize: 13, color: "var(--text-sub)", margin: "0 0 6px", lineHeight: 1.7 }}>
                      {post.text.length > 60 ? post.text.slice(0, 60) + "…" : post.text}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>
                      {post.createdAt?.toDate?.()?.toLocaleDateString("ja-JP") ?? ""}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "6px 10px", fontSize: 12, color: "var(--text-faint)", cursor: "pointer", flexShrink: 0 }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg)", padding: 24, width: "100%", maxWidth: 320 }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>投稿を削除しますか？</p>
            <p style={{ fontSize: 13, color: "var(--text-faint)", margin: "0 0 20px" }}>削除した投稿は元に戻せません。</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost" style={{ flex: 1 }}>キャンセル</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-coral" style={{ flex: 1 }}>削除する</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}