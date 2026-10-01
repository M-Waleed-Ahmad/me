import React from 'react';
import { OpenFromHash, CopyLink } from './QuestionControls';

export type Question = { slug: string; ask: string; answer: React.ReactNode; hint?: string };

/*
  The deep layer: questions an interviewer would ask, each answer tucked away
  until someone wants it. The first question is styled as the obvious entry point.
  Every question has its own URL fragment, so an answer can be sent as a link.
*/
export default function Questions({ items }: { items: Question[] }) {
  return (
    <section className="reveal" style={{ '--i': 8 } as React.CSSProperties}>
      <OpenFromHash />
      <h2 className="text-base font-medium text-ink">Questions I get asked</h2>
      <ol className="mt-4 space-y-2">
        {items.map((q, i) => (
          <li key={q.slug}>
            <details id={q.slug} className="group scroll-mt-24">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 transition-colors [&::-webkit-details-marker]:hidden ${
                  i === 0 ? 'bg-accent/10 text-accent-ink hover:bg-accent/15' : 'bg-surface text-ink hover:bg-rule/60'
                }`}
              >
                <span className="text-[1.05rem]">{q.ask}</span>
                <span className="shrink-0 font-mono text-xs opacity-70">
                  <span className="group-open:hidden">{q.hint ?? '+'}</span>
                  <span className="hidden group-open:inline">close</span>
                </span>
              </summary>
              <div className="px-1 pb-8 pt-6 sm:px-5">
                {q.answer}
                <CopyLink slug={q.slug} />
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
