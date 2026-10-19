"use client";

import { Rewind } from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { isDeskPath } from "@/lib/desk-frame";
import { scrollTo } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { OPEN_PREFERENCES_EVENT } from "./CookieConsent";
import { Marquee } from "./Marquee";

export function Footer() {
  const pathname = usePathname();
  if (isDeskPath(pathname)) return null;

  return (
    <footer className="overflow-hidden bg-ink-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="type-micro text-blue-300">Kinocut</p>
          <p className="mt-3 max-w-sm text-ink-300">{site.location}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <a href={site.links.terms} className="text-blue-300">
              Terms
            </a>
            <a href={site.links.privacy} className="text-blue-300">
              Privacy
            </a>
            <button
              type="button"
              className="text-blue-300"
              onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
            >
              Cookies
            </button>
            <a href={site.links.email} className="text-blue-300">
              {site.email}
            </a>
          </div>
        </div>
        <button type="button" className="btn btn-inverted" onClick={() => scrollTo(0)} aria-label="Rewind to top">
          <Rewind className="h-4 w-4" aria-hidden="true" />
          Rewind
        </button>
      </div>
      <p className="outline-word select-none px-5">Kinocut</p>
      <div className="border-t border-white/10 py-4">
        <Marquee label="Studio notes">
          {site.footer.stickers.map((sticker) => (
            <span
              key={sticker}
              className={cn(
                "type-micro rounded-pill px-4 py-2",
                sticker === "Now rolling" ? "bg-amber text-ink" : "border border-white/15 text-white",
              )}
            >
              {sticker}
            </span>
          ))}
        </Marquee>
      </div>
      <p className="px-5 pb-6 text-center text-sm text-ink-300">© {new Date().getFullYear()} Kinocut. A G-Tech Industries studio.</p>
    </footer>
  );
}
