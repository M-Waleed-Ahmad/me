import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';

const OTHER_WORK = [
  {
    name: '{{PLACEHOLDER: Project name}}',
    type: '{{PLACEHOLDER: e.g. Internal Tool / Freelance / Open Source}}',
    summary: '{{PLACEHOLDER: 1–2 sentences on what was built and what problem it solved.}}',
    tech: ['{{PLACEHOLDER: tech}}'],
  },
  {
    name: '{{PLACEHOLDER: Project name}}',
    type: '{{PLACEHOLDER: e.g. Experiment / Client Build}}',
    summary: '{{PLACEHOLDER: 1–2 sentences on what was built and what problem it solved.}}',
    tech: ['{{PLACEHOLDER: tech}}'],
  },
];

export default function OtherWorkPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Products
      </Link>

      <div className="border-b border-border-muted pb-8 mb-10 space-y-3">
        <div className="flex items-center gap-2 font-mono text-[10px] text-accent tracking-widest uppercase">
          <Package className="w-3.5 h-3.5" /> Other Work
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Freelance Builds & Experiments</h1>
        <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
          {'{{PLACEHOLDER: Short framing — what does "other work" represent? Exploration, client variety, proof-of-concept work?}}'}
        </p>
      </div>

      <div className="space-y-4">
        {OTHER_WORK.map((project, i) => (
          <div key={i} className="p-6 rounded-xl border border-border-muted bg-bg-panel space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">{project.type}</p>
                <h2 className="text-lg font-bold">{project.name}</h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{project.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map(t => (
                <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-border-muted bg-bg-dark text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
