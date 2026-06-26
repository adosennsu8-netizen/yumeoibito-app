"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CREATORS } from "../../data/creators";
import { useAuth } from "../../AuthContext";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";


export default function VipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const c = CREATORS[id];
  const { user, isVip, addVip } = useAuth();

  const alreadyVip = isVip ? isVip(id) : false;
  const [subscribed, setSubscribed] = useState(alreadyVip);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const chatId = user?.id ? `${user.id}_${id}` : null;

  useEffect(() => {
    if (!chatId || !alreadyVip) return;
    const ref = doc(db, "vipChats", chatId);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data().messages || []);
      }
    });
    return () => unsubscribe();
  }, [chatId, alreadyVip]);

  if (!c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>夢追い人が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubscribe() {
    addVip(id);
    setSubscribed(true);
    const welcomeMsg = {
      from: "creator",
      text: "VIP登録ありがとうございます！これからよろしくお願いします。今日はいい一日でしたか？",
      time: new Date().toISOString(),
    };
    const newMessages = [welcomeMsg];
    setMessages(newMessages);
    if (chatId) {
      await setDoc(doc(db, "vipChats", chatId), { messages: newMessages }, { merge: true });
    }
  }

  async function handleSend() {
    const val = chatInput.trim();
    if (!val) return;
    const newMsg = { from: "user", text: val, time: new Date().toISOString() };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setChatInput("");
    if (chatId) {
      await setDoc(doc(db, "vipChats", chatId), { messages: newMessages }, { merge: true });
    }
  }

  return (
    <div className="app-shell" style={{ paddingBottom: subscribed ? 0 : undefined }}>
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.push(`/profile/${id}`)}>←</button>
        <span className="title">{subscribed ? `${c.name}さんとのチャット` : "VIPプラン"}</span>
      </div>

      {!subscribed ? (
        <div className="page-content">
          <div style={{ textAlign: "center", padding: "4px 0 18px" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--purple-light)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20 }}>
              👑
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>{c.name}さんとVIPチャット</p>
            <p className="text-sub" style={{ fontSize: "11.5px", margin: 0 }}>月額プランに加入すると直接メッセージを送れます</p>
          </div>

          <div style={{ background: "var(--purple-light)", borderRadius: "var(--radius-lg)", padding: 18, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "var(--purple-dark)" }}>¥500</span>
              <span style={{ fontSize: "11px", color: "var(--purple)" }}>/ 月</span>
            </div>
            {["夢追い人と1対1でチャット", "VIPバッジがプロフィールに表示", "いつでも解約可能"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px", color: "var(--purple-dark)", marginBottom: 8 }}>
                ✓ {f}
              </div>
            ))}
          </div>

          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "11px 13px", marginBottom: 18, fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.7 }}>
            <span>ℹ️</span>
            <span>初回決済日を基準に毎月自動更新されます。解約はマイページからいつでも行えます。</span>
          </div>

          <button onClick={handleSubscribe} className="btn btn-purple btn-block">👑 月額500円でVIPになる</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px - 76px)" }}>
          <div style={{ padding: "12px 16px", background: "var(--purple-light)", color: "var(--purple-dark)", fontSize: 12, display: "flex", alignItems: "center", gap: 7 }}>
            👑 VIPチャットが解放されました
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, maxWidth: "78%", alignSelf: m.from === "user" ? "flex-end" : "flex-start", flexDirection: m.from === "user" ? "row-reverse" : "row" }}>
                {m.from === "creator" && (
                  <img src={c.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                )}
                <div style={{ padding: "10px 13px", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.65, background: m.from === "user" ? "var(--coral-light)" : "var(--paper)", color: m.from === "user" ? "var(--coral-dark)" : "var(--text-main)", border: m.from === "creator" ? "1px solid var(--border)" : "none" }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 9, background: "var(--bg-page)" }}>
            <input
              type="text"
              placeholder="メッセージを入力"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              style={{ flex: 1, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "10px 13px", outline: "none" }}
            />
            <button onClick={handleSend} style={{ background: "var(--purple)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", width: 38, height: 38, flexShrink: 0 }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}