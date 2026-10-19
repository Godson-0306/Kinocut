import { formatNaira, formatPrice, site } from "@/content/site";
import { planById, type VerifiedCharge } from "@/lib/billing";

const RESEND = "https://api.resend.com/emails";

async function postEmail(key: string, from: string, to: string, subject: string, text: string) {
  try {
    const response = await fetch(RESEND, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Resend rejected a payment email", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Payment email failed", error instanceof Error ? error.message : "unknown");
    return false;
  }
}

export async function sendCheckoutAttemptEmail(input: {
  name: string;
  email: string;
  plan: VerifiedCharge["plan"];
  currency: VerifiedCharge["currency"];
  amount: number;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.error("Payment email is not configured");
    return false;
  }
  const plan = planById(input.plan);
  const price = input.currency === "NGN" ? formatNaira(input.amount) : formatPrice(input.amount);
  return postEmail(
    key,
    from,
    site.email,
    `Checkout started — ${plan.name} — ${input.email}`,
    [
      `${input.name} started checkout for ${plan.name}. The payment is not finished.`,
      "",
      `Email: ${input.email}`,
      `Plan: ${plan.name}`,
      `Amount: ${price} ${site.pricing.cadence}`,
    ].join("\n"),
  );
}

export async function sendPaymentEmails(charge: VerifiedCharge, transactionId: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.error("Payment email is not configured");
    return false;
  }

  const plan = planById(charge.plan);
  const price = charge.currency === "NGN" ? formatNaira(charge.amount) : formatPrice(charge.amount);
  const amount = `${price} ${site.pricing.cadence}`;
  const passwordLink = /^\d+$/.test(transactionId)
    ? `${site.url}/checkout/return?transaction_id=${encodeURIComponent(transactionId)}`
    : `${site.url}/login`;

  const client = postEmail(
    key,
    from,
    charge.email,
    "Your Kinocut bay is open",
    [`Your ${plan.name} subscription is active.`, "", `${plan.name} is ${amount}.`, "", "Set your password and open the bay:", passwordLink, "", "Kinocut"].join("\n"),
  );
  const admin = postEmail(
    key,
    from,
    site.email,
    `New Kinocut subscription — ${plan.name} — ${charge.email}`,
    [`${charge.name || charge.email} started a ${plan.name} subscription.`, "", `Email: ${charge.email}`, `Plan: ${plan.name}`, `Amount: ${amount}`, `Reference: ${charge.txRef}`].join("\n"),
  );
  const [clientOk, adminOk] = await Promise.all([client, admin]);
  return clientOk && adminOk;
}
