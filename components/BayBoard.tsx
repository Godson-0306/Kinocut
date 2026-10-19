import { site } from "@/content/site";
import { createRequest, markDelivered, moveRequest, removeBay, startNext } from "@/lib/bay-actions";
import type { BayView, RequestStatus } from "@/lib/accounts";
import { BrandKitForm } from "./BrandKitForm";
import { MagneticButton } from "./MagneticButton";

const statusLabel: Record<RequestStatus, string> = {
  queued: "In the queue",
  active: "On the bench",
  delivered: "Ready for approval",
  approved: "Approved",
};

export function BayBoard({
  bay,
  mode,
  notice,
  editing,
}: {
  bay: BayView;
  mode: "client" | "staff";
  notice?: string;
  editing?: boolean;
}) {
  const active = bay.requests.some((request) => request.status === "active");
  const queued = bay.requests.some((request) => request.status === "queued");
  const kit = bay.brandKit;

  return (
    <article className="rounded-panel bg-white p-6 text-ink shadow-card md:p-8">
      <p className="type-micro text-blue-700">{bay.planName}</p>
      <p className="type-sub mt-3">
        {bay.price}
        <span className="text-base text-ink-600">{site.pricing.cadence}</span>
      </p>
      {notice ? <p className="type-body mt-4 text-ink-600">{notice}</p> : null}
      {mode === "client" && !kit.complete ? (
        <div className="mt-8">
          <h2 className="type-sub">Brand kit</h2>
          <div className="mt-4">
            <BrandKitForm bayId={bay.id} kit={kit} />
          </div>
        </div>
      ) : null}
      {kit.complete && mode === "client" && editing ? (
        <div className="mt-8">
          <h2 className="type-sub">Brand kit</h2>
          <div className="mt-4">
            <BrandKitForm bayId={bay.id} kit={kit} />
          </div>
        </div>
      ) : null}
      {kit.complete && !(mode === "client" && editing) ? (
        <div className="mt-6 rounded-card border border-ink/10 px-4 py-3">
          <p className="type-micro text-blue-700">Brand kit</p>
          <p className="type-body mt-2 text-ink-600">{kit.colors}</p>
          <p className="type-body mt-1 text-ink-600">{kit.captionStyle}</p>
          <a className="mt-2 block break-all text-blue-700 underline" href={kit.logo} target="_blank" rel="noreferrer">
            {kit.logo}
          </a>
          {mode === "client" ? (
            <a className="type-micro mt-3 inline-block text-blue-700" href={`/bay?kit=${bay.id}`}>
              Edit the kit
            </a>
          ) : null}
        </div>
      ) : null}
      {mode === "client" && !kit.complete && bay.requests.length === 0 ? null : (
        <ul className="mt-6 grid gap-3">
          {bay.requests.length === 0 ? <li className="type-body text-ink-600">The queue is empty.</li> : null}
          {bay.requests.map((request, index) => (
            <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-ink/10 px-4 py-3">
              <div>
                <a className="font-medium text-ink" href={mode === "staff" ? `/bays/${bay.id}/${request.id}` : `/bay/${request.id}`}>
                  {request.title}
                </a>
                <p className="type-micro mt-1 text-blue-700">{statusLabel[request.status]}</p>
              </div>
              {mode === "client" && request.status === "queued" ? (
                <div className="flex gap-3">
                  <form action={moveRequest}>
                    <input type="hidden" name="id" value={request.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" className="type-micro text-blue-700" data-cursor="hover" disabled={index === 0}>
                      Move up
                    </button>
                  </form>
                  <form action={moveRequest}>
                    <input type="hidden" name="id" value={request.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button type="submit" className="type-micro text-blue-700" data-cursor="hover">
                      Move down
                    </button>
                  </form>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {mode === "staff" ? (
        <div className="mt-6 grid gap-4">
          {queued && !active ? (
            <form action={startNext}>
              <input type="hidden" name="bayId" value={bay.id} />
              <MagneticButton type="submit">Start next</MagneticButton>
            </form>
          ) : null}
          {active ? (
            <form action={markDelivered} className="grid gap-4">
              <input type="hidden" name="bayId" value={bay.id} />
              <label className="block">
                <span className="type-micro text-blue-700">Finished video link</span>
                <input className="field mt-2" type="url" name="delivery" required placeholder="https://" />
              </label>
              <MagneticButton type="submit">Mark delivered</MagneticButton>
            </form>
          ) : null}
          <form action={removeBay} className="mt-2 grid gap-3 border-t border-ink/10 pt-6">
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
      ) : null}
      {mode === "client" && kit.complete ? (
        <form action={createRequest} className="mt-8 grid gap-4" id="new-request">
          <input type="hidden" name="bayId" value={bay.id} />
          <label className="block">
            <span className="type-micro text-blue-700">New request</span>
            <input className="field mt-2" name="title" required maxLength={120} placeholder="Title of the video" />
          </label>
          <label className="block">
            <span className="type-micro text-blue-700">Brief</span>
            <textarea className="field mt-2 min-h-28" name="brief" maxLength={2000} placeholder="What the video must do" />
          </label>
          <label className="block">
            <span className="type-micro text-blue-700">Footage links</span>
            <textarea className="field mt-2 min-h-24" name="links" placeholder="One Drive, Dropbox, Frame.io, or WeTransfer link per line" />
          </label>
          <MagneticButton type="submit">Add to the queue</MagneticButton>
        </form>
      ) : null}
    </article>
  );
}
