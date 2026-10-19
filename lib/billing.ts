import { randomBytes, timingSafeEqual } from "node:crypto";
import { site } from "@/content/site";

const FLUTTERWAVE = "https://api.flutterwave.com/v3";
const RATE_URL = "https://open.er-api.com/v6/latest/USD";

export type PlanId = (typeof site.pricing.plans)[number]["id"];
export type ChargeCurrency = "NGN" | "USD";

const PLAN_IDS = new Set<string>(site.pricing.plans.map((plan) => plan.id));

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && PLAN_IDS.has(value);
}

export function planById(id: PlanId) {
  const plan = site.pricing.plans.find((item) => item.id === id);
  if (!plan) throw new Error("Unknown plan");
  return plan;
}

export function planName(id: string) {
  return site.pricing.plans.find((item) => item.id === id)?.name ?? "Retired plan";
}

export function chargeCurrency(country: string | null): ChargeCurrency {
  return country === "NG" ? "NGN" : "USD";
}

export async function nairaPerDollar(): Promise<number | null> {
  try {
    const response = await fetch(RATE_URL, { cache: "no-store" });
    if (!response.ok) return null;
    const data = (await response.json()) as { rates?: { NGN?: number } };
    const next = data.rates?.NGN;
    if (typeof next !== "number" || next <= 0) return null;
    return Math.round(next);
  } catch {
    return null;
  }
}

type FlutterwaveEnvelope<T> = {
  status?: string;
  message?: string;
  data?: T;
};

function flutterwaveConfig() {
  const publicKey = process.env.FLW_PUBLIC_KEY;
  const secret = process.env.FLW_SECRET_KEY;
  const encryption = process.env.FLW_ENCRYPTION_KEY;
  const hash = process.env.FLW_SECRET_HASH;
  if (!publicKey || !secret || !encryption || !hash) return null;
  return { publicKey, secret, encryption, hash };
}

async function flutterwave<T>(path: string, init?: RequestInit): Promise<T> {
  const config = flutterwaveConfig();
  if (!config) throw new Error("Flutterwave is not configured");
  let response: Response;
  try {
    response = await fetch(`${FLUTTERWAVE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.secret}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error("Flutterwave is unavailable");
  }
  const body = (await response.json().catch(() => null)) as FlutterwaveEnvelope<T> | null;
  if (!response.ok || body?.status !== "success" || body.data == null) {
    const message = typeof body?.message === "string" ? body.message : "Flutterwave request failed";
    const error = new Error(message);
    if (response.status >= 500) error.name = "Unavailable";
    throw error;
  }
  return body.data;
}

export async function startSubscription(input: {
  plan: PlanId;
  name: string;
  email: string;
  currency: ChargeCurrency;
  amount: number;
  redirectUrl: string;
}) {
  const plan = planById(input.plan);
  const txRef = `kc_${plan.id}_${input.currency}_${input.amount}_${randomBytes(8).toString("hex")}`;
  const created = await flutterwave<{ id: number }>("/payment-plans", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      name: `Kinocut ${plan.name}`,
      interval: "monthly",
      currency: input.currency,
    }),
  });
  const payment = await flutterwave<{ link: string }>("/payments", {
    method: "POST",
    body: JSON.stringify({
      tx_ref: txRef,
      amount: input.amount,
      currency: input.currency,
      redirect_url: input.redirectUrl,
      payment_plan: created.id,
      payment_options: "card",
      customer: {
        email: input.email,
        name: input.name,
      },
      customizations: {
        title: "Kinocut",
        description: `${plan.name} monthly`,
        logo: `${site.url}/logo.png`,
      },
      meta: { plan: plan.id },
    }),
  });
  if (!payment.link) throw new Error("Flutterwave did not return a checkout link");
  return { link: payment.link, txRef };
}

export type VerifiedCharge = {
  plan: PlanId;
  currency: ChargeCurrency;
  amount: number;
  email: string;
  name: string;
  txRef: string;
};

const TX_REF = /^kc_(spark|momentum|studio)_(USD|NGN)_(\d+)_([a-z0-9]+)$/;

export async function verifyTransaction(transactionId: string): Promise<VerifiedCharge | null> {
  if (!/^\d+$/.test(transactionId)) return null;
  let data: {
    status?: string;
    tx_ref?: string;
    currency?: string;
    amount?: number | string;
    customer?: { email?: string; name?: string };
  };
  try {
    data = await flutterwave(`/transactions/${transactionId}/verify`);
  } catch (error) {
    console.error("Flutterwave verify failed", error instanceof Error ? error.message : "unknown");
    if (error instanceof Error && (error.name === "Unavailable" || error.message === "Flutterwave is unavailable")) throw error;
    return null;
  }
  if (data.status !== "successful" || !data.tx_ref) return null;
  const match = TX_REF.exec(data.tx_ref);
  if (!match) return null;
  const plan = match[1] as PlanId;
  const currency = match[2] as ChargeCurrency;
  const amount = Number(match[3]);
  if (String(data.currency).toUpperCase() !== currency) return null;
  const paid = Number(data.amount);
  if (!Number.isFinite(paid) || Math.abs(paid - amount) > 0.001) return null;
  return {
    plan,
    currency,
    amount,
    email: (data.customer?.email ?? "").trim().toLowerCase(),
    name: (data.customer?.name ?? "").trim(),
    txRef: data.tx_ref,
  };
}

export function webhookHashMatches(header: string | null) {
  const expected = flutterwaveConfig()?.hash;
  if (!expected || !header) return false;
  const left = Buffer.from(header);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
