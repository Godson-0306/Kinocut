import { chargeCurrency, isPlanId, nairaPerDollar, planById, startSubscription } from "@/lib/billing";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { plan?: unknown; name?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isPlanId(body.plan) || name.length < 1 || name.length > 80 || name.includes("<") || !EMAIL.test(email) || email.length > 120) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const plan = planById(body.plan);
  const currency = chargeCurrency(request.headers.get("x-vercel-ip-country"));
  let amount = plan.price;
  if (currency === "NGN") {
    const rate = await nairaPerDollar();
    if (rate == null) return Response.json({ error: "rate" }, { status: 409 });
    amount = plan.price * rate;
  }

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "http://localhost:3000";

  try {
    const url = await startSubscription({
      plan: plan.id,
      name,
      email,
      currency,
      amount,
      redirectUrl: `${origin}/checkout/return`,
    });
    return Response.json({ url }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Checkout failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "checkout" }, { status: 502 });
  }
}
