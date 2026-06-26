"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CREATORS } from "../../data/creators";
import { useAuth } from "../../AuthContext";


export default function VipCancelPage() {
  const params = useParams();
  const id = params.id;
  const c = CREATORS[id];
  const { vipList, cancelVip } = useAuth();

  const vipInfo = vipList.find((v) => v.creatorId === id) || {
    nextBilling: "次回更新日未定",
    price: 500,
  };

  const [done, setDone] = useState(false);
  const [reason, setReason] = useState("");

  if (!c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>夢追い人が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  const reasons = [
    "金額の負担が大きい",
    "チャットをあまり使わなかった",
    "他の夢追い人を応援したい",
    "その他",
  ];

  function handleCancel() {
    cancelVip(id);
    setDone(true);
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <Link className="back-btn" href="/mypage">←</Link>
        <span className="title">{done ? "解約完了" : "VIP解約"}</span>
      </div>

      {!done ? (
        <div className="page-content" style={{ paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <img src={c.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <p style={{ fontSize: "14.5px", fontWeight: 700, margin: 0 }}>{c.name}さんのVIPプラン</p>
              <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>
                ¥{vipInfo.price}/月 ・ 次回更新日 {vipInfo.nextBilling}
              </p>
            </div>
          </div>

          <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "14px 15px", marginBottom: 20, fontSize: "12.5px", color: "var(--text-sub)", lineHeight: 1.8 }}>
            <span style={{ color: "var(--coral)", marginRight: 5 }}>ℹ️</span>
            解約後も<strong>{vipInfo.nextBilling}まではVIPチャット・限定投稿を利用できます</strong>。期限を過ぎると自動的にVIP特典が終了します。
          </div>

          <p style={{ fontSize: "12.5px", color: "var(--text-faint)", margin: "0 0 10px", fontWeight: 700 }}>解約の理由（任意）</p>
          {reasons.map((r) => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", marginBottom: 9, cursor: "pointer" }}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} style={{ accentColor: "var(--coral)" }} />
              <span style={{ fontSize: "13.5px" }}>{r}</span>
            </label>
          ))}

          <button onClick={handleCancel} className="btn btn-outline-coral btn-block" style={{ marginTop: 22 }}>解約する</button>
          <Link href="/mypage" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>解約しない</Link>
        </div>
      ) : (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>✓</div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>解約手続きが完了しました</p>
          <p className="text-sub" style={{ fontSize: "13.5px", margin: "0 0 26px", lineHeight: 1.8 }}>
            {c.name}さんのVIPプランは{vipInfo.nextBilling}まで利用できます。
          </p>
          <Link className="btn btn-ghost btn-block" href="/mypage">マイページに戻る</Link>
        </div>
      )}
    </div>
  );
}