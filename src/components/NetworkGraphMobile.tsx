'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceNode } from '@/data/workspaceData';

interface NetworkGraphMobileProps {
  nodes: WorkspaceNode[];
  onReady?: () => void;
}

const pillarColors: Record<string, string> = {
  products:     'border-accent/40 text-accent',
  systems:      'border-accent/35 text-accent',
  intelligence: 'border-accent/30 text-accent',
};

const pillarBg: Record<string, string> = {
  products:     'bg-accent/5',
  systems:      'bg-accent/5',
  intelligence: 'bg-accent/5',
};

export default function NetworkGraphMobile({ nodes, onReady }: NetworkGraphMobileProps) {
  const pillars = nodes.filter(n => n.type === 'pillar');
  const projects = nodes.filter(n => n.type === 'project');
  const techNodes = nodes.filter(n => n.type === 'technology').slice(0, 8);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

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
