import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Container, PageIntro, TagList } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Smaller builds',
  description: 'Zillabyte and CCHROME: media-heavy agency and portfolio sites built with React and Cloudinary.',
  path: '/products/other',
});

const OTHER_WORK = [
  {
    name: 'Zillabyte',
    type: 'Agency / portfolio site',
    summary:
      'A media-heavy site built with React and Cloudinary, focused on presenting work cleanly without the drag of large visual assets.',
    role: 'Frontend implementation, media handling, responsive presentation.',
    outcome: 'Media load times down by roughly 40%, by my own before/after measurement.',
    tech: ['React', 'Cloudinary'],
  },
  {
    name: 'CCHROME',
    type: 'Agency / portfolio site',
    summary:
      'A visual portfolio where image handling, responsive layout and polish mattered more than product complexity.',
    role: 'Frontend build, layout polish, responsive image treatment.',
    outcome: 'Kept deliberately lightweight so the visual work stayed the focus.',
    tech: ['React', 'Cloudinary'],
  },
];

export default function OtherWorkPage() {
  return (
    <Container className="pb-24">
      <Link href="/products" className="mt-10 inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> All work
      </Link>

      <PageIntro kicker="Smaller builds" title="Smaller builds, still useful evidence.">
        These are not stretched into full case studies. They show range: polished client-facing pages, media-heavy
        surfaces and pragmatic frontend work.
      </PageIntro>

      <div className="space-y-4">
        {OTHER_WORK.map((project, index) => (
          <article key={project.name} className="reveal grid gap-6 rounded-2xl bg-surface p-6 lg:grid-cols-[4rem_minmax(0,1fr)_15rem] lg:gap-10" style={{ '--i': index + 1 } as React.CSSProperties}>
            <span className="font-serif text-5xl leading-none text-rule-strong">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-mono text-xs text-ink-3">{project.type}</p>
              <h2 className="mt-2 font-serif text-5xl leading-none text-ink">{project.name}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{project.summary}</p>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-paper p-4">
                  <dt className="font-mono text-xs text-ink-3">Role</dt>
                  <dd className="mt-1 leading-relaxed text-ink-2">{project.role}</dd>
                </div>
                <div className="rounded-xl bg-paper p-4">
                  <dt className="font-mono text-xs text-ink-3">Outcome</dt>
                  <dd className="mt-1 leading-relaxed text-ink-2">{project.outcome}</dd>
                </div>
              </dl>
            </div>
            <div className="space-y-4">
              <TagList items={project.tech} />
            </div>
          </article>
        ))}
      </div>

      <Link
        href="/products"
        className="mt-10 inline-flex items-center gap-2 text-ink underline decoration-accent/60 underline-offset-4 hover:text-accent-ink"
      >
        The main projects go much deeper <ArrowRight className="h-4 w-4" />
      </Link>
    </Container>
  );
}
