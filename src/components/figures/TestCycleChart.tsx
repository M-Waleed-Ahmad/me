/*
  Before/after for the Axelliant test cycle, drawn to a linear scale on purpose:
  the "after" bar is supposed to look almost invisible next to the "before" range.
*/

const WIDTH = 760;
const LEFT = 150;
const RIGHT = 40;
const MAX_HOURS = 72;
const scale = (h: number) => LEFT + ((WIDTH - LEFT - RIGHT) * h) / MAX_HOURS;

export default function TestCycleChart() {
  const ticks = [0, 12, 24, 36, 48, 60, 72];
  return (
    <svg
      viewBox={`0 0 ${WIDTH} 210`}
      className="block h-auto w-full"
      role="img"
      aria-label="Hybrid-system test cycle: 2 to 3 days (48 to 72 hours) before automation, about 2 hours after."
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={scale(t)} y1={28} x2={scale(t)} y2={170} stroke="var(--color-rule)" />
          <text x={scale(t)} y={190} textAnchor="middle" fontSize={11} className="font-mono" fill="var(--color-ink-3)">
            {t}h
          </text>
        </g>
      ))}

      {/* Before: a range, because the honest answer was "two to three days". */}
      <text x={LEFT - 16} y={68} textAnchor="end" fontSize={16} className="font-serif" fill="var(--color-ink)">
        Before
      </text>
      <text x={LEFT - 16} y={84} textAnchor="end" fontSize={11} className="font-mono" fill="var(--color-ink-3)">
        mostly manual
      </text>
      <rect x={scale(0)} y={52} width={scale(48) - scale(0)} height={30} fill="var(--color-ink-2)" />
      <rect
        x={scale(48)}
        y={52}
        width={scale(72) - scale(48)}
        height={30}
        fill="var(--color-ink-2)"
        fillOpacity={0.35}
      />
      <text x={scale(60)} y={72} textAnchor="middle" fontSize={12} className="font-mono" fill="var(--color-ink)">
        2–3 days
      </text>

      <text x={LEFT - 16} y={134} textAnchor="end" fontSize={16} className="font-serif" fill="var(--color-ink)">
        After
      </text>
      <text x={LEFT - 16} y={150} textAnchor="end" fontSize={11} className="font-mono" fill="var(--color-ink-3)">
        automated in CI
      </text>
      <rect x={scale(0)} y={118} width={scale(2) - scale(0)} height={30} fill="var(--color-accent)" />
      <text x={scale(2) + 10} y={138} fontSize={16} fontStyle="italic" className="font-serif" fill="var(--color-accent-ink)">
        ~2 hours, with Playwright and Cypress running inside the pipeline
      </text>
    </svg>
  );
}
