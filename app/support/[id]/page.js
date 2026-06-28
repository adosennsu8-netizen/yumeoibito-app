"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CREATORS } from "../../data/creators";
import { useAuth } from "../../AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PRESET_AMOUNTS = [300, 1000, 3000, 5000, 10000];

function storageKey(id) {
  return `blossom_pending_support_${id}`;
}

function CheckoutForm({ amount, creatorId, creatorName, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, creatorId, creatorName }),
      });
      const { clientSecret, error: apiError } = await res.json();
      if (apiError) { setError(apiError); setLoading(false); return; }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (e) {
      setError("決済に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px", marginBottom: 16, background: "var(--paper)" }}>
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#1a1530" } } }} />
      </div>
      {error && <p style={{ fontSize: 12, color: "var(--coral)", marginBottom: 12 }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading || !stripe} className="btn btn-coral btn-block">
        {loading ? "決済中..." : `❤️ ¥${Number(amount).toLocaleString("ja-JP")} を応援する`}
      </button>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const c = CREATORS[id];
  const { user, addSupport } = useAuth();

  const [selected, setSelected] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const saved = sessionStorage.getItem(storageKey(id));
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selected) {
          setSelected(data.selected);
          if (!PRESET_AMOUNTS.includes(Number(data.selected))) {
            setShowCustomInput(true);
            setCustomAmount(String(data.selected));
          }
        }
        if (data.message) setMessage(data.message);
        sessionStorage.removeItem(storageKey(id));
      }
    } catch (e) {}
  }, [id]);

  if (!c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state"><p>夢追い人が見つかりませんでした</p></div>
        </div>
      </div>
    );
  }

  function yen(n) { return "¥" + Number(n).toLocaleString("ja-JP"); }

  function handleSelectPreset(amount) {
    setSelected(amount);
    setShowCustomInput(false);
  }

  function handleSelectCustom() {
    setShowCustomInput(true);
    setSelected(customAmount || null);
  }

  function handleCustomInputChange(e) {
    setCustomAmount(e.target.value);
    setSelected(e.target.value);
  }

  function handleConfirm() {
    if (!selected || Number(selected) <= 0) return;
    if (!user) {
      try {
        sessionStorage.setItem(storageKey(id), JSON.stringify({ selected, message }));
      } catch (e) {}
      router.push(`/start?redirect=${encodeURIComponent(`/support/${id}`)}`);
      return;
    }
    setShowCheckout(true);
  }

  async function handleSuccess() {
    await addSupport(id);
    setCompleted(true);
  }

  const isValid = selected && Number(selected) >= 100;

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <Link className="back-btn" href={`/profile/${id}`}>←</Link>
        <span className="title">{completed ? "応援完了" : "応援する"}</span>
      </div>

      {!completed ? (
        <div className="page-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <img src={c.avatar} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
            <p className="serif" style={{ fontSize: "13.5px", fontStyle: "italic", color: "var(--text-sub)", margin: 0, lineHeight: 1.6 }}>
              「{c.quote}」
            </p>
          </div>

          {!showCheckout ? (
            <>
              <p className="text-sub" style={{ fontSize: 13, margin: "0 0 10px" }}>応援したい金額を選んでください</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9, marginBottom: 14 }}>
                {PRESET_AMOUNTS.map((amount) => (
                  <button key={amount} onClick={() => handleSelectPreset(amount)} style={{ padding: "16px 0", borderRadius: "var(--radius-md)", border: selected === amount && !showCustomInput ? "1.5px solid var(--coral)" : "1.5px solid var(--border)", background: selected === amount && !showCustomInput ? "var(--coral-light)" : "var(--paper)", color: selected === amount && !showCustomInput ? "var(--coral-dark)" : "var(--text-main)", fontSize: 15, fontWeight: 700 }}>
                    {yen(amount)}
                  </button>
                ))}
                <button onClick={handleSelectCustom} style={{ padding: "16px 0", borderRadius: "var(--radius-md)", border: showCustomInput ? "1.5px solid var(--coral)" : "1.5px solid var(--border)", background: showCustomInput ? "var(--coral-light)" : "var(--paper)", color: showCustomInput ? "var(--coral-dark)" : "var(--text-sub)", fontSize: 13 }}>
                  自由入力
                </button>
              </div>

              {showCustomInput && (
                <div className="field">
                  <input type="number" placeholder="金額を入力（100円以上）" value={customAmount} onChange={handleCustomInputChange} />
                </div>
              )}

              <div className="field">
                <textarea rows={3} placeholder="応援メッセージ（任意）" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>

              <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "11px 13px", marginBottom: 18, fontSize: 12, color: "var(--text-faint)", display: "flex", alignItems: "flex-start", gap: 7, lineHeight: 1.7 }}>
                <span>🔒</span>
                <span>カード情報はStripeで安全に処理されます。当サービスはカード情報を保持しません。</span>
              </div>

              <button onClick={handleConfirm} disabled={!isValid} className={isValid ? "btn btn-coral btn-block" : "btn btn-disabled btn-block"}>
                ❤️ {isValid ? `${yen(selected)} を応援する` : "金額を選んでください"}
              </button>
            </>
          ) : (
            <>
              <div style={{ background: "var(--cream)", borderRadius: "var(--radius-md)", padding: "13px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--text-sub)" }}>応援金額</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: "var(--coral)" }}>{yen(selected)}</span>
              </div>
              <Elements stripe={stripePromise}>
                <CheckoutForm amount={Number(selected)} creatorId={id} creatorName={c.name} onSuccess={handleSuccess} />
              </Elements>
              <button onClick={() => setShowCheckout(false)} className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
                ← 金額を変更する
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="page-content text-center" style={{ paddingTop: 56 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--coral-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 28 }}>❤️</div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>応援が届きました</p>
          <p className="text-sub" style={{ fontSize: "13.5px", margin: "0 0 22px" }}>
            {yen(selected)} を {c.name}さんに応援しました
          </p>
          <p className="text-faint" style={{ fontSize: "12.5px", margin: "0 0 26px", lineHeight: 1.8 }}>
            ランキングに反映されます。<br />金額は本人にのみ通知され、他のユーザーには公開されません。
          </p>
          <Link className="btn btn-ghost btn-block" href={`/profile/${id}`}>プロフィールに戻る</Link>
        </div>
      )}
    </div>
  );
}