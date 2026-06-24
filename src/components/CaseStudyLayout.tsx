'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Settings, GitBranch, Scale, Wrench, BarChart2, Lightbulb, ChevronDown, StickyNote } from 'lucide-react';

export interface CaseStudySection {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

export interface ProjectMeta {
  name: string;
  tagline: string;
  pillar: 'Products' | 'Systems' | 'Intelligence';
  pillarHref: string;
  status: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
}

interface CaseStudyLayoutProps {
  meta: ProjectMeta;
  sections: CaseStudySection[];
  headerExtra?: React.ReactNode;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  '01': AlertTriangle,
  '02': Settings,
  '03': GitBranch,
  '04': Scale,
  '05': Wrench,
  '06': BarChart2,
  '07': Lightbulb,
};

export default function CaseStudyLayout({ meta, sections, headerExtra }: CaseStudyLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-spy using IntersectionObserver
  useEffect(() => {
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) { sectionRefs.current[s.id] = el; observer.observe(el); }
    });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">

      {/* Back link */}
      <Link
        href={meta.pillarHref}
        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to {meta.pillar}
      </Link>

      {/* ── Project header ─────────────────────────────────────────────────── */}
      <div className="border-b border-border-muted pb-8 sm:pb-10 mb-8 sm:mb-12 space-y-5 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="text-accent tracking-widest uppercase">Pillar // {meta.pillar}</span>
          <span className="text-text-muted">·</span>
          <span className="px-2 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent">
            {meta.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{meta.name}</h1>
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed font-light">{meta.tagline}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {meta.tech.map(t => (
            <span key={t} className="font-mono text-[10px] px-2.5 py-1 rounded border border-border-muted bg-bg-panel text-text-secondary">
              {t}
            </span>
          ))}
        </div>

        {/* Impact metrics if provided */}
        {meta.metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {meta.metrics.map(m => (
              <div key={m.label} className="p-4 rounded-lg bg-bg-panel border border-border-muted space-y-1">
                <p className="text-xl font-bold text-accent font-mono">{m.value}</p>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Optional header extras (device mockup, toggles, etc.) */}
        {headerExtra}
      </div>

      {/* ── Body: sidebar + content ─────────────────────────────────────────── */}
      <div className="flex gap-12 items-start">

        {/* Sticky sidebar nav (desktop only) */}
        <nav className="hidden lg:flex flex-col gap-1 sticky top-20 w-44 flex-shrink-0" aria-label="Case study sections">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3">Sections</p>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-left text-[11px] font-mono px-3 py-2 rounded transition-all border ${
                activeId === s.id
                  ? 'text-accent border-accent/25 bg-accent/5'
                  : 'text-text-muted border-transparent hover:text-text-secondary hover:border-border-muted'
              }`}
            >
              <span className="text-text-muted mr-1.5">{s.number}</span>
              {s.title}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {sections.map(s => {
            const Icon = SECTION_ICONS[s.number] ?? Wrench;
            return (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-24 rounded-xl border border-border-muted bg-bg-panel overflow-hidden"
              >
                {/* Section header bar */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border-muted bg-bg-dark/40">
                  <span className="font-mono text-xs text-accent">{s.number}</span>
                  <div className="p-1.5 rounded bg-bg-panel border border-border-muted">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <h2 className="font-mono text-sm font-semibold text-text-primary tracking-wide">
                    {s.title}
                  </h2>
                </div>
                {/* Section content */}
                <div className="px-4 py-5 sm:px-6 sm:py-6">
                  {s.children}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable section sub-components ────────────────────────────────────────

/** Highlighted engineering note / marginalia */
export function EngineeringNote({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 rounded-lg border border-border-muted bg-bg-dark/60 font-mono text-xs">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-accent transition-colors hover:text-accent-bright"
      >
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
          <StickyNote className="h-3.5 w-3.5" />
          Engineering Note
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-muted px-4 py-3 text-text-secondary leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Tradeoff comparison row */
export function Tradeoff({
  decision,
  summary = '{{PLACEHOLDER: One-line summary of this decision.}}',
  pro,
  con,
}: {
  decision: string;
  summary?: string;
  pro: string;
  con: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border-muted overflow-hidden mb-3 bg-bg-dark">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-bg-panel"
      >
        <span className="min-w-0">
          <span className="block text-xs font-mono text-text-primary font-semibold">{decision}</span>
          <span className="mt-1 block text-[11px] text-text-muted leading-relaxed">{summary}</span>
        </span>
        <ChevronDown className={`mt-0.5 h-4 w-4 flex-shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 border-t border-border-muted sm:grid-cols-2 sm:divide-x divide-border-muted">
              <div className="px-4 py-3 space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Gained</span>
                <p className="text-xs text-text-secondary leading-relaxed">{pro}</p>
              </div>
              <div className="px-4 py-3 space-y-1 border-t border-border-muted sm:border-t-0">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Accepted</span>
                <p className="text-xs text-text-secondary leading-relaxed">{con}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ImplementationTimeline({
  phases,
}: {
  phases: { phase: string; duration: string; note: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-border-muted bg-bg-dark p-5 space-y-3">
      <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Delivery Timeline</p>
      <div className="space-y-2">
        {phases.map((row, i) => {
          const isOpen = openIndex === i;

          return (
            <div key={`${row.phase}-${i}`} className="rounded border border-border-muted bg-bg-panel/40">
              <button
                type="button"
                onClick={() => setOpenIndex((current) => current === i ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 px-4 py-3 text-left"
              >
                <span className="font-mono text-[10px] text-accent w-6 flex-shrink-0">{`0${i + 1}`}</span>
                <span className="flex-1 min-w-0 text-xs font-mono text-text-primary">{row.phase}</span>
                <span className="hidden sm:inline text-[10px] font-mono text-text-muted flex-shrink-0">{row.duration}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border-muted px-4 py-3 pl-14">
                      <p className="text-[10px] text-text-muted leading-relaxed">{row.note}</p>
                      <p className="mt-2 sm:hidden text-[10px] font-mono text-text-muted">{row.duration}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Metric card for Outcome section */
export function MetricCard({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="p-4 rounded-lg border border-border-muted bg-bg-dark space-y-1.5">
      <p className="text-2xl font-bold font-mono text-accent">{value}</p>
      <p className="text-[11px] font-mono text-text-primary uppercase tracking-wider">{label}</p>
      {note && <p className="text-[10px] text-text-muted">{note}</p>}
    </div>
  );
}

/** Placeholder block — visually distinct, greppable */
export function Placeholder({ children }: { children: string }) {
  return (
    <span className="italic text-text-muted bg-bg-dark border border-dashed border-border-muted rounded px-1.5 py-0.5 text-xs font-mono">
      {`{{PLACEHOLDER: ${children}}}`}
    </span>
  );
}

/** Architecture diagram placeholder  */
export function ArchDiagramPlaceholder({ label }: { label: string }) {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-border-muted bg-bg-dark p-8 text-center space-y-2">
      <p className="text-[10px] font-mono text-accent uppercase tracking-widest">{label}</p>
      <p className="text-[10px] font-mono text-text-muted">
        {'{{PLACEHOLDER: Architecture diagram — describe the real data flow here}}'}
      </p>
    </div>
  );
}
