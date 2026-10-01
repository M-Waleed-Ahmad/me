'use client';

import React, { useEffect, useState, ViewTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ConnectionMap from '@/components/figures/ConnectionMap';
import { TagList } from '@/components/ui';
import { profile, roleDeepDives, selectedWork } from '@/data/site';
import { workspaceNodes } from '@/data/workspaceData';

/** Map nodes whose story is told by another project's page. */
const WORK_FOR: Record<string, string> = { cicd: 'axelliant', testing: 'axelliant' };

/** Same order as the map's middle column, so the list and the map read together. */
const PROJECTS: { id: string; kind: string }[] = [
  { id: 'wepsych', kind: 'Compliance platform' },
  { id: 'arabia-hills', kind: 'Real estate · UAE' },
  { id: 'alfa-club', kind: 'Ecommerce' },
  { id: 'automation', kind: 'Workflows' },
  { id: 'cicd', kind: 'Pipelines · Axelliant' },
  { id: 'testing', kind: 'Test automation · Axelliant' },
  { id: 'deepshield', kind: 'Final-year project' },
  { id: 'robotics', kind: 'Skill composition' },
];

const labelFor = (id: string) => workspaceNodes.find((n) => n.id === id)?.label ?? id;

/*
  Intro across the top, then the map beside a project list. Hovering a row traces
  that project on the map; clicking opens its short summary in the same panel.
*/
export default function MapHome() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  // Homepage intro: any key or click skips the seam opening; otherwise it ends on its own.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === 'skip') return;
    const end = () => {
      root.dataset.intro = 'skip';
    };
    const timer = window.setTimeout(end, 3200);
    window.addEventListener('keydown', end, { once: true });
    window.addEventListener('pointerdown', end, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', end);
      window.removeEventListener('pointerdown', end);
    };
  }, []);

  const pick = (id: string | null) => {
    setSelected(id);
    setHovered(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-10 sm:px-8">
      {/* Opening: the screen parts along a seam. Purely visual and never blocks input. */}
      <div className="seam-intro" aria-hidden="true">
        <div className="seam-half seam-top">
          <p className="seam-text font-serif text-4xl sm:text-5xl">Start with the problem.</p>
        </div>
        <div className="seam-half seam-bottom">
          <p className="seam-text font-mono text-xs text-ink-3 sm:text-sm">the stack can come later</p>
        </div>
        <div className="seam-line" />
      </div>

      {/* Intro band */}
      <section className="flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="reveal flex items-center gap-2 font-mono text-xs text-ink-3" style={{ '--i': 0 } as React.CSSProperties}>
            <span className="h-2 w-2 rounded-full bg-accent" />
            {profile.location} · available for new roles
          </p>
          <h1 className="reveal mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl" style={{ '--i': 1 } as React.CSSProperties}>
            Software engineer, full-stack and AI systems.
          </h1>
          <p className="reveal mt-4 text-lg text-ink-2" style={{ '--i': 2 } as React.CSSProperties}>
            {profile.experience} shipping web, mobile and ML work for international clients.
          </p>
        </div>
        <Link
          href="/products"
          style={{ '--i': 3 } as React.CSSProperties}
          className="reveal shrink-0 text-sm text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink"
        >
          All work as a list
        </Link>
      </section>

      {/* Map + panel */}
      <section className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
        {/* On phones the map keeps a readable size and scrolls sideways, below the project list. */}
        <div>
          <div className="overflow-x-auto rounded-2xl bg-surface px-3 pb-3 pt-5 sm:px-5">
            <div className="min-w-[600px] lg:min-w-0">
              <ConnectionMap
                headings="titles"
                selected={selected}
                highlight={hovered}
                onSelect={(id) => {
                  pick(selected === id ? null : id);
                  // The summary sits above the map on phones: bring it into view.
                  if (window.innerWidth < 1024) {
                    document.getElementById('project-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-3 lg:hidden">swipe the map sideways to see it all →</p>
        </div>

        <div id="project-panel" className="reveal order-first scroll-mt-20 lg:order-none lg:pt-1" style={{ '--i': 4 } as React.CSSProperties}>
          {selected ? (
            <div key={selected} className="swap-in h-full">
              <ProjectSummary id={selected} onBack={() => pick(null)} />
            </div>
          ) : (
            <div key="list" className="swap-in">
              <p className="font-serif text-2xl text-ink">Projects</p>
              <p className="mt-1 text-sm text-ink-3">
                <span className="hidden lg:inline">Hover to trace it on the map, click to open.</span>
                <span className="lg:hidden">Tap a project to open it.</span>
              </p>
              <ul className="mt-4">
                {PROJECTS.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => pick(p.id)}
                      onMouseEnter={() => setHovered(p.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(p.id)}
                      onBlur={() => setHovered(null)}
                      className="group flex w-full items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface"
                    >
                      <span className="font-serif text-xl text-ink transition-colors group-hover:text-accent-ink">{labelFor(p.id)}</span>
                      <span className="shrink-0 text-sm text-ink-3">{p.kind}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectSummary({ id, onBack }: { id: string; onBack: () => void }) {
  const work = [...selectedWork, ...roleDeepDives].find((w) => w.slug === (WORK_FOR[id] ?? id));
  const node = workspaceNodes.find((n) => n.id === id);
  const kind = PROJECTS.find((p) => p.id === id)?.kind;
  const href = work?.href ?? node?.url ?? '/products';

  return (
    <div aria-live="polite" className="flex h-full flex-col">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 self-start text-sm text-ink-3 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All projects
      </button>
      <p className="mt-6 font-mono text-xs text-ink-3">{work?.kind ?? kind}</p>
      {/* Shares a name with the project page title, so it glides into place on navigation. */}
      <ViewTransition name={`project-title-${work?.slug ?? id}`} share="morph">
        <h2 className="mt-1 font-serif text-5xl leading-none text-ink">{work?.name ?? node?.label}</h2>
      </ViewTransition>
      <p className="mt-4 leading-relaxed text-ink-2">{work?.summary ?? node?.description}</p>

      {work && (
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-serif text-5xl leading-none text-ink">{work.figure.value}</p>
            <p className="mt-2 text-sm text-ink-3">{work.figure.label}</p>
          </div>
        </div>
      )}
      {work && (
        <div className="mt-5">
          <TagList items={work.stack} />
        </div>
      )}

      <Link
        href={href}
        className="mt-8 inline-flex items-center justify-between rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent"
      >
        Open project <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
