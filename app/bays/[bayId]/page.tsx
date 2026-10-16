import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayBoard } from "@/components/BayBoard";
import { BayShell } from "@/components/BayShell";
import { bayFor } from "@/lib/accounts";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client bay",
  robots: { index: false, follow: false },
};

export default async function StaffBayPage({ params }: { params: Promise<{ bayId: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "staff") redirect("/bay");
  const { bayId } = await params;
  const bay = await bayFor(user, bayId).catch(() => null);
  if (!bay) redirect("/bays");

  return (
    <BayShell kicker="Client bay" title={bay.planName}>
      <BayBoard bay={bay} mode="staff" />
    </BayShell>
  );
}
