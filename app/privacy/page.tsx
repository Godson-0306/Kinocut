import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Placeholder privacy notes for the Kinocut marketing site.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy"
      lede="Placeholder privacy notes for this marketing site. Update them when you add analytics, accounts, or payment."
    >
      <section>
        <h2 className="type-sub text-ink">What this site stores</h2>
        <p className="type-body mt-3">
          The intro slate is remembered for the session in sessionStorage so it does not replay on every click. The site does not set advertising cookies and does not run a tracker in this build.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Email and booking</h2>
        <p className="type-body mt-3">
          If you email {site.email}, we receive whatever you send. The calendar buttons open a scheduling link. That service has its own privacy policy, and you should name it here when you connect it.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Footage</h2>
        <p className="type-body mt-3">
          Client footage is not uploaded on this marketing page. When the bay is live, say where files live, who can open them, and how long you keep them.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Contact</h2>
        <p className="type-body mt-3">
          Privacy questions go to <a className="text-blue-700 underline" href={site.links.email}>{site.email}</a>.
        </p>
      </section>
    </LegalDocument>
  );
}
