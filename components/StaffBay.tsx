import { markDelivered, removeBay, startNext } from "@/lib/bay-actions";
import type { BayView, RequestSummary } from "@/lib/accounts";
import { BrandKitCard } from "./BrandKitForm";
import { MagneticButton } from "./MagneticButton";

function shortBrief(brief: string) {
  const text = brief.trim().replace(/\s+/g, " ");
  if (!text) return "No brief yet.";
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

function footage(count: number) {
  if (count === 0) return "No footage links";
  return count === 1 ? "1 footage link" : `${count} footage links`;
}

function RequestRow({ bayId, request }: { bayId: string; request: RequestSummary }) {
  return (
    <li className="rounded-card border border-ink/10 px-4 py-3">
      <a className="block" href={`/bays/${bayId}/${request.id}`}>
        <p className="font-medium">{request.title}</p>
        <p className="type-body mt-1 text-ink-600">
          {request.age} · {footage(request.linkCount)}
        </p>
        <p className="type-body mt-1 text-ink-600">{shortBrief(request.brief)}</p>
      </a>
      {request.deliveryLink ? (
        <a className="mt-2 block break-all text-sm text-blue-700 underline" href={request.deliveryLink} target="_blank" rel="noreferrer">
          {request.deliveryLink}
        </a>
      ) : null}
    </li>
  );
}

export function StaffBay({ bay, notice }: { bay: BayView; notice?: string }) {
  const active = bay.requests.filter((request) => request.status === "active");
  const queued = bay.requests.filter((request) => request.status === "queued").sort((a, b) => a.position - b.position);
  const delivered = bay.requests.filter((request) => request.status === "delivered");

  return (
    <div className="grid gap-4">
      {notice ? <p className="text-sm text-red-600">{notice}</p> : null}
      <section className="rounded-panel border border-ink/10 bg-white p-6 text-ink shadow-card md:p-8">
        <h2 className="type-sub">On the bench</h2>
        {active.length === 0 ? <p className="type-body mt-4 text-ink-600">Nothing is on the bench.</p> : null}
        <ul className="mt-4 grid gap-3">
          {active.map((request) => (
            <RequestRow key={request.id} bayId={bay.id} request={request} />
          ))}
        </ul>
        {queued.length > 0 && active.length === 0 ? (
          <form action={startNext} className="mt-6">
            <input type="hidden" name="bayId" value={bay.id} />
            <MagneticButton type="submit">Start next</MagneticButton>
          </form>
        ) : null}
        {active.length > 0 ? (
          <form action={markDelivered} className="mt-6 grid gap-4">
            <input type="hidden" name="bayId" value={bay.id} />
            <label className="block">
              <span className="type-micro text-blue-700">Finished video link</span>
              <input className="field mt-2" type="url" name="delivery" required placeholder="https://" />
            </label>
            <MagneticButton type="submit">Mark delivered</MagneticButton>
          </form>
        ) : null}
      </section>
      <section className="rounded-panel border border-ink/10 bg-white p-6 text-ink shadow-card md:p-8">
        <h2 className="type-sub">Waiting to start</h2>
        {queued.length === 0 ? <p className="type-body mt-4 text-ink-600">Nothing is waiting to start.</p> : null}
        <ul className="mt-4 grid gap-3">
          {queued.map((request) => (
            <RequestRow key={request.id} bayId={bay.id} request={request} />
          ))}
        </ul>
      </section>
      <section className="rounded-panel border border-ink/10 bg-white p-6 text-ink shadow-card md:p-8">
        <h2 className="type-sub">Waiting on the client</h2>
        {delivered.length === 0 ? <p className="type-body mt-4 text-ink-600">Nothing is waiting on the client.</p> : null}
        <ul className="mt-4 grid gap-3">
          {delivered.map((request) => (
            <RequestRow key={request.id} bayId={bay.id} request={request} />
          ))}
        </ul>
      </section>
      <section className="rounded-panel border border-ink/10 bg-white p-6 text-ink shadow-card md:p-8">
        <h2 className="type-sub">Brand kit</h2>
        {bay.brandKit.complete ? (
          <div className="mt-4">
            <BrandKitCard kit={bay.brandKit} />
          </div>
        ) : (
          <p className="type-body mt-4 text-ink-600">The brand kit is not saved yet.</p>
        )}
      </section>
      <form action={removeBay} className="grid gap-3 rounded-panel border border-ink/10 bg-white p-6 shadow-card md:p-8">
        <input type="hidden" name="bayId" value={bay.id} />
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input className="mt-1" type="checkbox" name="confirm" value="yes" required />
          <span>Remove this bay and its queue. A client with no other bay loses sign-in.</span>
        </label>
        <button type="submit" className="w-fit text-sm font-medium text-red-600">
          Remove bay
        </button>
      </form>
    </div>
  );
}
