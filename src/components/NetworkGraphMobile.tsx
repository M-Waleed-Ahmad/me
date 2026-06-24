'use client';

import React from 'react';
import Link from 'next/link';
import { WorkspaceNode } from '@/data/workspaceData';

interface NetworkGraphMobileProps {
  nodes: WorkspaceNode[];
}

const pillarColors: Record<string, string> = {
  products:     'border-emerald-500/40 text-emerald-400',
  systems:      'border-blue-500/30 text-blue-400',
  intelligence: 'border-violet-500/30 text-violet-400',
};

const pillarBg: Record<string, string> = {
  products:     'bg-emerald-500/5',
  systems:      'bg-blue-500/5',
  intelligence: 'bg-violet-500/5',
};

export default function NetworkGraphMobile({ nodes }: NetworkGraphMobileProps) {
  const pillars = nodes.filter(n => n.type === 'pillar');
  const projects = nodes.filter(n => n.type === 'project');
  const techNodes = nodes.filter(n => n.type === 'technology').slice(0, 8);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-4 py-8 overflow-auto">
      {/* Pillar Clusters */}
      {pillars.map(pillar => {
        const pillarProjects = projects.filter(p => p.pillar === pillar.id);
        const colorClass = pillarColors[pillar.id] ?? 'border-border-muted text-text-secondary';
        const bgClass = pillarBg[pillar.id] ?? '';

        return (
          <div key={pillar.id} className={`w-full rounded-xl border p-4 ${bgClass} ${colorClass}`}>
            {/* Pillar header node */}
            <Link
              href={pillar.url ?? '#'}
              className="flex items-center gap-2 mb-3"
            >
              <span className={`w-3 h-3 rounded-full border-2 ${colorClass} bg-transparent`} />
              <span className={`text-xs font-mono font-semibold uppercase tracking-widest ${colorClass}`}>
                {pillar.label}
              </span>
            </Link>

            {/* Project child nodes */}
            <div className="flex flex-wrap gap-2 pl-5">
              {pillarProjects.map(proj => (
                <Link
                  key={proj.id}
                  href={proj.url ?? '#'}
                  className="text-[11px] font-mono px-2.5 py-1 rounded border border-border-muted bg-bg-dark text-text-secondary hover:border-accent/40 hover:text-text-primary transition-all"
                >
                  {proj.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Technology tag cloud */}
      <div className="w-full">
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2 text-center">
          Technologies in the workspace
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {techNodes.map(t => (
            <span
              key={t.id}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-bg-panel border border-border-muted text-text-muted"
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
