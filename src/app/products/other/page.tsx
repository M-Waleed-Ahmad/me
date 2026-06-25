import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Layers3, Package, Sparkles } from 'lucide-react';

const OTHER_WORK = [
  {
    name: 'Zillabyte',
    type: 'Agency / Portfolio Site',
    summary:
      'A media-heavy web build using React and Cloudinary, focused on presenting work cleanly while reducing the drag of large visual assets.',
    outcome: 'Media load times reduced substantially, roughly 40% by Waleed\'s own measurement.',
    role: 'Frontend implementation, media handling, responsive presentation.',
    tech: ['React', 'Cloudinary'],
  },
  {
    name: 'CCHROME',
    type: 'Agency / Portfolio Site',
    summary:
      'A visual portfolio site where image handling, responsive layout, and polish mattered more than adding unnecessary product complexity.',
    outcome: 'Kept lightweight and presentation-focused so the visual work stayed central.',
    role: 'Frontend build, layout polish, responsive image treatment.',
    tech: ['React', 'Cloudinary'],
  },
];

const SIGNALS = [
  ['Pattern', 'Client-facing surfaces with visual assets and practical performance constraints.'],
  ['Role', 'Implementation and polish rather than large product architecture.'],
  ['Why brief', 'Useful delivery evidence, but not every shipped surface needs a full case-study treatment.'],
];

export default function OtherWorkPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Products
        </Link>

        <section className="mt-8 border-b border-border-muted pb-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-accent tracking-widest uppercase">
            <Package className="w-4 h-4" />
            Other Work
          </div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Smaller builds, still useful evidence.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">
                These projects are not stretched into full case studies. They show delivery range:
                polished client-facing pages, media-heavy surfaces, and pragmatic frontend execution.
              </p>
            </div>
            <div className="border border-border-muted bg-bg-panel p-5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                <Sparkles className="h-4 w-4" />
                Read this section as
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Supporting proof, not the centerpiece. The strongest product stories remain Arabia Hills,
                WePsych, and ALFA Club.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-0 border-b border-border-muted md:grid-cols-3 md:divide-x md:divide-border-muted">
          {SIGNALS.map(([label, text]) => (
            <div key={label} className="border-b border-border-muted py-5 md:border-b-0 md:px-6 first:md:pl-0 last:md:pr-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{label}</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 divide-y divide-border-muted border-y border-border-muted">
          {OTHER_WORK.map((project, index) => (
            <article key={project.name} className="grid gap-6 py-7 lg:grid-cols-[180px_1fr_260px]">
              <div>
                <p className="font-mono text-[10px] text-text-muted">0{index + 1}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-accent">{project.type}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{project.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{project.summary}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="border-t border-border-muted pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Role</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.role}</p>
                  </div>
                  <div className="border-t border-border-muted pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Outcome</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.outcome}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-5">
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {project.tech.map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-1 border border-border-muted bg-bg-panel text-text-secondary">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted lg:justify-end">
                  <Layers3 className="h-3.5 w-3.5" />
                  Supporting build
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 flex flex-col gap-4 border border-accent/20 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Main product stories</p>
            <p className="mt-2 text-sm text-text-secondary">For deeper architecture and product decisions, start with the three case studies.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-primary transition-colors hover:text-accent"
          >
            View products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
