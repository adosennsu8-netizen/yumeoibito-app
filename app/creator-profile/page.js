"use client";

import { useState } from "react";
import CreatorTabs from "../CreatorTabs";

export default function CreatorProfileEditPage() {
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>✏️</span>
        <span className="title">マイ夢ページを編集</span>
      </div>

      <CreatorTabs active="profile" />

      <div className="page-content">
        <div
          style={{
            position: "relative",
            height: 120,
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: 18,
            background: "var(--border)",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&h=500&fit=crop"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            style={{
              position: "absolute",
              right: 9,
              bottom: 9,
              background: "rgba(26,21,48,0.55)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 11,
              padding: "6px 11px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            📷 カバー画像を変更
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces"
              alt=""
              style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
            />
            <button
              aria-label="アイコンを変更"
              style={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "var(--coral)",
                border: "2px solid var(--bg-page)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 10,
              }}
            >
              📷
            </button>
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>表示名</label>
            <input type="text" defaultValue="水野 蒼" />
          </div>
        </div>

        <div className="field">
          <label>年齢</label>
          <input type="number" defaultValue={28} min={18} max={99} style={{ maxWidth: 120 }} />
        </div>

        <div className="field">
          <label>肩書き・夢のひとこと</label>
          <input type="text" defaultValue="陶芸家を目指して 5年目" />
        </div>

        <div className="field">
          <label>活動拠点の都道府県</label>
          <select
            defaultValue="東京都"
            style={{
              width: "100%",
              padding: "11px 13px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--paper)",
            }}
          >
            <option>東京都</option>
            <option>大阪府</option>
            <option>長野県</option>
            <option>北海道</option>
          </select>
        </div>

        <div className="field">
          <label>夢への一言（プロフィール上部に表示）</label>
          <textarea
            rows={3}
            className="serif-input"
            defaultValue="割れても、もう一度焼く。土も自分も、何度でもやり直せると思ってます。"
          />
        </div>

        <div className="field">
          <label>自己紹介</label>
          <textarea
            rows={4}
            defaultValue="会社員を辞めて陶芸の道へ。窯を借りるお金を貯めながら、来年春の個展開催を目標に作品を作り続けています。"
          />
        </div>

        <div>
          <label
            style={{
              fontSize: "11.5px",
              color: "var(--text-faint)",
              fontWeight: 700,
              display: "block",
              marginBottom: 8,
            }}
          >
            カテゴリ
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <span className="tag tag-coral">陶芸 ×</span>
            <span className="tag tag-amber">個展準備中 ×</span>
            <button
              style={{
                fontSize: 12,
                padding: "5px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--text-faint)",
                background: "none",
                color: "var(--text-faint)",
              }}
            >
              + 追加
            </button>
          </div>
        </div>

        <div
          style={{
            background: "var(--cream)",
            borderRadius: "var(--radius-md)",
            padding: "11px 13px",
            marginBottom: 20,
            fontSize: 12,
            color: "var(--text-faint)",
            display: "flex",
            alignItems: "flex-start",
            gap: 7,
            lineHeight: 1.7,
          }}
        >
          <span>ℹ️</span>
          <span>
            過度な加工が施された写真（強い美肌加工等）はカバー画像・アイコン画像として利用できません。実際の見た目に近い写真をご登録ください。
          </span>
        </div>

        <div className="payout-status registered" style={{ marginBottom: 20 }}>
          <div>
            <p className="ps-text">本人確認：確認済み</p>
            <p className="ps-sub">運転免許証による確認が完了しています</p>
          </div>
          <span style={{ color: "var(--coral-dark)" }}>✓</span>
        </div>

        <button
          onClick={() => showToast("プロフィールを保存しました")}
          className="btn btn-coral btn-block"
        >
          プロフィールを保存
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 90,
          left: "50%",
          transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`,
          background: "var(--navy)",
          color: "#fff",
          padding: "11px 22px",
          borderRadius: "var(--radius-pill)",
          fontSize: 13,
          opacity: toast ? 1 : 0,
          transition: "all 0.25s",
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {toast}
      </div>
    </div>
  );
}
