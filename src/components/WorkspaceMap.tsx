'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { workspaceNodes } from '@/data/workspaceData';

const PILLARS = [
  {
    id: 'products',
    label: 'Products',
    number: '01',
    description: 'User-facing software built to solve real human problems and ship at production scale.',
    expandedDescription: 'This pillar reveals product judgment: compliance tools, real estate workflows, commerce surfaces, and decisions that balance user clarity with operational constraints.',
    href: '/products',
  },
  {
    id: 'systems',
    label: 'Systems',
    number: '02',
    description: 'Automation pipelines, CI/CD infrastructure, and system boundaries that keep delivery reliable.',
    expandedDescription: 'This pillar makes invisible engineering visible: validation loops, release confidence, data movement, failure boundaries, and the notes behind tradeoff decisions.',
    href: '/systems',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    number: '03',
    description: 'Applied AI, forensic media analysis, robotics skill composition, and safety evaluation.',
    expandedDescription: 'This pillar keeps AI grounded in evidence: uncertainty, review points, reusable skill architecture, red-team thinking, and systems that explain what they know.',
    href: '/intelligence',
  },
];

export default function WorkspaceMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePillar = PILLARS.find((pillar) => pillar.id === activeId) ?? null;
  const activeProjects = useMemo(() => {
    if (!activePillar) return [];
    return workspaceNodes.filter((node) => node.type === 'project' && node.pillar === activePillar.id);
  }, [activePillar]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16 grid gap-6 border-b border-border-muted pb-8 md:grid-cols-[1fr_420px] md:items-end">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Workspace Map</span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The Three Pillars</h2>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">
          A compact index of how the work is organized. The useful signal is not the categories themselves, but how a project moves between them.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl pb-14 pt-10">
        <div className="absolute left-0 right-0 top-[4.05rem] h-px bg-border-muted" />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PILLARS.map((pillar) => {
            const isActive = activeId === pillar.id;

            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                onMouseEnter={() => setActiveId(pillar.id)}
                onFocus={() => setActiveId(pillar.id)}
                onClick={() => setActiveId(pillar.id)}
                className="group relative flex min-h-28 flex-col items-start justify-start gap-4 focus:outline-none"
              >
                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px] transition-all ${
                    isActive
                      ? 'border-accent bg-accent text-bg-dark shadow-[0_0_24px_rgba(16,185,129,0.28)]'
                      : 'border-border-muted bg-bg-dark text-text-muted group-hover:border-accent/60 group-hover:text-accent'
                  }`}
                >
                  {pillar.number}
                </span>
                <span className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-4xl">
                  {pillar.label}
                  <ArrowUpRight className="h-4 w-4 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 min-h-48 border-t border-border-muted pt-8">
          <AnimatePresence mode="wait" initial={false}>
            {activePillar ? (
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]"
              >
                <div className="space-y-4">
                  <p className="max-w-3xl text-xl font-light leading-relaxed tracking-tight text-text-primary sm:text-2xl">
                    {activePillar.description}
                  </p>
                  <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
                    {activePillar.expandedDescription}
                  </p>
                </div>
                <div className="flex flex-wrap content-start gap-2 md:justify-end">
                  {activeProjects.slice(0, 4).map((project) => (
                    <span key={project.id} className="border border-accent/20 bg-accent/5 px-2 py-1 font-mono text-[9px] text-accent">
                      {project.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="font-mono text-[10px] uppercase tracking-widest text-text-muted"
              >
                Focus a point on the line.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
