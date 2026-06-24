'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass, Zap, GitBranch, Cpu, Package } from 'lucide-react';
import { useNavigator } from '@/context/NavigatorContext';
import { workspaceNodes, workspaceEdges } from '@/data/workspaceData';
import WorkspaceMap from '@/components/WorkspaceMap';

// Dynamic imports — NetworkGraph loads only on client, avoiding SSR issues with D3
const NetworkGraph = dynamic(() => import('@/components/NetworkGraph'), {
  ssr: false,
  loading: () => null,
});

const NetworkGraphMobile = dynamic(() => import('@/components/NetworkGraphMobile'), {
  ssr: false,
});

const FOCUS_ITEMS = [
  { icon: Package, label: 'Production software' },
  { icon: GitBranch, label: 'System design' },
  { icon: Zap, label: 'Automation & workflows' },
  { icon: Cpu, label: 'Applied AI / LLMs' },
];

const DESKTOP_BOOT_STATES = [
  'Opening workspace...',
  'Mapping connections...',
  'Workspace ready.',
];

const MOBILE_BOOT_STATES = [
  'Opening workspace...',
  'Workspace ready.',
];

export default function Home() {
  const { openNavigator } = useNavigator();
  const [isMobile, setIsMobile] = useState(false);
  const [graphReady, setGraphReady] = useState(false);
  const [minimumBootTimePassed, setMinimumBootTimePassed] = useState(false);
  const [bootStateIndex, setBootStateIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const bootStates = isMobile ? MOBILE_BOOT_STATES : DESKTOP_BOOT_STATES;
  const bootComplete = graphReady && minimumBootTimePassed;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const minimumDelay = reduceMotion ? 120 : isMobile ? 620 : 920;
    const readyTimer = window.setTimeout(() => setMinimumBootTimePassed(true), minimumDelay);

    if (reduceMotion) {
      return () => window.clearTimeout(readyTimer);
    }

    const messageTimer = window.setInterval(() => {
      setBootStateIndex((index) => Math.min(index + 1, bootStates.length - 1));
    }, isMobile ? 300 : 360);

    return () => {
      window.clearTimeout(readyTimer);
      window.clearInterval(messageTimer);
    };
  }, [bootStates.length, isMobile, reduceMotion]);

  const handleGraphReady = useCallback(() => {
    setGraphReady(true);
  }, []);

  const graphOpacity = useMemo(() => {
    if (reduceMotion) return 0.8;
    if (bootComplete) return 0.8;
    return isMobile ? 0.18 : 0.32;
  }, [bootComplete, isMobile, reduceMotion]);

  return (
    <div className="flex-1 flex flex-col">

      {/* ─── SECTION 1: Living Network Hero ─────────────────────────────────── */}
      <section className="relative h-[82vh] min-h-[560px] max-h-[900px] border-b border-border-muted overflow-hidden bg-bg-dark sm:h-[85vh] sm:min-h-[600px]">

        {/* Network graph layer — fills the whole section */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={false}
          animate={{ opacity: graphOpacity }}
          transition={{ duration: reduceMotion ? 0.08 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {isMobile
            ? <NetworkGraphMobile nodes={workspaceNodes} onReady={handleGraphReady} />
            : (
              <NetworkGraph
                nodes={workspaceNodes}
                edges={workspaceEdges}
                onReady={handleGraphReady}
                reduceMotion={reduceMotion ?? false}
              />
            )}
        </motion.div>

        {/* Vignette overlay — pulls attention to center text */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(3,3,3,0.65) 100%)' }}
        />

        {/* Hero text content — center-aligned, above graph */}
        <AnimatePresence>
          {!bootComplete && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center bg-bg-dark/70 px-4"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              aria-live="polite"
              aria-label="Workspace is initializing"
            >
              <motion.p
                key={bootStates[bootStateIndex]}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.18 }}
                className="font-mono text-xs uppercase tracking-widest text-text-secondary"
              >
                {bootStates[bootStateIndex]}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: bootComplete ? 1 : 0, y: bootComplete ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/25 bg-accent/5 text-accent text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Systems Workspace
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight leading-[1.08] text-text-primary">
              Building products, systems,
              <br className="hidden sm:block" />
              {' '}and intelligent workflows.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed font-light">
              A systems-focused engineer exploring the intersection of software, automation, and applied AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto group px-7 py-3.5 rounded-lg bg-accent hover:bg-accent-bright text-bg-dark font-mono text-sm font-semibold tracking-wide transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.18)] hover:shadow-[0_0_32px_rgba(52,211,153,0.32)] flex items-center justify-center gap-2"
              >
                Explore Workspace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={openNavigator}
                className="w-full sm:w-auto px-7 py-3.5 rounded-lg border border-border-muted hover:border-accent/35 bg-bg-panel/70 backdrop-blur-sm hover:bg-bg-panel text-text-secondary hover:text-text-primary font-mono text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                Open Navigator
              </button>
            </div>
          </motion.div>

          {/* Graph hint */}
          {!isMobile && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-muted tracking-widest"
            >
              ↓ drag nodes · scroll to zoom · click to navigate
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── SECTION 2: Identity ────────────────────────────────────────────── */}
      <section className="border-b border-border-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-5 gap-12 items-start">

          {/* Philosophy paragraph */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-3 space-y-5"
          >
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase block">
              Identity // Engineering Philosophy
            </span>
            <p className="text-xl sm:text-2xl text-text-primary leading-relaxed font-light tracking-tight">
              {'{{PLACEHOLDER: "I enjoy building products that solve real problems, designing systems that scale, and exploring where applied AI can create meaningful leverage."}}'}
            </p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
              {'{{PLACEHOLDER: One more sentence — something personal about how you approach problems or what draws you to this work.}}'}
            </p>
          </motion.div>

          {/* Current Focus list */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 bg-bg-panel border border-border-muted rounded-xl p-6 space-y-4"
          >
            <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase block">
              Current Focus
            </span>
            <ul className="space-y-3">
              {FOCUS_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="p-1.5 rounded bg-bg-dark border border-border-muted group-hover:border-accent/25 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-sm font-mono text-text-primary">{item.label}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 3: Workspace Map ────────────────────────────────────────── */}
      <WorkspaceMap />

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border-muted bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-text-muted">
            Designed with restraint. Engineered in systems.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-text-secondary">
            <Link href="/journey" className="hover:text-accent transition-colors">Journey</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
            <Link href="/systems" className="hover:text-accent transition-colors">Systems</Link>
            <Link href="/explorer" className="hover:text-accent transition-colors">Explorer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
