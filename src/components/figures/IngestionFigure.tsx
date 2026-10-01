import React from 'react';

/*
  What happens to a bulk upload in Arabia Hills: every row is checked before it
  can reach the database, and a row that fails goes back with its reason instead
  of quietly corrupting the listing catalogue. Rows are illustrative, not real data.
*/

const ROWS = [
  { id: 1, ok: true },
  { id: 2, ok: true },
  { id: 3, ok: false, reason: 'missing a required field' },
  { id: 4, ok: true },
];

export default function IngestionFigure() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 text-sm sm:gap-5">
        <div>
          <p className="mb-2 font-mono text-xs text-ink-3">bulk upload</p>
          <ul className="space-y-1.5">
            {ROWS.map((row) => (
              <li
                key={row.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${row.ok ? 'bg-paper text-ink-2' : 'bg-accent/10 text-accent-ink'}`}
              >
                <span>listing row {row.id}</span>
                <span aria-hidden>{row.ok ? '✓' : '✕'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper">Make.com</span>
          <span className="font-mono text-[11px] leading-tight text-ink-3">
            shape
            <br />
            required fields
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-paper px-3 py-2.5">
            <p className="font-mono text-xs text-ink-3">into Supabase</p>
            <p className="mt-0.5 text-ink">rows 1, 2, 4</p>
          </div>
          <div className="rounded-lg border border-dashed border-accent/50 px-3 py-2.5">
            <p className="font-mono text-xs text-accent-ink">back to the team</p>
            <p className="mt-0.5 text-ink">row 3: {ROWS[2].reason}</p>
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-3">illustration, not real listing data</p>
    </div>
  );
}
