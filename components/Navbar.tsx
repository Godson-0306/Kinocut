"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { onIntroDone } from "@/lib/intro";
import { startScroll, stopScroll, subscribeScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#work", label: "Showreel" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#proof", label: "Proof" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const interior = pathname !== "/";
  const [booted, setBooted] = useState(interior);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(interior);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (interior) {
      setBooted(true);
      setSolid(true);
      return;
    }
    setSolid(false);
    return onIntroDone(() => setBooted(true));
  }, [interior]);

  useEffect(() => {
    return subscribeScroll(({ y, direction }) => {
      const nextSolid = interior || y > window.innerHeight * 0.72;
      const nextHidden = !openRef.current && y > 80 && direction > 0;
      setSolid((current) => (current === nextSolid ? current : nextSolid));
      setHidden((current) => (current === nextHidden ? current : nextHidden));
    });
  }, [interior]);

  useEffect(() => {
    openRef.current = open;
    if (open) {
      stopScroll();
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      startScroll();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-1/2 top-4 z-[70] w-[min(980px,calc(100%-1.25rem))]"
        initial={false}
        animate={{
          x: "-50%",
          y: !booted ? -28 : hidden ? -120 : 0,
          opacity: booted ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease }}
      >
        <nav
          className={cn(
            "nav-glass flex items-center justify-between gap-3 rounded-pill px-2 py-2",
            solid ? "is-solid text-ink" : "text-white",
          )}
          aria-label="Primary"
        >
          <Logo tone={solid ? "dark" : "light"} className="pl-1.5" />
          <div className="hidden items-center gap-1 md:flex">
            <MagneticButton href={site.links.login} variant="ghost" className={cn("px-3", solid && "on-light")}>
              Login
            </MagneticButton>
            <MagneticButton href={site.links.pricing} variant="ghost" className={cn("px-3", solid && "on-light")}>
              See pricing
            </MagneticButton>
            <MagneticButton href={site.links.book} shine>
              Book a call
            </MagneticButton>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X /> : <Menu />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[65] flex flex-col bg-ink px-6 pb-10 pt-28 text-white md:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.4rem) 2.6rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.4rem) 2.6rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.4rem) 2.6rem)" }}
            transition={{ duration: 0.7, ease }}
          >
            <button ref={closeRef} type="button" className="sr-only" onClick={() => setOpen(false)}>
              Close menu
            </button>
            <motion.ul
              className="flex flex-col gap-2"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
                closed: {},
              }}
            >
              {links.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: 24, opacity: 0 },
                  }}
                  transition={{ duration: 0.5, ease }}
                >
                  <a href={link.href} className="type-display-sm block py-1" onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-auto flex flex-col gap-3">
              <MagneticButton href={site.links.login} variant="ghost" className="w-full" onClick={() => setOpen(false)}>
                Login
              </MagneticButton>
              <MagneticButton href={site.links.book} className="w-full" onClick={() => setOpen(false)}>
                Book a call
              </MagneticButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
