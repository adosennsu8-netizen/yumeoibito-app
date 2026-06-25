"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <button className="back-btn" onClick={() => router.back()}>←</button>
        <span className="title">利用規約</span>
      </div>

      <div className="page-content">
        <div className="card card-pad">
          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "0 0 20px" }}>最終更新日：2026年6月25日</p>

          <p style={{ fontSize: 13, lineHeight: 1.9, color: "var(--text-sub)", margin: "0 0 20px" }}>
            本利用規約（以下「本規約」）は、Joynovation（以下「当社」）が提供するBLOSSOM（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。
          </p>

          {[
            {
              title: "第1条（定義）",
              body: "・「ユーザー」：本サービスを利用するすべての方\n・「応援者」：夢追い人を応援する女性ユーザー\n・「夢追い人」：本サービスに登録した男性クリエイター\n・「応援金額」：応援者が夢追い人に送る金銭的支援",
            },
            {
              title: "第2条（利用資格）",
              body: "本サービスは18歳以上の方を対象としています。夢追い人として登録できるのは成人男性に限ります。応援者として登録できるのは成人女性に限ります。未成年者の利用は禁止します。",
            },
            {
              title: "第3条（アカウント登録）",
              body: "ユーザーは正確な情報を登録する義務があります。アカウントの譲渡・売買は禁止します。登録情報に変更があった場合は速やかに更新してください。1人につき1アカウントのみ登録できます。",
            },
            {
              title: "第4条（本人確認）",
              body: "夢追い人として登録するには、顔写真付き本人確認書類の提出が必要です。提出いただいた書類は本人確認のみに使用し、確認完了後に適切に廃棄します。虚偽の書類を提出した場合は即時アカウント停止の対象となります。",
            },
            {
              title: "第5条（応援・VIPプラン）",
              body: "応援金額の80%が夢追い人に届きます。残り20%はプラットフォーム手数料です。VIPプランは月額制で、解約するまで自動更新されます。解約後も次回更新日まで特典を利用できます。返金は原則として行いません。",
            },
            {
              title: "第6条（禁止事項）",
              body: "以下の行為を禁止します。\n・虚偽情報の登録\n・他のユーザーへの嫌がらせ・誹謗中傷\n・わいせつ・暴力的なコンテンツの投稿\n・本サービスを通じた売春・援助交際\n・マネーロンダリングへの利用\n・当社の許可なく本サービスを商業利用すること\n・その他法令または公序良俗に反する行為",
            },
            {
              title: "第7条（コンテンツの権利）",
              body: "ユーザーが投稿したコンテンツの著作権はユーザーに帰属します。ただし当社は、本サービスの運営・改善・宣伝のためにコンテンツを無償で使用できるものとします。",
            },
            {
              title: "第8条（アカウント停止・削除）",
              body: "当社は、以下の場合にアカウントを停止・削除できます。\n・本規約に違反した場合\n・不正利用が疑われる場合\n・長期間利用がない場合\n・その他当社が不適切と判断した場合",
            },
            {
              title: "第9条（免責事項）",
              body: "当社は、本サービスに関してユーザーに生じた損害について、当社の故意または重大な過失による場合を除き、責任を負いません。ユーザー間のトラブルについては、当事者間で解決するものとします。",
            },
            {
              title: "第10条（規約の変更）",
              body: "当社は必要に応じて本規約を変更できます。重要な変更がある場合は、本サービス上で事前にお知らせします。変更後も本サービスを利用し続けた場合、変更後の規約に同意したものとみなします。",
            },
            {
              title: "第11条（準拠法・管轄）",
              body: "本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。",
            },
            {
              title: "第12条（お問い合わせ）",
              body: "本規約に関するお問い合わせは以下までご連絡ください。\n\nJoynovation\nWebサイト：https://www.joynovation.com/\nメール：support@blossom.app",
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