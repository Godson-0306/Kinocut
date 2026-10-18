import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BayBoard } from "@/components/BayBoard";
import { BayShell } from "@/components/BayShell";
import { baysFor } from "@/lib/accounts";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your bay",
  description: "The Kinocut queue for your subscription.",
  robots: { index: false, follow: false },
};

const notices: Record<string, string> = {
  title: "A request needs a title.",
  links: "Each footage link needs to be a full http or https address.",
  bay: "That bay could not take a new request.",
  kit: "The brand kit needs every field. Logo, music, and references have to be full links.",
};

export default async function BayPage({ searchParams }: { searchParams: Promise<{ error?: string; kit?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role === "staff") redirect("/bays");
  const params = await searchParams;
  let bays;
  try {
    bays = await baysFor(user);
  } catch {
    return (
      <BayShell kicker="Your bay" title={user.name} lede="The bay could not be reached.">
        <article className="rounded-panel bg-white p-8 text-ink shadow-card">
          <p className="type-body text-ink-600">Check the database connection, then open this page again.</p>
        </article>
      </BayShell>
    );
  }

  const needsKit = bays.some((bay) => !bay.brandKit.complete);

  return (
    <BayShell
      kicker="Your bay"
      title={user.name}
      lede={
        needsKit
          ? "Save the brand kit before the first request. Fonts, colors, logo, captions, music, references, hook, and the CTA."
          : "One request is on the bench at a time. The rest wait in the queue until you approve."
      }
    >
      {bays.length === 0 ? (
        <article className="rounded-panel bg-white p-8 text-ink shadow-card">
          <p className="type-body text-ink-600">Your bay opens after a confirmed subscription.</p>
        </article>
      ) : (
        bays.map((bay) => <BayBoard key={bay.id} bay={bay} mode="client" editing={params.kit === bay.id} notice={notices[params.error ?? ""]} />)
      )}
    </BayShell>
  );
}
