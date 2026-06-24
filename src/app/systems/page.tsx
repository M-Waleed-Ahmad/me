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
    problem: '{{PLACEHOLDER: Describe the manual event that used to start this workflow, such as a client upload, CRM update, or intake form submission.}}',
    solution: '{{PLACEHOLDER: Explain the trigger source, validation boundary, and how duplicate events are detected.}}',
    result: '{{PLACEHOLDER: Replace with the real time saved or reliability improvement once measured.}}',
  },
  {
    label: 'Processing',
    eyebrow: 'Normalize and enrich',
    problem: '{{PLACEHOLDER: Describe the messy input shape: inconsistent fields, missing values, or third-party API variance.}}',
    solution: '{{PLACEHOLDER: Explain the normalization layer, API calls, retry policy, and logging approach.}}',
    result: '{{PLACEHOLDER: Replace with the real reduction in manual clean-up or error rate.}}',
  },
  {
    label: 'Decision',
    eyebrow: 'Rules before action',
    problem: '{{PLACEHOLDER: Describe where the workflow needs human judgment, routing logic, or approval checks.}}',
    solution: '{{PLACEHOLDER: Explain the branching rules and what stays intentionally human-reviewed.}}',
    result: '{{PLACEHOLDER: Replace with the real approval speed or exception handling outcome.}}',
  },
  {
    label: 'Output',
    eyebrow: 'Write, notify, sync',
    problem: '{{PLACEHOLDER: Describe the final handoff problem: missed notifications, stale records, or duplicate entry.}}',
    solution: '{{PLACEHOLDER: Explain the destination systems and how successful writes are confirmed.}}',
    result: '{{PLACEHOLDER: Replace with the real operational impact.}}',
  },
];

const pipelineStages: Stage[] = [
  {
    label: 'Code Push',
    eyebrow: 'Branch protection starts here',
    problem: '{{PLACEHOLDER: What used to make changes risky before CI existed?}}',
    solution: '{{PLACEHOLDER: Describe branch rules, required reviews, and commit checks.}}',
    result: '{{PLACEHOLDER: Replace with the real merge confidence improvement.}}',
  },
  {
    label: 'Tests',
    eyebrow: 'Fast feedback loop',
    problem: '{{PLACEHOLDER: Which regressions were most expensive to catch manually?}}',
    solution: '{{PLACEHOLDER: Describe unit, integration, and smoke checks that run automatically.}}',
    result: '{{PLACEHOLDER: Replace with the real defect catch rate or escaped bug reduction.}}',
  },
  {
    label: 'Build',
    eyebrow: 'Reproducible artifact',
    problem: '{{PLACEHOLDER: What environment drift or packaging issue caused deployment risk?}}',
    solution: '{{PLACEHOLDER: Describe container build, environment validation, and artifact versioning.}}',
    result: '{{PLACEHOLDER: Replace with the real build stability or rollback speed.}}',
  },
  {
    label: 'Deploy',
    eyebrow: 'Controlled release',
    problem: '{{PLACEHOLDER: What made manual deployment fragile or slow?}}',
    solution: '{{PLACEHOLDER: Describe automated deploy, health checks, and rollback criteria.}}',
    result: '{{PLACEHOLDER: Replace with the real deployment frequency or recovery time.}}',
  },
];

const architectureViews: ArchitectureView[] = [
  {
    id: 'product-backend',
    label: 'Product Backend',
    note: 'A typical product architecture view: user actions move through an API boundary, domain rules, storage, and async workers.',
    nodes: [
      { title: 'Client App', detail: '{{PLACEHOLDER: Describe the frontend surface and primary user actions.}}', icon: Blocks },
      { title: 'API Boundary', detail: '{{PLACEHOLDER: Describe auth, request validation, and rate limiting.}}', icon: Route },
      { title: 'Domain Services', detail: '{{PLACEHOLDER: Describe the business logic layer and why it is isolated.}}', icon: Braces },
      { title: 'PostgreSQL', detail: '{{PLACEHOLDER: Describe relational data shape, constraints, and indexes.}}', icon: Database },
      { title: 'Workers', detail: '{{PLACEHOLDER: Describe background tasks such as notifications, sync, or reporting.}}', icon: Repeat2 },
    ],
  },
  {
    id: 'integration-flow',
    label: 'Integration Flow',
    note: 'A systems integration view: external events are treated as unreliable until validated, logged, and confirmed.',
    nodes: [
      { title: 'External System', detail: '{{PLACEHOLDER: Name the source system or integration category.}}', icon: Webhook },
      { title: 'Ingestion Guard', detail: '{{PLACEHOLDER: Describe signature checks, schema validation, and replay protection.}}', icon: ShieldCheck },
      { title: 'Queue / Buffer', detail: '{{PLACEHOLDER: Describe buffering, retries, and poison-event handling.}}', icon: Split },
      { title: 'Transform', detail: '{{PLACEHOLDER: Describe mapping from third-party payload to internal model.}}', icon: Settings2 },
      { title: 'Destination Sync', detail: '{{PLACEHOLDER: Describe write confirmation and reconciliation.}}', icon: Server },
    ],
  },
  {
    id: 'data-pipeline',
    label: 'Data Pipeline',
    note: 'A data movement view: raw inputs become trusted, queryable state only after normalization and auditability.',
    nodes: [
      { title: 'Raw Input', detail: '{{PLACEHOLDER: Describe imported files, events, or API responses.}}', icon: GitCommit },
      { title: 'Normalizer', detail: '{{PLACEHOLDER: Describe cleaning, coercion, and rejected-record handling.}}', icon: Workflow },
      { title: 'Validation', detail: '{{PLACEHOLDER: Describe required checks before data becomes trusted.}}', icon: CheckCircle2 },
      { title: 'Stored State', detail: '{{PLACEHOLDER: Describe tables, materialized views, or cache.}}', icon: Database },
      { title: 'Consumer', detail: '{{PLACEHOLDER: Describe dashboards, apps, or APIs consuming the data.}}', icon: Code2 },
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
          {'{{PLACEHOLDER: Short first-person note on why Waleed keeps decision logic explicit instead of hiding it inside one large automation scenario.}}'}
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
          {'{{PLACEHOLDER: Short first-person note on the smallest CI check that prevented the biggest category of failures.}}'}
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
            These maps are placeholders for real project diagrams, but the interaction model is the point:
            inspect the flow, then inspect the reasoning behind each boundary.
          </p>
        </div>
        <EngineeringNote title="Engineering Note: boundary-first design">
          {'{{PLACEHOLDER: Short first-person note on why Waleed sketches boundaries and data ownership before choosing frameworks.}}'}
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
