'use client';

import React, { useId, useState } from 'react';

/*
  DeepShield's four reporting bands. Dragging the score shows how the same model
  output turns into a different kind of claim depending on where it lands.
*/

const BANDS = [
  { name: 'Real', from: 0, to: 0.3, claim: 'Reported as likely authentic.' },
  { name: 'Unsure', from: 0.3, to: 0.65, claim: 'Too close to call. The report says so instead of forcing a verdict.' },
  { name: 'Likely fake', from: 0.65, to: 0.85, claim: 'Manipulation likely. The heatmap shows where the model looked.' },
  { name: 'Strong fake', from: 0.85, to: 1, claim: 'High-confidence manipulation, packaged with the evidence trail.' },
];

const WIDTH = 760;
const PAD = 24;
const x = (v: number) => PAD + v * (WIDTH - PAD * 2);

function bandFor(score: number) {
  return BANDS.find((b) => score <= b.to) ?? BANDS[BANDS.length - 1];
}

export default function ConfidenceBands() {
  const [score, setScore] = useState(0.72);
  const inputId = useId();
  const band = bandFor(score);
  const bandIndex = BANDS.indexOf(band);

  return (
    <div className="p-4 sm:p-6">
      <svg viewBox={`0 0 ${WIDTH} 130`} className="block h-auto w-full" aria-hidden>
        {BANDS.map((b, i) => (
          <g key={b.name}>
            <rect
              x={x(b.from)}
              y={30}
              width={x(b.to) - x(b.from)}
              height={44}
              fill="var(--color-accent)"
              fillOpacity={0.08 + i * 0.16}
              stroke="var(--color-paper)"
              strokeWidth={2}
            />
            <text
              x={(x(b.from) + x(b.to)) / 2}
              y={57}
              textAnchor="middle"
              fontSize={16}
              className="font-serif"
              fill={i === bandIndex ? 'var(--color-ink)' : 'var(--color-ink-2)'}
              fontStyle={i === bandIndex ? 'italic' : 'normal'}
            >
              {b.name}
            </text>
          </g>
        ))}

        {[0, 0.3, 0.65, 0.85, 1].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={74} x2={x(t)} y2={84} stroke="var(--color-ink-3)" />
            <text x={x(t)} y={100} textAnchor="middle" fontSize={11} className="font-mono" fill="var(--color-ink-3)">
              {t.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Score marker */}
        <g style={{ transform: `translateX(${x(score)}px)`, transition: 'transform 80ms linear' }}>
          <line x1={0} y1={18} x2={0} y2={86} stroke="var(--color-ink)" strokeWidth={2} />
          <circle cx={0} cy={16} r={5} fill="var(--color-ink)" />
        </g>
      </svg>

      <label htmlFor={inputId} className="sr-only">
        Model score
      </label>
      <input
        id={inputId}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-accent)]"
        aria-valuetext={`${score.toFixed(2)}, ${band.name}`}
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline sm:gap-6" aria-live="polite">
        <p className="font-mono text-sm text-ink">
          score {score.toFixed(2)}
        </p>
        <p className="text-ink-2">
          <span className="font-serif text-2xl italic text-accent-ink">{band.name}.</span> {band.claim}
        </p>
      </div>
    </div>
  );
}
