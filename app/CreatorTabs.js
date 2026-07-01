"use client";
import Link from "next/link";
export default function CreatorTabs({ active }) {
  const tabs = [
    { id: "profile", href: "/creator-profile", icon: "✏️", label: "プロフィール" },
    { id: "post", href: "/creator-post", icon: "📷", label: "新規投稿" },
    { id: "chat", href: "/creator-chat", icon: "💬", label: "チャット" },
    { id: "earnings", href: "/creator-earnings", icon: "🍎", label: "収益" },
  ];
  return (
    <div className="tab-row" style={{ display: "flex", width: "100%" }}>
      {tabs.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={`tab-btn ${active === t.id ? "active" : ""}`}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <span style={{ fontSize: 15 }}>{t.icon}</span>
          <span>{t.label}</span>
        </Link>
      ))}
    </div>
  );
}