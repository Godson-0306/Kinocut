export function LegalDocument({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="bg-surface px-5 pb-24 pt-36 text-ink">
      <article className="mx-auto max-w-3xl">
        <h1 className="type-display-sm">{title}</h1>
        {lede ? <p className="type-body measure mt-6 text-ink-600">{lede}</p> : null}
        <div className="mt-10 space-y-8 text-ink-600">{children}</div>
      </article>
    </main>
  );
}
