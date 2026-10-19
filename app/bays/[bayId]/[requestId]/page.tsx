import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { RequestPanel } from "@/components/RequestPanel";
import { requestFor, staffDesk } from "@/lib/accounts";
import { emptyStaffFrame, staffFrame } from "@/lib/desk-frame";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request",
  robots: { index: false, follow: false },
};

export default async function StaffRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ bayId: string; requestId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "staff") redirect("/bay");
  const { bayId, requestId } = await params;
  const query = await searchParams;
  const [request, desk] = await Promise.all([requestFor(user, requestId).catch(() => null), staffDesk().catch(() => null)]);
  if (!request || request.bayId !== bayId) redirect(`/bays/${bayId}`);
  const frame = desk ? staffFrame(desk) : emptyStaffFrame;

  const notice = query.error === "note" ? "A note needs a few words." : query.error === "delivery" ? "Delivery needs one finished-video link." : undefined;

  return (
    <BayShell title={request.title} counts={frame.counts} nav={frame.nav}>
      <RequestPanel request={request} mode="staff" notice={notice} />
    </BayShell>
  );
}
