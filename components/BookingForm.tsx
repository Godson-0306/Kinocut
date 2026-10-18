"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, X } from "lucide-react";

const field =
  "mt-2 w-full rounded-lg border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/60";

export function BookingForm({
  start,
  when,
  onBack,
}: {
  start: string;
  when: string;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [notes, setNotes] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [booked, setBooked] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start,
          name,
          email,
          about,
          notes,
          guests: guests.map((guest) => guest.trim()).filter(Boolean),
        }),
      });
      if (response.ok) {
        setBooked(true);
        return;
      }
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(
        body?.error === "unavailable"
          ? "That time was just taken. Go back and pick another."
          : "The calendar could not save that. Try again.",
      );
    } catch {
      setError("The calendar could not save that. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (booked) {
    return (
      <div>
        <p className="text-lg font-semibold">You&apos;re booked.</p>
        <p className="mt-2 text-sm text-white/70">{when}. A confirmation is on its way.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <p className="text-sm text-white/60">{when}</p>
      <label className="mt-4 block text-sm font-medium">
        Your name <span aria-hidden="true">*</span>
        <input className={field} name="name" required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Email address <span aria-hidden="true">*</span>
        <input className={field} type="email" name="email" required maxLength={120} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-medium">
        What is this meeting about? <span aria-hidden="true">*</span>
        <input className={field} name="about" required maxLength={200} value={about} onChange={(event) => setAbout(event.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Additional notes
        <textarea
          className={`${field} min-h-24 resize-y`}
          name="notes"
          maxLength={2000}
          placeholder="Please share anything that will help prepare for our meeting."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      {guests.map((guest, index) => (
        <label key={index} className="mt-4 block text-sm font-medium">
          Guest email
          <span className="mt-2 flex gap-2">
            <input
              className={`${field} mt-0`}
              type="email"
              maxLength={120}
              placeholder="email"
              value={guest}
              onChange={(event) => setGuests((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
            />
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/20 text-white/70"
              aria-label="Remove guest"
              onClick={() => setGuests((current) => current.filter((_, itemIndex) => itemIndex !== index))}
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </label>
      ))}
      {guests.length < 10 ? (
        <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm text-white/80" onClick={() => setGuests((current) => [...current, ""])}>
          <UserPlus className="h-4 w-4" /> Add guests
        </button>
      ) : null}
      <p className="mt-5 text-xs leading-relaxed text-white/55">
        By proceeding, you agree to Cal.com&apos;s{" "}
        <a className="underline underline-offset-2" href="https://cal.com/terms" target="_blank" rel="noreferrer">
          Terms
        </a>{" "}
        and{" "}
        <a className="underline underline-offset-2" href="https://cal.com/privacy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </p>
      {error ? <p className="mt-3 text-sm text-amber">{error}</p> : null}
      <div className="mt-5 flex items-center justify-end gap-2">
        <button type="button" className="rounded-lg px-4 py-2 text-sm text-white/80" onClick={onBack} disabled={pending}>
          Back
        </button>
        <button type="submit" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink disabled:opacity-60" disabled={pending}>
          {pending ? "Confirming…" : "Confirm"}
        </button>
      </div>
    </form>
  );
}
