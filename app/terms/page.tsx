import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Placeholder terms for the Kinocut edit bay subscription.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of the bay"
      lede="This is placeholder copy so the footer link has a real page. Replace it with counsel-reviewed terms before you take payment."
    >
      <section>
        <h2 className="type-sub text-ink">The service</h2>
        <p className="type-body mt-3">
          Kinocut provides video editing on a monthly subscription. One request is active at a time. You send footage, we return a finished cut, and revisions on that cut are included.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Billing and cancel</h2>
        <p className="type-body mt-3">
          The plan renews monthly until you cancel before the next billing date. The month already paid stays usable until it ends. After the first-week refund window, the current month is not prorated.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Your files</h2>
        <p className="type-body mt-3">
          You own the masters we export for you. You promise you have the right to the footage, music, and brand assets you send. We license stock and commercial music only for the cuts we deliver.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Outside the bay</h2>
        <p className="type-body mt-3">
          Live-action shoots, 3D, feature-length films, and complex VFX are not part of the subscription. We will say so before that kind of work enters the queue.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Contact</h2>
        <p className="type-body mt-3">
          Questions about these terms go to <a className="text-blue-700 underline" href={site.links.email}>{site.email}</a>.
        </p>
      </section>
    </LegalDocument>
  );
}
