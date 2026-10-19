import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { RequestPanel } from "@/components/RequestPanel";
import { baysFor, requestFor } from "@/lib/accounts";
import { clientFrame } from "@/lib/desk-frame";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request",
  robots: { index: false, follow: false },
};

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "staff") redirect("/bays");
  const { requestId } = await params;
  const query = await searchParams;
  const [request, bays] = await Promise.all([requestFor(user, requestId).catch(() => null), baysFor(user).catch(() => [])]);
  if (!request) redirect("/bay");
  const frame = clientFrame(bays);

  return (
    <BayShell title={request.title} counts={frame.counts} nav={frame.nav}>
      <RequestPanel request={request} mode="client" notice={query.error === "note" ? "A note needs a few words." : undefined} />
    </BayShell>
  );
}
