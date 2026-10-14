export function LegalDocument({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" className="bg-surface px-5 pb-24 pt-36 text-ink">
      <article className="mx-auto max-w-3xl">
        <p className="type-micro text-blue-700">Kinocut · placeholder</p>
        <h1 className="type-display-sm mt-4">{title}</h1>
        <p className="type-body measure mt-6 text-ink-600">{lede}</p>
        <div className="mt-10 space-y-8 text-ink-600">{children}</div>
      </article>
    </main>
  );
}
