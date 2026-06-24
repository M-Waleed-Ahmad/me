'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Code2,
  Compass,
  Database,
  GraduationCap,
  Layers,
  Network,
} from 'lucide-react';

type JourneyNode = {
  id: string;
  company: string;
  role: string;
  period: string;
  angle: string;
  description: string;
  lessons: string[];
  projects: string[];
  skills: string[];
  icon: React.ElementType;
};

const journeyNodes: JourneyNode[] = [
  {
    id: 'fast',
    company: 'FAST-NUCES',
    role: 'Computer Science Education',
    period: '{{PLACEHOLDER: confirm dates e.g. 2016 - 2020}}',
    angle: 'Fundamentals',
    description: '{{PLACEHOLDER: Confirm academic background and the systems fundamentals that shaped Waleed early: algorithms, data structures, operating systems, networks, or databases.}}',
    lessons: [
      '{{PLACEHOLDER: Lesson from CS fundamentals that still affects how Waleed designs systems.}}',
      '{{PLACEHOLDER: Lesson about modeling problems before choosing implementation tools.}}',
    ],
    projects: ['{{PLACEHOLDER: Academic or early project to confirm}}'],
    skills: ['Algorithms', 'Data Structures', 'C++', 'Python'],
    icon: GraduationCap,
  },
  {
    id: 'ashtex',
    company: 'Ashtex Solutions',
    role: '{{PLACEHOLDER: confirm role title}}',
    period: '{{PLACEHOLDER: confirm dates e.g. 2020 - 2022}}',
    angle: 'Production software',
    description: '{{PLACEHOLDER: Summarize Waleed impact at Ashtex, especially full-stack delivery, APIs, healthcare workflows, and production ownership.}}',
    lessons: [
      '{{PLACEHOLDER: Lesson from shipping real software for users or clients.}}',
      '{{PLACEHOLDER: Lesson about separating domain logic, API boundaries, and background work.}}',
    ],
    projects: ['WePsych', '{{PLACEHOLDER: confirm additional Ashtex project}}'],
    skills: ['FastAPI', 'React', 'Docker', 'REST APIs'],
    icon: Layers,
  },
  {
    id: 'arrivy',
    company: 'Arrivy',
    role: '{{PLACEHOLDER: confirm role title}}',
    period: '{{PLACEHOLDER: confirm dates e.g. 2022 - 2023}}',
    angle: 'Frontend systems',
    description: '{{PLACEHOLDER: Summarize Waleed impact at Arrivy, with emphasis on responsive interfaces, performance, and polished product surfaces.}}',
    lessons: [
      '{{PLACEHOLDER: Lesson about performance budgets, interaction feel, or mobile-first UX.}}',
      '{{PLACEHOLDER: Lesson about turning design intent into reliable UI implementation.}}',
    ],
    projects: ['ALFA Club', '{{PLACEHOLDER: confirm additional Arrivy project}}'],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    icon: Code2,
  },
  {
    id: 'axelliant',
    company: 'Axelliant',
    role: '{{PLACEHOLDER: confirm role title}}',
    period: '{{PLACEHOLDER: confirm dates e.g. 2023 - Present}}',
    angle: 'Systems and scale',
    description: '{{PLACEHOLDER: Summarize Waleed impact at Axelliant, especially database design, system architecture, automation, and delivery under real constraints.}}',
    lessons: [
      '{{PLACEHOLDER: Lesson about database constraints, data movement, or architecture boundaries.}}',
      '{{PLACEHOLDER: Lesson about making systems observable and maintainable after launch.}}',
    ],
    projects: ['Arabia Hills', '{{PLACEHOLDER: confirm additional Axelliant project}}'],
    skills: ['PostgreSQL', 'Supabase', 'Next.js', 'System Design'],
    icon: Database,
  },
];

const adjacent: Record<string, string[]> = {
  fast: ['ashtex', 'arrivy'],
  ashtex: ['fast', 'arrivy', 'axelliant'],
  arrivy: ['fast', 'ashtex', 'axelliant'],
  axelliant: ['ashtex', 'arrivy'],
};

const positions: Record<string, string> = {
  fast: 'md:col-start-1 md:row-start-2',
  ashtex: 'md:col-start-2 md:row-start-1',
  arrivy: 'md:col-start-3 md:row-start-2',
  axelliant: 'md:col-start-2 md:row-start-3',
};

export default function JourneyPage() {
  const [activeId, setActiveId] = useState('axelliant');
  const activeNode = useMemo(
    () => journeyNodes.find((node) => node.id === activeId) ?? journeyNodes[0],
    [activeId]
  );
  const ActiveIcon = activeNode.icon;

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <section className="border-b border-border-muted pb-8">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Briefcase className="h-4 w-4" />
            Journey
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                A career map organized by lessons, not dates.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                The Journey page is intentionally non-linear. It shows how each workspace contributed
                a different way of thinking: fundamentals, production ownership, interface craft, and systems design.
              </p>
            </div>
            <aside className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Waleed to confirm</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {'{{PLACEHOLDER: Confirm exact roles, dates, company ordering, and which projects belong to each node before launch.}}'}
              </p>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="border border-border-muted bg-bg-panel p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-border-muted pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Workspace map</p>
                <p className="mt-1 text-xs text-text-muted">Select any node to inspect how the lesson connects.</p>
              </div>
              <Network className="h-4 w-4 text-accent" />
            </div>

            <div className="grid gap-3 md:grid-cols-3 md:grid-rows-3">
              {journeyNodes.map((node) => {
                const Icon = node.icon;
                const selected = node.id === activeId;
                const connected = adjacent[activeId]?.includes(node.id);

                return (
                  <button
                    key={node.id}
                    id={node.id}
                    onClick={() => setActiveId(node.id)}
                    className={`min-h-36 border px-4 py-4 text-left transition-all ${positions[node.id]} ${
                      selected
                        ? 'border-accent/50 bg-accent/10'
                        : connected
                          ? 'border-accent/20 bg-bg-dark'
                          : 'border-border-muted bg-bg-dark hover:border-accent/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Icon className={`h-5 w-5 ${selected ? 'text-accent' : 'text-text-muted'}`} />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                        {node.angle}
                      </span>
                    </div>
                    <h2 className="mt-5 text-base font-semibold text-text-primary">{node.company}</h2>
                    <p className="mt-1 text-[11px] font-mono leading-relaxed text-text-secondary">{node.role}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.aside
            key={activeNode.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="border border-border-muted bg-bg-panel p-5"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-muted pb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{activeNode.period}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{activeNode.company}</h2>
                <p className="mt-1 text-xs font-mono text-text-secondary">{activeNode.role}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center border border-accent/25 bg-accent/10">
                <ActiveIcon className="h-5 w-5 text-accent" />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">What this reveals</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{activeNode.description}</p>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <BookOpen className="h-3.5 w-3.5 text-accent" />
                  Lessons carried forward
                </p>
                <div className="space-y-2">
                  {activeNode.lessons.map((lesson) => (
                    <div key={lesson} className="border border-border-muted bg-bg-dark p-3 text-xs leading-relaxed text-text-secondary">
                      {lesson}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <Compass className="h-3.5 w-3.5 text-accent" />
                  Connected work
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeNode.projects.map((project) => (
                    <span key={project} className="border border-border-muted bg-bg-dark px-2.5 py-1 font-mono text-[10px] text-text-secondary">
                      {project}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">Skills gained</p>
                <div className="flex flex-wrap gap-2">
                  {activeNode.skills.map((skill) => (
                    <span key={skill} className="border border-accent/15 bg-accent/5 px-2.5 py-1 font-mono text-[10px] text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </section>

        <section className="border-t border-border-muted pt-8">
          <div className="flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>Each node should eventually be backed by a real story, not a date range.</p>
            <a href="/explorer" className="inline-flex items-center gap-2 font-mono text-xs text-accent hover:text-accent-bright">
              Open Relationship Explorer
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
