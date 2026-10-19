import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Placeholder privacy notes for the Kinocut marketing site.",
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy">
      <section>
        <h2 className="type-sub text-ink">What this site stores</h2>
        <p className="type-body mt-3">
          The intro slate is remembered for the session in sessionStorage so it does not replay on every click. A cookie notice asks before Google Analytics stores cookies to measure visits. Those cookies stay off until you accept. Signing in sets a separate login cookie. The site does not set advertising cookies.
        </p>
      </section>
      <section>
        <h2 className="type-sub text-ink">Email and booking</h2>
        <p className="type-body mt-3">
          If you email {site.email}, we receive whatever you send. Booking a time sends your name, email, and notes to Cal.com, which sends the confirmation. Cal.com has its own privacy policy.
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
