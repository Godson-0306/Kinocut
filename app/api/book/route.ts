import { cleanBooking, createIntroBooking } from "@/lib/cal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Parameters<typeof cleanBooking>[0];
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const booking = cleanBooking(body);
  if (!booking) return Response.json({ error: "invalid" }, { status: 400 });

  const result = await createIntroBooking(booking);
  if (!result.ok) {
    const status = result.reason === "invalid" ? 400 : result.reason === "unavailable" ? 409 : 502;
    return Response.json({ error: result.reason }, { status, headers: { "Cache-Control": "private, no-store" } });
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
}
