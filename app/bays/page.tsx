import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayShell } from "@/components/BayShell";
import { staffBayList } from "@/lib/accounts";
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
  let bays;
  try {
    bays = await staffBayList();
  } catch {
    return (
      <BayShell kicker="Kinocut" title="All bays" lede="The bay could not be reached.">
        <article className="rounded-panel bg-white p-8 text-ink shadow-card">
          <p className="type-body text-ink-600">Check the database connection, then open this page again.</p>
        </article>
      </BayShell>
    );
  }

  return (
    <BayShell kicker="Kinocut" title="All bays" lede="Open a bay to start the next request or mark the active cut delivered.">
      {bays.length === 0 ? (
        <article className="rounded-panel bg-white p-8 text-ink shadow-card">
          <p className="type-body text-ink-600">No client bays yet.</p>
        </article>
      ) : (
        bays.map((bay) => (
          <a key={bay.id} href={`/bays/${bay.id}`} className="rounded-panel bg-white p-6 text-ink shadow-card">
            <p className="type-micro text-blue-700">{bay.planName}</p>
            <h2 className="type-sub mt-2">{bay.clientName}</h2>
            <p className="type-body mt-2 text-ink-600">{bay.email}</p>
            <p className="type-body mt-2 text-ink-600">
              {bay.price} · {bay.activeTitle ? `On the bench: ${bay.activeTitle}` : "Nothing on the bench"}
            </p>
          </a>
        ))
      )}
    </BayShell>
  );
}
