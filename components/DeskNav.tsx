"use client";

import { usePathname } from "next/navigation";
import type { DeskLink } from "@/lib/desk-frame";
import { cn } from "@/lib/utils";

function selected(pathname: string, href: string) {
  if (href === "/bay" || href === "/bays") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DeskNav({ links, row }: { links: DeskLink[]; row?: boolean }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Desk" className={row ? "flex gap-2 overflow-x-auto" : "grid gap-1"}>
      {links.map((link) => {
        const on = selected(pathname, link.href);
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={on ? "page" : undefined}
            title={link.label}
            className={cn(
              "rounded-card px-3 py-2 text-sm",
              row ? "shrink-0" : "min-w-0 truncate",
              on ? "bg-ink text-white" : "text-ink hover:bg-ink/5",
            )}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
