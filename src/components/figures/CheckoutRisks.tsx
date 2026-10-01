import React from 'react';

/*
  ALFA Club's checkout as a critical path: each step, and the one frontend
  failure at that step most likely to cost the sale.
*/

const STEPS = [
  { step: 'Product page', risk: 'Heavy images slow the first view', fix: 'Cloudinary-served media' },
  { step: 'Cart', risk: 'Layout jumps as items update', fix: 'Stable layout, no shift' },
  { step: 'Checkout', risk: 'Small tap targets, missing feedback', fix: 'Mobile-sized controls, loading states' },
  { step: 'Payment', risk: 'Trust is decided before this screen', fix: 'Nothing provisional on the way here' },
];

export default function CheckoutRisks() {
  return (
    <ol className="grid gap-3 sm:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s.step} className="relative rounded-xl bg-paper p-4">
          <p className="font-mono text-xs text-ink-3">step {i + 1}</p>
          <p className="mt-1 font-serif text-xl leading-tight text-ink">{s.step}</p>
          <p className="mt-3 text-sm leading-snug text-accent-ink">{s.risk}</p>
          <p className="mt-2 text-sm leading-snug text-ink-2">
            <span aria-hidden>→ </span>
            {s.fix}
          </p>
          {i < STEPS.length - 1 && (
            <span aria-hidden className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-ink-3 sm:block">
              ›
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
