"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CreatorTabs from "../CreatorTabs";
import { useAuth } from "../AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, orderBy, getDocs } from "firebase/firestore";

export default function CreatorChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const creatorId = user?.uid || user?.id;

  // 自分宛のVIPチャット一覧を取得
  useEffect(() => {
    if (!creatorId) return;
    const q = query(collection(db, "vipChats"));
    const unsub = onSnapshot(q, (snap) => {
      const myChats = snap.docs
        .filter((d) => d.id.endsWith(`_${creatorId}`))
        .map((d) => ({ id: d.id, ...d.data() }));
      setChats(myChats);
    });
    return () => unsub();
  }, [creatorId]);

  useEffect(() => {
    if (!selectedChat) return;
    const ref = doc(db, "vipChats", selectedChat.id);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setMessages(snap.data().messages || []);
    });
    return () => unsub();
  }, [selectedChat]);

  async function handleSend() {
    const val = input.trim();
    if (!val || !selectedChat) return;
    const newMsg = { from: "creator", text: val, time: new Date().toISOString() };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput("");
    await setDoc(doc(db, "vipChats", selectedChat.id), { messages: newMessages }, { merge: true });
  }

  function getFanName(chatId) {
    // chatId形式: {userId}_{creatorId}
    return `ファン (${chatId.split("_")[0].slice(0, 6)}...)`;
  }

  if (!user?.isCreator) {
    return (
      <div className="app-shell">
        <div className="page-content empty-state">
          <p>夢追い人専用のページです</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>💬</span>
        <span className="title">VIPチャット</span>
      </div>

      <CreatorTabs active="chat" />

      {!selectedChat ? (
        <div className="page-content">
          {chats.length === 0 ? (
            <div className="empty-state" style={{ paddingTop: 40 }}>
              <p style={{ fontSize: 13, color: "var(--text-faint)", textAlign: "center" }}>
                まだVIPチャットはありません
              </p>
            </div>
          ) : (
            chats.map((chat) => {
              const lastMsg = chat.messages?.[chat.messages.length - 1];
              return (
                <div key={chat.id} onClick={() => setSelectedChat(chat)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    👑
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 3px" }}>{getFanName(chat.id)}</p>
                    <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
                      {lastMsg ? lastMsg.text.slice(0, 30) + (lastMsg.text.length > 30 ? "…" : "") : "メッセージなし"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px - 56px - 76px)" }}>
          <div style={{ padding: "10px 16px", background: "var(--purple-light)", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSelectedChat(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>←</button>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--purple-dark)" }}>{getFanName(selectedChat.id)}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, maxWidth: "78%", alignSelf: m.from === "creator" ? "flex-end" : "flex-start", flexDirection: m.from === "creator" ? "row-reverse" : "row" }}>
                <div style={{ padding: "10px 13px", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.65, background: m.from === "creator" ? "var(--coral-light)" : "var(--paper)", color: m.from === "creator" ? "var(--coral-dark)" : "var(--text-main)", border: m.from === "user" ? "1px solid var(--border)" : "none" }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 9, background: "var(--bg-page)" }}>
            <input type="text" placeholder="メッセージを入力" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} style={{ flex: 1, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "10px 13px", outline: "none" }} />
            <button onClick={handleSend} style={{ background: "var(--purple)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", width: 38, height: 38, flexShrink: 0 }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}