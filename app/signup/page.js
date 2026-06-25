"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../AuthContext";

function SignupContent() {
  const [step, setStep] = useState("choice");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      router.push(redirect);
    } catch (e) {
      setError("Googleログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit() {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }
    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup(email, password);
      setStep("done");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        // 既存ユーザーはログイン
        try {
          await login(email, password);
          router.push(redirect);
        } catch {
          setError("メールアドレスまたはパスワードが違います");
        }
      } else {
        setError("登録に失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
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
              setStep("choice");
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
              応援するにはユーザー登録が必要です。<br />
              誰かの夢の、いちばん近くへ。
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, width: "100%", border: "1px solid var(--border)", background: "var(--paper)", marginBottom: 10 }}
          >
            🔍 Googleで続ける
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>または</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
          </div>

          <button onClick={() => setStep("form")} className="btn btn-outline-coral btn-block">
            メールアドレスで登録
          </button>

          {error && <p style={{ fontSize: 12, color: "var(--coral)", textAlign: "center", marginTop: 12 }}>{error}</p>}

          <p style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center", marginTop: 18, lineHeight: 1.8 }}>
            登録すると<a href="/terms" style={{ color: "var(--coral)" }}>利用規約</a>と<a href="/privacy" style={{ color: "var(--coral)" }}>プライバシーポリシー</a>に同意したものとみなされます
          </p>
        </div>
      )}

      {step === "form" && (
        <div className="page-content">
          <div className="field">
            <label>ニックネーム</label>
            <input type="text" placeholder="例：はな" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>メールアドレス</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>パスワード</label>
            <input type="password" placeholder="8文字以上" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p style={{ fontSize: 12, color: "var(--coral)", marginBottom: 12 }}>{error}</p>}
          <button onClick={handleEmailSubmit} disabled={loading} className="btn btn-coral btn-block">
            {loading ? "登録中..." : "登録する"}
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--coral-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>
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