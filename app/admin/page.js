"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const ADMIN_PASSWORD = "8413";

export default function AdminPage() {
  const { addNotification } = useAuth();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("notice");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [toast, setToast] = useState("");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [authed]);

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
      title: title || "運営からのお知らせ",
      body: text,
      text: title ? `【${title}】${text}` : text,
    });
    setTitle("");
    setText("");
    showToast("通知を送信しました");
  }

  async function handleDeleteReport(reportId) {
    await deleteDoc(doc(db, "reports", reportId));
    showToast("通報を削除しました");
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
              <input type="password" placeholder="管理者パスワードを入力" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }} />
            </div>
            <button onClick={handleLogin} className="btn btn-coral btn-block">ログイン</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
              <button onClick={() => setTab("notice")} style={{ flex: 1, padding: "12px", fontSize: 13, fontWeight: 700, background: "none", border: "none", borderBottom: tab === "notice" ? "2px solid var(--coral)" : "2px solid transparent", color: tab === "notice" ? "var(--coral)" : "var(--text-faint)", cursor: "pointer" }}>
                📣 通知送信
              </button>
              <button onClick={() => setTab("reports")} style={{ flex: 1, padding: "12px", fontSize: 13, fontWeight: 700, background: "none", border: "none", borderBottom: tab === "reports" ? "2px solid var(--coral)" : "2px solid transparent", color: tab === "reports" ? "var(--coral)" : "var(--text-faint)", cursor: "pointer" }}>
                🚩 通報一覧 {reports.length > 0 && `(${reports.length})`}
              </button>
            </div>

            {tab === "notice" && (
              <div className="card card-pad">
                <p className="section-title">📣 運営通知を送信</p>
                <div className="field">
                  <label>タイトル（任意）</label>
                  <input type="text" placeholder="例：メンテナンスのお知らせ" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="field">
                  <label>本文</label>
                  <textarea rows={5} placeholder="通知の内容を入力してください" value={text} onChange={(e) => setText(e.target.value)} />
                </div>
                <button onClick={handleSend} className="btn btn-coral btn-block">送信する</button>
              </div>
            )}

            {tab === "reports" && (
              <div>
                {reports.length === 0 ? (
                  <p className="text-faint" style={{ fontSize: 13, textAlign: "center", paddingTop: 40 }}>通報はありません</p>
                ) : (
                  reports.map((r) => (
                    <div key={r.id} className="card card-pad" style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>対象：{r.targetName}</p>
                          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 4px" }}>通報者：{r.reporterName}</p>
                          <p style={{ fontSize: 12, color: "var(--coral)", margin: "0 0 4px" }}>理由：{r.reason}</p>
                          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>
                            {r.createdAt?.toDate?.()?.toLocaleString("ja-JP") ?? ""}
                          </p>
                        </div>
                        <button onClick={() => handleDeleteReport(r.id)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "6px 10px", fontSize: 12, color: "var(--text-faint)", cursor: "pointer", flexShrink: 0 }}>
                          削除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}