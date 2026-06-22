"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function getAnnouncement(redirect) {
  if (!redirect || redirect === "/") return null;
  if (redirect.startsWith("/support/")) return "応援するにはアカウント登録が必要です";
  if (redirect.startsWith("/vip/")) return "VIPチャットを利用するにはアカウント登録が必要です";
  if (redirect.startsWith("/mypage")) return "マイページを見るにはアカウント登録が必要です";
  return "続けるにはアカウント登録が必要です";
}

function StartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const announcement = getAnnouncement(redirect);

  function goSignup() {
    router.push(`/signup?redirect=${encodeURIComponent(redirect)}`);
  }

  function goCreatorSignup() {
    router.push("/creator-signup");
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>
          ←
        </button>
        <span className="title">はじめる</span>
      </div>

      <div style={{ padding: "36px 22px 24px" }}>
        {announcement && (
          <div
            style={{
              background: "var(--coral-light)",
              borderRadius: "var(--radius-md)",
              padding: "13px 16px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13,
              color: "var(--coral-dark)",
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
            <span>{announcement}</span>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p className="serif" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            どちらで始めますか？
          </p>
          <p className="text-sub" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
            あとからもう一方を追加することもできます
          </p>
        </div>

        <button
          onClick={goSignup}
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
          onClick={goCreatorSignup}
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

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartContent />
    </Suspense>
  );
}
