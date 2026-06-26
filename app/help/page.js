"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

const FAQS = [
  {
    q: "応援した金額はどのように使われますか？",
    a: "応援金額の80%が夢追い人に直接届きます。残りの20%はプラットフォームの運営・決済手数料として使用されます。",
  },
  {
    q: "VIPプランはいつでも解約できますか？",
    a: "はい、マイページからいつでも解約できます。解約後も次回更新日までVIP特典をご利用いただけます。",
  },
  {
    q: "応援金額は他のユーザーに公開されますか？",
    a: "応援金額は夢追い人本人にのみ通知されます。他のユーザーには公開されません。ランキングには順位のみ表示されます。",
  },
  {
    q: "夢追い人として登録するには何が必要ですか？",
    a: "アカウント登録・本人確認書類のアップロード・プロフィール設定が必要です。本人確認には運転免許証などの顔写真付き書類をご用意ください。",
  },
  {
    q: "プロフィール写真に制限はありますか？",
    a: "過度な加工が施された写真（強い美肌加工等）は使用できません。実際の見た目に近い写真をご登録ください。",
  },
  {
    q: "収益の振込はいつ行われますか？",
    a: "毎月1日に前月分の収益を振込します。振込には口座登録が必要です。",
  },
  {
    q: "退会後のデータはどうなりますか？",
    a: "アカウント削除後、投稿・応援履歴などのデータは削除されます。ただしVIP課金中の場合は先に解約手続きをお願いします。",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const { user, logout, vipList } = useAuth();
  const [openIndex, setOpenIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    try {
      const { deleteUser } = await import("firebase/auth");
      const { auth } = await import("../lib/firebase");
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      logout();
      router.push("/");
    } catch (e) {
      if (e.code === "auth/requires-recent-login") {
        alert("セキュリティのため、一度ログアウトして再ログインしてからアカウントを削除してください。");
      } else {
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">ヘルプ・お問い合わせ</span>
      </div>

      <div className="page-content">

        {/* FAQ */}
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <p className="section-title">❓ よくある質問</p>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "13px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <span style={{ fontSize: "13.5px", fontWeight: 700, flex: 1, paddingRight: 10 }}>{faq.q}</span>
                <span style={{ color: "var(--text-faint)", fontSize: 14 }}>{openIndex === i ? "▲" : "▼"}</span>
              </button>
              {openIndex === i && (
                <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 1.8, margin: "0 0 13px" }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* お問い合わせ */}
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <p className="section-title">📩 お問い合わせ</p>
          <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 1.8, margin: "0 0 14px" }}>
            ご不明な点やご要望はメールにてお問い合わせください。通常2営業日以内にご返信します。
          </p>
       <a　href="mailto:support@blossom.app"
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px 0",
              borderRadius: "var(--radius-md)",
              background: "var(--coral-light)",
              color: "var(--coral-dark)",
              fontSize: "13.5px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            📧 support@blossom.app
          </a>
        </div>

        {/* 規約・ポリシー */}
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <p className="section-title">📄 規約・ポリシー</p>
          <Link href="/terms" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)", fontSize: "13.5px", textDecoration: "none", color: "var(--text-main)" }}>
            利用規約 <span style={{ color: "var(--text-faint)" }}>›</span>
          </Link>
          <Link href="/privacy" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", fontSize: "13.5px", textDecoration: "none", color: "var(--text-main)" }}>
            プライバシーポリシー <span style={{ color: "var(--text-faint)" }}>›</span>
          </Link>
          <Link href="/tokushoho" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", fontSize: "13.5px", textDecoration: "none", color: "var(--text-main)" }}>
            特定商取引法に基づく表記 <span style={{ color: "var(--text-faint)" }}>›</span>
          </Link>
        </div>

        {/* アカウント削除 */}
        {user && (
          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <p className="section-title">⚠️ アカウント削除</p>
            {vipList.length > 0 ? (
              <>
                <p style={{ fontSize: "13px", color: "var(--coral)", lineHeight: 1.8, margin: "0 0 14px" }}>
                  現在VIPプランに加入中です。アカウントを削除する前に、マイページからVIPプランを解約してください。
                </p>
                <Link href="/mypage" className="btn btn-outline-coral btn-block">
                  マイページでVIPを解約する
                </Link>
              </>
            ) : !showDeleteConfirm ? (
              <>
                <p style={{ fontSize: "13px", color: "var(--text-sub)", lineHeight: 1.8, margin: "0 0 14px" }}>
                  アカウントを削除すると、投稿・応援履歴などすべてのデータが削除されます。この操作は取り消せません。
                </p>
                <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-outline-coral btn-block">
                  アカウントを削除する
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: "13px", color: "var(--coral)", fontWeight: 700, lineHeight: 1.8, margin: "0 0 14px" }}>
                  本当に削除しますか？この操作は取り消せません。
                </p>
                <button onClick={handleDelete} className="btn btn-coral btn-block" style={{ marginBottom: 10 }}>
                  はい、削除します
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-ghost btn-block">
                  キャンセル
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}