"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatorLoginPage() {
  const router = useRouter();

  function goToCreatorHome() {
    /* 本番では、ログイン中ユーザーが夢追い人プロフィールを
       すでに作成済みかどうかをAPIで判定し、未作成なら
       /creator-profile（初回設定）、作成済みなら
       /creator-earnings（収益確認）に振り分ける想定。
       モックアップでは常に収益画面に遷移させる。 */
    router.push("/creator-earnings");
  }

  return (
    <div className="app-shell">
      <div className="creator-login-hero">
        <p className="serif">あなたの夢を、ここから発信しよう</p>
        <p className="sub">
          夢追い人としてログインすると、投稿の管理や
          <br />
          応援された金額の確認ができます
        </p>
      </div>

      <div style={{ padding: "28px 22px 24px" }}>
        <button
          onClick={goToCreatorHome}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            padding: 12,
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontWeight: 700,
            width: "100%",
            border: "1px solid var(--border)",
            background: "var(--paper)",
            marginBottom: 10,
          }}
        >
          🔍 Googleで続ける
        </button>

        <button
          onClick={goToCreatorHome}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
            padding: 12,
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontWeight: 700,
            width: "100%",
            border: "none",
            background: "#06C755",
            color: "#fff",
            marginBottom: 10,
          }}
        >
          💬 LINEで続ける
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>または</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
        </div>

        <button onClick={goToCreatorHome} className="btn btn-outline-coral btn-block">
          メールアドレスでログイン
        </button>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-sub)",
            textAlign: "center",
            marginTop: 22,
          }}
        >
          応援する側として利用したい方は
          <br />
          <Link href="/signup" style={{ color: "var(--coral)", fontWeight: 700 }}>
            こちらから登録・ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
