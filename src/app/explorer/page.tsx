'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Code2,
  GitBranch,
  Hash,
  Layers,
  Network,
  Search,
  Zap,
} from 'lucide-react';
import {
  workspaceEdges,
  workspaceNodes,
  WorkspaceNode,
} from '@/data/workspaceData';
import { GraphPreview } from './GraphPreview';

const typeMeta: Record<WorkspaceNode['type'], { label: string; icon: React.ElementType; className: string }> = {
  pillar: { label: 'Pillar', icon: Hash, className: 'text-accent' },
  project: { label: 'Project', icon: Layers, className: 'text-text-primary' },
  technology: { label: 'Technology', icon: Code2, className: 'text-accent' },
  concept: { label: 'Concept', icon: Zap, className: 'text-accent' },
  experience: { label: 'Experience', icon: Briefcase, className: 'text-accent' },
};

const pillarLabels: Record<string, string> = {
  products: 'Products',
  systems: 'Systems',
  intelligence: 'Intelligence',
};

function getConnections(nodeId: string) {
  const edgeMatches = workspaceEdges.filter(
    (edge) => edge.source === nodeId || edge.target === nodeId
  );

  return edgeMatches
    .map((edge) => {
      const relatedId = edge.source === nodeId ? edge.target : edge.source;
      const related = workspaceNodes.find((node) => node.id === relatedId);

      return related
        ? {
            node: related,
            direction: edge.source === nodeId ? 'uses' : 'used by',
            label: edge.label,
          }
        : null;
    })
    .filter(Boolean) as { node: WorkspaceNode; direction: string; label?: string }[];
}

export default function RelationshipExplorerPage() {
  const [selectedId, setSelectedId] = useState('fastapi');
  const [query, setQuery] = useState('');
  const selectedNode = useMemo(
    () => workspaceNodes.find((node) => node.id === selectedId) ?? workspaceNodes[0],
    [selectedId]
  );

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaceNodes;

    return workspaceNodes.filter((node) =>
      [node.label, node.type, node.pillar ?? '', node.description ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const connections = useMemo(() => getConnections(selectedNode.id), [selectedNode.id]);
  const groupedConnections = useMemo(() => {
    return connections.reduce<Record<WorkspaceNode['type'], typeof connections>>(
      (groups, connection) => {
        groups[connection.node.type].push(connection);
        return groups;
      },
      {
        pillar: [],
        project: [],
        technology: [],
        concept: [],
        experience: [],
      }
    );
  }, [connections]);

  const SelectedIcon = typeMeta[selectedNode.type].icon;

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-b border-border-muted pb-8"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <Network className="h-4 w-4" />
            Relationship Explorer
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Inspect how projects, tools, concepts, and experience connect.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
                The graph below isn&apos;t a map of everything — it&apos;s a lens. It re-settles
                around whatever you select, showing only direct connections at a time.
              </p>
            </div>
            <aside className="border border-border-muted bg-bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Source of truth</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Data comes from <span className="font-mono text-text-primary">workspaceData.ts</span>, so this page evolves with the homepage graph rather than becoming a parallel content island.
              </p>
            </aside>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
          <aside className="sticky border border-border-muted bg-bg-panel p-4">
            <div className="flex items-center gap-2 border-b border-border-muted pb-3">
              <Search className="h-4 w-4 text-text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter nodes..."
                className="min-w-0 flex-1 bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
            </div>

            <div className="mt-4 max-h-[560px] space-y-1 overflow-y-auto pr-1">
              {filteredNodes.map((node) => {
                const Icon = typeMeta[node.type].icon;
                const selected = node.id === selectedNode.id;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`w-full border px-3 py-3 text-left transition-all duration-200 ${
                      selected
                        ? 'border-accent/50 bg-accent/10'
                        : 'border-transparent bg-bg-dark hover:border-accent/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${typeMeta[node.type].className}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">{node.label}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                          {typeMeta[node.type].label}
                          {node.pillar ? ` / ${pillarLabels[node.pillar]}` : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-5">
            {/* Graph + focused-node header share one border/surface, so the
                graph reads as "part of this node's detail" rather than a
                separate widget sitting above an unrelated panel. */}
            <div className="border border-border-muted bg-bg-panel">
              <div className="flex items-center justify-between border-b border-border-muted px-5 py-3">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Neighborhood view
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  {laidOutCountLabel(connections.length)}
                </p>
              </div>
              <GraphPreview focusId={selectedNode.id} onSelect={setSelectedId} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border-muted p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center border border-accent/25 bg-accent/10">
                          <SelectedIcon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                            {typeMeta[selectedNode.type].label}
                          </p>
                          <h2 className="text-2xl font-semibold tracking-tight">{selectedNode.label}</h2>
                        </div>
                      </div>
                      {selectedNode.description && (
                        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary">
                          {selectedNode.description}
                        </p>
                      )}
                    </div>

                    {selectedNode.url && (
                      <Link
                        href={selectedNode.url}
                        className="inline-flex items-center justify-center gap-2 border border-border-muted bg-bg-dark px-3 py-2 font-mono text-xs text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
                      >
                        Open node
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedNode.id}-sections`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <section className="grid gap-4 md:grid-cols-2">
                  {Object.entries(groupedConnections)
                    .filter(([, items]) => items.length > 0)
                    .map(([type, items]) => {
                      const meta = typeMeta[type as WorkspaceNode['type']];
                      const Icon = meta.icon;

                      return (
                        <div key={type} className="border border-border-muted bg-bg-panel p-5">
                          <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-muted pb-3">
                            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                              <Icon className="h-3.5 w-3.5" />
                              {meta.label}s
                            </p>
                            <span className="font-mono text-[10px] text-text-muted">{items.length}</span>
                          </div>
                          <div className="space-y-2">
                            {items.map(({ node, direction }) => (
                              <button
                                key={`${direction}-${node.id}`}
                                onClick={() => setSelectedId(node.id)}
                                className="group w-full border border-border-muted bg-bg-dark p-3 text-left transition-all hover:border-accent/25"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-text-primary group-hover:text-accent">{node.label}</p>
                                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                                      {direction}
                                    </p>
                                  </div>
                                  <ArrowRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </section>

                {connections.length === 0 && (
                  <section className="border border-border-muted bg-bg-panel p-6 text-sm text-text-secondary">
                    No direct relationships are defined for this node yet.
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <section className="border border-border-muted bg-bg-panel p-5">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                <GitBranch className="h-3.5 w-3.5" />
                What this should reveal
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                A technology is not listed as a badge here. It is connected to the products,
                systems, experience, and decisions where it actually appears. That is the point of the workspace graph.
              </p>
            </section>
          </main>
        </section>
      </div>
    </div>
  );
}

function laidOutCountLabel(count: number) {
  return `${count} direct connection${count === 1 ? '' : 's'}`;
}