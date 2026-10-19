import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { WorkQueue } from "@/components/WorkQueue";
import { staffDesk } from "@/lib/accounts";
import { emptyStaffFrame, staffFrame } from "@/lib/desk-frame";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All bays",
  description: "Kinocut view of every client bay.",
  robots: { index: false, follow: false },
};

export default async function StaffBaysPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "staff") redirect("/bay");
  let desk;
  try {
    desk = await staffDesk();
  } catch {
    return (
      <BayShell title="The desk" lede="The bay could not be reached." counts={emptyStaffFrame.counts} nav={emptyStaffFrame.nav}>
        <article className="rounded-panel border border-ink/10 bg-white p-8 text-ink shadow-card">
          <p className="type-body text-ink-600">Check the database connection, then open this page again.</p>
        </article>
      </BayShell>
    );
  }

  const frame = staffFrame(desk);

  return (
    <BayShell title="The desk" lede="Start what is waiting, finish what is on the bench, and send the cut back as a link." counts={frame.counts} nav={frame.nav}>
      <WorkQueue queue={desk.queue} projects={desk.projects} />
    </BayShell>
  );
}
