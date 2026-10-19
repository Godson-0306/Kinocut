import { logout } from "@/lib/auth-actions";
import type { DeskCount, DeskLink } from "@/lib/desk-frame";
import { DeskNav } from "./DeskNav";
import { Logo } from "./Logo";

export function BayShell({
  title,
  lede,
  counts,
  nav,
  children,
}: {
  title: string;
  lede?: string;
  counts: DeskCount[];
  nav: DeskLink[];
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="min-h-[100svh] bg-white text-ink md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-ink/10 md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:px-4 md:py-6">
        <Logo tone="dark" />
        <div className="mt-8 min-h-0 flex-1 overflow-y-auto">
          <DeskNav links={nav} />
        </div>
        <form action={logout} className="pt-6">
          <button type="submit" className="type-micro text-blue-700">
            Sign out
          </button>
        </form>
      </aside>
      <div className="px-5 py-6 md:px-8 md:py-8">
        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <Logo tone="dark" />
          <form action={logout}>
            <button type="submit" className="type-micro text-blue-700">
              Sign out
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {counts.map((count) => (
            <div key={count.label} className="rounded-card border border-ink/10 px-4 py-3">
              <p className="type-micro text-blue-700">{count.label}</p>
              <p className="mt-1 text-2xl">{count.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 md:hidden">
          <DeskNav links={nav} row />
        </div>
        <h1 className="type-sub mt-6">{title}</h1>
        {lede ? <p className="type-body mt-3 text-ink-600">{lede}</p> : null}
        <div className="mt-8 grid gap-4">{children}</div>
      </div>
    </main>
  );
}
