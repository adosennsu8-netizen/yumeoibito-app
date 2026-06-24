"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../AuthContext";
import { PREFECTURES } from "../data/creators";

const STEPS = ["account", "verify", "profile", "done"];
const STEP_LABELS = {
  account: "アカウント登録",
  verify: "本人確認",
  profile: "プロフィール設定",
  done: "完了",
};

export default function CreatorSignupPage() {
  const router = useRouter();
  const { loginAsCreator, registerCreator } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [verifyFile, setVerifyFile] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    prefecture: "",
    title: "",
    quote: "",
    bio: "",
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

  function handleAccountChoice() {
    goNext();
  }

  function handleVerifyUpload() {
    setVerifyFile("driver_license.jpg");
  }

  function handleVerifyNext() {
    if (!verifyFile) return;
    goNext();
  }

  function handleProfileSubmit() {
    const creatorProfile = {
      ...profile,
      id: `creator_${Date.now()}`,
      isCreator: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f9a8a8&color=fff`,
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=500&fit=crop",
      categories: [],
      categoryLabels: [],
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
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= stepIndex ? "var(--coral)" : "var(--border)",
            }}
          />
        ))}
      </div>

      {step === "account" && (
        <div style={{ padding: "28px 22px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <p className="serif" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 8px" }}>
              夢追い人として始める
            </p>
            <p className="text-sub" style={{ fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              まずはアカウントを作成してください。<br />
              この後、本人確認とプロフィール設定があります。
            </p>
          </div>
          <button onClick={handleAccountChoice} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, width: "100%", border: "1px solid var(--border)", background: "var(--paper)", marginBottom: 10 }}>
            🔍 Googleで続ける
          </button>
          <button onClick={handleAccountChoice} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, padding: 12, borderRadius: "var(--radius-md)", fontSize: 14, fontWeight: 700, width: "100%", border: "none", background: "#06C755", color: "#fff", marginBottom: 10 }}>
            💬 LINEで続ける
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
            <span style={{ fontSize: 11, color: "var(--text-faint)" }}>または</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
          </div>
          <button onClick={handleAccountChoice} className="btn btn-outline-coral btn-block">
            メールアドレスで登録
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="page-content">
          <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "10px 0 8px" }}>本人確認書類のアップロード</p>
          <p className="text-sub" style={{ fontSize: "12.5px", lineHeight: 1.8, margin: "0 0 18px" }}>
            運転免許証など、顔写真付きの本人確認書類をアップロードしてください。これは夢追い人を男性に限定する方針の実効性を担保するために必須の手続きです。
          </p>
          <div
            onClick={handleVerifyUpload}
            style={{ border: verifyFile ? "1.5px solid var(--coral)" : "1.5px dashed var(--text-faint)", borderRadius: "var(--radius-md)", padding: 30, textAlign: "center", marginBottom: 18, color: verifyFile ? "var(--coral-dark)" : "var(--text-faint)", background: verifyFile ? "var(--coral-light)" : "transparent", cursor: "pointer" }}
          >
            <span style={{ fontSize: 24, display: "block", margin: "0 auto 8px" }}>{verifyFile ? "✅" : "🪪"}</span>
            <span style={{ fontSize: "12.5px" }}>
              {verifyFile ? `アップロード済み：${verifyFile}` : "タップして運転免許証を撮影・アップロード"}
            </span>
          </div>
          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "11px 13px", marginBottom: 20, fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.7 }}>
            <span>🔒</span>
            <span>アップロードされた書類は本人確認のみに利用され、運営は口座情報・書類画像を直接保持しません。審査には1〜2営業日ほどお時間をいただく場合があります。</span>
          </div>
          <button onClick={handleVerifyNext} disabled={!verifyFile} className={verifyFile ? "btn btn-coral btn-block" : "btn btn-disabled btn-block"}>
            {verifyFile ? "次へ進む" : "書類をアップロードしてください"}
          </button>
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
          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "11px 13px", marginBottom: 20, fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.7 }}>
            <span>ℹ️</span>
            <span>プロフィール写真は登録完了後にマイページから設定できます。過度な加工が施された写真は利用できません。</span>
          </div>
          <button onClick={handleProfileSubmit} className="btn btn-coral btn-block">登録を完了する</button>
        </div>
      )}

      {step === "done" && (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--coral-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>✓</div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>登録が完了しました</p>
          <p className="text-sub" style={{ fontSize: "13.5px", margin: "0 0 12px", lineHeight: 1.8 }}>
            本人確認の審査が完了するまで、プロフィールは非公開状態になります。
          </p>
          <p className="text-faint" style={{ fontSize: 12, margin: "0 0 26px", lineHeight: 1.8 }}>
            審査結果はメールでお知らせします（モックアップでは即時「確認済み」として扱います）。
          </p>
          <button onClick={() => router.push("/creator-earnings")} className="btn btn-coral btn-block">
            収益・口座管理画面へ
          </button>
        </div>
      )}
    </div>
  );
}