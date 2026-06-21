"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../AuthContext";

function SignupContent() {
  // step: "choice" | "form" | "done"
  const [step, setStep] = useState("choice");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  function handleOAuthLogin() {
    login();
    setStep("done");
  }

  function handleEmailSubmit() {
    login();
    setStep("done");
  }

  function handleBack() {
    setStep("choice");
  }

  function goToDestination() {
    router.push(redirect);
  }

  const headerTitle =
    step === "choice" ? "はじめまして" : step === "form" ? "メールアドレスで登録" : "登録完了";

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button
          className="back-btn"
          onClick={() => {
            if (step === "form") {
              handleBack();
            } else {
              router.push("/");
            }
          }}
        >
          ←
        </button>
        <span className="title">{headerTitle}</span>
      </div>

      {step === "choice" && (
        <div style={{ padding: "28px 22px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <p className="serif" style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              はじめまして
            </p>
            <p className="text-sub" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              応援するにはユーザー登録が必要です。
              <br />
              誰かの夢の、いちばん近くへ。
            </p>
          </div>

          <button
            onClick={handleOAuthLogin}
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
            onClick={handleOAuthLogin}
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

          <button
            onClick={() => setStep("form")}
            className="btn btn-outline-coral btn-block"
          >
            メールアドレスで登録
          </button>

          <p
            style={{
              fontSize: 11,
              color: "var(--text-faint)",
              textAlign: "center",
              marginTop: 18,
              lineHeight: 1.8,
            }}
          >
            登録すると利用規約とプライバシーポリシーに同意したものとみなされます
          </p>
        </div>
      )}

      {step === "form" && (
        <div className="page-content">
          <div className="field">
            <label>ニックネーム</label>
            <input type="text" placeholder="例：はな" />
          </div>
          <div className="field">
            <label>メールアドレス</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>パスワード</label>
            <input type="password" placeholder="8文字以上" />
          </div>
          <button onClick={handleEmailSubmit} className="btn btn-coral btn-block">
            登録する
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "var(--coral-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              fontSize: 28,
            }}
          >
            ✓
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>登録が完了しました</p>
          <p className="text-sub" style={{ fontSize: "13.5px", margin: "0 0 26px", lineHeight: 1.8 }}>
            これで応援やVIPチャットが利用できます
          </p>
          <button onClick={goToDestination} className="btn btn-coral btn-block">
            {redirect === "/" ? "夢追い人を探しに行く" : "もとの画面に戻る"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
