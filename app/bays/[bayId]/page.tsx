import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { StaffBay } from "@/components/StaffBay";
import { bayFor, staffDesk } from "@/lib/accounts";
import { bayFrame, emptyStaffFrame, staffFrame } from "@/lib/desk-frame";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client bay",
  robots: { index: false, follow: false },
};

export default async function StaffBayPage({
  params,
  searchParams,
}: {
  params: Promise<{ bayId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "staff") redirect("/bay");
  const { bayId } = await params;
  const query = await searchParams;
  const [bay, desk] = await Promise.all([bayFor(user, bayId).catch(() => null), staffDesk().catch(() => null)]);
  if (!bay) redirect("/bays");
  const frame = bayFrame(bay, desk ? staffFrame(desk).nav : emptyStaffFrame.nav);

  return (
    <BayShell title={bay.clientName} counts={frame.counts} nav={frame.nav}>
      <StaffBay bay={bay} notice={query.error === "delivery" ? "Delivery needs one finished-video link." : undefined} />
    </BayShell>
  );
}
