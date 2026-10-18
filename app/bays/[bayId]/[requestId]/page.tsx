import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { RequestPanel } from "@/components/RequestPanel";
import { requestFor } from "@/lib/accounts";
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
  const request = await requestFor(user, requestId).catch(() => null);
  if (!request || request.bayId !== bayId) redirect(`/bays/${bayId}`);

  const notice = query.error === "note" ? "A note needs a few words." : query.error === "delivery" ? "Delivery needs one finished-video link." : undefined;

  return (
    <BayShell kicker="Request" title={request.title} wide>
      <RequestPanel request={request} mode="staff" notice={notice} />
    </BayShell>
  );
}
