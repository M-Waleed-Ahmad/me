'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { workspaceEdges, workspaceNodes, WorkspaceNode } from '@/data/workspaceData';
import { GraphPreview } from './GraphPreview';

const typeLabels: Record<WorkspaceNode['type'], string> = {
  pillar: 'Area',
  project: 'Project',
  technology: 'Technology',
  concept: 'Concept',
  experience: 'Experience',
};

const pillarLabels: Record<string, string> = {
  products: 'Products',
  systems: 'Systems',
  intelligence: 'Intelligence',
};

function getConnections(nodeId: string) {
  return workspaceEdges
    .filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .map((edge) => {
      const relatedId = edge.source === nodeId ? edge.target : edge.source;
      const related = workspaceNodes.find((node) => node.id === relatedId);
      return related ? { node: related, direction: edge.source === nodeId ? 'uses' : 'used by' } : null;
    })
    .filter(Boolean) as { node: WorkspaceNode; direction: string }[];
}

export default function ExplorerClient() {
  const [selectedId, setSelectedId] = useState('deepshield');
  const [query, setQuery] = useState('');
  const selectedNode = useMemo(
    () => workspaceNodes.find((node) => node.id === selectedId) ?? workspaceNodes[0],
    [selectedId]
  );

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workspaceNodes;
    return workspaceNodes.filter((node) =>
      [node.label, node.type, node.pillar ?? '', node.description ?? ''].join(' ').toLowerCase().includes(q)
    );
  }, [query]);

  const connections = useMemo(() => getConnections(selectedNode.id), [selectedNode.id]);
  const groupedConnections = useMemo(() => {
    return connections.reduce<Record<WorkspaceNode['type'], typeof connections>>(
      (groups, connection) => {
        groups[connection.node.type].push(connection);
        return groups;
      },
      { pillar: [], project: [], technology: [], concept: [], experience: [] }
    );
  }, [connections]);

  return (
    <section className="reveal grid grid-cols-[minmax(0,1fr)] gap-8 pb-24 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start" style={{ '--i': 1 } as React.CSSProperties}>
      <aside className="overflow-hidden rounded-2xl bg-surface lg:sticky lg:top-24">
        <label className="flex items-center gap-2 border-b border-rule px-4 py-3">
          <Search className="h-4 w-4 text-ink-3" />
          <span className="sr-only">Filter nodes</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter: react, axelliant…"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-3"
          />
        </label>

        <ul className="max-h-[32rem] overflow-y-auto py-1">
          {filteredNodes.map((node) => {
            const selected = node.id === selectedNode.id;
            return (
              <li key={node.id}>
                <button
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={selected}
                  className={`flex w-full items-baseline justify-between gap-3 border-l-2 px-4 py-2 text-left transition-colors ${
                    selected ? 'border-accent bg-paper' : 'border-transparent hover:bg-paper'
                  }`}
                >
                  <span className={`truncate ${selected ? 'text-ink' : 'text-ink-2'}`}>{node.label}</span>
                  <span className="shrink-0 font-mono text-[11px] text-ink-3">{typeLabels[node.type].toLowerCase()}</span>
                </button>
              </li>
            );
          })}
          {filteredNodes.length === 0 && <li className="px-4 py-6 text-sm text-ink-3">Nothing matches “{query}”.</li>}
        </ul>
      </aside>

      <div className="space-y-8">
        <figure>
          <div className="overflow-hidden rounded-2xl">
            <GraphPreview focusId={selectedNode.id} onSelect={setSelectedId} />
          </div>
          <figcaption className="mt-3 flex gap-3 text-sm leading-snug text-ink-3">
            <span className="shrink-0 font-mono text-xs leading-5 text-ink-2">Fig. 6</span>
            <span>
              Direct connections around {selectedNode.label}. Click any node to re-centre the graph on it.
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-5 rounded-2xl bg-surface p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-ink-3">
              {typeLabels[selectedNode.type]}
              {selectedNode.pillar ? ` · ${pillarLabels[selectedNode.pillar]}` : ''} · {connections.length} connection
              {connections.length === 1 ? '' : 's'}
            </p>
            <h2 className="mt-1 font-serif text-5xl leading-none text-ink">{selectedNode.label}</h2>
            {selectedNode.description && (
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-2">{selectedNode.description}</p>
            )}
          </div>
          {selectedNode.url && (
            <Link
              href={selectedNode.url}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              Open <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {(Object.entries(groupedConnections) as [WorkspaceNode['type'], typeof connections][])
            .filter(([, items]) => items.length > 0)
            .map(([type, items]) => (
              <div key={type}>
                <p className="font-mono text-xs text-ink-3">
                  {typeLabels[type]} · {items.length}
                </p>
                <ul className="mt-2 border-t border-rule">
                  {items.map(({ node, direction }) => (
                    <li key={`${direction}-${node.id}`} className="border-b border-rule">
                      <button
                        onClick={() => setSelectedId(node.id)}
                        className="group flex w-full items-baseline justify-between gap-3 py-2.5 text-left"
                      >
                        <span className="font-serif text-xl text-ink group-hover:text-accent-ink">{node.label}</span>
                        <span className="font-mono text-[11px] text-ink-3">{direction}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          {connections.length === 0 && <p className="text-ink-2">No direct relationships are defined for this node yet.</p>}
        </div>
      </div>
    </section>
  );
}
