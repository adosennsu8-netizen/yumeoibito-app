"use client";

import { useState, useRef } from "react";
import CreatorTabs from "../CreatorTabs";
import { useAuth } from "../AuthContext";
import { PREFECTURES } from "../data/creators";
import { auth, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATEGORY_OPTIONS = [
  "美容", "音楽", "スポーツ", "アート", "料理", "芸能", "起業",
  "クリエイター", "テクノロジー", "ファッション", "執筆・文学",
  "教育・指導", "農業・自然", "伝統工芸", "旅・冒険",
];

export default function CreatorProfileEditPage() {
  const { user, updateCreatorProfile } = useAuth();
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    title: user?.title || "",
    prefecture: user?.prefecture || "",
    quote: user?.quote || "",
    bio: user?.bio || "",
  });
  const [categories, setCategories] = useState(user?.categories || []);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(user?.cover || "");
  const [coverFile, setCoverFile] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setLoading(true);
    try {
      let avatarUrl = user?.avatar;
      let coverUrl = user?.cover;

      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      if (coverFile) {
        const storageRef = ref(storage, `covers/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(storageRef);
      }

      await updateCreatorProfile({
        id: user?.id,
        ...form,
        avatar: avatarUrl,
        cover: coverUrl,
        categories,
        categoryLabels: categories,
      });
      showToast("プロフィールを保存しました");
    } catch (e) {
      console.error(e);
      showToast("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(cat) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function addCustom() {
    const val = customInput.trim();
    if (!val || categories.includes(val)) return;
    setCategories((prev) => [...prev, val]);
    setCustomInput("");
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>✏️</span>
        <span className="title">マイ夢ページを編集</span>
      </div>

      <CreatorTabs active="profile" />

      <div className="page-content">
        {/* カバー画像 */}
        <div style={{ position: "relative", height: 120, borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: 18, background: "var(--border)", cursor: "pointer" }}
          onClick={() => coverInputRef.current.click()}>
          {coverPreview
            ? <img src={coverPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: 13 }}>タップして設定</div>
          }
          <div style={{ position: "absolute", right: 9, bottom: 9, background: "rgba(26,21,48,0.55)", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontSize: 11, padding: "6px 11px", display: "flex", alignItems: "center", gap: 5 }}>
            📷 カバー画像を変更
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
        </div>

        {/* アバター＋表示名 */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
          <div style={{ position: "relative", flexShrink: 0 }} onClick={() => avatarInputRef.current.click()}>
            <img src={avatarPreview || "/logo.png"} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }} />
            <div style={{ position: "absolute", right: -2, bottom: -2, width: 22, height: 22, borderRadius: "50%", background: "var(--coral)", border: "2px solid var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10 }}>
              📷
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>表示名</label>
            <input type="text" value={form.name} placeholder="例：山田 太郎" onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
        </div>

        <div className="field">
          <label>年齢</label>
          <input type="number" value={form.age} placeholder="28" min={18} max={99} style={{ maxWidth: 120 }} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
        </div>

        <div className="field">
          <label>肩書き・夢のひとこと</label>
          <input type="text" value={form.title} placeholder="例：陶芸家を目指して 5年目" onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>

        <div className="field">
          <label>活動拠点の都道府県</label>
          <select
            value={form.prefecture}
            onChange={(e) => setForm((f) => ({ ...f, prefecture: e.target.value }))}
            style={{ width: "100%", padding: "11px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--paper)", fontSize: 14, appearance: "auto", WebkitAppearance: "auto" }}
          >
            <option value="" disabled>選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>夢への一言（プロフィール上部に表示）</label>
          <textarea rows={3} className="serif-input" value={form.quote} placeholder="あなたの夢を一言で表すと？" onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
        </div>

        <div className="field">
          <label>自己紹介</label>
          <textarea rows={4} value={form.bio} placeholder="どんな夢を、どんな想いで追いかけているか教えてください" onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
        </div>

        <div>
          <label style={{ fontSize: "11.5px", color: "var(--text-faint)", fontWeight: 700, display: "block", marginBottom: 8 }}>カテゴリ</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => toggleCategory(cat)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: "var(--radius-md)", border: "none", background: "var(--coral-light)", color: "var(--coral-dark)", cursor: "pointer" }}>
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
          <span>過度な加工が施された写真（強い美肌加工等）はカバー画像・アイコン画像として利用できません。実際の見た目に近い写真をご登録ください。</span>
        </div>

        <div className="payout-status registered" style={{ marginBottom: 20 }}>
          <div>
            <p className="ps-text">本人確認：確認済み</p>
            <p className="ps-sub">運転免許証による確認が完了しています</p>
          </div>
          <span style={{ color: "var(--coral-dark)" }}>✓</span>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn btn-coral btn-block">
          {loading ? "保存中..." : "プロフィールを保存"}
        </button>
      </div>

      {showCategoryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }} onClick={() => setShowCategoryModal(false)}>
          <div style={{ background: "var(--paper)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", padding: "20px 16px 32px", width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>カテゴリを選択</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button key={cat} onClick={() => toggleCategory(cat)} style={{ fontSize: 13, padding: "7px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid", borderColor: categories.includes(cat) ? "var(--coral)" : "var(--border)", background: categories.includes(cat) ? "var(--coral-light)" : "var(--paper)", color: categories.includes(cat) ? "var(--coral-dark)" : "var(--text-main)", cursor: "pointer" }}>
                  {categories.includes(cat) ? `✓ ${cat}` : cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input type="text" placeholder="自由入力（例：ダンス）" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }} style={{ flex: 1, padding: "10px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontSize: 13 }} />
              <button onClick={addCustom} className="btn btn-coral" style={{ padding: "10px 16px" }}>追加</button>
            </div>
            <button onClick={() => setShowCategoryModal(false)} className="btn btn-coral btn-block">決定</button>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}