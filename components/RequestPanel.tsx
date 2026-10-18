import { addNote, approveRequest, markDelivered, startNext } from "@/lib/bay-actions";
import type { RequestDetail, RequestStatus } from "@/lib/accounts";
import { BrandKitCard } from "./BrandKitForm";
import { MagneticButton } from "./MagneticButton";

const statusLabel: Record<RequestStatus, string> = {
  queued: "In the queue",
  active: "On the bench",
  delivered: "Ready for approval",
  approved: "Approved",
};

export function RequestPanel({
  request,
  mode,
  notice,
}: {
  request: RequestDetail;
  mode: "client" | "staff";
  notice?: string;
}) {
  const back = mode === "staff" ? "/bays" : "/bay";

  return (
    <article className="rounded-panel bg-white p-6 text-ink shadow-card md:p-8">
      <a className="type-micro text-blue-700" href={back}>
        {mode === "staff" ? "Back to the desk" : "Back to your bay"}
      </a>
      <h2 className="type-sub mt-3">{request.title}</h2>
      <p className="type-micro mt-2 text-blue-700">{statusLabel[request.status]}</p>
      {notice ? <p className="type-body mt-4 text-ink-600">{notice}</p> : null}
      <div className={mode === "staff" ? "mt-6 grid gap-8 lg:grid-cols-2" : "mt-6 grid gap-8"}>
        {request.brandKit.complete ? (
          <section>
            <h3 className="type-micro text-blue-700">Brand kit</h3>
            <div className="mt-4">
              <BrandKitCard kit={request.brandKit} />
            </div>
          </section>
        ) : null}
        <section>
          {request.brief ? <p className="type-body text-ink-600">{request.brief}</p> : <p className="type-body text-ink-600">No brief yet.</p>}
          {request.links.length > 0 ? (
            <div className="mt-4">
              <p className="type-micro text-blue-700">Footage</p>
              <ul className="mt-2 grid gap-2">
                {request.links.map((link) => (
                  <li key={link}>
                    <a className="break-all text-blue-700 underline" href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {request.deliveryLink ? (
            <div className="mt-4">
              <p className="type-micro text-blue-700">Finished video</p>
              <a className="mt-2 block break-all text-blue-700 underline" href={request.deliveryLink} target="_blank" rel="noreferrer">
                {request.deliveryLink}
              </a>
            </div>
          ) : null}
          {mode === "staff" && request.canStart ? (
            <form action={startNext} className="mt-6">
              <input type="hidden" name="bayId" value={request.bayId} />
              <input type="hidden" name="requestId" value={request.id} />
              <MagneticButton type="submit">Start this request</MagneticButton>
            </form>
          ) : null}
          {mode === "staff" && request.status === "active" ? (
            <form action={markDelivered} className="mt-6 grid gap-4">
              <input type="hidden" name="bayId" value={request.bayId} />
              <input type="hidden" name="requestId" value={request.id} />
              <label className="block">
                <span className="type-micro text-blue-700">Finished video link</span>
                <input className="field mt-2" type="url" name="delivery" required placeholder="https://" />
              </label>
              <MagneticButton type="submit">Mark delivered</MagneticButton>
            </form>
          ) : null}
          {mode === "client" && request.status === "delivered" ? (
            <form action={approveRequest} className="mt-6">
              <input type="hidden" name="id" value={request.id} />
              <MagneticButton type="submit">Approve this cut</MagneticButton>
            </form>
          ) : null}
        </section>
      </div>
      <div className="mt-8 grid gap-4">
        {request.notes.map((note) => (
          <article key={note.id} className="rounded-card border border-ink/10 px-4 py-3">
            <p className="type-micro text-blue-700">
              {note.author} · {note.at}
            </p>
            <p className="type-body mt-2 text-ink-600">{note.body}</p>
          </article>
        ))}
      </div>
      <form action={addNote} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={request.id} />
        <input type="hidden" name="bayId" value={request.bayId} />
        <label className="block">
          <span className="type-micro text-blue-700">Note</span>
          <textarea className="field mt-2 min-h-24" name="body" required maxLength={2000} placeholder="Timestamps and the change you want" />
        </label>
        <MagneticButton type="submit">Leave a note</MagneticButton>
      </form>
    </article>
  );
}
