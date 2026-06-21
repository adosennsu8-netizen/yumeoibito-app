"use client";

import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.push("/")}>
          ←
        </button>
        <span className="title">はじめる</span>
      </div>

      <div style={{ padding: "36px 22px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <p className="serif" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            どちらで始めますか？
          </p>
          <p className="text-sub" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            あとからもう一方を追加することもできます
          </p>
        </div>

        <button
          onClick={() => router.push("/signup")}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid var(--border)",
            background: "var(--paper)",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "var(--coral-light)",
                color: "var(--coral)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              ❤️
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px" }}>応援する</p>
              <p style={{ fontSize: "12.5px", color: "var(--text-faint)", margin: 0, lineHeight: 1.6 }}>
                夢追い人を見つけて、投げ銭やVIPチャットで応援する
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push("/creator-signup")}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            border: "1.5px solid var(--border)",
            background: "var(--paper)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "var(--purple-light)",
                color: "var(--purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              👑
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px" }}>夢追い人として活動する</p>
              <p style={{ fontSize: "12.5px", color: "var(--text-faint)", margin: 0, lineHeight: 1.6 }}>
                夢を発信して、応援してもらう（男性限定・本人確認あり）
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
