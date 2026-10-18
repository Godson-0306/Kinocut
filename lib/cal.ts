const EVENT_TYPE_ID = 7526395;
const ZONE = "Africa/Lagos";

export type BookingTime = {
  start: string;
  label12: string;
  label24: string;
};

export type BookingDay = {
  date: string;
  times: BookingTime[];
};

const clock12 = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const clock24 = new Intl.DateTimeFormat("en-GB", {
  timeZone: ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const weekday = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, weekday: "short" });
const hourOnly = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hour: "2-digit", hourCycle: "h23" });

function inWindow(start: string) {
  if (weekday.format(new Date(start)) === "Sun") return false;
  const hour = Number(hourOnly.format(new Date(start)));
  return hour >= 17 && hour < 23;
}

export async function introCalendar(): Promise<BookingDay[]> {
  const key = process.env.CAL_API_KEY;
  if (!key) return [];

  const start = new Date();
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 2);
  end.setUTCDate(1);
  const url = new URL("https://api.cal.com/v2/slots");
  url.searchParams.set("eventTypeId", EVENT_TYPE_ID);
  url.searchParams.set("start", start.toISOString());
  url.searchParams.set("end", end.toISOString());
  url.searchParams.set("timeZone", ZONE);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${key}`, "cal-api-version": "2024-09-04" },
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { data?: Record<string, { start: string }[]> };
    return Object.entries(body.data ?? {})
      .map(([date, times]) => ({
        date,
        times: times
          .map((time) => time.start)
          .filter(inWindow)
          .map((slot) => ({
            start: slot,
            label12: clock12.format(new Date(slot)).replace(" ", "").toLowerCase(),
            label24: clock24.format(new Date(slot)),
          })),
      }))
      .filter((day) => day.times.length > 0);
  } catch {
    return [];
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type IntroBooking = {
  start: string;
  name: string;
  email: string;
  about: string;
  notes: string;
  guests: string[];
};

export async function createIntroBooking(
  input: IntroBooking,
): Promise<{ ok: true } | { ok: false; reason: "unavailable" | "invalid" | "failed" }> {
  const key = process.env.CAL_API_KEY;
  if (!key) return { ok: false, reason: "failed" };

  const responses: Record<string, string> = { title: input.about };
  if (input.notes) responses.notes = input.notes;

  try {
    const response = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify({
        start: input.start,
        eventTypeId: EVENT_TYPE_ID,
        attendee: {
          name: input.name,
          email: input.email,
          timeZone: ZONE,
          language: "en",
        },
        guests: input.guests,
        bookingFieldsResponses: responses,
        location: { type: "integration", integration: "zoom" },
      }),
      cache: "no-store",
    });
    if (response.ok) return { ok: true };
    if (response.status === 409) return { ok: false, reason: "unavailable" };
    if (response.status === 400) return { ok: false, reason: "invalid" };
    return { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

export function cleanBooking(body: {
  start?: unknown;
  name?: unknown;
  email?: unknown;
  about?: unknown;
  notes?: unknown;
  guests?: unknown;
}): IntroBooking | null {
  const start = typeof body.start === "string" ? body.start : "";
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const about = typeof body.about === "string" ? body.about.trim().replace(/\s+/g, " ") : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const when = new Date(start).getTime();
  const guests = Array.isArray(body.guests)
    ? [...new Set(body.guests.filter((guest): guest is string => typeof guest === "string").map((guest) => guest.trim().toLowerCase()))]
    : [];

  if (!Number.isFinite(when) || when < Date.now() || name.length < 1 || name.length > 80 || name.includes("<")) return null;
  if (!EMAIL.test(email) || email.length > 120 || about.length < 1 || about.length > 200 || notes.length > 2000) return null;
  if (guests.length > 10 || guests.some((guest) => !EMAIL.test(guest) || guest.length > 120 || guest === email)) return null;
  return { start, name, email, about, notes, guests };
}
