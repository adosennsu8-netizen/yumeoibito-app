"use client";

import CreatorTabs from "../CreatorTabs";
import { calcPayout } from "../data/creators";
import { useAuth } from "../AuthContext";

export default function CreatorEarningsPage() {
  const { user } = useAuth();

  const thisMonthSupportHistory = user?.creatorEarnings?.thisMonthSupportHistory || [];
  const payoutAccountRegistered = user?.creatorEarnings?.payoutAccountRegistered || false;
  const nextPayoutDate = user?.creatorEarnings?.nextPayoutDate || "未定";
  const pastMonthsTotalReceived = user?.creatorEarnings?.pastMonthsTotalReceived || 0;

  const thisMonthGross = thisMonthSupportHistory.reduce((sum, s) => sum + s.amount, 0);
  const thisMonthNet = calcPayout(thisMonthGross);

  function yen(n) {
    return "¥" + Number(n).toLocaleString("ja-JP");
  }

  function handleAccountClick() {
    alert(
      "実際の実装では、ここから決済代行会社が提供する口座登録・本人確認フォームへ遷移します。\n（プラットフォーム側では口座番号を直接保持しません）"
    );
  }

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <span>👛</span>
        <span className="title">収益・口座管理</span>
      </div>

      <CreatorTabs active="earnings" />

      <div className="page-content">
        <div className="earn-summary">
          <p className="label">今月応援された金額</p>
          <p className="amount">{yen(thisMonthGross)}</p>
          <div className="sub-row">
            <span>受取金額（手数料控除後）</span>
            <span>{yen(thisMonthNet)}</span>
          </div>
        </div>

        <div className="fee-note">
          <span>プラットフォーム手数料（20%）控除済み</span>
          <span>ℹ️</span>
        </div>

        <div className={`payout-status ${payoutAccountRegistered ? "registered" : "unregistered"}`}>
          <div>
            <p className="ps-text">
              {payoutAccountRegistered ? "振込先口座：登録済み" : "振込先口座：未登録"}
            </p>
            <p className="ps-sub">
              {payoutAccountRegistered
                ? `次回振込予定日：${nextPayoutDate}`
                : "振込を受け取るには口座登録が必要です"}
            </p>
          </div>
          <button
            onClick={handleAccountClick}
            className={payoutAccountRegistered ? "btn btn-ghost" : "btn btn-coral"}
            style={{ width: "auto", padding: "9px 14px", fontSize: "12.5px" }}
          >
            {payoutAccountRegistered ? "口座情報を確認" : "口座を登録する"}
          </button>
        </div>

        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <p className="section-title">🏦 累計受取金額</p>
          <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            {yen(pastMonthsTotalReceived + thisMonthNet)}
          </p>
        </div>

        <div className="card card-pad">
          <p className="section-title">❤️ 今月の応援履歴</p>
          {thisMonthSupportHistory.length === 0 ? (
            <p className="text-faint" style={{ fontSize: 13 }}>まだ応援されていません</p>
          ) : (
            thisMonthSupportHistory.map((s, i) => (
              <div key={i} className="earn-row">
                <div>
                  <p className="sname">{s.supporterName}さん</p>
                  <p className="sdate">{s.date}</p>
                </div>
                <div className="amounts">
                  <p className="gross">{yen(s.amount)}</p>
                  <p className="net">{yen(calcPayout(s.amount))}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}