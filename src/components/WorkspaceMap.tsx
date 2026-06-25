'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const activePillar = PILLARS[activeIndex];
  const activeProjects = useMemo(() => {
    return workspaceNodes.filter((node) => node.type === 'project' && node.pillar === activePillar.id);
  }, [activePillar]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % PILLARS.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

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
          {PILLARS.map((pillar, index) => {
            const isActive = activeIndex === index;

            return (
              <Link
                key={pillar.id}
                href={pillar.href}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
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
                  {isActive && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-[-7px] rounded-full border border-accent/35"
                      initial={{ opacity: 0, scale: 0.72 }}
                      animate={{ opacity: [0.2, 0.75, 0.2], scale: [0.88, 1.18, 0.88] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </span>
                <span className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent sm:text-4xl">
                  {pillar.label}
                  <ArrowUpRight className="h-4 w-4 text-text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </span>
                <motion.span
                  aria-hidden
                  className="h-0.5 bg-accent"
                  initial={false}
                  animate={{ width: isActive ? '72%' : '0%', opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.32 }}
                />
              </Link>
            );
          })}
        </div>

        <div className="mt-10 min-h-48 border-t border-border-muted pt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
              className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]"
            >
              <div className="space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  Active pillar / {activePillar.number}
                </p>
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
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
