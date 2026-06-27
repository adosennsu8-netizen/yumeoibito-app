"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";
import { auth, storage } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AccountPage() {
  const router = useRouter();
  const { user, updateUserName } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");
  const [imageFile, setImageFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(user?.cover || "");
  const [coverFile, setCoverFile] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!name.trim()) {
      showToast("名前を入力してください");
      return;
    }
    setLoading(true);
    try {
      let avatarUrl = user?.avatar;
      let coverUrl = user?.cover;

      if (imageFile) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      if (coverFile) {
        const storageRef = ref(storage, `covers/${auth.currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatarUrl,
      });
      await updateUserName(name, avatarUrl, coverUrl);
      showToast("保存しました");
    } catch (e) {
      console.error(e);
      showToast("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">アカウント編集</span>
      </div>

      <div className="page-content">

        {user?.isCreator && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: "11.5px", color: "var(--text-faint)", fontWeight: 700, display: "block", marginBottom: 8 }}>カバー画像</label>
            <div
              style={{ position: "relative", width: "100%", height: 130, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--cream)", cursor: "pointer" }}
              onClick={() => coverInputRef.current.click()}
            >
              {coverPreviewUrl ? (
                <img src={coverPreviewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: 13 }}>
                  タップして設定
                </div>
              )}
              <div style={{ position: "absolute", right: 10, bottom: 10, background: "var(--coral)", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
                📷
              </div>
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={previewUrl}
              alt=""
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              style={{ position: "absolute", right: -2, bottom: -2, width: 26, height: 26, borderRadius: "50%", background: "var(--coral)", border: "2px solid var(--bg-page)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, cursor: "pointer" }}
            >
              📷
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "8px 0 0" }}>
            タップしてアイコンを変更
          </p>
        </div>

        <div className="field">
          <label>ニックネーム</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：はな" />
        </div>

        <div className="field">
          <label>メールアドレス</label>
          <input type="email" value={user?.email || ""} disabled style={{ background: "var(--cream)", color: "var(--text-faint)" }} />
        </div>

        <button onClick={handleSave} disabled={loading} className="btn btn-coral btn-block">
          {loading ? "保存中..." : "保存する"}
        </button>
      </div>

      <div style={{ position: "fixed", bottom: 90, left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "20px"})`, background: "var(--navy)", color: "#fff", padding: "11px 22px", borderRadius: "var(--radius-pill)", fontSize: 13, opacity: toast ? 1 : 0, transition: "all 0.25s", pointerEvents: "none", zIndex: 50 }}>
        {toast}
      </div>
    </div>
  );
}