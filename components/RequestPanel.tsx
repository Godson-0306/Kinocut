import { addNote, approveRequest } from "@/lib/bay-actions";
import type { RequestDetail, RequestStatus } from "@/lib/accounts";
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
  const back = mode === "staff" ? `/bays/${request.bayId}` : "/bay";

  return (
    <article className="rounded-panel bg-white p-6 text-ink shadow-card md:p-8">
      <a className="type-micro text-blue-700" href={back}>
        Back to the queue
      </a>
      <h2 className="type-sub mt-3">{request.title}</h2>
      <p className="type-micro mt-2 text-blue-700">{statusLabel[request.status]}</p>
      {request.brief ? <p className="type-body mt-4 text-ink-600">{request.brief}</p> : null}
      {request.links.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {request.links.map((link) => (
            <li key={link}>
              <a className="text-blue-700 underline" href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {notice ? <p className="type-body mt-4 text-ink-600">{notice}</p> : null}
      {mode === "client" && request.status === "delivered" ? (
        <form action={approveRequest} className="mt-6">
          <input type="hidden" name="id" value={request.id} />
          <MagneticButton type="submit">Approve this cut</MagneticButton>
        </form>
      ) : null}
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
