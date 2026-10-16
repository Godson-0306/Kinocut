export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const currency = country === "NG" ? "NGN" : "USD";
  return Response.json({ currency }, { headers: { "Cache-Control": "private, no-store" } });
}
