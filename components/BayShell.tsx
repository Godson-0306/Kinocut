import { logout } from "@/lib/auth-actions";

export function BayShell({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="relative min-h-[100svh] overflow-hidden bg-ink px-5 py-32 text-white">
      <div className="bg-aurora pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />
      <div className="relative mx-auto w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <p className="type-micro text-blue-300">{kicker}</p>
          <form action={logout}>
            <button type="submit" className="type-micro text-blue-300" data-cursor="hover">
              Sign out
            </button>
          </form>
        </div>
        <h1 className="type-sub mt-3">{title}</h1>
        {lede ? <p className="type-body mt-3 text-ink-300">{lede}</p> : null}
        <div className="mt-8 grid gap-4">{children}</div>
      </div>
    </main>
  );
}
