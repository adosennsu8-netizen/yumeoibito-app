"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";

export default function AdminNoticePage() {
  const params = useParams();
  const router = useRouter();
  const { notifications } = useAuth();
  const n = notifications.find((n) => String(n.id) === String(params.id));

  if (!n) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>通知が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">運営からのお知らせ</span>
      </div>
      <div className="page-content">
        <div className="card card-pad">
          <p style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 10px" }}>{n.title}</p>
          <p style={{ fontSize: "11px", color: "var(--text-faint)", margin: "0 0 14px" }}>{n.time}</p>
          <p style={{ fontSize: "13.5px", lineHeight: 1.8, margin: 0 }}>{n.body}</p>
        </div>
      </div>
    </div>
  );
}