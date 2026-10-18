"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { site } from "@/content/site";
import type { BookingDay, BookingTime } from "@/lib/cal";
import { BookingForm } from "./BookingForm";
import { cn } from "@/lib/utils";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ordinal(day: number) {
  const teen = day % 100;
  if (teen >= 11 && teen <= 13) return `${day}th`;
  return `${day}${["th", "st", "nd", "rd"][day % 10] ?? "th"}`;
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

function cellsFor(year: number, month: number) {
  const count = new Date(year, month + 1, 0).getDate();
  const lead = new Date(year, month, 1).getDay();
  const cells: Array<number | null> = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function keyFor(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function BookingCalendar({ days, note }: { days: BookingDay[]; note: string }) {
  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const first = days[0]?.date;
  const [cursor, setCursor] = useState(() => {
    const [year, month] = (first ?? new Date().toISOString().slice(0, 10)).split("-").map(Number);
    return { year, month: month - 1 };
  });
  const [selected, setSelected] = useState(first ?? "");
  const [hour12, setHour12] = useState(true);
  const [slot, setSlot] = useState<BookingTime | null>(null);

  const months = useMemo(() => {
    const found = new Set(days.map((day) => day.date.slice(0, 7)));
    if (first) found.add(first.slice(0, 7));
    return [...found].sort();
  }, [days, first]);
  const cursorKey = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;
  const cursorIndex = Math.max(0, months.indexOf(cursorKey));
  const chosen = byDate.get(selected);
  const [chosenYear, chosenMonth, chosenDay] = (selected || "2000-01-01").split("-").map(Number);
  const chosenName = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
    new Date(chosenYear, (chosenMonth || 1) - 1, chosenDay || 1),
  );

  function shift(direction: -1 | 1) {
    const next = months[cursorIndex + direction];
    if (!next) return;
    const [year, month] = next.split("-").map(Number);
    setCursor({ year, month: month - 1 });
    const opening = days.find((day) => day.date.startsWith(next));
    if (opening) setSelected(opening.date);
  }

  if (!days.length) {
    return (
      <a href={site.links.calendar} target="_blank" rel="noreferrer" className="btn btn-inverted mt-6">
        Open the calendar
      </a>
    );
  }

  if (slot) {
    return (
      <BookingForm
        start={slot.start}
        when={`${chosenName} ${ordinal(chosenDay)} · ${hour12 ? slot.label12 : slot.label24}`}
        onBack={() => setSlot(null)}
      />
    );
  }

  return (
    <div>
      <p className="type-micro text-blue-300">Calendar</p>
      <p className="mt-3 text-sm text-white/70">{note}</p>
      <div className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{monthLabel(cursor.year, cursor.month)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 disabled:opacity-30"
            aria-label="Previous month"
            disabled={cursorIndex <= 0}
            onClick={() => shift(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 disabled:opacity-30"
            aria-label="Next month"
            disabled={cursorIndex >= months.length - 1}
            onClick={() => shift(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-white/45">
        {WEEK.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cellsFor(cursor.year, cursor.month).map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;
          const date = keyFor(cursor.year, cursor.month, day);
          const open = byDate.has(date);
          const active = date === selected;
          if (!open) {
            return (
              <span key={date} className="grid h-10 place-items-center text-sm text-white/25">
                {day}
              </span>
            );
          }
          return (
            <button
              key={date}
              type="button"
              aria-pressed={active}
              aria-label={`${monthLabel(cursor.year, cursor.month)} ${day}`}
              onClick={() => setSelected(date)}
              className={cn(
                "grid h-10 place-items-center rounded-xl text-sm",
                active ? "bg-white text-ink" : "bg-white/10 text-white hover:bg-white/20",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-white/80">
          {chosenName} {ordinal(chosenDay)}
        </p>
        <div className="flex rounded-full bg-white/10 p-1 text-xs">
          <button
            type="button"
            className={cn("rounded-full px-3 py-1", hour12 ? "bg-white text-ink" : "text-white/70")}
            onClick={() => setHour12(true)}
          >
            12h
          </button>
          <button
            type="button"
            className={cn("rounded-full px-3 py-1", hour12 ? "text-white/70" : "bg-white text-ink")}
            onClick={() => setHour12(false)}
          >
            24h
          </button>
        </div>
      </div>
      <div className="mt-4 grid max-h-72 gap-2 overflow-y-auto pr-1">
        {chosen?.times.map((time) => (
          <button
            key={time.start}
            type="button"
            onClick={() => setSlot(time)}
            className="rounded-2xl border border-white/15 px-3 py-3 text-center text-sm hover:bg-white hover:text-ink"
          >
            {hour12 ? time.label12 : time.label24}
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
