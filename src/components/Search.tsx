'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Layers, Code2, Cpu, Briefcase, ArrowRight, Hash, Zap } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { workspaceNodes, WorkspaceNode } from '@/data/workspaceData';

// ─── Type config ────────────────────────────────────────────────────────────
const TYPE_META: Record<WorkspaceNode['type'], { label: string; icon: React.ElementType; color: string }> = {
  pillar:     { label: 'Pillar',     icon: Hash,     color: 'text-accent' },
  project:    { label: 'Project',    icon: Layers,   color: 'text-text-primary' },
  technology: { label: 'Technology', icon: Code2,    color: 'text-accent' },
  concept:    { label: 'Concept',    icon: Zap,      color: 'text-accent' },
  experience: { label: 'Experience', icon: Briefcase,color: 'text-accent' },
};

const PILLAR_META: Record<string, { icon: React.ElementType; color: string }> = {
  products:     { icon: Layers, color: 'text-accent' },
  systems:      { icon: Code2,  color: 'text-accent' },
  intelligence: { icon: Cpu,    color: 'text-accent' },
};

// ─── Fuzzy scorer ────────────────────────────────────────────────────────────
function scoreNode(node: WorkspaceNode, q: string): number {
  const needle = q.toLowerCase();
  const haystack = [
    node.label,
    node.description ?? '',
    node.type,
    node.pillar ?? '',
  ].join(' ').toLowerCase();

  if (node.label.toLowerCase().startsWith(needle)) return 3;
  if (node.label.toLowerCase().includes(needle)) return 2;
  if (haystack.includes(needle)) return 1;
  return 0;
}

export default function Search() {
  const { isOpen, query, setQuery, closeSearch } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
        setActiveIndex(0);
      }, 60);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  // Filtered + scored results
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      // Default: show pillars + projects (most useful starting point)
      return workspaceNodes
        .filter(n => n.type === 'pillar' || n.type === 'project')
        .slice(0, 10);
    }
    return workspaceNodes
      .map(n => ({ node: n, score: scoreNode(n, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ node }) => node)
      .slice(0, 12);
  }, [query]);

  // Navigate to selected node
  const selectNode = (node: WorkspaceNode) => {
    if (node.url) {
      router.push(node.url);
      closeSearch();
    }
  };

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const node = results[activeIndex];
      if (node) selectNode(node);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Palette modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[12%] z-[70] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 sm:top-[18%]"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace search"
          >
            <div className="rounded-xl border border-border-muted bg-bg-panel/98 shadow-2xl overflow-hidden backdrop-blur-xl">

              {/* Input row */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-muted">
                <SearchIcon className="w-4 h-4 text-text-secondary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => {
                    setActiveIndex(0);
                    setQuery(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search projects, technologies, concepts..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none font-mono"
                  aria-label="Search workspace"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    onClick={() => {
                      setActiveIndex(0);
                      setQuery('');
                    }}
                    className="text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border-muted text-[10px] font-mono text-text-muted">
                  ESC
                </kbd>
              </div>

              {/* Results list */}
              <ul ref={listRef} className="max-h-80 overflow-y-auto py-1.5 no-scrollbar" role="listbox">
                {results.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-text-muted font-mono">
                    No results for &ldquo;{query}&rdquo;
                  </li>
                )}

                {results.map((node, idx) => {
                  const typeMeta = TYPE_META[node.type];
                  const TypeIcon = typeMeta.icon;
                  const pillarMeta = node.pillar ? PILLAR_META[node.pillar] : null;
                  const PillarIcon = pillarMeta?.icon;
                  const isActive = idx === activeIndex;

                  return (
                    <li
                      key={node.id}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => selectNode(node)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        isActive ? 'bg-bg-panel-hover' : 'hover:bg-bg-panel-hover'
                      }`}
                    >
                      {/* Node type icon */}
                      <div className={`flex-shrink-0 ${typeMeta.color}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>

                      {/* Label + meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary truncate">
                            {node.label}
                          </span>
                          {node.pillar && PillarIcon && (
                            <span className={`text-[10px] font-mono flex items-center gap-0.5 ${pillarMeta?.color}`}>
                              <PillarIcon className="w-2.5 h-2.5" />
                              {node.pillar}
                            </span>
                          )}
                        </div>
                        {node.description && (
                          <p className="text-[11px] text-text-muted truncate mt-0.5">
                            {node.description}
                          </p>
                        )}
                      </div>

                      {/* Type badge + arrow */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="hidden sm:inline text-[10px] font-mono text-text-muted">
                          {typeMeta.label}
                        </span>
                        {node.url && (
                          <ArrowRight className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Footer hints */}
              <div className="px-4 py-2.5 border-t border-border-muted flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-border-muted">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-border-muted">↵</kbd> open
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
