import { useMemo, useState } from "react";

/** Utilities */
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

function getMonthMatrix(viewDate) {
  // Build a 6x7 (42-day) calendar grid for the given month (Sunday-start).
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const firstDay = first.getDay(); // 0=Sun
  const start = new Date(first);
  start.setDate(first.getDate() - firstDay); // sunday before (or same day)

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function CalendarMini({
  initialDate = new Date(),
  events = [], // [{date:'YYYY-MM-DD', label:'Rent due'}]
  onSelectDate,
  title = "📅 Calendar",
}) {
  const [viewDate, setViewDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  const [selected, setSelected] = useState(initialDate);

  const today = new Date();
  const monthLabel = viewDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  const days = useMemo(() => getMonthMatrix(viewDate), [viewDate]);
  const currentMonth = viewDate.getMonth();

  const eventMap = useMemo(() => {
    const m = new Map();
    for (const e of events) {
      if (!m.has(e.date)) m.set(e.date, []);
      m.get(e.date).push(e);
    }
    return m;
  }, [events]);

  const selectedEvents = eventMap.get(ymd(selected)) || [];

  const gotoPrev = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const gotoNext = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const gotoToday = () => {
    const t = new Date();
    setViewDate(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelected(t);
    onSelectDate?.(t);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={gotoPrev} className="px-2 py-1 rounded border hover:bg-slate-50">◀</button>
          <div className="min-w-[140px] text-center text-slate-700 font-medium">{monthLabel}</div>
          <button onClick={gotoNext} className="px-2 py-1 rounded border hover:bg-slate-50">▶</button>
          <button onClick={gotoToday} className="ml-2 px-2 py-1 rounded border hover:bg-slate-50">Today</button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = d.getMonth() === currentMonth;
          const isToday = isSameDay(d, today);
          const isSelected = isSameDay(d, selected);
          const hasEvents = (eventMap.get(ymd(d)) || []).length > 0;

          const base =
            "aspect-square rounded-lg flex items-center justify-center text-sm select-none cursor-pointer";
          const tone = inMonth ? "text-slate-800" : "text-slate-400";
          const ring = isSelected ? "ring-2 ring-blue-500" : isToday ? "ring-2 ring-amber-400" : "ring-1 ring-slate-200";
          const bg = isSelected ? "bg-blue-50" : "bg-white hover:bg-slate-50";

          return (
            <button
              key={ymd(d)}
              onClick={() => {
                setSelected(d);
                onSelectDate?.(d);
              }}
              className={`${base} ${tone} ${ring} ${bg} relative`}
              title={ymd(d)}
            >
              {d.getDate()}
              {hasEvents && (
                <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      <div className="mt-4">
        <p className="text-sm text-slate-600 mb-2">
          <span className="font-medium text-slate-800">Selected:</span> {selected.toDateString()}
        </p>
        {selectedEvents.length === 0 ? (
          <p className="text-xs text-slate-500">No events for this day.</p>
        ) : (
          <ul className="space-y-1">
            {selectedEvents.map((e, i) => (
              <li
                key={`${e.date}-${i}`}
                className="text-sm px-3 py-1 rounded border border-slate-200 bg-slate-50"
              >
                {e.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
