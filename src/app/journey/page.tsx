'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  Database,
  GraduationCap,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
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

const educationNodes: JourneyNode[] = [
  {
    id: 'gcl',
    company: 'Government College Lahore',
    role: 'FSC',
    period: '08/2020 - 06/2022',
    angle: 'Foundations',
    description: 'Early academic foundation before moving into computer science and product engineering.',
    lessons: [
      'Built the discipline for technical study before the work became product-shaped.',
      'Created the base that later made CS fundamentals and implementation work easier to connect.',
    ],
    projects: ['Academic foundation'],
    skills: ['Mathematics', 'Science foundations'],
    icon: GraduationCap,
  },
  {
    id: 'fast',
    company: 'FAST NUCES',
    role: 'Bachelor of Computer Science',
    period: '09/2022 - 06/2026',
    angle: 'CS fundamentals',
    description: 'Computer science training in Lahore, still in progress, grounding the portfolio in algorithms, data structures, databases, and system thinking.',
    lessons: [
      'Model the problem before choosing the implementation tool.',
      'Use fundamentals to make product decisions easier to reason about under constraints.',
    ],
    projects: ['DeepShield', 'Robotics skill architecture'],
    skills: ['Algorithms', 'Data Structures', 'Databases', 'Python'],
    icon: GraduationCap,
  },
];

const experienceNodes: JourneyNode[] = [
  {
    id: 'arrivy',
    company: 'Arrivy',
    role: 'QA Engineer Intern',
    period: '06/2023 - 08/2023',
    angle: 'Quality systems',
    description: 'Worked on QA for an employee management system and an automation tool, both shipped to production, while helping maintain quality and schedules in a seven-member intern team.',
    lessons: [
      'Shipping is not only writing features; it is keeping quality visible enough for a team to trust the release.',
      'Testing work teaches where product assumptions break before users find the breakage.',
    ],
    projects: ['Employee management system', 'Automation tool'],
    skills: ['QA', 'Release discipline', 'Team coordination'],
    icon: ShieldCheck,
  },
  {
    id: 'ashtex',
    company: 'Ashtex Solutions',
    role: 'Software Engineer & Assistant Project Manager',
    period: '06/2024 - 10/2024',
    angle: 'Client delivery',
    description: 'Built React and automation tooling for client-facing products while managing documentation, sprint delivery, and cross-team coordination.',
    lessons: [
      'Client work rewards clear communication as much as implementation speed.',
      'Automation only helps when the people using it can understand what it is doing.',
    ],
    projects: ['Client-facing products', 'Automation tooling'],
    skills: ['React', 'Automation tooling', 'Laravel', 'Make.com'],
    icon: Layers,
  },
  {
    id: 'axelliant',
    company: 'Axelliant',
    role: 'Automation & CI/CD Engineer',
    period: '04/2025 - 02/2026',
    angle: 'Systems delivery',
    description: 'Worked on GitHub Actions parallel pipelines, deployment reliability, and automated test frameworks using Playwright and Cypress in CI.',
    lessons: [
      'A pipeline is a product for engineers: it has users, failure states, feedback loops, and trust requirements.',
      'Measured-in-practice automation can change team behavior when it compresses multi-day testing into hours.',
    ],
    projects: ['CI/CD pipelines', 'Playwright/Cypress test automation'],
    skills: ['GitHub Actions', 'Playwright', 'Cypress', 'CI/CD'],
    icon: Database,
  },
  {
    id: 'future',
    company: 'Future',
    role: 'Next product and systems chapter',
    period: 'Next',
    angle: 'Direction',
    description: 'The forward-looking node keeps the map open: more product ownership, deeper systems work, and applied intelligence that earns trust through evidence.',
    lessons: [
      'The next step should compound the same pattern: own real problems, expose the system, and ship with accountability.',
      'Future work belongs here only if it strengthens the proof that Waleed can own a product or feature end to end.',
    ],
    projects: ['Product ownership', 'Systems architecture', 'Applied AI workflows'],
    skills: ['Ownership', 'System design', 'Applied AI'],
    icon: Sparkles,
  },
];

const journeyNodes = [...educationNodes, ...experienceNodes];

export default function JourneyPage() {
  const [activeId, setActiveId] = useState('axelliant');
  const activeNode = useMemo(
    () => journeyNodes.find((node) => node.id === activeId) ?? experienceNodes[0],
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
                Education sets the foundation. Experience carries the main narrative: quality,
                client delivery, CI/CD ownership, and the next systems-oriented chapter.
              </p>
            </div>
            <aside className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Sanity check</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                The through-line is ownership: quality, delivery, automation, and systems thinking
                all point back to building software that can survive real users and real teams.
              </p>
            </aside>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_390px] lg:items-start">
          <div className="space-y-6">
            <div className="border border-border-muted bg-bg-panel/70 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-muted pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Foundations</p>
                  <p className="mt-1 text-xs text-text-muted">Education, shown as supporting context.</p>
                </div>
                <GraduationCap className="h-4 w-4 text-accent" />
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                {educationNodes.map((node, index) => {
                  const Icon = node.icon;
                  const selected = node.id === activeId;

                  return (
                    <React.Fragment key={node.id}>
                      <button
                        id={node.id}
                        onClick={() => setActiveId(node.id)}
                        className={`min-h-24 border px-4 py-3 text-left transition-all ${
                          selected
                            ? 'border-accent/45 bg-accent/10'
                            : 'border-border-muted bg-bg-dark/70 hover:border-accent/25'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Icon className={`h-4 w-4 ${selected ? 'text-accent' : 'text-text-muted'}`} />
                          <span className="font-mono text-[10px] text-text-muted">{node.period}</span>
                        </div>
                        <h2 className="mt-3 text-sm font-semibold text-text-primary">{node.company}</h2>
                        <p className="mt-1 text-[11px] font-mono leading-relaxed text-text-secondary">{node.role}</p>
                      </button>
                      {index < educationNodes.length - 1 && (
                        <div className="hidden items-center justify-center text-text-muted sm:flex">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="border border-border-muted bg-bg-panel p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-border-muted pb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Experience track</p>
                  <p className="mt-1 text-xs text-text-muted">Chronological, left to right on desktop.</p>
                </div>
                <Network className="h-4 w-4 text-accent" />
              </div>

              <div className="grid gap-3 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:items-stretch">
                {experienceNodes.map((node, index) => {
                  const Icon = node.icon;
                  const selected = node.id === activeId;
                  const isFuture = node.id === 'future';

                  return (
                    <React.Fragment key={node.id}>
                      <button
                        id={node.id}
                        onClick={() => setActiveId(node.id)}
                        className={`min-h-44 border px-4 py-4 text-left transition-all ${
                          selected
                            ? 'border-accent/50 bg-accent/10'
                            : isFuture
                              ? 'border-border-muted border-dashed bg-bg-dark/60 hover:border-accent/25'
                              : 'border-border-muted bg-bg-dark hover:border-accent/25'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Icon className={`h-5 w-5 ${selected ? 'text-accent' : 'text-text-muted'}`} />
                          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                            {node.angle}
                          </span>
                        </div>
                        <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-accent">{node.period}</p>
                        <h2 className="mt-2 text-base font-semibold text-text-primary">{node.company}</h2>
                        <p className="mt-1 text-[11px] font-mono leading-relaxed text-text-secondary">{node.role}</p>
                      </button>
                      {index < experienceNodes.length - 1 && (
                        <div className="hidden items-center justify-center text-text-muted xl:flex">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
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
            <p>Each node answers the same question: what did this stage teach Waleed about building reliable software?</p>
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
