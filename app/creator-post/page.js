"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreatorTabs from "../CreatorTabs";
import { useAuth } from "../AuthContext";

export default function CreatorNewPostPage() {
  const { user, addPost, addNotification, favorites, vipList } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [vipOnly, setVipOnly] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function handlePost() {
    if (!text.trim()) {
      showToast("本文を入力してください");
      return;
    }
    const today = new Date();
    const date = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    addPost({
      id: `post_${Date.now()}`,
      creatorId: user?.id || "new",
      creatorName: user?.name || "",
      creatorAvatar: user?.avatar || "",
      title,
      text,
      isVip: vipOnly,
      date,
      time: "たった今",
      likes: 0,
      comments: [],
    });
    addNotification({
      type: "post",
      creatorId: user?.id || "new",
      text: `${user?.name || ""}さんが新しく投稿しました`,
    });
    setTitle("");
    setText("");
    setVipOnly(false);
    showToast("投稿しました");
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>✏️</span>
        <span className="title">新規投稿</span>
      </div>

      <CreatorTabs active="post" />

      <div className="page-content">
        <label style={{ fontSize: "11.5px", color: "var(--text-faint)", fontWeight: 700, display: "block", marginBottom: 8 }}>写真</label>
        <div style={{ border: "1.5px dashed var(--text-faint)", borderRadius: "var(--radius-md)", padding: 30, textAlign: "center", marginBottom: 16, color: "var(--text-faint)" }}>
          <span style={{ fontSize: 24, display: "block", margin: "0 auto 6px" }}>🖼️</span>
          <span style={{ fontSize: "12.5px" }}>タップして写真を追加</span>
        </div>

        <div className="field">
          <label>タイトル</label>
          <input type="text" placeholder="例：今日の窯入れ" value={title} onChange={(e) => setTitle(e.target.value)} />
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

        <button onClick={handlePost} className="btn btn-coral btn-block">投稿する</button>
      </div>

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}