'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NavAct = 'i' | 'ii' | 'iii';
type Beat   = 'ii-1' | 'ii-2' | 'ii-3';
type StageAct = 'i' | Beat | 'iii';

// ─── Stage: performance metrics visual ───────────────────────────────────────

const METRICS = [
  { id: 'perf',     label: 'Performance',   value: '90s',   sub: 'Lighthouse est.',  ax: 200, ay: 80,  sx: 110, sy: 108, beat: 'ii-2' as Beat },
  { id: 'checkout', label: 'Checkout',      value: 'UX',    sub: 'mobile-first',      ax: 88,  ay: 230, sx: 290, sy: 108, beat: 'ii-3' as Beat },
  { id: 'react',    label: 'React',         value: 'SPA',   sub: 'storefront layer',  ax: 312, ay: 230, sx: 110, sy: 292, beat: 'ii-1' as Beat },
  { id: 'craft',    label: 'Polish',        value: '∞',     sub: 'iteration cycles',  ax: 200, ay: 375, sx: 290, sy: 292, beat: 'ii-3' as Beat },
];

const NODE_R = 22;

const STAGE_EDGES = [
  { id: 'se1', from: 'react',    to: 'perf',     label: 'optimise'  },
  { id: 'se2', from: 'react',    to: 'checkout', label: 'compose'   },
  { id: 'se3', from: 'checkout', to: 'craft',    label: 'refine'    },
  { id: 'se4', from: 'perf',     to: 'craft',    label: 'validate'  },
];

function getNode(id: string) { return METRICS.find(n => n.id === id)!; }

function computeEdge(fromId: string, toId: string) {
  const f = getNode(fromId); const t = getNode(toId);
  const dx = t.ax - f.ax, dy = t.ay - f.ay;
  const d  = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / d, ny = dy / d;
  return {
    x1: f.ax + nx * (NODE_R + 4),
    y1: f.ay + ny * (NODE_R + 4),
    x2: t.ax - nx * (NODE_R + 12),
    y2: t.ay - ny * (NODE_R + 12),
    mx: (f.ax + t.ax) / 2,
    my: (f.ay + t.ay) / 2,
  };
}

const EDGES_COMPUTED = STAGE_EDGES.map(e => ({ ...e, ...computeEdge(e.from, e.to) }));

function isNodeHl(act: StageAct, id: string) {
  if (act === 'ii-1') return id === 'react';
  if (act === 'ii-2') return id === 'perf';
  if (act === 'ii-3') return id === 'checkout' || id === 'craft';
  return false;
}

function isEdgeHl(act: StageAct, id: string) {
  if (act === 'ii-2') return id === 'se1';
  if (act === 'ii-3') return id === 'se2' || id === 'se3' || id === 'se4';
  return false;
}

function Stage({ stageAct, onNodeClick }: { stageAct: StageAct; onNodeClick: (beat: Beat) => void }) {
  const [hovNode, setHovNode] = useState<string | null>(null);
  const isI   = stageAct === 'i';
  const isIII = stageAct === 'iii';

  const ACT_LABELS: Record<StageAct, string> = {
    'i':    'Before · scattered optimisations',
    'ii-1': 'Foundation · React storefront layer',
    'ii-2': 'Performance · Lighthouse scores',
    'ii-3': 'Delivery · checkout + polish',
    'iii':  'After · production surface',
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-bg-dark overflow-hidden select-none">

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

      <p className="absolute top-14 left-6 right-6 font-mono text-[9px] text-text-muted">
        hover to highlight · click to jump
      </p>

      <svg viewBox="0 0 400 455" className="w-full max-w-[270px] sm:max-w-xs" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="ah-dim"    markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#1c1c1c" />
          </marker>
          <marker id="ah-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES_COMPUTED.map(e => {
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
              {hl && (
                <motion.text
                  key={e.id + '-label'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  transition={{ delay: 0.2 }}
                  x={e.mx + 14} y={e.my - 4}
                  textAnchor="middle" fontSize={7}
                  fontFamily="var(--font-geist-mono), monospace"
                  fill="#10b981"
                >
                  {e.label}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {METRICS.map(node => {
          const px  = isI ? node.sx : node.ax;
          const py  = isI ? node.sy : node.ay;
          const hl  = isNodeHl(stageAct, node.id);
          const hov = hovNode === node.id;
          const focused = hl || hov;
          const floorLabel  = '#d4d4db';
          const floorSub    = '#9a9aa3';
          const floorStroke = isIII ? '#52525c' : '#46464f';
          const floorFill   = isIII ? '#1c1d22' : '#1a1b20';

          return (
            <motion.g
              key={node.id}
              animate={{ x: px, y: py }}
              initial={{ x: node.sx, y: node.sy }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovNode(node.id)}
              onMouseLeave={() => setHovNode(null)}
              onClick={() => onNodeClick(node.beat)}
            >
              <circle
                cx={0} cy={0} r={NODE_R + 13}
                fill={focused ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.04)'}
                stroke={focused ? 'rgba(16,185,129,0.28)' : 'rgba(255,255,255,0.10)'}
                strokeWidth={1}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              <circle
                cx={0} cy={0}
                r={focused ? NODE_R + 2 : NODE_R}
                fill={focused ? 'rgba(16,185,129,0.12)' : floorFill}
                stroke={focused ? '#10b981' : floorStroke}
                strokeWidth={focused ? 1.5 : 1.25}
                filter={focused ? 'url(#node-glow)' : undefined}
                style={{ transition: 'all 0.35s ease' }}
              />

              {/* Value badge inside node */}
              <text
                x={0} y={5}
                textAnchor="middle" fontSize={focused ? 11 : 10}
                fontFamily="var(--font-geist-mono), monospace"
                fill={focused ? '#34d399' : '#7a7a85'}
                fontWeight="700"
                style={{ transition: 'all 0.35s ease' }}
              >
                {isI ? '?' : node.value}
              </text>

              {/* Primary label */}
              <text
                x={0} y={NODE_R + (focused ? 20 : 16)}
                textAnchor="middle" fontSize={focused ? 10.5 : 9.75}
                fontFamily="var(--font-geist-mono), monospace"
                fill={focused ? '#34d399' : floorLabel}
                fontWeight={focused ? '600' : '500'}
                style={{ transition: 'all 0.35s ease' }}
              >
                {node.label}
              </text>

              {!isI && (
                <text
                  x={0} y={NODE_R + (focused ? 32 : 27)}
                  textAnchor="middle" fontSize={6.5}
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
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Shipped</p>
            <p className="text-xl font-bold text-text-primary tracking-tight leading-snug">
              1 storefront.<br />90s Lighthouse.<br />Mobile-first.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tradeoff ─────────────────────────────────────────────────────────────────

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

// ─── Animation variants ───────────────────────────────────────────────────────

const contentVariants = {
  enter:  (dir: number) => ({ x: dir * 28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: -(dir * 28), opacity: 0 }),
};

const ACT_ORDER: NavAct[] = ['i', 'ii', 'iii'];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AlfaClubPage() {
  const [navAct, setNavAct]       = useState<NavAct>('i');
  const [activeBeat, setActiveBeat] = useState<Beat>('ii-1');
  const [direction, setDirection] = useState(1);
  const prevActRef = useRef<NavAct>('i');

  const switchAct = (act: NavAct) => {
    const prev = prevActRef.current;
    const dir = ACT_ORDER.indexOf(act) >= ACT_ORDER.indexOf(prev) ? 1 : -1;
    setDirection(dir);
    prevActRef.current = act;
    setNavAct(act);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (act !== 'ii') setActiveBeat('ii-1');
  };

  const handleNodeClick = (beat: Beat) => {
    const idMap: Record<Beat, string> = { 'ii-1': 'beat-1', 'ii-2': 'beat-2', 'ii-3': 'beat-3' };
    const jump = () => {
      setActiveBeat(beat);
      document.getElementById(idMap[beat])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (navAct !== 'ii') {
      switchAct('ii');
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

        {/* LEFT: Sticky visual stage */}
        <div className="hidden lg:block w-1/2">
          <div className="fixed top-14 w-1/3 h-[calc(100vh-3.5rem)] border-r border-border-muted">
            <Stage stageAct={stageAct} onNodeClick={handleNodeClick} />
          </div>
        </div>

        {/* RIGHT: Narrative */}
        <div>

          {/* Page header */}
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
            <h1 className="text-3xl sm:text-[2.75rem] font-bold tracking-tight leading-[1.08] mb-4">ALFA Club</h1>
            <p className="max-w-md text-base sm:text-lg leading-relaxed text-text-secondary font-light mb-6">
              React ecommerce storefront work for alfaclub.ca — performance, polish, and
              a mobile checkout experience that earns trust before the first tap.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['React', 'TypeScript', 'Tailwind CSS'].map(t => (
                <span key={t} className="font-mono text-[10px] px-2.5 py-1 rounded border border-border-muted bg-bg-panel text-text-secondary">{t}</span>
              ))}
            </div>
            <div className="flex gap-8 pt-5 border-t border-border-muted">
              {[
                { l: 'Lighthouse', v: '90s est.' },
                { l: 'Surface',    v: 'Ecommerce' },
                { l: 'Focus',      v: 'Checkout UX' },
              ].map(m => (
                <div key={m.l}>
                  <p className="text-xl font-bold font-mono text-accent">{m.v}</p>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-0.5">{m.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Act nav */}
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
                  {act === 'i' ? 'I · The Bet' : act === 'ii' ? 'II · The Build' : 'III · What Held Up'}
                </button>
              ))}
            </div>
          </nav>

          {/* Act content */}
          <AnimatePresence mode="wait" custom={direction}>

            {/* ACT I */}
            {navAct === 'i' && (
              <motion.div
                key="act-i"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <div className="lg:hidden h-52 border-b border-border-muted">
                  <Stage stageAct="i" onNodeClick={handleNodeClick} />
                </div>

                <div className="px-6 sm:px-10 py-12 sm:py-16 space-y-10">
                  <p className="font-mono text-[10px] text-accent tracking-widest uppercase">Act I · The Bet</p>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="text-3xl sm:text-[2.4rem] font-bold tracking-tight text-text-primary leading-[1.1]"
                  >
                    One storefront. Performance as product quality from the first commit.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.45 }}
                    className="space-y-5 max-w-prose"
                  >
                    <p className="text-base text-text-secondary leading-relaxed">
                      ALFA Club needed storefront work that treated frontend quality as product quality.
                      Fast pages, responsive interaction, and a checkout flow that felt dependable
                      on mobile — not as stretch goals, but as the baseline expectation.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The challenge was not building a shopping interface from scratch but making
                      every decision — bundle weight, interaction timing, layout stability — feel
                      intentional rather than incidental. On ecommerce, the frontend is the product.
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
                        'Preserve the existing ecommerce intent while improving perceived speed and interaction quality.',
                        'Prioritize mobile checkout — that is where small frontend delays feel most expensive.',
                        'Use measurable frontend improvements where available, but avoid inventing analytics or conversion numbers.',
                        'Treat spacing, responsiveness, and feedback states as part of the engineering surface, not afterthoughts.',
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
                      Continue to The Build
                      <span className="text-accent">→</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ACT II */}
            {navAct === 'ii' && (
              <motion.div
                key="act-ii"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <div className="lg:hidden h-52 border-b border-border-muted">
                  <Stage stageAct={stageAct} onNodeClick={handleNodeClick} />
                </div>

                <div className="px-6 sm:px-10 py-10">
                  <p className="font-mono text-[10px] text-accent tracking-widest uppercase mb-2">Act II · The Build</p>
                  <p className="text-[11px] font-mono text-text-muted">Three beats — scroll or click a diagram node to jump.</p>
                </div>

                {/* Beat 1 — The Storefront Layer */}
                <div id="beat-1" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-1' ? 'text-accent' : 'text-text-muted'}`}>01</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">The Storefront Layer</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      The React surface was the product. Every component decision — how the cart
                      updated, how product images loaded, how filters responded — was a product
                      decision. The implementation had to be clean enough that future changes
                      stayed cheap.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      TypeScript and Tailwind kept the component surface predictable: types caught
                      prop drift early, and utility classes meant the design language stayed consistent
                      without a separate stylesheet growing in the background.
                    </p>
                  </div>
                  <p className="font-mono text-[10px] text-text-muted italic">
                    ↑ React node highlighted in the diagram — the storefront layer that connects performance work to the shopper.
                  </p>
                </div>

                {/* Beat 2 — Performance */}
                <div id="beat-2" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-2' ? 'text-accent' : 'text-text-muted'}`}>02</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">The Performance Pass</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      Pages landed in the Lighthouse 90s range — Waleed&apos;s measured-in-practice
                      account, not an audited export. The work focused on the things that move
                      that number: render-blocking assets, image loading strategy, and keeping
                      the initial bundle honest.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The alternative — optimizing only what felt slow — would have left gaps
                      that compounded. Treating the score as a target from the start meant
                      performance was a constraint, not a cleanup task.
                    </p>
                  </div>
                  <Tradeoff
                    decision="Lighthouse target vs. optimise-what-feels-slow"
                    summary="Setting a measurable floor changed how frontend decisions were made."
                    pro="Kept the performance story honest and auditable, not just impressionistic."
                    con="Required deferring some visual richness until the budget could support it."
                  />
                </div>

                {/* Beat 3 — Checkout & Polish */}
                <div id="beat-3" className="scroll-mt-32 px-6 sm:px-10 py-10 border-t border-border-muted space-y-6">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-[10px] transition-colors ${activeBeat === 'ii-3' ? 'text-accent' : 'text-text-muted'}`}>03</span>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Checkout &amp; Polish</h2>
                  </div>
                  <div className="space-y-4 max-w-prose">
                    <p className="text-base text-text-secondary leading-relaxed">
                      Mobile checkout was the highest-stakes surface. A layout shift at the wrong
                      moment, a tap target that is one pixel too small, or a loading state that
                      goes missing — any of those erodes trust before the payment screen.
                      The checkout path was treated as a critical-path product surface, not a
                      derived UI layer.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The polish pass tightened visual states across the whole storefront —
                      hover feedback, empty states, responsive breakpoints — so nothing looked
                      provisional in production.
                    </p>
                  </div>
                  <Tradeoff
                    decision="Visual polish vs. performance budget"
                    summary="Storefront interaction had to feel refined without making the page heavier."
                    pro="Kept the brand experience polished and responsive for shoppers throughout the purchase path."
                    con="Required every visual decision to be weighed against speed, not just aesthetic preference."
                  />
                  <div className="space-y-3 pt-1">
                    <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">Delivery sequence</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { n: '01', l: 'Audit',       d: 'Identified where responsiveness and layout quality most affected trust.' },
                        { n: '02', l: 'Performance', d: 'Optimised rendering, mobile layout, and checkout interaction.' },
                        { n: '03', l: 'Polish',      d: 'Tightened visual states so the site felt stable and production-ready.' },
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

            {/* ACT III */}
            {navAct === 'iii' && (
              <motion.div
                key="act-iii"
                custom={direction}
                variants={contentVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
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
                      ALFA Club shipped a production ecommerce storefront with stronger mobile
                      checkout ergonomics and performance work in the Lighthouse 90s range.
                      Because there is no audited Lighthouse export in the available source,
                      that figure is intentionally labeled as an estimate — the directional
                      result is real, the precise number is not a benchmark.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The project reflects a consistent principle: the frontend is not a layer
                      on top of the product — it is the product surface your users actually
                      experience. Every interaction state, load sequence, and layout choice
                      either builds or erodes the trust that converts a browser into a buyer.
                    </p>
                    <p className="text-base text-text-secondary leading-relaxed">
                      The lesson from the checkout pass was that small-team ecommerce work
                      needs the same attention to critical paths that infrastructure work does.
                      A payment flow is a critical path. Treat it as one.
                    </p>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                    className="text-3xl sm:text-[2.4rem] font-bold tracking-tight text-text-primary leading-[1.1] pt-4"
                  >
                    The frontend is the product. Build it like one.
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
        </div>
      </div>
    </div>
  );
}