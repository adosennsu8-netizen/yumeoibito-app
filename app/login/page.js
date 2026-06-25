"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../AuthContext";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
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

  async function handleEmailLogin() {
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push(redirect);
    } catch (e) {
      setError("メールアドレスまたはパスワードが違います");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">ログイン</span>
      </div>

      <div className="page-content">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, width: "100%", border: "1px solid var(--border)", background: "var(--paper)", marginBottom: 10 }}
        >
          🔍 Googleでログイン
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>または</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
        </div>

        <div className="field">
          <label>メールアドレス</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>パスワード</label>
          <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleEmailLogin(); }} />
        </div>

        {error && <p style={{ fontSize: 12, color: "var(--coral)", marginBottom: 12 }}>{error}</p>}

        <button onClick={handleEmailLogin} disabled={loading} className="btn btn-coral btn-block">
          {loading ? "ログイン中..." : "ログインする"}
        </button>

        <p style={{ fontSize: 12, color: "var(--text-faint)", textAlign: "center", marginTop: 16 }}>
          アカウントをお持ちでない方は
          <a href={`/signup?redirect=${encodeURIComponent(redirect)}`} style={{ color: "var(--coral)", marginLeft: 4 }}>新規登録</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}