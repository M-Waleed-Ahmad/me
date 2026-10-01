'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Diagram, { DiagramEdge, DiagramNode } from '@/components/figures/Diagram';

export type Step = { title: string; body: string; highlight: string[] };

type Props = {
  idPrefix: string;
  title: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  steps: Step[];
};

/*
  "Walk me through the system." Desktop: the diagram stays pinned while short
  steps scroll past and light up the part they describe. Phones: the same steps
  become swipeable frames under the diagram.
*/
export default function WalkThrough({ idPrefix, title, width, height, nodes, edges, steps }: Props) {
  const [active, setActive] = useState(0);
  const desktopSteps = useRef<(HTMLLIElement | null)[]>([]);
  const rail = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    desktopSteps.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const onRailScroll = () => {
    const el = rail.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(Math.max(0, Math.min(steps.length - 1, index)));
  };

  const goTo = (index: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  const figure = (
    <div className="overflow-x-auto border border-rule graph-paper">
      <div className="min-w-[720px] p-3 sm:p-5 lg:min-w-0">
        <Diagram
          idPrefix={idPrefix}
          title={title}
          width={width}
          height={height}
          nodes={nodes}
          edges={edges}
          highlight={steps[active]?.highlight}
        />
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop: pinned figure, scrolling steps */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="sticky top-24 self-start">
          {figure}
          <p className="mt-3 font-mono text-xs text-ink-3">
            step {active + 1} of {steps.length}
          </p>
        </div>
        <ol>
          {steps.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                desktopSteps.current[i] = el;
              }}
              data-index={i}
              className={`flex min-h-[38vh] flex-col justify-center border-l-2 py-6 pl-6 transition-colors last:min-h-[30vh] ${
                i === active ? 'border-accent' : 'border-rule'
              }`}
            >
              <p className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, '0')}</p>
              <p className={`mt-1 font-serif text-2xl leading-tight ${i === active ? 'text-ink' : 'text-ink-3'}`}>{step.title}</p>
              <p className={`mt-2 leading-relaxed ${i === active ? 'text-ink-2' : 'text-ink-3'}`}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Phones and tablets: figure on top, swipeable frames below */}
      <div className="lg:hidden">
        {figure}
        <p className="mt-2 font-mono text-xs text-ink-3">swipe the diagram sideways to see it all →</p>
        <ol
          ref={rail}
          onScroll={onRailScroll}
          className="mt-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
          aria-label="Walk-through steps"
        >
          {steps.map((step, i) => (
            <li key={step.title} className="w-full shrink-0 snap-center pr-1" aria-current={i === active ? 'step' : undefined}>
              <div className="border-l-2 border-accent pl-4">
                <p className="font-mono text-xs text-ink-3">
                  {i + 1} / {steps.length}
                </p>
                <p className="mt-1 font-serif text-2xl leading-tight text-ink">{step.title}</p>
                <p className="mt-2 leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous step"
            className="border border-rule-strong p-2 text-ink disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {steps.map((step, i) => (
              <span key={step.title} className={`h-1.5 w-6 ${i === active ? 'bg-accent' : 'bg-rule'}`} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === steps.length - 1}
            aria-label="Next step"
            className="border border-rule-strong p-2 text-ink disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
