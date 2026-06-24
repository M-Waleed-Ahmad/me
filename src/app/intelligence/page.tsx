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
    label: 'Media Intake',
    eyebrow: 'Source quality first',
    question: 'What kind of media is being inspected, and how much evidence can the system safely extract?',
    method: 'Images move directly into the image path. Video is sampled with OpenCV using 8 evenly spaced frames so review is not based on one convenient moment.',
    signal: 'The pipeline treats the media as evidence to inspect, not a file to label instantly.',
    icon: Play,
  },
  {
    label: 'UCF Encoder',
    eyebrow: 'Primary separation model',
    question: 'Can the primary model separate real-looking media from manipulated media strongly enough to guide review?',
    method: 'The UCF dual-encoder is the primary model path. In Waleed\'s notes, real samples generally separated around 0.45-0.60 and fake samples around 0.80-0.95.',
    signal: 'The output is treated as a score band, not a single absolute truth.',
    icon: Layers3,
  },
  {
    label: 'Xception Analysis',
    eyebrow: 'Feature-level anomaly search',
    question: 'What happens when the supporting video-frame model sees a stronger alarm than the primary path?',
    method: 'Xception inspects video frames as supporting evidence. Fusion normally weights UCF/Xception at 0.80/0.20, shifting toward 0.55/0.45 when Xception raises a strong alarm.',
    signal: 'The second model can change confidence without hiding which path influenced the result.',
    icon: BrainCircuit,
  },
  {
    label: 'GradCAM++',
    eyebrow: 'Make the model inspectable',
    question: 'What would a reviewer need to see before trusting the model output?',
    method: 'Grad-CAM++ heatmaps are generated from encoder_f.block12 for images or the peak-frame Xception block for video, then resized back to the original media.',
    signal: 'The heatmap shows where the model looked, which supports review without pretending to prove intent.',
    icon: Eye,
  },
  {
    label: 'Confidence Bands',
    eyebrow: 'Communicate uncertainty',
    question: 'How should the system express confidence without overstating certainty?',
    method: 'Bands are explicit: Real <= 0.30, Unsure 0.30-0.65, Likely Fake 0.65-0.85, and Strong Fake > 0.85.',
    signal: 'A 51% finding and a 99% finding are not presented as the same kind of conclusion.',
    icon: SlidersHorizontal,
  },
  {
    label: 'Forensic Result',
    eyebrow: 'Decision support, not magic',
    question: 'How does the result remain reviewable after the model has made a prediction?',
    method: 'DeepShield packages the verdict, confidence band, heatmap evidence, blockchain tamper-evident result data, and a forensic PDF with QR verification.',
    signal: 'The output is built for audit and human review rather than blind trust.',
    icon: ShieldCheck,
  },
];

const roboticsNodes: SkillNode[] = [
  {
    label: 'Goal',
    level: 'Intent layer',
    detail: 'The interface starts from a behavior such as navigating, avoiding obstacles, or completing a composed task inside a controlled arena.',
    icon: Target,
  },
  {
    label: 'Planner',
    level: 'Task decomposition',
    detail: 'Rule-based structure breaks the behavior into checkpoints so learned components do not have to own the entire control problem.',
    icon: GitBranch,
  },
  {
    label: 'Skill Library',
    level: 'Reusable actions',
    detail: 'Reusable skills combine rule-based behavior with learned ML behavior, making the system easier to inspect than one monolithic policy.',
    icon: Network,
  },
  {
    label: 'Policy',
    level: 'State-aware choice',
    detail: 'An imitation-learning pipeline generates training data through automated expert rollouts, avoiding manual teleoperation as the only data source.',
    icon: Route,
  },
  {
    label: 'Feedback',
    level: 'Closed-loop correction',
    detail: 'Navigation and obstacle avoidance compose reliably, while larger maze-scale arenas exposed harder reactive-control tuning still being resolved.',
    icon: Radar,
  },
];

const researchCards: ResearchCard[] = [
  {
    label: 'Threat Model',
    prompt: 'What failure mode is the model or agent most likely to miss under adversarial wording?',
    evidence: 'Logs, failed examples, and repeated prompts that show whether the behavior is stable or brittle.',
    response: 'Turn the failure into a named eval case before choosing a mitigation.',
    icon: AlertTriangle,
  },
  {
    label: 'Evaluation Set',
    prompt: 'Which prompt families, edge cases, or tool-use scenarios belong in the test set?',
    evidence: 'Ambiguous cases need review notes, not just pass/fail labels.',
    response: 'Measure refusal quality, instruction hierarchy, data access behavior, and recovery from unsafe requests.',
    icon: FileSearch,
  },
  {
    label: 'Attack Surface',
    prompt: 'Where can user input, tool output, retrieved data, or system instructions conflict?',
    evidence: 'The useful trace shows which instruction source won and why.',
    response: 'Constrain tool use, isolate untrusted content, and make conflicting instructions visible.',
    icon: ScanFace,
  },
  {
    label: 'Defense Pattern',
    prompt: 'Which defense reduces the failure without blocking legitimate work?',
    evidence: 'A defense is useful only if it improves the eval set while preserving normal user tasks.',
    response: 'Prefer proportional guardrails and document the tradeoff they introduce.',
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
          Most detection tools hand you a verdict and ask you to trust it. DeepShield is designed
          around the opposite idea: show the score, the uncertainty band, and the evidence trail.
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
          Reusable skill boundaries make the robot easier to debug. When a composed behavior fails,
          you can inspect the planner, the learned skill, or the feedback loop instead of guessing.
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
          Red teaming is still an exploration area here, so the honest version is a research board:
          define the risk, collect evidence, and avoid pretending general interest is production proof.
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
                This pillar focuses on technical curiosity without AI theater: DeepShield&apos;s forensic
                media pipeline, a robotics skill-composition interface, and early red-teaming research.
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
