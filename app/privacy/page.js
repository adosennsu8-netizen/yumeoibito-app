"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">プライバシーポリシー</span>
      </div>

      <div className="page-content">
        <div className="card card-pad">
          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "0 0 20px" }}>最終更新日：2026年6月25日</p>

          <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--text-sub)", margin: "0 0 20px" }}>
            株式会社Joynovation（以下「当社」）が運営するBLOSSOM（以下「本サービス」）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
          </p>

          {[
            {
              title: "第1条（収集する情報）",
              body: "当社は、本サービスの提供にあたり、以下の情報を収集することがあります。\n・氏名、メールアドレス等の登録情報\n・本人確認書類（夢追い人登録時）\n・利用履歴、応援履歴、VIP加入情報\n・端末情報、IPアドレス、Cookie等の技術情報",
            },
            {
              title: "第2条（情報の利用目的）",
              body: "収集した情報は、以下の目的で利用します。\n・本サービスの提供・運営・改善\n・本人確認および不正利用の防止\n・応援金額の集計および振込処理\n・ユーザーへのお知らせ・サポート対応\n・利用規約に違反したユーザーへの対応",
            },
            {
              title: "第3条（第三者提供）",
              body: "当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。\n・ユーザーの同意がある場合\n・法令に基づく場合\n・決済代行会社・本人確認事業者への提供（業務委託の範囲内）",
            },
            {
              title: "第4条（本人確認書類の取り扱い）",
              body: "夢追い人登録時に提出いただく本人確認書類は、本人確認事業者が管理します。当社は書類の原本・画像を直接保持しません。確認完了後、書類情報は適切に廃棄されます。",
            },
            {
              title: "第5条（Cookieの使用）",
              body: "本サービスでは、利便性向上のためCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。",
            },
            {
              title: "第6条（セキュリティ）",
              body: "当社は、収集した個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を実施します。ただし、インターネット上での完全な安全性を保証するものではありません。",
            },
            {
              title: "第7条（個人情報の開示・訂正・削除）",
              body: "ユーザーは、当社が保有する自己の個人情報の開示・訂正・削除を求めることができます。お問い合わせは support@blossom.app までご連絡ください。",
            },
            {
              title: "第8条（未成年者の利用）",
              body: "本サービスは18歳以上を対象としています。18歳未満の方の利用はお断りしています。",
            },
            {
              title: "第9条（プライバシーポリシーの変更）",
              body: "当社は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、本サービス上でお知らせします。",
            },
            {
              title: "第10条（お問い合わせ）",
              body: "プライバシーポリシーに関するお問い合わせは以下までご連絡ください。\n\n株式会社Joynovation\nWebサイト：https://www.joynovation.com/\nメール：support@blossom.app",
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <p style={{ fontSize: "13.5px", fontWeight: 700, margin: "0 0 8px" }}>{section.title}</p>
              <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--text-sub)", margin: 0, whiteSpace: "pre-line" }}>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}