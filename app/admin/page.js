"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";

const ADMIN_PASSWORD = "blossom2026admin"; // ← ここを好きなパスワードに変更

export default function AdminPage() {
  const { addNotification } = useAuth();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      showToast("パスワードが違います");
    }
  }

  function handleSend() {
    if (!text.trim()) {
      showToast("本文を入力してください");
      return;
    }
    addNotification({
      type: "admin",
      creatorId: null,
      text: title ? `【${title}】${text}` : text,
    });
    setTitle("");
    setText("");
    showToast("通知を送信しました");
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>⚙️</span>
        <span className="title">運営管理画面</span>
      </div>

      <div className="page-content">
        {!authed ? (
          <div className="card card-pad">
            <p className="section-title">🔒 管理者認証</p>
            <div className="field">
              <label>パスワード</label>
              <input
                type="password"
                placeholder="管理者パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              />
            </div>
            <button onClick={handleLogin} className="btn btn-coral btn-block">
              ログイン
            </button>
          </div>
        ) : (
          <div className="card card-pad">
            <p className="section-title">📣 運営通知を送信</p>
            <div className="field">
              <label>タイトル（任意）</label>
              <input
                type="text"
                placeholder="例：メンテナンスのお知らせ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="field">
              <label>本文</label>
              <textarea
                rows={5}
                placeholder="通知の内容を入力してください"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button onClick={handleSend} className="btn btn-coral btn-block">
              送信する
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 90,
          left: "50%",
          transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`,
          background: "var(--navy)",
          color: "#fff",
          padding: "11px 22px",
          borderRadius: "var(--radius-pill)",
          fontSize: 13,
          opacity: toast ? 1 : 0,
          transition: "all 0.25s",
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {toast}
      </div>
    </div>
  );
}