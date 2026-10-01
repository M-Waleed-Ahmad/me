import React, { ViewTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { selectedWork, WorkItem } from '@/data/site';
import { TextLink } from '@/components/ui';
import PrintButton from './PrintButton';

/*
  Building blocks for a project page: a hero that carries the ten-second version,
  soft cards for the detail, and plain-language sections. Space and surfaces do
  the organising; there are almost no rules or borders.
*/

export function ProjectHero({
  item,
  description,
  facts,
  back = { href: '/', label: 'Back to map' },
}: {
  item: WorkItem;
  description: string;
  facts: { value: string; label: string }[];
  back?: { href: string; label: string };
}) {
  return (
    <header>
      <div className="reveal flex items-center justify-between text-sm text-ink-3" data-no-print>
        <Link href={back.href} className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> {back.label}
        </Link>
        <PrintButton />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="reveal font-mono text-xs text-ink-3" style={{ '--i': 1 } as React.CSSProperties}>{item.kind}</p>
          <ViewTransition name={`project-title-${item.slug}`} share="morph">
            <h1 className="mt-2 font-serif text-6xl leading-none tracking-[-0.01em] text-ink sm:text-7xl">{item.name}</h1>
          </ViewTransition>
          <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-ink-2" style={{ '--i': 2 } as React.CSSProperties}>{description}</p>
          <div className="reveal mt-5 flex flex-wrap items-center gap-x-5 gap-y-3" style={{ '--i': 3 } as React.CSSProperties}>
            <ul className="flex flex-wrap gap-2" aria-label="Stack">
              {item.stack.map((tech) => (
                <li key={tech} className="rounded-full bg-surface px-3 py-1 text-sm text-ink-2">
                  {tech}
                </li>
              ))}
            </ul>
            {item.live && (
              <span className="text-sm">
                <TextLink href={item.live} external>
                  Visit live site
                </TextLink>
              </span>
            )}
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-6">
          {facts.map((fact, i) => (
            <div key={fact.label} className="reveal" style={{ '--i': 3 + i } as React.CSSProperties}>
              <dd className="font-serif text-5xl leading-none text-ink">{fact.value}</dd>
              <dt className="mt-2 text-sm leading-snug text-ink-3">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* Real product screenshots, when they've been added to src/data/site.ts */}
      {item.screenshots.length > 0 && (
        <div className="reveal mt-12 grid gap-4 sm:grid-cols-2" style={{ '--i': 5 } as React.CSSProperties}>
          {item.screenshots.map((shot, i) => (
            <figure key={shot.src} className={i === 0 && item.screenshots.length % 2 === 1 ? 'sm:col-span-2' : ''}>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="h-auto w-full rounded-2xl"
                sizes="(min-width: 1024px) 1100px, 100vw"
              />
              <figcaption className="mt-2 text-sm text-ink-3">{shot.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </header>
  );
}

export function SoftCard({
  title,
  lede,
  children,
  className = '',
}: {
  title: string;
  lede?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`reveal rounded-2xl bg-surface p-6 ${className}`} style={{ '--i': 6 } as React.CSSProperties}>
      <h2 className="text-base font-medium text-ink">{title}</h2>
      {lede && <p className="mt-1 text-sm text-ink-3">{lede}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function KeyValues({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="space-y-3 text-[0.95rem]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-6">
          <dt className="shrink-0 text-ink-3">{label}</dt>
          <dd className="text-right text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HardParts({ items }: { items: string[] }) {
  return (
    <section className="reveal" style={{ '--i': 7 } as React.CSSProperties}>
      <h2 className="text-base font-medium text-ink">What made it hard</h2>
      <ol className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3 leading-relaxed text-ink-2">
            <span className="font-mono text-xs leading-7 text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Walks the projects in the same order as the work list. */
export function NextProject({ slug }: { slug: string }) {
  const index = selectedWork.findIndex((w) => w.slug === slug);
  const next = selectedWork[(index + 1) % selectedWork.length];
  return (
    <Link
      href={next.href}
      className="group mt-16 flex items-center justify-between gap-6 rounded-2xl bg-surface px-6 py-5 transition-colors hover:bg-rule/60"
    >
      <span>
        <span className="block text-sm text-ink-3">Next project</span>
        <span className="mt-1 block font-serif text-3xl text-ink transition-colors group-hover:text-accent-ink">{next.name}</span>
      </span>
      <span className="text-sm text-ink-3">{next.kind} →</span>
    </Link>
  );
}
