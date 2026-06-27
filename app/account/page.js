"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { auth } from "../lib/firebase";
import { updateProfile } from "firebase/auth";

export default function AccountPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  async function handleSave() {
    if (!name.trim()) {
      showToast("名前を入力してください");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await auth.currentUser.reload();
      showToast("保存しました");
    } catch (e) {
      showToast("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">アカウント編集</span>
      </div>

      <div className="page-content">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={user?.avatar}
            alt=""
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }}
          />
          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
            アイコンは名前から自動生成されます
          </p>
        </div>

        <div className="field">
          <label>ニックネーム</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：はな"
          />
        </div>

        <div className="field">
          <label>メールアドレス</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            style={{ background: "var(--cream)", color: "var(--text-faint)" }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-coral btn-block"
        >
          {loading ? "保存中..." : "保存する"}
        </button>
      </div>

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}