"use client";

import { useRouter } from "next/navigation";

export default function TokushohoPage() {
  const router = useRouter();

  const items = [
    { label: "販売者名", value: "Joynovation（ジョイノベーション）" },
    { label: "運営責任者", value: "（準備中）" },
    { label: "所在地", value: "（準備中）" },
    { label: "電話番号", value: "（準備中）" },
    { label: "メールアドレス", value: "support@blossom.app" },
    { label: "サービス名", value: "BLOSSOM" },
    { label: "販売価格", value: "応援金額：300円〜任意の金額\nVIPプラン：月額500円（税込）" },
    { label: "支払方法", value: "クレジットカード（Visa・Mastercard・American Express・JCB）" },
    { label: "支払時期", value: "応援：即時決済\nVIPプラン：加入時および毎月自動更新" },
    { label: "サービス提供時期", value: "決済完了後、即時" },
    { label: "返金・キャンセルポリシー", value: "応援金額は原則返金不可です。\nVIPプランは解約後も次回更新日まで利用可能です。期間途中での返金は行いません。" },
    { label: "動作環境", value: "インターネットに接続されたスマートフォン・PCブラウザ" },
    { label: "プラットフォーム手数料", value: "応援金額の20%をプラットフォーム手数料として頂戴します。残り80%が夢追い人に支払われます。" },
  ];

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">特定商取引法に基づく表記</span>
      </div>

      <div className="page-content">
        <div className="card card-pad">
          {items.map((item, i) => (
            <div key={i} style={{ padding: "13px 0", borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <p style={{ fontSize: "11.5px", color: "var(--text-faint)", fontWeight: 700, margin: "0 0 5px" }}>{item.label}</p>
              <p style={{ fontSize: "13.5px", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}