'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Code2, Cpu, ArrowUpRight } from 'lucide-react';
import { workspaceNodes } from '@/data/workspaceData';

const PILLARS = [
  {
    id: 'products',
    label: 'Products',
    number: '01',
    icon: Layers,
    description: 'User-facing software built to solve real human problems and ship at production scale.',
    expandedDescription: 'From mental health therapy platforms to luxury real estate portals — the work here centers on business outcomes, full lifecycle involvement, and real users who depend on the system.',
    color: 'accent',
    href: '/products',
  },
  {
    id: 'systems',
    label: 'Systems',
    number: '02',
    icon: Code2,
    description: 'Scalable backends, automation pipelines, and CI/CD infrastructure that runs without hand-holding.',
    expandedDescription: 'Backend architecture, data pipelines, webhook integrations, and zero-downtime deployment systems. This is where things break at 3am — and where design decisions matter most.',
    color: 'accent',
    href: '/systems',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    number: '03',
    icon: Cpu,
    description: 'Applied AI, computer vision research, and robotics skill composition architectures.',
    expandedDescription: 'Technical depth over hype. Computer vision pipelines, deepfake detection models, LLM safety testing, and hierarchical robotic behavior trees — built to understand, not just to use.',
    color: 'accent',
    href: '/intelligence',
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string; badge: string }> = {
  accent: {
    border: 'hover:border-accent/30 group-hover:border-accent/30',
    text:   'group-hover:text-accent',
    bg:     'group-hover:bg-accent/5',
    badge:  'bg-accent/10 text-accent border-accent/20',
  },
};

export default function WorkspaceMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border-muted pb-8">
        <div className="space-y-2">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">Workspace Map</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">The Three Pillars</h2>
        </div>
        <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
          Each pillar represents a distinct lens. Most work spans all three simultaneously.
        </p>
      </div>

      {/* Pillar cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const colors = colorMap[pillar.color];
          const projects = workspaceNodes.filter(n => n.type === 'project' && n.pillar === pillar.id);
          const isHovered = hovered === pillar.id;

          return (
            <Link
              key={pillar.id}
              href={pillar.href}
              onMouseEnter={() => setHovered(pillar.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative block p-8 rounded-xl bg-bg-panel border border-border-muted transition-all duration-300 ${colors.border} ${colors.bg} overflow-hidden`}
            >
              {/* Background grid texture */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Number badge + icon */}
              <div className="flex items-start justify-between mb-8">
                <div className={`p-3 rounded-lg bg-bg-dark border border-border-muted transition-colors duration-300 ${isHovered ? 'border-accent/20' : ''}`}>
                  <Icon className={`w-5 h-5 text-text-secondary transition-colors duration-300 ${colors.text}`} />
                </div>
                <span className="font-mono text-[10px] text-text-muted tracking-widest">
                  PILLAR_{pillar.number}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${colors.text}`}>
                {pillar.label}
              </h3>

              {/* Description — switches on hover */}
              <div className="relative min-h-[60px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={isHovered ? 'expanded' : 'collapsed'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-sm text-text-secondary leading-relaxed absolute inset-0"
                  >
                    {isHovered ? pillar.expandedDescription : pillar.description}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Footer row — projects + tech count */}
              <div className="mt-10 pt-4 border-t border-border-muted flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {projects.slice(0, 3).map(p => (
                    <span key={p.id} className={`text-[9px] font-mono px-2 py-0.5 rounded border ${colors.badge}`}>
                      {p.label}
                    </span>
                  ))}
                </div>
                <ArrowUpRight className={`w-4 h-4 text-text-muted transition-all duration-300 ${isHovered ? `${colors.text} translate-x-0.5 -translate-y-0.5` : ''}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
