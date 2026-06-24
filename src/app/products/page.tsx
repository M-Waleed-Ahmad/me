'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, ArrowUpRight, Compass, ExternalLink } from 'lucide-react';
import { useNavigator } from '@/context/NavigatorContext';

const PRODUCTS = [
  {
    id: 'wepsych',
    href: '/products/wepsych',
    status: 'Production · International',
    name: 'WePsych',
    role: 'Full-Stack Architect & Lead Engineer',
    tagline: 'Digital mental health platform for real patients, at international scale.',
    description: '{{PLACEHOLDER: 1–2 sentences on what WePsych does, who uses it, and the problem space it addresses.}}',
    impact: [
      { label: 'Users', value: '{{PLACEHOLDER: N}}' },
      { label: 'Uptime', value: '{{PLACEHOLDER: 99.x%}}' },
      { label: 'Countries', value: '{{PLACEHOLDER: N}}' },
    ],
    tech: ['FastAPI', 'React', 'Supabase', 'PostgreSQL'],
    pillarTag: 'Healthcare · Full-Lifecycle',
    featured: true,
  },
  {
    id: 'arabia-hills',
    href: '/products/arabia-hills',
    status: 'Production',
    name: 'Arabia Hills',
    role: 'Platform Engineer',
    tagline: 'High-performance real estate portal with spatial search and complex data pipelines.',
    description: '{{PLACEHOLDER: 1–2 sentences on Arabia Hills property search and the engineering problem addressed.}}',
    impact: [
      { label: 'Query Speed', value: '{{PLACEHOLDER: Xms}}' },
      { label: 'Listings', value: '{{PLACEHOLDER: N+}}' },
    ],
    tech: ['Next.js', 'Supabase', 'PostgreSQL', 'PostGIS'],
    pillarTag: 'Real Estate · Platform Engineering',
    featured: false,
  },
  {
    id: 'alfa-club',
    href: '/products/alfa-club',
    status: 'Production',
    name: 'ALFA Club',
    role: 'Frontend Engineer',
    tagline: 'Luxury membership platform engineered for craftsmanship and near-perfect performance scores.',
    description: '{{PLACEHOLDER: 1–2 sentences on ALFA Club and the frontend optimization focus.}}',
    impact: [
      { label: 'Lighthouse', value: '{{PLACEHOLDER: 9X}}' },
      { label: 'Bounce ↓', value: '{{PLACEHOLDER: X%}}' },
    ],
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    pillarTag: 'Membership · UX Craftsmanship',
    featured: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function ProductsPage() {
  const { openNavigator } = useNavigator();
  const featured = PRODUCTS.find(p => p.featured)!;
  const secondary = PRODUCTS.filter(p => !p.featured);

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">

        {/* Pillar header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border-muted pb-8"
        >
          <div className="flex items-center gap-2 text-accent font-mono text-[10px] tracking-widest uppercase mb-3">
            <Layers className="w-3.5 h-3.5" />
            Pillar 01 // Products
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">The Workspace Shelf</h1>
          <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
            Production software built to solve human problems — not demos, not side projects.
            Each entry is a story: a real problem, real constraints, real users, real outcomes.
          </p>
        </motion.div>

        {/* ── Featured: WePsych ──────────────────────────────────────────────── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Link
            href={featured.href}
            className="group block rounded-xl border border-border-muted bg-bg-panel hover:border-accent/30 transition-all duration-300 overflow-hidden"
          >
            {/* Top band */}
            <div className="bg-bg-dark/60 border-b border-border-muted px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] text-accent tracking-widest uppercase">{featured.status}</span>
              </div>
              <span className="font-mono text-[10px] text-text-muted">FEATURED CASE STUDY</span>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: info */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <p className="text-[10px] font-mono text-text-muted mb-1">{featured.pillarTag}</p>
                  <h2 className="text-3xl sm:text-4xl font-bold group-hover:text-accent transition-colors duration-300">
                    {featured.name}
                  </h2>
                  <p className="text-sm text-text-secondary font-mono mt-1">{featured.role}</p>
                </div>
                <p className="text-base text-text-secondary leading-relaxed max-w-xl">
                  {featured.tagline}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {featured.tech.map(t => (
                    <span key={t} className="font-mono text-[10px] px-2.5 py-1 rounded border border-border-muted bg-bg-dark text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: metrics + CTA */}
              <div className="space-y-5">
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                  {featured.impact.map(m => (
                    <div key={m.label} className="p-3 rounded-lg border border-border-muted bg-bg-dark">
                      <p className="text-lg font-bold font-mono text-accent">{m.value}</p>
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-mono text-text-secondary">Inspect case study</span>
                  <ArrowUpRight className="w-4 h-4 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Secondary grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {secondary.map((product, i) => (
            <motion.div key={product.id} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible">
              <Link
                href={product.href}
                className="group block h-full rounded-xl border border-border-muted bg-bg-panel hover:border-accent/30 hover:bg-bg-panel-hover transition-all duration-300 overflow-hidden"
              >
                <div className="bg-bg-dark/40 border-b border-border-muted px-6 py-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-text-muted tracking-widest">{product.status}</span>
                  <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-mono text-text-muted mb-1">{product.pillarTag}</p>
                    <h2 className="text-xl font-bold group-hover:text-accent transition-colors duration-300">{product.name}</h2>
                    <p className="text-xs text-text-secondary font-mono mt-0.5">{product.role}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">{product.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.tech.map(t => (
                      <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-border-muted bg-bg-dark text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    {product.impact.map(m => (
                      <div key={m.label}>
                        <p className="text-base font-bold font-mono text-accent">{m.value}</p>
                        <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Other Work */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
          <Link
            href="/products/other"
            className="group flex items-center justify-between p-5 rounded-xl border border-border-muted border-dashed hover:border-accent/25 hover:bg-bg-panel transition-all"
          >
            <div>
              <p className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                Other Work
              </p>
              <p className="text-xs text-text-muted font-mono mt-0.5">
                Freelance builds, experiments, and internal tools
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
          </Link>
        </motion.div>

        {/* Navigator CTA */}
        <div className="border-t border-border-muted pt-8 flex items-center justify-between">
          <p className="text-xs font-mono text-text-muted">
            Looking for Systems or Intelligence work?
          </p>
          <button
            onClick={openNavigator}
            className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded border border-border-muted hover:border-accent/30 text-text-secondary hover:text-text-primary transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-accent" /> Open Navigator
          </button>
        </div>
      </div>
    </div>
  );
}
