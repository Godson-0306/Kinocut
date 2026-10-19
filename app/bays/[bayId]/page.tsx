import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayBoard } from "@/components/BayBoard";
import { BayShell } from "@/components/BayShell";
import { bayFor, staffDesk } from "@/lib/accounts";
import { emptyStaffFrame, staffFrame } from "@/lib/desk-frame";
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
  const frame = desk ? staffFrame(desk) : emptyStaffFrame;

  return (
    <BayShell title={bay.clientName} counts={frame.counts} nav={frame.nav}>
      <BayBoard bay={bay} mode="staff" notice={query.error === "delivery" ? "Delivery needs one finished-video link." : undefined} />
    </BayShell>
  );
}
