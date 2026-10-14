import { site } from "@/content/site";
import { FilmHoles } from "./FilmHoles";
import { Marquee } from "./Marquee";

export function LogoStrip() {
  return (
    <section className="bg-surface text-ink" aria-label={site.logos.label}>
      <FilmHoles />
      <div className="px-5 py-8 md:py-10">
        <p className="type-micro mb-6 text-center text-ink-600">{site.logos.label}</p>
        <Marquee label="Client wordmarks">
          {site.logos.brands.map((brand) =>
            "href" in brand ? (
              <a
                key={brand.name}
                href={brand.href}
                target="_blank"
                rel="noreferrer"
                className="px-4 text-2xl tracking-[-0.04em] text-ink/80 transition-colors duration-base hover:text-ink"
                style={{ fontWeight: 680 }}
              >
                {brand.name}
              </a>
            ) : (
              <span key={brand.name} className="px-4 text-2xl tracking-[-0.04em] text-ink/80" style={{ fontWeight: 680 }}>
                {brand.name}
              </span>
            ),
          )}
        </Marquee>
      </div>
      <FilmHoles />
    </section>
  );
}
