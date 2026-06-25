'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Settings, GitBranch, Scale, Wrench, BarChart2, Lightbulb, ChevronDown, StickyNote } from 'lucide-react';

export interface CaseStudySection {
  id: string;
  number: string;
  title: string;
  /** If set, this section defaults to collapsed. The string is shown as a one-line summary in the collapsed state. */
  collapsedSummary?: string;
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

  useEffect(() => {
    const updateActiveSection = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) {
        setActiveId(sections[sections.length - 1]?.id ?? '');
        return;
      }

      const marker = Math.min(320, window.innerHeight * 0.38);
      const current = sections.reduce((active, section) => {
        const element = document.getElementById(section.id);
        if (!element) return active;
        return element.getBoundingClientRect().top <= marker ? section.id : active;
      }, sections[0]?.id ?? '');
      setActiveId(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sectionTreatment = (section: CaseStudySection) => {
    if (section.number === '01') {
      return {
        shell: 'scroll-mt-24 border-y border-border-muted py-12 sm:py-16',
        header: 'mb-8 flex items-baseline gap-4',
        number: 'font-mono text-sm text-accent',
        title: 'text-2xl sm:text-3xl font-semibold tracking-tight',
        content: 'max-w-5xl space-y-5 [&_p]:max-w-3xl [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-text-secondary [&_p:first-of-type]:max-w-4xl [&_p:first-of-type]:text-3xl [&_p:first-of-type]:font-light [&_p:first-of-type]:leading-tight [&_p:first-of-type]:tracking-tight [&_p:first-of-type]:text-text-primary sm:[&_p:first-of-type]:text-4xl',
        icon: false,
      };
    }
    if (section.number === '03') {
      return {
        shell: 'scroll-mt-24 border-y border-border-muted py-10 sm:py-12',
        header: 'mb-6 flex items-baseline gap-4',
        number: 'font-mono text-xs text-accent',
        title: 'text-xl sm:text-2xl font-semibold tracking-tight',
        content: 'space-y-6 [&>div:first-child]:mt-0 [&>div:first-child]:mb-8 [&_p]:max-w-3xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-text-secondary',
        icon: false,
      };
    }
    if (section.number === '06' || section.number === '07') {
      return {
        shell: 'scroll-mt-24 border-t border-border-muted pt-12',
        header: 'mb-5 flex items-baseline gap-4',
        number: 'font-mono text-xs text-accent',
        title: 'text-xl sm:text-2xl font-semibold tracking-tight',
        content: section.number === '07'
          ? 'max-w-5xl space-y-5 [&_p]:max-w-3xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-text-secondary [&_p:last-of-type]:max-w-4xl [&_p:last-of-type]:text-2xl [&_p:last-of-type]:font-light [&_p:last-of-type]:leading-tight [&_p:last-of-type]:tracking-tight [&_p:last-of-type]:text-text-primary sm:[&_p:last-of-type]:text-3xl'
          : 'max-w-5xl space-y-6',
        icon: false,
      };
    }
    return {
      shell: 'scroll-mt-24 border-t border-border-muted pt-10',
      header: 'mb-5 flex items-baseline gap-4',
      number: 'font-mono text-xs text-accent',
      title: 'text-lg sm:text-xl font-semibold tracking-tight',
      content: 'max-w-5xl space-y-5 [&_p]:max-w-3xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-text-secondary',
      icon: false,
    };
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
      <div className="border-b border-border-muted pb-8 sm:pb-12 mb-8 sm:mb-12 space-y-6 sm:space-y-8">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
          <span className="text-accent tracking-widest uppercase">Pillar // {meta.pillar}</span>
          <span className="text-text-muted">·</span>
          <span className="px-2 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent">
            {meta.status}
          </span>
        </div>

        <div className="space-y-5">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{meta.name}</h1>
          <p className="max-w-4xl text-2xl sm:text-3xl leading-tight tracking-tight text-text-primary font-light">
            {meta.tagline}
          </p>
        </div>

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
          <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border-muted py-4">
            {meta.metrics.map(m => (
              <div key={m.label} className="min-w-28 space-y-1">
                <p className="text-xl sm:text-2xl font-bold text-accent font-mono">{m.value}</p>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Optional header extras (device mockup, toggles, etc.) */}
        {headerExtra}
      </div>

      {/* ── Body: sidebar + content ─────────────────────────────────── */}
      {/*
        Sidebar uses sticky (not fixed) so it scrolls with the page header naturally
        and only "sticks" once it reaches its own top offset. This means it always
        starts below the page header block regardless of header height across projects.
      */}
      <div className="relative lg:grid lg:grid-cols-[11rem_1fr] lg:gap-x-8">

        {/* Sticky sidebar nav (desktop only) */}
        <div className="hidden lg:block">
          <nav
            className="sticky top-24 max-h-[calc(100vh-7rem)] flex-col gap-1 overflow-auto pr-2 flex"
            aria-label="Case study sections"
          >
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3">Sections</p>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`text-left text-[11px] font-mono py-2 transition-all border-l pl-3 ${
                  activeId === s.id
                    ? 'text-accent border-accent'
                    : 'text-text-muted border-border-muted hover:text-text-secondary'
                }`}
              >
                <span className="text-text-muted mr-1.5">{s.number}</span>
                {s.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="min-w-0 space-y-8">
          {sections.map(s => {
            const Icon = SECTION_ICONS[s.number] ?? Wrench;
            const treatment = sectionTreatment(s);
            const isCollapsible = Boolean(s.collapsedSummary);
            return (
              <section
                key={s.id}
                id={s.id}
                className={treatment.shell}
              >
                <div className={treatment.header}>
                  <span className={treatment.number}>{s.number}</span>
                  {treatment.icon && (
                    <div className="p-1.5 rounded bg-bg-panel border border-border-muted">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                  )}
                  <h2 className={treatment.title}>
                    {s.title}
                  </h2>
                </div>
                {isCollapsible
                  ? <CollapsibleSectionBody summary={s.collapsedSummary!} contentClass={treatment.content}>{s.children}</CollapsibleSectionBody>
                  : <div className={treatment.content}>{s.children}</div>
                }
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Collapse/expand shell — same visual pattern as Tradeoff and EngineeringNote */
function CollapsibleSectionBody({
  summary,
  contentClass,
  children,
}: {
  summary: string;
  contentClass: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border-muted bg-bg-dark/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-bg-panel/60"
      >
        <span className="text-[11px] font-mono text-text-secondary leading-relaxed">{summary}</span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`border-t border-border-muted px-4 py-5 ${contentClass}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
