'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass, Zap, GitBranch, Cpu, Package, X, Maximize2 } from 'lucide-react';
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

const STATE_DURATION_MS = 650;
const MIN_TOTAL_DURATION_MS = 1900;
const CROSSFADE_DURATION_MS = 450;
const MOBILE_STATE_DURATION_MS = 520;
const MOBILE_MIN_TOTAL_DURATION_MS = 1200;
const REDUCED_MOTION_DURATION_MS = 120;
const REDUCED_MOTION_CROSSFADE_MS = 80;

export default function Home() {
  const { openNavigator } = useNavigator();
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [graphReady, setGraphReady] = useState(false);
  // overlayOpen tracks the full-screen overlay — separate from the resting hero graph
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [minimumBootTimePassed, setMinimumBootTimePassed] = useState(false);
  const [bootStateIndex, setBootStateIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const bootStates = isMobile ? MOBILE_BOOT_STATES : DESKTOP_BOOT_STATES;
  const bootComplete = graphReady && minimumBootTimePassed;
  // Capture scroll position before opening overlay so we can restore on close
  const savedScrollY = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const minimumDelay = reduceMotion
      ? REDUCED_MOTION_DURATION_MS
      : isMobile
        ? MOBILE_MIN_TOTAL_DURATION_MS
        : MIN_TOTAL_DURATION_MS;
    const readyTimer = window.setTimeout(() => setMinimumBootTimePassed(true), minimumDelay);

    if (reduceMotion) {
      return () => window.clearTimeout(readyTimer);
    }

    const messageTimer = window.setInterval(() => {
      setBootStateIndex((index) => Math.min(index + 1, bootStates.length - 1));
    }, isMobile ? MOBILE_STATE_DURATION_MS : STATE_DURATION_MS);

    return () => {
      window.clearTimeout(readyTimer);
      window.clearInterval(messageTimer);
    };
  }, [bootStates.length, isMobile, reduceMotion]);

  const handleGraphReady = useCallback(() => {
    setGraphReady(true);
  }, []);

  // Open the overlay — save current scroll position
  const openOverlay = useCallback(() => {
    if (!bootComplete || isMobile) return;
    savedScrollY.current = window.scrollY;
    setOverlayOpen(true);
  }, [bootComplete, isMobile]);

  // Close the overlay — restore scroll position
  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    // Restore scroll on next frame so the page repaints first
    requestAnimationFrame(() => {
      window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
    });
  }, []);

  // Escape key closes overlay
  useEffect(() => {
    if (!overlayOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [overlayOpen, closeOverlay]);

  // Resting hero graph is always dimmed — opacity never changes based on engagement
  const restingGraphOpacity = bootComplete
    ? (isMobile ? 0.38 : 0.28)
    : (isMobile ? 0.14 : 0.18);
  const restingGraphFilter = 'saturate(0.4) brightness(0.45)';

  return (
    <div className="flex-1 flex flex-col">

      {/* ─── FULL-SCREEN GRAPH OVERLAY ───────────────────────────────────────── */}
      {/*
        Sits above everything (z-50). Separate from the hero graph — own NetworkGraph
        instance at full brightness. Hero text is fully hidden behind solid bg.
        Closing restores scroll position.
      */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            key="graph-overlay"
            className="fixed inset-0 z-50 flex flex-col bg-bg-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Interactive workspace graph"
          >
            {/* Overlay header bar */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border-muted bg-bg-dark/90 backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[11px] text-text-secondary tracking-widest uppercase">
                  Workspace Graph — drag nodes · scroll to zoom · click to open
                </span>
              </div>
              <button
                onClick={closeOverlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-muted hover:border-accent/35 bg-bg-panel hover:bg-bg-panel-hover text-text-secondary hover:text-text-primary font-mono text-[11px] tracking-wide transition-all duration-150"
                aria-label="Close graph overlay"
              >
                <X className="w-3.5 h-3.5" />
                Close
              </button>
            </div>

            {/* Full-viewport graph — all interactivity, full brightness */}
            <div className="relative flex-1 overflow-hidden">
              <NetworkGraph
                nodes={workspaceNodes}
                edges={workspaceEdges}
                onReady={() => {}}
                reduceMotion={reduceMotion ?? false}
                isEngaged={true}
                onEngage={() => {}}
              />
              {/* Subtle hint at the bottom */}
              <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-text-muted">
                drag · scroll to zoom · click node to open · esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SECTION 1: Living Network Hero ─────────────────────────────────── */}
      {/*
        The hero section itself is clickable to open the overlay, but we guard
        against clicks that originate from buttons or links (the CTAs) using
        a pointer-events check on the event target.
      */}
      <section
        className="relative h-[82vh] min-h-[560px] max-h-[900px] border-b border-border-muted overflow-hidden bg-bg-dark sm:h-[85vh] sm:min-h-[600px] cursor-pointer"
        onClick={(e) => {
          // Don't open overlay if user clicked a button or link (CTAs)
          const target = e.target as HTMLElement;
          if (target.closest('button, a')) return;
          openOverlay();
        }}
        aria-label="Click to open interactive workspace graph"
      >

        {/* Resting graph layer — always dimmed, never changes state */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={false}
          animate={{
            opacity: restingGraphOpacity,
            filter: restingGraphFilter,
          }}
          transition={{
            duration: (reduceMotion ? REDUCED_MOTION_CROSSFADE_MS : CROSSFADE_DURATION_MS) / 1000,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          {isMobile
            ? <NetworkGraphMobile nodes={workspaceNodes} onReady={handleGraphReady} />
            : (
              <NetworkGraph
                nodes={workspaceNodes}
                edges={workspaceEdges}
                onReady={handleGraphReady}
                reduceMotion={reduceMotion ?? false}
                isEngaged={false}
                onEngage={() => {}}
              />
            )}
        </motion.div>

        {/* Vignette — outer edge darkening */}
        <div className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 28%, rgba(3,3,3,0.65) 100%)' }}
        />

        {/* Center hard gradient overlay — always present, always smothers graph text behind hero */}
        {!isMobile && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 'calc(64% + 160px)', height: 'calc(48% + 160px)' }}
          >
            <div
              className="w-full h-full"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(3,3,3,0.97) 0%, rgba(3,3,3,0.92) 38%, rgba(3,3,3,0.72) 62%, rgba(3,3,3,0) 100%)',
              }}
            />
          </div>
        )}

        {/* Boot sequence overlay */}
        <AnimatePresence>
          {!bootComplete && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center bg-bg-dark/70 px-4"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: (reduceMotion ? REDUCED_MOTION_CROSSFADE_MS : CROSSFADE_DURATION_MS) / 1000,
                ease: [0.16, 1, 0.3, 1],
              }}
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

        {/* Hero text content */}
        <div className="pointer-events-none relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: bootComplete ? 1 : 0, y: bootComplete ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none relative max-w-3xl space-y-6 px-5 py-7 sm:px-8 sm:py-8"
          >
            {/* Solid backdrop — guarantees legibility regardless of graph position */}
            <div
              aria-hidden
              className="absolute -z-10 backdrop-blur-[2px]"
              style={{
                inset: '-2.5rem',
                background:
                  'radial-gradient(ellipse 80% 72% at 50% 50%, rgba(3,3,3,0.97) 0%, rgba(3,3,3,0.92) 30%, rgba(3,3,3,0.78) 56%, rgba(3,3,3,0.42) 78%, rgba(3,3,3,0) 100%)',
              }}
            />

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
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
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

          {/* Click-to-open graph hint — describes the overlay model accurately */}
          {!isMobile && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: bootComplete ? 1 : 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-text-muted"
            >
              <Maximize2 className="w-3 h-3" />
              click to explore the graph in full screen
            </motion.p>
          )}
        </div>

        {/* Click target — entire hero section opens the overlay on desktop */}
        {!isMobile && bootComplete && (
          <button
            onClick={openOverlay}
            className="absolute inset-0 z-10 cursor-pointer bg-transparent border-0 appearance-none"
            aria-label="Open interactive workspace graph"
            tabIndex={-1}
          />
        )}
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
              I build products that solve real operational problems, systems that make delivery
              more reliable, and applied AI workflows that stay honest about evidence.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
              The common thread is making hidden complexity visible: data movement, user trust,
              automation boundaries, and the places where human review still matters.
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
