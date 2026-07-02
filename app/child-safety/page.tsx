"use client";

import { useRouter } from "next/navigation";

export default function ChildSafetyPage() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">子どもの安全に関する方針</span>
      </div>

      <div className="page-content">
        <div className="card card-pad">
          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "0 0 20px" }}>最終更新日：2026年7月2日</p>

          <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--text-sub)", margin: "0 0 20px" }}>
            Joynovation（以下「当社」）が運営するBLOSSOM（以下「本サービス」）は、児童の性的搾取および虐待（CSAE：Child Sexual Abuse and Exploitation）を断固として許容しません。当社は、すべてのユーザーが安全に本サービスを利用できる環境を維持するため、以下の方針に基づき対応します。
          </p>

          {[
            {
              title: "第1条（基本方針）",
              body: "本サービスは18歳以上のユーザーを対象としています。児童の性的搾取・虐待に関するコンテンツ（画像、動画、文章、リンクを問わず）の投稿、送信、共有、勧誘を固く禁止します。該当するコンテンツを発見した場合、当社は速やかに削除およびアカウントの永久停止措置を講じます。",
            },
            {
              title: "第2条（ユーザーによる通報）",
              body: "ユーザーは、本サービス内の通報機能から「子どもの安全に関する懸念」を選択して、該当コンテンツやアカウントを報告できます。アプリ内での通報が困難な場合は、下記の連絡先まで直接ご連絡ください。",
            },
            {
              title: "第3条（対応措置）",
              body: "通報を受けた当社は、以下の対応を速やかに実施します。\n・該当コンテンツの削除\n・該当アカウントの利用停止または永久停止\n・証拠の保全\n・必要に応じた関係当局・法執行機関への報告",
            },
            {
              title: "第4条（法令遵守）",
              body: "当社は、児童の安全に関連する適用法令を遵守し、国内外の関連当局からの要請に対し、法令の定める範囲で適切に協力します。米国関連法令が適用される場合、National Center for Missing & Exploited Children（NCMEC）等への報告義務についても遵守します。",
            },
            {
              title: "第5条（専用連絡先）",
              body: "児童の安全に関する懸念・通報・お問い合わせは、以下の専用窓口で常時受け付けています。\n\nJoynovation\nメール：support@blossom.app\n\n本連絡先は、児童性的虐待コンテンツ（CSAM）の防止対策およびコンプライアンスに関するお問い合わせに、迅速に対応します。",
            },
            {
              title: "第6条（年齢制限）",
              body: "本サービスの利用は18歳以上に限定されています。18歳未満と判明したアカウントは速やかに利用を停止します。",
            },
            {
              title: "第7条（本方針の変更）",
              body: "当社は、必要に応じて本方針を変更することがあります。重要な変更がある場合は、本サービス上でお知らせします。",
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