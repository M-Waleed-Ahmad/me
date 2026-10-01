import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/*
  Shared building blocks for the notebook layout. All of these are server-safe
  (no hooks), so pages can stay Server Components and ship less JavaScript.
*/

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Small section marker, e.g. "§ 2 · Systems". The only place mono labels are used for structure. */
export function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono text-xs tracking-wide text-ink-3 ${className}`}>{children}</p>;
}

export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="reveal pb-8 pt-12 sm:pb-10 sm:pt-16">
      <Kicker>{kicker}</Kicker>
      <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.01em] text-ink sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{children}</div>}
    </header>
  );
}

export function SectionHeading({
  id,
  number,
  title,
  lede,
}: {
  id?: string;
  number?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      {number && <Kicker>{number}</Kicker>}
      <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">{title}</h2>
      {lede && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">{lede}</p>}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-rule px-2 py-0.5 font-mono text-xs text-ink-2">
      {children}
    </span>
  );
}

export function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

/** Numbered figure on graph paper with a caption underneath. */
export function Figure({
  number,
  caption,
  children,
  className = '',
  plain = false,
  fluid = false,
}: {
  number: string;
  caption: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  plain?: boolean;
  /** Shrink with the container instead of scrolling sideways below 600px. */
  fluid?: boolean;
}) {
  return (
    <figure className={className}>
      {/* Figures keep a readable minimum width; on phones they scroll sideways instead of shrinking. */}
      <div className={`overflow-x-auto border border-rule ${plain ? 'bg-surface' : 'graph-paper'}`}>
        <div className={fluid ? undefined : 'min-w-[600px]'}>{children}</div>
      </div>
      <figcaption className="mt-3 flex gap-3 text-sm leading-snug text-ink-3">
        <span className="shrink-0 font-mono text-xs leading-5 text-ink-2">Fig. {number}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

/** Handwritten-feeling annotation: serif italic in the accent colour. */
export function MarginNote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <aside className={`font-serif text-lg italic leading-snug text-accent-ink ${className}`}>
      <span aria-hidden className="mr-1 not-italic">↳</span>
      {children}
    </aside>
  );
}

/** Body text with an optional note in the right margin (stacks below on small screens). */
export function WithMargin({ note, children }: { note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
      <div className="prose-notebook">{children}</div>
      {note ? <MarginNote className="lg:pt-1">{note}</MarginNote> : <span className="hidden lg:block" />}
    </div>
  );
}

/** A decision record: what was chosen, what it bought, what it cost. Always visible. */
export function Decision({
  title,
  gained,
  accepted,
}: {
  title: string;
  gained: string;
  accepted: string;
}) {
  return (
    <div className="border-l-2 border-accent bg-surface/70 py-4 pl-5 pr-4">
      <p className="font-mono text-xs text-ink-3">Decision</p>
      <p className="mt-1 font-serif text-2xl leading-tight text-ink">{title}</p>
      <dl className="mt-4 grid gap-4 text-[0.95rem] leading-relaxed sm:grid-cols-2 sm:gap-6">
        <div>
          <dt className="font-mono text-xs text-ink-3">Gained</dt>
          <dd className="mt-1 text-ink-2">{gained}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-ink-3">Accepted</dt>
          <dd className="mt-1 text-ink-2">{accepted}</dd>
        </div>
      </dl>
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-5xl leading-none text-ink">{value}</p>
      <p className="mt-2 max-w-[16rem] text-sm leading-snug text-ink-3">{label}</p>
    </div>
  );
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors';

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external = false,
  download = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  download?: boolean;
}) {
  const style =
    variant === 'primary'
      ? 'bg-ink text-paper hover:bg-accent'
      : 'border border-rule-strong text-ink hover:border-ink';
  const className = `${buttonBase} ${style}`;

  if (external || download || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={className}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Inline text link with an accent underline. */
export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    'text-ink underline decoration-accent/60 decoration-1 underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ArrowUpRight aria-hidden className="ml-0.5 inline h-3.5 w-3.5 align-[-2px]" />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
