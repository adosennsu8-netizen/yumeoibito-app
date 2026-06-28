import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { creatorId, creatorName, userEmail, userName } = await req.json();
    

    // 顧客作成
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: { creatorId, creatorName },
    });

    // 500円/月のPriceを都度作成（本番ではPrice IDを固定推奨）
    const price = await stripe.prices.create({
      unit_amount: 500,
      currency: "jpy",
      recurring: { interval: "month" },
      product_data: { name: `VIP - ${creatorName}` },
    });

    // Checkout Session作成
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vip/${creatorId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/vip/${creatorId}?cancel=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}