"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { PREFECTURES } from "../data/creators";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const CATEGORY_OPTIONS = [
  "美容", "音楽", "スポーツ", "アート", "料理", "芸能", "起業",
  "クリエイター", "テクノロジー", "ファッション", "執筆・文学",
  "教育・指導", "農業・自然", "伝統工芸", "旅・冒険",
];

const STEPS = ["account", "profile", "done"];
const STEP_LABELS = {
  account: "アカウント登録",
  profile: "プロフィール設定",
  done: "完了",
};

export default function CreatorSignupPage() {
  const router = useRouter();
  const { loginAsCreator, registerCreator } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    prefecture: "",
    title: "",
    quote: "",
    bio: "",
    categories: [],
  });

  const step = STEPS[stepIndex];

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      router.push("/mypage");
    } else {
      setStepIndex((i) => Math.max(i - 1, 0));
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      goNext();
    } catch (e) {
      setError("Googleログインに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSignup() {
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
      await createUserWithEmailAndPassword(auth, email, password);
      goNext();
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("このメールアドレスはすでに登録されています");
      } else {
        setError("登録に失敗しました。もう一度お試しください");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleProfileSubmit() {
    const creatorProfile = {
      ...profile,
      id: auth.currentUser?.uid || `creator_${Date.now()}`,
      isCreator: true,
      avatar: auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f9a8a8&color=fff`,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=500&fit=crop",
      categories: profile.categories,
      categoryLabels: profile.categories,
      vipCount: 0,
      monthlySupportCount: 0,
      ranking: [],
    };
    loginAsCreator(creatorProfile);
    registerCreator(creatorProfile);
    goNext();
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={goBack}>←</button>
        <span className="title">夢追い人になる（{STEP_LABELS[step]}）</span>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 16px 0" }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= stepIndex ? "var(--coral)" : "var(--border)" }} />
        ))}
      </div>

      {step === "account" && (
        <div style={{ padding: "28px 22px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <p className="serif" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>夢追い人として始める</p>
            <p className="text-sub" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              まずはアカウントを作成してください。<br />この後、プロフィール設定があります。
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

          {!showEmailForm ? (
            <button onClick={() => setShowEmailForm(true)} className="btn btn-outline-coral btn-block">
              メールアドレスで登録
            </button>
          ) : (
            <div>
              <div className="field">
                <label>メールアドレス</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>パスワード</label>
                <input type="password" placeholder="8文字以上" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p style={{ fontSize: 12, color: "var(--coral)", marginBottom: 12 }}>{error}</p>}
              <button onClick={handleEmailSignup} disabled={loading} className="btn btn-coral btn-block">
                {loading ? "登録中..." : "登録する"}
              </button>
            </div>
          )}

          {error && !showEmailForm && <p style={{ fontSize: 12, color: "var(--coral)", textAlign: "center", marginTop: 12 }}>{error}</p>}
        </div>
      )}

      {step === "profile" && (
        <div className="page-content">
          <div className="field">
            <label>表示名</label>
            <input type="text" placeholder="例：山田 太郎" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>年齢</label>
            <input type="number" placeholder="例：28" min={18} max={99} style={{ maxWidth: 120 }} value={profile.age} onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))} />
          </div>
          <div className="field">
            <label>活動拠点の都道府県</label>
            <select value={profile.prefecture} onChange={(e) => setProfile((p) => ({ ...p, prefecture: e.target.value }))} style={{ width: "100%", padding: "11px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--paper)" }}>
              <option value="" disabled>選択してください</option>
              {PREFECTURES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>肩書き・夢のひとこと</label>
            <input type="text" placeholder="例：写真家を目指して 2年目" value={profile.title} onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="field">
            <label>夢への一言</label>
            <textarea rows={3} className="serif-input" placeholder="あなたの夢を一言で表すと？" value={profile.quote} onChange={(e) => setProfile((p) => ({ ...p, quote: e.target.value }))} />
          </div>
          <div className="field">
            <label>自己紹介</label>
            <textarea rows={4} placeholder="どんな夢を、どんな想いで追いかけているか教えてください" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
          </div>

          <div>
            <label style={{ fontSize: "11.5px", color: "var(--text-faint)", fontWeight: 700, display: "block", marginBottom: 8 }}>カテゴリ</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {profile.categories.map((cat) => (
                <button key={cat} onClick={() => setProfile((p) => ({ ...p, categories: p.categories.filter((c) => c !== cat) }))} style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--radius-md)", border: "none", background: "var(--coral-light)", color: "var(--coral-dark)", cursor: "pointer" }}>
                  {cat} ×
                </button>
              ))}
              <button onClick={() => setShowCategoryModal(true)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--radius-md)", border: "1px dashed var(--text-faint)", background: "none", color: "var(--text-faint)" }}>
                + 追加
              </button>
            </div>
          </div>

          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "11px 13px", marginBottom: 20, fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.7 }}>
            <span>ℹ️</span>
            <span>プロフィール写真は登録完了後にマイページから設定できます。</span>
          </div>

          <button onClick={handleProfileSubmit} className="btn btn-coral btn-block">登録を完了する</button>
        </div>
      )}

      {step === "done" && (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--coral-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>✓</div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>登録が完了しました</p>
          <p className="text-sub" style={{ fontSize: "13.5px", margin: "0 0 12px", lineHeight: 1.8 }}>
            プロフィールを公開して、応援を受け取りましょう。
          </p>
          <button onClick={() => router.push("/creator-earnings")} className="btn btn-coral btn-block">
            収益・口座管理画面へ
          </button>
        </div>
      )}

      {showCategoryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }} onClick={() => setShowCategoryModal(false)}>
          <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", padding: "20px 16px 32px", width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>カテゴリを選択</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button key={cat} onClick={() => setProfile((p) => ({ ...p, categories: p.categories.includes(cat) ? p.categories.filter((c) => c !== cat) : [...p.categories, cat] }))} style={{ fontSize: 13, padding: "7px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid", borderColor: profile.categories.includes(cat) ? "var(--coral)" : "var(--border)", background: profile.categories.includes(cat) ? "var(--coral-light)" : "var(--paper)", color: profile.categories.includes(cat) ? "var(--coral-dark)" : "var(--text-main)", cursor: "pointer" }}>
                  {profile.categories.includes(cat) ? `✓ ${cat}` : cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="text" placeholder="自由入力（例：ダンス）" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { const val = customInput.trim(); if (val && !profile.categories.includes(val)) { setProfile((p) => ({ ...p, categories: [...p.categories, val] })); } setCustomInput(""); } }} style={{ flex: 1, padding: "10px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontSize: 13 }} />
              <button onClick={() => { const val = customInput.trim(); if (val && !profile.categories.includes(val)) { setProfile((p) => ({ ...p, categories: [...p.categories, val] })); } setCustomInput(""); }} className="btn btn-coral" style={{ padding: "10px 16px" }}>追加</button>
            </div>
            <button onClick={() => setShowCategoryModal(false)} className="btn btn-coral btn-block">決定</button>
          </div>
        </div>
      )}
    </div>
  );
}