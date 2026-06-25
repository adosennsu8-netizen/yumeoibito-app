"use client";

import Link from "next/link";
import { CREATORS } from "../data/creators";
import { useAuth } from "../AuthContext";

const ICON_MAP = {
  support: "❤️",
  post: "📝",
  vip: "👑",
  like: "🤍",
  favorite: "♥",
  admin: "📣",
};

function linkFor(n) {
  if (n.type === "post") return "/feed";
  if (n.type === "vip") return `/vip/${n.creatorId}`;
  return `/profile/${n.creatorId}`;
}

export default function NotificationsPage() {
  const { notifications, markAllRead } = useAuth();

  return (
    <div className="app-shell">
      <header className="top-header">
        <p className="brand">通知</p>
        <p className="tagline">応援先からのお知らせをまとめて確認できます</p>
      </header>

      <div className="page-content">
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            style={{ fontSize: 12, color: "var(--text-faint)", background: "none", border: "none", padding: "0 0 12px", cursor: "pointer" }}
          >
            すべて既読にする
          </button>
        )}
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p>まだ通知はありません</p>
          </div>
        ) : (
          <div className="card card-pad">
            {notifications.map((n, i) => {
              return (
                <Link
                  key={n.id}
                  href={linkFor(n)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 0",
                    borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: n.type === "post" ? "var(--purple-light)" : "var(--coral-light)",
                    }}
                  >
                    {ICON_MAP[n.type] || "🔔"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13.5px", lineHeight: 1.65, margin: "0 0 3px", color: "var(--text-main)", fontWeight: n.read ? 400 : 700 }}>
                      {n.text}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>{n.time}</p>
                  </div>
                  {!n.read && (
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--coral)", flexShrink: 0, marginTop: 6 }} />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}