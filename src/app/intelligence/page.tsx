'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Eye,
  FileSearch,
  GitBranch,
  Layers3,
  Network,
  Play,
  Radar,
  Route,
  ScanFace,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Workflow,
} from 'lucide-react';

type PipelineStage = {
  label: string;
  eyebrow: string;
  question: string;
  method: string;
  signal: string;
  icon: React.ElementType;
};

type SkillNode = {
  label: string;
  level: string;
  detail: string;
  icon: React.ElementType;
};

type ResearchCard = {
  label: string;
  prompt: string;
  evidence: string;
  response: string;
  icon: React.ElementType;
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

const deepShieldStages: PipelineStage[] = [
  {
    label: 'Video Input',
    eyebrow: 'Source quality first',
    question: '{{PLACEHOLDER: What kind of input does DeepShield receive, and what makes the input hard to trust?}}',
    method: '{{PLACEHOLDER: Describe frame sampling, face detection, normalization, and any rejected-input rules.}}',
    signal: '{{PLACEHOLDER: Replace with real input-quality checks or dataset constraints.}}',
    icon: Play,
  },
  {
    label: 'Dual Encoder',
    eyebrow: 'Compare visual evidence',
    question: '{{PLACEHOLDER: Why does the model need more than a single visual representation?}}',
    method: '{{PLACEHOLDER: Describe the two encoder paths at a high level without inventing unpublished architecture specifics.}}',
    signal: '{{PLACEHOLDER: Replace with real model-inspection notes or ablation findings.}}',
    icon: Layers3,
  },
  {
    label: 'Xception Analysis',
    eyebrow: 'Feature-level anomaly search',
    question: '{{PLACEHOLDER: What artifact patterns was Xception expected to detect in manipulated frames?}}',
    method: '{{PLACEHOLDER: Explain why this backbone was considered and what alternatives were compared.}}',
    signal: '{{PLACEHOLDER: Replace with real validation metric, marked clearly if still pending.}}',
    icon: BrainCircuit,
  },
  {
    label: 'GradCAM++',
    eyebrow: 'Make the model inspectable',
    question: '{{PLACEHOLDER: What would a user or reviewer need to see before trusting the model output?}}',
    method: '{{PLACEHOLDER: Explain heatmap generation and how it supports review rather than pretending to be proof.}}',
    signal: '{{PLACEHOLDER: Replace with real examples of useful or misleading heatmaps.}}',
    icon: Eye,
  },
  {
    label: 'Confidence Score',
    eyebrow: 'Communicate uncertainty',
    question: '{{PLACEHOLDER: How should the system express confidence without overstating certainty?}}',
    method: '{{PLACEHOLDER: Describe score calibration, thresholds, and what lands in a review band.}}',
    signal: '{{PLACEHOLDER: Replace with real threshold logic or calibration notes.}}',
    icon: SlidersHorizontal,
  },
  {
    label: 'Result',
    eyebrow: 'Decision support, not magic',
    question: '{{PLACEHOLDER: What decision does DeepShield help a user make, and where does human review remain necessary?}}',
    method: '{{PLACEHOLDER: Describe the result format, explanation layer, and failure-state messaging.}}',
    signal: '{{PLACEHOLDER: Replace with real output examples or review workflow.}}',
    icon: ShieldCheck,
  },
];

const roboticsNodes: SkillNode[] = [
  {
    label: 'Goal',
    level: 'Intent layer',
    detail: '{{PLACEHOLDER: Describe a high-level behavior the robot should achieve.}}',
    icon: Target,
  },
  {
    label: 'Planner',
    level: 'Task decomposition',
    detail: '{{PLACEHOLDER: Explain how the goal splits into smaller skills or checkpoints.}}',
    icon: GitBranch,
  },
  {
    label: 'Skill Library',
    level: 'Reusable actions',
    detail: '{{PLACEHOLDER: Describe reusable primitives such as pick, place, inspect, or navigate.}}',
    icon: Network,
  },
  {
    label: 'Policy',
    level: 'State-aware choice',
    detail: '{{PLACEHOLDER: Explain how state, confidence, and constraints select the next action.}}',
    icon: Route,
  },
  {
    label: 'Feedback',
    level: 'Closed-loop correction',
    detail: '{{PLACEHOLDER: Describe sensor feedback and recovery when the world does not match the plan.}}',
    icon: Radar,
  },
];

const researchCards: ResearchCard[] = [
  {
    label: 'Threat Model',
    prompt: '{{PLACEHOLDER: What failure mode or attack class is being evaluated?}}',
    evidence: '{{PLACEHOLDER: What evidence would prove the system is vulnerable or resilient?}}',
    response: '{{PLACEHOLDER: What mitigation or guardrail would be considered?}}',
    icon: AlertTriangle,
  },
  {
    label: 'Evaluation Set',
    prompt: '{{PLACEHOLDER: What prompts, tasks, or scenarios belong in the test set?}}',
    evidence: '{{PLACEHOLDER: How are ambiguous cases labeled or reviewed?}}',
    response: '{{PLACEHOLDER: What gets measured beyond pass/fail?}}',
    icon: FileSearch,
  },
  {
    label: 'Attack Surface',
    prompt: '{{PLACEHOLDER: Where can instructions, data, tools, or user inputs conflict?}}',
    evidence: '{{PLACEHOLDER: What traces or logs make the failure observable?}}',
    response: '{{PLACEHOLDER: How does the system constrain tool use or data access?}}',
    icon: ScanFace,
  },
  {
    label: 'Defense Pattern',
    prompt: '{{PLACEHOLDER: Which defensive pattern was considered and why?}}',
    evidence: '{{PLACEHOLDER: What would show this defense is working without blocking valid use?}}',
    response: '{{PLACEHOLDER: What tradeoff does this defense introduce?}}',
    icon: CheckCircle2,
  },
];

function ThinkingNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="border-l-2 border-accent bg-accent/5 px-4 py-3 font-mono text-xs leading-relaxed">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">{title}</p>
      <div className="mt-1 text-text-secondary">{children}</div>
    </aside>
  );
}

function DeepShieldPipeline() {
  const [active, setActive] = useState(0);
  const activeStage = deepShieldStages[active];
  const ActiveIcon = activeStage.icon;

  return (
    <section id="deepshield" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <ShieldCheck className="h-4 w-4" />
            DeepShield // Centerpiece
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            A detection pipeline designed around inspectability.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            DeepShield is presented as a pipeline rather than an AI demo because the interesting
            work is how uncertainty, model evidence, and human review move through the system.
          </p>
        </div>
        <ThinkingNote title="Thinking note: why inspectability matters">
          {'{{PLACEHOLDER: Short first-person note on why Waleed cares about evidence and reviewability in applied ML systems.}}'}
        </ThinkingNote>
      </div>

      <div className="border border-border-muted bg-bg-panel p-4 sm:p-5">
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
          {deepShieldStages.map((stage, index) => {
            const Icon = stage.icon;
            const selected = index === active;

            return (
              <button
                key={stage.label}
                onClick={() => setActive(index)}
                className={`group min-h-32 border px-4 py-4 text-left transition-all ${
                  selected
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border-muted bg-bg-dark hover:border-accent/25 hover:bg-bg-panel-hover'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon className={`h-4 w-4 ${selected ? 'text-accent' : 'text-text-muted group-hover:text-accent'}`} />
                  <span className="font-mono text-[10px] text-text-muted">0{index + 1}</span>
                </div>
                <p className="mt-5 text-sm font-semibold text-text-primary">{stage.label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{stage.eyebrow}</p>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={activeStage.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="grid gap-5 border border-border-muted bg-bg-panel p-5 lg:grid-cols-[260px_1fr]"
      >
        <div className="border border-border-muted bg-bg-dark p-5">
          <div className="flex h-16 w-16 items-center justify-center border border-accent/30 bg-accent/10">
            <ActiveIcon className="h-7 w-7 text-accent" />
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-accent">{activeStage.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{activeStage.label}</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Question', activeStage.question],
            ['Method', activeStage.method],
            ['Signal', activeStage.signal],
          ].map(([label, text]) => (
            <div key={label} className="border-t border-border-muted pt-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function RoboticsSkillArchitecture() {
  const [active, setActive] = useState(2);
  const activeNode = roboticsNodes[active];

  return (
    <section id="robotics" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Workflow className="h-4 w-4" />
            Robotics Skill Architecture
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Modular skills that compose into larger behavior.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            This section frames robotics as a system design problem: goals become plans,
            plans select skills, and feedback decides whether the system should continue,
            correct, or stop.
          </p>
        </div>
        <ThinkingNote title="Thinking note: composition over scripts">
          {'{{PLACEHOLDER: Short first-person note on why Waleed thinks reusable skill boundaries matter more than one-off robot routines.}}'}
        </ThinkingNote>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="border border-border-muted bg-bg-panel p-5">
          <div className="grid gap-3 md:grid-cols-5">
            {roboticsNodes.map((node, index) => {
              const Icon = node.icon;
              const selected = index === active;

              return (
                <button
                  key={node.label}
                  onClick={() => setActive(index)}
                  className={`min-h-40 border px-4 py-4 text-left transition-all ${
                    selected
                      ? 'border-accent/50 bg-accent/10'
                      : 'border-border-muted bg-bg-dark hover:border-accent/25'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${selected ? 'text-accent' : 'text-text-muted'}`} />
                  <p className="mt-5 text-sm font-semibold text-text-primary">{node.label}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">{node.level}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] text-text-muted">
            {roboticsNodes.map((node, index) => (
              <React.Fragment key={node.label}>
                <span className={index === active ? 'text-accent' : undefined}>{node.label}</span>
                {index < roboticsNodes.length - 1 && <ArrowRight className="h-3 w-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          key={activeNode.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="border border-border-muted bg-bg-panel p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Inspector</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{activeNode.label}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-text-muted">{activeNode.level}</p>
          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{activeNode.detail}</p>
        </motion.div>
      </div>
    </section>
  );
}

function RedTeamingResearch() {
  const [active, setActive] = useState(0);
  const activeCard = useMemo(() => researchCards[active], [active]);
  const ActiveIcon = activeCard.icon;

  return (
    <section id="red-teaming" className="scroll-mt-24 space-y-6 border-t border-border-muted pt-10">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Radar className="h-4 w-4" />
            Red Teaming Research
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            A research board for testing model behavior.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            This is not an AI hype wall. It is a lightweight evaluation framework:
            define the risk, gather evidence, then decide what defense is proportionate.
          </p>
        </div>
        <ThinkingNote title="Thinking note: evaluations before opinions">
          {'{{PLACEHOLDER: Short first-person note on why Waleed prefers explicit eval cases over vibes-based claims about model safety.}}'}
        </ThinkingNote>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {researchCards.map((card, index) => {
            const Icon = card.icon;
            const selected = index === active;

            return (
              <button
                key={card.label}
                onClick={() => setActive(index)}
                className={`flex min-h-20 items-center gap-3 border px-4 py-3 text-left transition-all ${
                  selected
                    ? 'border-accent/50 bg-accent/10'
                    : 'border-border-muted bg-bg-panel hover:border-accent/25'
                }`}
              >
                <Icon className={`h-4 w-4 ${selected ? 'text-accent' : 'text-text-muted'}`} />
                <span className="text-sm font-semibold text-text-primary">{card.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeCard.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="border border-border-muted bg-bg-panel p-5"
        >
          <div className="flex items-center gap-3 border-b border-border-muted pb-4">
            <div className="flex h-10 w-10 items-center justify-center border border-accent/25 bg-accent/10">
              <ActiveIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Evaluation Lens</p>
              <h3 className="text-xl font-semibold tracking-tight">{activeCard.label}</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ['Prompt', activeCard.prompt],
              ['Evidence', activeCard.evidence],
              ['Response', activeCard.response],
            ].map(([label, text]) => (
              <div key={label} className="border-t border-border-muted pt-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function IntelligencePage() {
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
            <Cpu className="h-4 w-4" />
            Pillar 03 // Intelligence
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Applied intelligence, shown as systems of evidence.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                This pillar focuses on technical curiosity without AI theater: model inspectability,
                modular skill design, safety evaluation, and the judgment needed to decide where automation helps.
              </p>
            </div>
            <div className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Intelligence Lens</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['Evidence', 'Uncertainty', 'Composition', 'Safety'].map((item) => (
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
          aria-label="Intelligence principles"
        >
          {[
            {
              title: 'Inspect before trusting',
              text: 'A model output is more useful when the system can explain what evidence shaped it.',
            },
            {
              title: 'Compose small skills',
              text: 'Robotics and AI systems become easier to reason about when complex behavior is built from named parts.',
            },
            {
              title: 'Evaluate failure modes',
              text: 'Red teaming starts by naming what can go wrong, then designing tests that make failures visible.',
            },
          ].map((item) => (
            <div key={item.title} className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.text}</p>
            </div>
          ))}
        </motion.section>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <DeepShieldPipeline />
        </motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <RoboticsSkillArchitecture />
        </motion.div>

        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
          <RedTeamingResearch />
        </motion.div>

        <motion.section
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="border-t border-border-muted pt-8"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Recruiter lens', 'This pillar supports the broader product story by showing technical depth behind shipped work.'],
              ['Engineer lens', 'The sections expose pipelines, boundaries, uncertainty, and evaluation logic.'],
              ['Founder lens', 'The framing shows judgment: when to automate, when to review, and how to manage risk.'],
            ].map(([label, text]) => (
              <div key={label} className="border border-border-muted bg-bg-panel p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{label}</p>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
