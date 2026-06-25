'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavAct = 'i' | 'ii' | 'iii';
type Beat   = 'ii-1' | 'ii-2' | 'ii-3';
type StageAct = 'i' | Beat | 'iii';

// ─── Stage node / edge definitions ───────────────────────────────────────────

const NODE_R = 18;

interface NodeDef {
  id: string;
  /** Architecture (Act II+) position */
  ax: number; ay: number;
  /** Scattered (Act I) position — deliberate 2×2 grid, not random */
  sx: number; sy: number;
  label: string;          // architecture label
  scatterLabel: string;   // "before" label
  sub: string;            // sub-label under architecture label
  beat: Beat;             // which beat clicking this node jumps to
}

const NODES: NodeDef[] = [
  {
    id: 'bulk',
    ax: 200, ay: 72,
    sx: 110, sy: 108,
    label: 'Bulk Source',    scatterLabel: 'Listing Data',
    sub: 'raw input',
    beat: 'ii-2',
  },
  {
    id: 'make',
    ax: 88,  ay: 222,
    sx: 290, sy: 108,
    label: 'Make.com',       scatterLabel: 'Agent Edits',
    sub: 'validate · transform',
    beat: 'ii-2',
  },
  {
    id: 'supa',
    ax: 312, ay: 222,
    sx: 110, sy: 292,
    label: 'Supabase',       scatterLabel: 'Admin Tools',
    sub: 'Postgres · Auth · Storage',
    beat: 'ii-1',
  },
  {
    id: 'next',
    ax: 200, ay: 368,
    sx: 290, sy: 292,
    label: 'Next.js App',    scatterLabel: 'Public Search',
    sub: 'CMS + public site',
    beat: 'ii-3',
  },
];

/** Edge coords computed from architecture positions, shortened to node boundary + arrowhead clearance */
function computeEdge(fromId: string, toId: string) {
  const f = NODES.find(n => n.id === fromId)!;
  const t = NODES.find(n => n.id === toId)!;
  const dx = t.ax - f.ax, dy = t.ay - f.ay;
  const d  = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / d, ny = dy / d;
  return {
    x1: f.ax + nx * (NODE_R + 3),
    y1: f.ay + ny * (NODE_R + 3),
    x2: t.ax - nx * (NODE_R + 10),   // extra room for arrowhead
    y2: t.ay - ny * (NODE_R + 10),
    mx: (f.ax + t.ax) / 2,
    my: (f.ay + t.ay) / 2,
  };
}

const EDGES = [
  { id: 'e1', from: 'bulk', to: 'make', label: 'raw data',        ...computeEdge('bulk', 'make') },
  { id: 'e2', from: 'make', to: 'supa', label: 'validated',        ...computeEdge('make', 'supa') },
  { id: 'e3', from: 'supa', to: 'next', label: 'canonical records',...computeEdge('supa', 'next') },
];

function isNodeHl(act: StageAct, id: string) {
  if (act === 'ii-1') return id === 'supa';
  if (act === 'ii-2') return id === 'bulk' || id === 'make';
  if (act === 'ii-3') return id === 'next';
  return false;
}

function isEdgeHl(act: StageAct, id: string) {
  if (act === 'ii-2') return id === 'e1';
  if (act === 'ii-3') return id === 'e2' || id === 'e3';
  return false;
}

// ─── Stage component ──────────────────────────────────────────────────────────

function Stage({
  stageAct,
  onNodeClick,
}: {
  stageAct: StageAct;
  onNodeClick: (beat: Beat) => void;
}) {
  const [hovNode, setHovNode] = useState<string | null>(null);
  const isI   = stageAct === 'i';
  const isIII = stageAct === 'iii';

  const ACT_LABELS: Record<StageAct, string> = {
    'i':    'Before · disconnected pieces',
    'ii-1': 'Foundation · the shared schema',
    'ii-2': 'Automation · ingestion pipeline',
    'ii-3': 'Delivery · the product surface',
    'iii':  'After · system at rest',
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-bg-dark overflow-hidden select-none">

      {/* Act label — top-left */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={stageAct}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.22 }}
            className="font-mono text-[10px] text-accent tracking-widest uppercase"
          >
            {ACT_LABELS[stageAct]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Interaction hint — present in every act now, since hover/click work everywhere */}
      <p className="absolute top-14 left-6 right-6 font-mono text-[9px] text-text-muted">
        hover to highlight · click to jump
      </p>

      {/* SVG diagram */}
      <svg viewBox="0 0 400 440" className="w-full max-w-[270px] sm:max-w-xs" style={{ overflow: 'visible' }}>
        <defs>
          {/* Arrowhead markers */}
          <marker id="ah-dim"    markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#1c1c1c" />
          </marker>
          <marker id="ah-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
          {/* Node glow filter */}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Edges ── */}
        {EDGES.map(e => {
          const hl = isEdgeHl(stageAct, e.id);
          return (
            <g key={e.id}>
              <line
                x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={hl ? '#10b981' : isIII ? '#2b2b31' : '#232329'}
                strokeWidth={hl ? 1.5 : 1}
                opacity={isI ? 0 : hl ? 1 : isIII ? 0.42 : 0.32}
                markerEnd={isI ? undefined : hl ? 'url(#ah-accent)' : 'url(#ah-dim)'}
                style={{ transition: 'all 0.45s ease' }}
              />
              {/* Edge label when highlighted */}
              {hl && (
                <motion.text
                  key={e.id + '-label'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ delay: 0.2 }}
                  x={e.mx + (e.id === 'e2' ? 0 : 14)}
                  y={e.my + (e.id === 'e2' ? -8 : -4)}
                  textAnchor="middle"
                  fontSize={7}
                  fontFamily="var(--font-geist-mono), monospace"
                  fill="#10b981"
                >
                  {e.label}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {NODES.map(node => {
          const px   = isI ? node.sx : node.ax;
          const py   = isI ? node.sy : node.ay;
          const hl   = isNodeHl(stageAct, node.id);
          const hov  = hovNode === node.id;
          const focused = hl || hov;
          // Hover works everywhere now, not just Act II — there's always something
          // reasonable for a click to do (jump to the relevant beat), so the cursor
          // and hover feedback should never feel dead.
          const interactive = true;
          // Floor colors raised well clear of the page background so the node shape
          // itself reads clearly even when it isn't the current focus — "dim" should
          // mean "quietly present," not "almost gone."
          const floorLabel = '#d4d4db';
          const floorSub = '#9a9aa3';
          const floorStroke = isIII ? '#52525c' : '#46464f';
          const floorFill = isIII ? '#1c1d22' : '#1a1b20';

          return (
            <motion.g
              key={node.id}
              animate={{ x: px, y: py }}
              initial={{ x: node.sx, y: node.sy }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onMouseEnter={() => interactive && setHovNode(node.id)}
              onMouseLeave={() => setHovNode(null)}
              onClick={() => onNodeClick(node.beat)}
            >
              {/* Outer glow ring — always visible at a low level so every node reads as a deliberate shape, brighter when focused */}
              <circle
                cx={0} cy={0} r={NODE_R + 13}
                fill={focused ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.04)'}
                stroke={focused ? 'rgba(16,185,129,0.28)' : 'rgba(255,255,255,0.10)'}
                strokeWidth={1}
                opacity={1}
                style={{ transition: 'opacity 0.3s ease' }}
              />

              {/* Main circle */}
              <circle
                cx={0} cy={0}
                r={focused ? NODE_R + 2 : NODE_R}
                fill={focused ? 'rgba(16,185,129,0.12)' : floorFill}
                stroke={focused ? '#10b981' : floorStroke}
                strokeWidth={focused ? 1.5 : 1.25}
                filter={focused ? 'url(#node-glow)' : undefined}
                opacity={1}
                style={{ transition: 'all 0.35s ease' }}
              />

              {/* Inner dot */}
              <circle
                cx={0} cy={0} r={focused ? 5 : 3.5}
                fill={focused ? '#10b981' : '#7a7a85'}
                opacity={1}
                style={{ transition: 'all 0.35s ease' }}
              />

              {/* Primary label */}
              <text
                x={0} y={NODE_R + (focused ? 20 : 16)}
                textAnchor="middle"
                fontSize={focused ? 10.5 : 9.75}
                fontFamily="var(--font-geist-mono), monospace"
                fill={focused ? '#34d399' : floorLabel}
                fontWeight={focused ? '600' : '500'}
                opacity={1}
                style={{ transition: 'all 0.35s ease' }}
              >
                {isI ? node.scatterLabel : node.label}
              </text>

              {/* Sub-label (Act II/III only) */}
              {!isI && (
                <text
                  x={0} y={NODE_R + (focused ? 32 : 27)}
                  textAnchor="middle"
                  fontSize={6.5}
                  fontFamily="var(--font-geist-mono), monospace"
                  fill={focused ? '#065f46' : floorSub}
                  opacity={0.95}
                  style={{ transition: 'all 0.35s ease' }}
                >
                  {node.sub}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* ── Act III outcome overlay ── */}
      <AnimatePresence>
        {isIII && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="absolute bottom-10 left-6 right-6 text-center"
          >
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Delivered</p>
            <p className="text-xl font-bold text-text-primary tracking-tight leading-snug">
              2 people.<br />1 schema.<br />3 surfaces.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tradeoff (inline) ────────────────────────────────────────────────────────

function Tradeoff({ decision, summary, pro, con }: {
  decision: string; summary: string; pro: string; con: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border-muted overflow-hidden">
      <button
        type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left hover:bg-bg-panel/50 transition-colors"
      >
        <span className="min-w-0">
          <span className="block text-xs font-mono text-text-primary font-semibold">{decision}</span>
          <span className="mt-0.5 block text-[11px] text-text-muted leading-relaxed">{summary}</span>
        </span>
        <ChevronDown className={`mt-0.5 h-4 w-4 flex-shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-border-muted sm:divide-x divide-border-muted">
              <div className="px-4 py-3 space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Gained</span>
                <p className="text-xs text-text-secondary leading-relaxed">{pro}</p>
              </div>
              <div className="px-4 py-3 space-y-1 border-t border-border-muted sm:border-t-0">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Accepted</span>
                <p className="text-xs text-text-secondary leading-relaxed">{con}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Act content animation variants ──────────────────────────────────────────

const contentVariants = {
  enter: (dir: number) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: -(dir * 28), opacity: 0 }),
};

const ACT_ORDER: NavAct[] = ['i', 'ii', 'iii'];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArabiaHillsPage() {
  const [navAct, setNavAct] = useState<NavAct>('i');
  const [activeBeat, setActiveBeat] = useState<Beat>('ii-1');
  const [direction, setDirection] = useState(1);
  const prevActRef = useRef<NavAct>('i');

  // Tab switch — animates content in/out, resets scroll
  const switchAct = (act: NavAct) => {
    const prev = prevActRef.current;
    const dir = ACT_ORDER.indexOf(act) >= ACT_ORDER.indexOf(prev) ? 1 : -1;
    setDirection(dir);
    prevActRef.current = act;
    setNavAct(act);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (act !== 'ii') setActiveBeat('ii-1');
  };

  // Node click → jump to corresponding beat. If we're not currently on Act II,
  // switch there first and wait a tick for that act's DOM to mount before
  // scrolling — otherwise the target beat section doesn't exist yet to scroll to.
  const handleNodeClick = (beat: Beat) => {
    const idMap: Record<Beat, string> = { 'ii-1': 'beat-1', 'ii-2': 'beat-2', 'ii-3': 'beat-3' };
    const jump = () => {
      setActiveBeat(beat);
      document.getElementById(idMap[beat])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (navAct !== 'ii') {
      switchAct('ii');
      // Wait for Act II's content to mount before attempting to scroll to a beat within it.
      requestAnimationFrame(() => requestAnimationFrame(jump));
    } else {
      jump();
    }
  };

  const stageAct: StageAct =
    navAct === 'i'   ? 'i' :
    navAct === 'iii' ? 'iii' :
    activeBeat;

  return (
    <div className="flex-1">
      <div className="lg:grid lg:grid-cols-[42%_58%]">

        {/* ── LEFT: Sticky visual stage (desktop) ─────────────────────────── */}
        <div className="hidden lg:block w-1/2">
          <div className="fixed top-14 w-1/3 h-[calc(100vh-3.5rem)] border-r border-border-muted">
            <Stage stageAct={stageAct} onNodeClick={handleNodeClick} />
          </div>
        </div>
        {/* ── RIGHT: Narrative ──────────────────────────────────────────────── */}
        <div>

          {/* Page header — always visible, not part of act switching */}
          <div className="px-6 sm:px-10 pt-8 pb-8 border-b border-border-muted">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors mb-7"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Products
            </Link>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] mb-5">
              <span className="text-accent tracking-widest uppercase">Pillar // Products</span>
              <span className="text-text-muted">·</span>
              <span className="px-2 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent">Production</span>
            </div>
            <h1 className="text-3xl sm:text-[2.75rem] font-bold tracking-tight leading-[1.08] mb-4">Arabia Hills</h1>
            <p className="max-w-md text-base sm:text-lg leading-relaxed text-text-secondary font-light mb-6">
              A real estate platform built by a two-person team — bulk listing ingestion,
              agent CMS, and public search all sharing one schema.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Next.js', 'Supabase', 'PostgreSQL', 'Make.com', 'TypeScript'].map(t => (
                <span key={t} className="font-mono text-[10px] px-2.5 py-1 rounded border border-border-muted bg-bg-panel text-text-secondary">{t}</span>
              ))}
            </div>
            <div className="flex gap-8 pt-5 border-t border-border-muted">
              {[{ l: 'Team', v: '2 people' }, { l: 'Catalog', v: '20+ est.' }, { l: 'Search', v: 'Responsive' }].map(m => (
                <div key={m.l}>
                  <p className="text-xl font-bold font-mono text-accent">{m.v}</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-0.5">{m.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3-item act nav — sticky below site header */}
          <nav className="sticky top-14 z-20 bg-bg-dark/95 backdrop-blur-sm border-b border-border-muted" aria-label="Case study acts">
            <div className="flex">
              {ACT_ORDER.map(act => (
                <button
                  key={act}
                  onClick={() => switchAct(act)}
                  className={`flex-1 py-3 font-mono text-[11px] tracking-wider transition-all border-b-2 ${
                    navAct === act ? 'text-accent border-accent' : 'text-text-muted border-transparent hover:text-text-secondary'
                  }`}
                >
                  {act === 'i' ? 'I · The Bet' : act === 'ii' ? 'II · The System' : 'III · What Held Up'}
                </button>
              ))}
            </div>
          </nav>

          {/* ── Act content — only one act rendered at a time ─────────────── */}
          <AnimatePresence mode="wait" custom={direction}>

            {/* ── ACT I: THE BET ─────────────────────────────────────────── */}
            {navAct === 'i' && (
              <motion.div
                key="act-i"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {/* Mobile stage */}
                <div className="lg:hidden h-52 border-b border-border-muted">
                  <Stage stageAct="i" onNodeClick={handleNodeClick} />
                </div>

                <div className="px-6 sm:px-10 py-12 sm:py-16 space-y-10">
                  <p className="font-mono text-[10px] text-accent tracking-widest uppercase">Act I · The Bet</p>

                  {/* Large opener */}
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="text-3xl sm:text-[2.4rem] font-bold tracking-tight text-text-primary leading-[1.1]"
                  >
                    A two-person team. Three surfaces that had to share one database.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.45 }}
                    className="space-y-5 max-w-prose"
                  >
                    <p className="text-base text-text-secondary leading-relaxed">
                      Arabia Hills needed a property platform a small team could actually operate.
                      The hard part was not building listing pages — it was making bulk import,
                      agent edits, and public search feel like one maintainable product rather
                      than three separate problems.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      With no hard frontend/backend split and a team of two, the architecture
                      had to stay practical: one canonical schema, a manageable CMS, and an
                      automation pipeline anyone on the team could inspect when listing data
                      changed shape.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.45 }}
                    className="space-y-4"
                  >
                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">The constraints</p>
                    <ul className="space-y-3">
                      {[
                        'Bulk listing data had to be validated and transformed before it reached the database.',
                        'Non-technical agents needed a CMS that matched the same listing schema as the public site.',
                        'Search was attribute and filter based — no geospatial or map-search system in scope.',
                        'Both product implementation and operational tooling came from the same small team.',
                      ].map((c, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.28 + i * 0.06, duration: 0.35 }}
                          className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
                        >
                          <span className="text-accent font-mono text-[10px] mt-1 flex-shrink-0">→</span>
                          {c}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Act navigation hint */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="pt-4"
                  >
                    <button
                      onClick={() => switchAct('ii')}
                      className="inline-flex items-center gap-2 font-mono text-[11px] text-text-muted hover:text-accent transition-colors"
                    >
                      Continue to The System
                      <span className="text-accent">→</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ── ACT II: THE SYSTEM ─────────────────────────────────────── */}
            {navAct === 'ii' && (
              <motion.div
                key="act-ii"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {/* Mobile stage (shows current beat's highlight) */}
                <div className="lg:hidden h-52 border-b border-border-muted">
                  <Stage stageAct={stageAct} onNodeClick={handleNodeClick} />
                </div>

                <div className="px-6 sm:px-10 py-10">
                  <p className="font-mono text-[10px] text-accent tracking-widest uppercase mb-2">Act II · The System</p>
                  <p className="text-[11px] font-mono text-text-muted">Three beats — scroll or click a diagram node to jump.</p>
                </div>

                {/* Beat 1 — The Foundation */}
                <div id="beat-1" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-1' ? 'text-accent' : 'text-text-muted'}`}>01</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">The Foundation</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      The hardest decision was made first: one shared schema, used by the public site,
                      the agent CMS, and the ingestion pipeline. There was no separate &quot;import model&quot;
                      translated before reaching the real database. The canonical listing record was
                      the import record.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      This meant schema design had to be right upfront — listing fields, relationships,
                      and status logic representing what agents needed to manage and what visitors
                      needed to browse, without compromise between the two.
                    </p>
                  </div>
                  <p className="font-mono text-[10px] text-text-muted italic">
                    ↑ Supabase (Postgres) highlighted in the diagram — the schema it holds is the platform&apos;s single source of truth.
                  </p>
                </div>

                {/* Beat 2 — The Automation Layer */}
                <div id="beat-2" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-2' ? 'text-accent' : 'text-text-muted'}`}>02</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">The Automation Layer</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      Bulk listing data entered the system through Make.com rather than direct
                      database writes. The pipeline validated field shapes, transformed incoming
                      data to fit the canonical schema, and surfaced errors before anything
                      reached Supabase.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The alternative — a custom backend importer — would have given more control
                      but at the cost of a service to build and maintain. For a two-person build,
                      Make.com&apos;s inspectable, visual flow was more valuable than raw flexibility.
                    </p>
                  </div>
                  <Tradeoff
                    decision="Make.com ingestion vs. custom backend importer"
                    summary="The automation layer kept the pipeline visible and easy to adjust."
                    pro="Faster to ship, easier to inspect, and adaptable to changing listing formats without a backend release."
                    con="Less control than a custom importer — validation rules had to stay explicit and auditable."
                  />
                </div>

                {/* Beat 3 — The Product Surface */}
                <div id="beat-3" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-3' ? 'text-accent' : 'text-text-muted'}`}>03</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">The Product Surface</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      The Next.js application served two surfaces from the same Supabase-backed data:
                      agents accessed a CMS to manage listings; the public site let visitors filter
                      and browse the same canonical records. One schema, two interfaces.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      Search stayed attribute and filter based — deliberately, not by default.
                      Geospatial search was explicitly out of scope rather than deferred,
                      keeping the model honest and avoiding infrastructure the platform didn&apos;t need.
                    </p>
                  </div>
                  <Tradeoff
                    decision="Attribute filters vs. map/geospatial search"
                    summary="The project stayed aligned with its actual search requirements."
                    pro="Reduced complexity, focused on listing attributes that mattered for this catalog."
                    con="Left advanced map-based discovery out of scope — an explicit call, not an oversight."
                  />
                  <div className="space-y-3 pt-1">
                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Delivery sequence</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { n: '01', l: 'Schema',     d: 'Canonical listing model, shared by all surfaces.' },
                        { n: '02', l: 'Pipeline',   d: 'Make.com validates and transforms bulk data.' },
                        { n: '03', l: 'CMS + Search', d: 'Agent editing and public filtering.' },
                      ].map(p => (
                        <div key={p.n} className="space-y-1.5">
                          <p className="font-mono text-[10px] text-accent">{p.n}</p>
                          <p className="text-xs font-mono text-text-primary font-semibold">{p.l}</p>
                          <p className="text-[11px] text-text-muted leading-relaxed">{p.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-10 py-6 border-t border-border-muted">
                  <button
                    onClick={() => switchAct('iii')}
                    className="inline-flex items-center gap-2 font-mono text-[11px] text-text-muted hover:text-accent transition-colors"
                  >
                    Continue to What Held Up
                    <span className="text-accent">→</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── ACT III: WHAT HELD UP ──────────────────────────────────── */}
            {navAct === 'iii' && (
              <motion.div
                key="act-iii"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                {/* Mobile stage */}
                <div className="lg:hidden h-52 border-b border-border-muted">
                  <Stage stageAct="iii" onNodeClick={handleNodeClick} />
                </div>

                <div className="px-6 sm:px-10 py-12 sm:py-16 space-y-10">
                  <p className="font-mono text-[10px] text-accent tracking-widest uppercase">Act III · What Held Up</p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45 }}
                    className="space-y-5 max-w-prose"
                  >
                    <p className="text-base text-text-secondary leading-relaxed">
                      Arabia Hills became a complete real estate delivery rather than a static catalog.
                      The same system supported public browsing, agent content management, and bulk
                      listing ingestion — not as separate tools, but as one coherent product.
                      Catalog size during the measured build period was in the 20+ listing range
                      (rough estimate, not a benchmarked count), with responsive filtering
                      working in practice.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The project reflects a product-owner mindset: the public website, the admin
                      workflow, and the ingestion path all had to make sense together — and they did,
                      because the schema was designed as a shared contract from the start.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The lesson was that small teams need tools they can understand under pressure.
                      A clever architecture is worth less than one where the data path is visible
                      when a listing import goes wrong.
                    </p>
                  </motion.div>

                  {/* Large closer */}
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="text-3xl sm:text-[2.4rem] font-bold tracking-tight text-text-primary leading-[1.1] pt-4"
                  >
                    Visible data paths beat clever infrastructure.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => switchAct('i')}
                      className="inline-flex items-center gap-2 font-mono text-[11px] text-text-muted hover:text-accent transition-colors"
                    >
                      ← Back to The Bet
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>{/* end narrative */}
      </div>{/* end grid */}
    </div>
  );
}