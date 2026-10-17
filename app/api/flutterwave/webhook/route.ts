import { openBayFromCharge } from "@/lib/accounts";
import { verifyTransaction, webhookHashMatches } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!webhookHashMatches(request.headers.get("verif-hash"))) {
    return new Response("invalid", { status: 401 });
  }

  let body: { event?: string; data?: { id?: number | string; status?: string } };
  try {
    body = await request.json();
  } catch {
    return new Response("invalid", { status: 400 });
  }

  if (body.event !== "charge.completed") return new Response("ok");

  const id = body.data?.id;
  if (id == null || body.data?.status !== "successful") return new Response("ok");

  try {
    const charge = await verifyTransaction(String(id));
    if (!charge) return new Response("ok");
    if (charge.email) {
      const opened = await openBayFromCharge(charge, String(id));
      if (!opened?.notified) return new Response("unnotified", { status: 400 });
    }
    console.info("Flutterwave subscription verified", charge.plan, charge.currency);
    return new Response("ok");
  } catch {
    return new Response("unverified", { status: 400 });
  }
}
