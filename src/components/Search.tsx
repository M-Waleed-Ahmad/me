'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CornerDownLeft, Search as SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { workspaceNodes } from '@/data/workspaceData';
import { profile } from '@/data/site';

type Result = { id: string; label: string; kind: string; description?: string; url: string; external?: boolean };

const PAGES: Result[] = [
  { id: 'page-work', label: 'Work', kind: 'page', description: 'All case studies', url: '/products' },
  { id: 'page-journey', label: 'Journey', kind: 'page', description: 'Experience and education timeline', url: '/journey' },
  { id: 'page-contact', label: 'Contact', kind: 'page', description: 'Email, LinkedIn, GitHub', url: '/contact' },
  { id: 'page-resume', label: 'Résumé (PDF)', kind: 'file', description: 'Download the CV', url: profile.resume, external: true },
  { id: 'page-process', label: 'How I built this', kind: 'page', description: 'Decisions, AI use and quality checks', url: '/process' },
  { id: 'page-explorer', label: 'Explorer', kind: 'page', description: 'How everything connects', url: '/explorer' },
];

const NODE_RESULTS: Result[] = workspaceNodes
  .filter((n) => n.url)
  .map((n) => ({ id: n.id, label: n.label, kind: n.type === 'pillar' ? 'area' : n.type, description: n.description, url: n.url! }));

const ALL = [...PAGES, ...NODE_RESULTS];

function score(result: Result, q: string) {
  const label = result.label.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  if (`${result.kind} ${result.description ?? ''}`.toLowerCase().includes(q)) return 1;
  return 0;
}

export default function Search() {
  const { isOpen, query, setQuery, closeSearch } = useSearch();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL.filter((r) => r.kind === 'page' || r.kind === 'file' || r.kind === 'project').slice(0, 10);
    return ALL.map((r) => ({ r, s: score(r, q) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ r }) => r)
      .slice(0, 12);
  }, [query]);

  const open = (result: Result) => {
    closeSearch();
    setActiveIndex(0);
    if (result.external) window.open(result.url, '_blank', 'noopener');
    else router.push(result.url);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) open(result);
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const duration = reduceMotion ? 0 : 0.15;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={closeSearch}
            className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration }}
            className="fixed left-1/2 top-[12%] z-[70] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
          >
            <div className="overflow-hidden border border-ink bg-paper shadow-[8px_8px_0_0_var(--color-rule)]">
              <div className="flex items-center gap-3 border-b border-rule px-4 py-3.5">
                <SearchIcon className="h-4 w-4 shrink-0 text-ink-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setActiveIndex(0);
                    setQuery(e.target.value);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search projects, roles, technologies…"
                  className="flex-1 bg-transparent text-ink outline-none placeholder:text-ink-3"
                  aria-label="Search"
                  aria-controls="search-results"
                  aria-activedescendant={results[activeIndex] ? `search-${results[activeIndex].id}` : undefined}
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="button" onClick={closeSearch} aria-label="Close search" className="text-ink-3 hover:text-ink">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul id="search-results" ref={listRef} role="listbox" className="max-h-80 overflow-y-auto py-1">
                {results.length === 0 && (
                  <li className="px-4 py-8 text-center text-ink-3">Nothing for “{query}”.</li>
                )}
                {results.map((result, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <li
                      key={result.id}
                      id={`search-${result.id}`}
                      role="option"
                      aria-selected={active}
                      onClick={() => open(result)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex cursor-pointer items-center gap-4 border-l-2 px-4 py-2.5 ${
                        active ? 'border-accent bg-surface' : 'border-transparent'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-xl leading-tight text-ink">{result.label}</p>
                        {result.description && <p className="truncate text-sm text-ink-3">{result.description}</p>}
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-ink-3">{result.kind}</span>
                      {active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-accent" />}
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between border-t border-rule px-4 py-2 font-mono text-[11px] text-ink-3">
                <span>↑↓ to move · enter to open · esc to close</span>
                <span>
                  {results.length} result{results.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
