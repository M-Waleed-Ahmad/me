'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowLeft, Layers, Cpu, Code2, Compass,
  Briefcase, Mail, Shuffle, ChevronRight
} from 'lucide-react';
import { useNavigator } from '@/context/NavigatorContext';
import { workspaceNodes, workspaceEdges } from '@/data/workspaceData';

// FUTURE: Advanced Navigator
// A future version may become RAG-powered over a knowledge base built from real
// project/experience/research content, answering questions like
// "What did Waleed do on WePsych?" or "What database decisions were made?"
// This requires: a vector database (e.g. Pinecone / pgvector), embedding pipelines
// for project MDX content, and a /api/navigator route serving LLM completions.
// Do NOT scaffold this until real written content exists and a backend is ready.

type MenuLevel = 'main' | 'products' | 'systems' | 'intelligence';

// Routes that have actual pages built — Surprise Me only picks from these.
// Update this set as each new phase ships new pages.
const BUILT_ROUTES = new Set([
  '/',
  '/products',
  '/products/wepsych',
  '/products/arabia-hills',
  '/products/alfa-club',
  '/products/other',
  '/systems',
  '/systems#automation',
  '/systems#cicd',
  '/systems#architecture',
  '/intelligence',
  '/intelligence#deepshield',
  '/intelligence#robotics',
  '/intelligence#red-teaming',
  '/explorer',
  '/journey',
  '/contact',
]);

const PILLAR_META: Record<Exclude<MenuLevel, 'main'>, {
  icon: React.ElementType;
  label: string;
}> = {
  products:     { icon: Layers, label: 'Products Pillar' },
  systems:      { icon: Code2,  label: 'Systems Pillar' },
  intelligence: { icon: Cpu,    label: 'Intelligence Pillar' },
};

export default function Navigator() {
  const { isOpen, closeNavigator } = useNavigator();
  const [level, setLevel] = useState<MenuLevel>('main');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => { setLevel('main'); setSelectedProject(null); }, 300);
      return () => clearTimeout(t);
    } else {
      // Focus close button when panel opens
      setTimeout(() => closeButtonRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [isOpen, level]);

  const navigate = (path: string) => {
    router.push(path);
    closeNavigator();
  };

  const surpriseMe = () => {
    const routable = workspaceNodes.filter(n => n.url && BUILT_ROUTES.has(n.url));
    const pick = routable[Math.floor(Math.random() * routable.length)];
    if (pick?.url) navigate(pick.url);
  };

  // Get technologies connected to a project via edges
  const getProjectTech = (projectId: string) => {
    const techIds = workspaceEdges
      .filter(e => e.source === projectId)
      .map(e => e.target);
    return workspaceNodes
      .filter(n => techIds.includes(n.id) && n.type === 'technology')
      .map(n => n.label)
      .slice(0, 4);
  };

  const pillarProjects = level !== 'main'
    ? workspaceNodes.filter(n => n.type === 'project' && n.pillar === level)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeNavigator}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Workspace Navigator"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm border-l border-border-muted bg-bg-panel/97 shadow-2xl backdrop-blur-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-muted">
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs tracking-widest text-text-primary uppercase">
                  Workspace Guide
                </span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={closeNavigator}
                aria-label="Close navigator"
                className="p-1.5 rounded text-text-secondary hover:text-text-primary border border-transparent hover:border-border-muted transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait" initial={false}>

                {/* ── Main menu ── */}
                {level === 'main' && (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.16 }}
                    className="p-5 space-y-5"
                  >
                    <p className="text-xs font-mono text-text-muted leading-relaxed">
                      You&apos;ve entered Waleed&apos;s workspace.<br />
                      What would you like to explore?
                    </p>

                    {/* Pillars */}
                    <div className="space-y-2">
                      {(['products', 'systems', 'intelligence'] as const).map(pillar => {
                        const meta = PILLAR_META[pillar];
                        const Icon = meta.icon;
                        const count = workspaceNodes.filter(n => n.type === 'project' && n.pillar === pillar).length;
                        return (
                          <button
                            key={pillar}
                            onClick={() => setLevel(pillar)}
                            className="w-full flex items-center justify-between p-4 rounded-lg bg-bg-dark border border-border-muted hover:border-accent/30 hover:bg-bg-panel-hover transition-all group text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded bg-bg-panel border border-border-muted group-hover:border-border-focus transition-colors">
                                <Icon className="w-4 h-4 text-text-secondary transition-colors group-hover:text-accent" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-text-primary capitalize">
                                  {pillar}
                                </div>
                                <div className="text-[10px] font-mono text-text-muted mt-0.5">
                                  {count} {count === 1 ? 'project' : 'projects'}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Global links */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { label: 'Explorer', href: '/explorer', icon: Compass },
                        { label: 'Journey',  href: '/journey',  icon: Briefcase },
                        { label: 'Contact',  href: '/contact',  icon: Mail },
                      ].map(({ label, href, icon: Icon }) => (
                        <button
                          key={href}
                          onClick={() => navigate(href)}
                          className="flex flex-col items-start p-4 rounded-lg bg-bg-dark border border-border-muted hover:border-accent/25 hover:bg-bg-panel-hover transition-all text-left group"
                        >
                          <Icon className="w-4 h-4 text-text-secondary group-hover:text-accent mb-2 transition-colors" />
                          <span className="text-sm font-medium text-text-primary">{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Surprise Me */}
                    <button
                      onClick={surpriseMe}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/50 text-accent text-xs font-mono tracking-widest transition-all"
                    >
                      <Shuffle className="w-4 h-4" />
                      SURPRISE ME
                    </button>
                  </motion.div>
                )}

                {/* ── Pillar sub-menu ── */}
                {level !== 'main' && !selectedProject && (
                  <motion.div
                    key={`pillar-${level}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.16 }}
                    className="p-5 space-y-4"
                  >
                    <button
                      onClick={() => setLevel('main')}
                      className="flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors mb-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>

                    <div className="border-b border-border-muted pb-3">
                      <h3 className="text-sm font-mono font-semibold text-text-primary uppercase tracking-wider">
                        {PILLAR_META[level].label}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-1">
                        Select a project to inspect
                      </p>
                    </div>

                    <div className="space-y-2">
                      {pillarProjects.map(project => {
                        const tech = getProjectTech(project.id);
                        return (
                          <button
                            key={project.id}
                            onClick={() => project.url && navigate(project.url)}
                            className="w-full text-left p-4 rounded-lg bg-bg-dark border border-border-muted hover:border-accent/35 hover:bg-bg-panel-hover transition-all group space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                                {project.label}
                              </span>
                              <span className="text-[10px] font-mono text-accent bg-accent/10 border border-accent/15 px-2 py-0.5 rounded">
                                Open
                              </span>
                            </div>
                            {project.description && (
                              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                                {project.description}
                              </p>
                            )}
                            {tech.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {tech.map(t => (
                                  <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-panel border border-border-muted text-text-muted">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Link to pillar landing */}
                    <button
                      onClick={() => navigate(`/${level}`)}
                      className="w-full py-2.5 text-center text-[11px] font-mono text-text-secondary hover:text-accent border border-border-muted rounded-lg hover:border-accent/25 transition-all"
                    >
                      View all {level} →
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border-muted">
              <p className="text-[10px] font-mono text-text-muted text-center">
                Waleed Ahmad · Systems Workspace · {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
