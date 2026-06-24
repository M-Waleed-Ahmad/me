'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Blocks,
  Braces,
  ChevronDown,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  GitCommit,
  Repeat2,
  Route,
  Server,
  Settings2,
  ShieldCheck,
  Split,
  StickyNote,
  Webhook,
  Workflow,
} from 'lucide-react';

type Stage = {
  label: string;
  eyebrow: string;
  problem: string;
  solution: string;
  result: string;
};

type ArchitectureView = {
  id: string;
  label: string;
  note: string;
  nodes: { title: string; detail: string; icon: React.ElementType }[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.48,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const automationStages: Stage[] = [
  {
    label: 'Trigger',
    eyebrow: 'Webhook, schedule, or form event',
    problem: 'Bulk or repeated operational events are easy to mishandle when the process starts with manual copying.',
    solution: 'Use an explicit trigger, then validate the incoming record before it can change trusted application data.',
    result: 'Used in work such as Arabia Hills listing ingestion, where automation made the import path inspectable.',
  },
  {
    label: 'Processing',
    eyebrow: 'Normalize and enrich',
    problem: 'Imported records rarely arrive in the exact shape the product needs.',
    solution: 'Normalize fields, reject incomplete records, and keep transformation rules visible instead of burying them in one opaque step.',
    result: 'Reduced operational ambiguity by making data cleanup part of the workflow rather than an afterthought.',
  },
  {
    label: 'Decision',
    eyebrow: 'Rules before action',
    problem: 'Some records should not be pushed forward automatically just because a tool can do it.',
    solution: 'Keep approval rules, exception paths, and human review points explicit in the workflow.',
    result: 'Preserves accountability while still removing repetitive manual work.',
  },
  {
    label: 'Output',
    eyebrow: 'Write, notify, sync',
    problem: 'The last step is where teams often lose track of whether the automation actually changed the destination system.',
    solution: 'Write to the destination, confirm success, and make failed writes visible for follow-up.',
    result: 'Turns automation into an auditable system rather than a hopeful shortcut.',
  },
];

const pipelineStages: Stage[] = [
  {
    label: 'Code Push',
    eyebrow: 'Branch protection starts here',
    problem: 'Changes become risky when feedback arrives only after manual testing or deployment.',
    solution: 'GitHub Actions pipelines provide an immediate check after code changes enter the workflow.',
    result: 'Raised merge confidence by making automated checks part of the normal delivery path.',
  },
  {
    label: 'Tests',
    eyebrow: 'Fast feedback loop',
    problem: 'Hybrid system testing was too slow when large parts of it stayed manual.',
    solution: 'Playwright and Cypress automated test frameworks run inside CI to catch browser and workflow regressions earlier.',
    result: 'Estimated reduction from 2-3 days of hybrid testing to about 2 hours, based on Waleed\'s measured-in-practice account.',
  },
  {
    label: 'Build',
    eyebrow: 'Reproducible artifact',
    problem: 'Slow builds delay feedback and make teams less likely to trust the pipeline.',
    solution: 'Parallelize GitHub Actions jobs where the dependency graph allows independent work.',
    result: 'Improved build times and deployment reliability in Axelliant pipeline work.',
  },
  {
    label: 'Deploy',
    eyebrow: 'Controlled release',
    problem: 'Deployment should not depend on a person remembering a fragile sequence of steps.',
    solution: 'Move release work into repeatable CI/CD stages with visible success and failure states.',
    result: 'Made deployment behavior more consistent and easier to reason about after changes.',
  },
];

const architectureViews: ArchitectureView[] = [
  {
    id: 'product-backend',
    label: 'Product Backend',
    note: 'A typical product architecture view: user actions move through an API boundary, domain rules, storage, and async workers.',
    nodes: [
      { title: 'Client App', detail: 'Flutter or React surfaces collect user actions and keep the workflow understandable.', icon: Blocks },
      { title: 'Auth Boundary', detail: 'Supabase Auth or app-level checks decide who can read, write, or approve sensitive records.', icon: Route },
      { title: 'Domain Rules', detail: 'Compliance, listing, and workflow rules stay explicit instead of being scattered across screens.', icon: Braces },
      { title: 'PostgreSQL', detail: 'Structured tables hold the canonical state used by exports, admin surfaces, and search.', icon: Database },
      { title: 'Reports', detail: 'PDF exports and operational outputs turn stored state into reviewable artifacts.', icon: Repeat2 },
    ],
  },
  {
    id: 'integration-flow',
    label: 'Integration Flow',
    note: 'A systems integration view: external events are treated as unreliable until validated, logged, and confirmed.',
    nodes: [
      { title: 'Bulk Source', detail: 'Listing files, form data, or client records arrive from outside the product boundary.', icon: Webhook },
      { title: 'Ingestion Guard', detail: 'Required fields and record shape are checked before anything becomes trusted state.', icon: ShieldCheck },
      { title: 'Exception Path', detail: 'Bad or ambiguous records stay reviewable instead of silently corrupting the destination.', icon: Split },
      { title: 'Transform', detail: 'Make.com or app logic maps the input into the internal schema.', icon: Settings2 },
      { title: 'Destination Sync', detail: 'Successful writes update Supabase/PostgreSQL and become visible in the app surface.', icon: Server },
    ],
  },
  {
    id: 'data-pipeline',
    label: 'Data Pipeline',
    note: 'A data movement view: raw inputs become trusted, queryable state only after normalization and auditability.',
    nodes: [
      { title: 'Raw Input', detail: 'Media, listing data, CPD records, or test results start as untrusted inputs.', icon: GitCommit },
      { title: 'Normalizer', detail: 'The system reshapes records into the structure later stages expect.', icon: Workflow },
      { title: 'Validation', detail: 'Required checks happen before data becomes exportable, searchable, or reviewable.', icon: CheckCircle2 },
      { title: 'Stored State', detail: 'PostgreSQL or result artifacts hold the canonical record of what happened.', icon: Database },
      { title: 'Consumer', detail: 'Users, admins, supervisors, or reviewers inspect the result through a product surface.', icon: Code2 },
    ],
  },
];

function EngineeringNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="border border-border-muted bg-bg-panel font-mono text-xs">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-accent transition-colors hover:text-accent-bright"
      >
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
          <StickyNote className="h-3.5 w-3.5" />
          {title}
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
    </aside>
  );
}

function StageDetails({ stage }: { stage: Stage }) {
  return (
    <motion.div
      key={stage.label}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="min-h-[258px] border border-border-muted bg-bg-panel px-5 py-5"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{stage.eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{stage.label}</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ['Problem', stage.problem],
          ['Solution', stage.solution],
          ['Result', stage.result],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-border-muted pt-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AutomationShowcase() {
  const [active, setActive] = useState(0);
  const activeStage = automationStages[active];

  return (
    <section id="automation" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Workflow className="h-4 w-4" />
            Automation Showcase
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Workflow builder as a thinking model</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Automation is not just connecting tools. The useful work is deciding where reliability,
            validation, and human review belong in the path.
          </p>
        </div>
        <EngineeringNote title="Engineering Note: why rules before output?">
          A workflow is easier to trust when its decision points are visible. The goal is not to
          hide judgment inside automation, but to remove repetition while preserving review.
        </EngineeringNote>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {automationStages.map((stage, index) => (
            <button
              key={stage.label}
              onClick={() => setActive(index)}
              className={`group flex min-h-20 items-center justify-between border px-4 py-3 text-left transition-all ${
                active === index
                  ? 'border-accent/45 bg-accent/10 text-text-primary'
                  : 'border-border-muted bg-bg-panel text-text-secondary hover:border-accent/25 hover:text-text-primary'
              }`}
            >
              <span>
                <span className="block font-mono text-[10px] text-text-muted">0{index + 1}</span>
                <span className="mt-1 block text-sm font-semibold">{stage.label}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-accent opacity-70 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
        <StageDetails stage={activeStage} />
      </div>
    </section>
  );
}

function CicdShowcase() {
  const [active, setActive] = useState(0);
  const activeStage = pipelineStages[active];
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % pipelineStages.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section id="cicd" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <GitBranch className="h-4 w-4" />
            CI/CD Showcase
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">A pipeline that explains its own risk controls</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            The animation here is informational: it shows which stage is responsible for confidence,
            reproducibility, and release control.
          </p>
        </div>
        <EngineeringNote title="Engineering Note: deployment confidence">
          The most useful CI check is the one that changes team behavior. At Axelliant, browser
          automation inside CI turned slow hybrid testing into a much tighter feedback loop.
        </EngineeringNote>
      </div>

      <div className="border border-border-muted bg-bg-panel p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {pipelineStages.map((stage, index) => {
            const isActive = active === index;
            const isPast =
              active > index || (active === 0 && index === pipelineStages.length - 1);

            return (
              <button
                key={stage.label}
                onClick={() => setActive(index)}
                className={`relative min-h-28 overflow-hidden border px-4 py-4 text-left transition-all ${
                  isActive
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border-muted bg-bg-dark hover:border-accent/25'
                }`}
              >
                <span className="font-mono text-[10px] text-text-muted">0{index + 1}</span>
                <span className="mt-2 block text-sm font-semibold text-text-primary">{stage.label}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-text-muted">{stage.eyebrow}</span>
                <motion.span
                  aria-hidden
                  animate={{ width: isActive ? '100%' : isPast ? '100%' : '0%' }}
                  transition={{ duration: reduceMotion ? 0 : isActive ? 3.4 : 0.25, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-0.5 bg-accent"
                />
              </button>
            );
          })}
        </div>
      </div>

      <StageDetails stage={activeStage} />
    </section>
  );
}

function ArchitectureShowcase() {
  const [activeId, setActiveId] = useState(architectureViews[0].id);
  const activeView = useMemo(
    () => architectureViews.find((view) => view.id === activeId) ?? architectureViews[0],
    [activeId]
  );

  return (
    <section id="architecture" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Database className="h-4 w-4" />
            Architecture Showcase
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">System maps that make data movement visible</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            These maps generalize patterns from the portfolio: compliance records, listing ingestion,
            forensic media analysis, and CI feedback loops all depend on visible data movement.
          </p>
        </div>
        <EngineeringNote title="Engineering Note: boundary-first design">
          Before choosing frameworks, Waleed looks for ownership boundaries: who creates the data,
          who can change it, who can review it, and what artifact proves the system did the right thing.
        </EngineeringNote>
      </div>

      <div className="flex flex-wrap gap-2">
        {architectureViews.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveId(view.id)}
            className={`border px-3 py-2 font-mono text-[11px] transition-all ${
              activeId === view.id
                ? 'border-accent/45 bg-accent/10 text-accent'
                : 'border-border-muted bg-bg-panel text-text-secondary hover:border-accent/25 hover:text-text-primary'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeView.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="border border-border-muted bg-bg-panel p-5"
      >
        <div className="mb-6 flex flex-col gap-2 border-b border-border-muted pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{activeView.label}</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">{activeView.note}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {activeView.nodes.map((node, index) => {
            const Icon = node.icon;
            return (
              <React.Fragment key={node.title}>
                <div className="min-h-44 border border-border-muted bg-bg-dark p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="font-mono text-[10px] text-text-muted">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-text-primary">{node.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-text-secondary">{node.detail}</p>
                </div>
                {index < activeView.nodes.length - 1 && (
                  <div className="flex items-center justify-center text-text-muted lg:hidden">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default function SystemsPage() {
  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <motion.section
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border-b border-border-muted pb-10"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Code2 className="h-4 w-4" />
            Pillar 02 // Systems
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Systems work is where the invisible parts become inspectable.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                This pillar shows the operating logic behind products: automation, CI/CD,
                data movement, system boundaries, and the tradeoffs that make software reliable after launch.
              </p>
            </div>
            <div className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Systems Lens</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['Reliability', 'Automation', 'Observability', 'Boundaries'].map((item) => (
                  <div key={item} className="border border-border-muted bg-bg-dark px-3 py-3">
                    <p className="font-mono text-[11px] text-text-secondary">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-3"
          aria-label="Systems principles"
        >
          {[
            {
              title: 'Design for failure',
              text: 'Retries, validation, and fallbacks are part of the product experience, not backend trivia.',
            },
            {
              title: 'Make flow visible',
              text: 'A good diagram answers where data comes from, where it changes, and who owns the result.',
            },
            {
              title: 'Automate judgment carefully',
              text: 'The goal is less manual work, not less accountability. Some checkpoints should stay explicit.',
            },
          ].map((item) => (
            <div key={item.title} className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          ))}
        </motion.section>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <AutomationShowcase />
        </motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <CicdShowcase />
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <ArchitectureShowcase />
        </motion.div>
      </div>
    </div>
  );
}
