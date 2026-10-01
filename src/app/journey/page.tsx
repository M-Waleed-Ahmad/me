import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { certifications, educationHistory, experience, leadership, profile } from '@/data/site';
import { ButtonLink, Container, PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Journey',
  description:
    'Experience and education: CI/CD at Axelliant, client delivery at Ashtex Solutions, a traineeship at Arrivy, and a BS in Computer Science from FAST NUCES.',
  path: '/journey',
});

export default function JourneyPage() {
  return (
    <Container className="pb-24">
      <PageIntro kicker="Journey" title="QA first, then delivery, then pipelines.">
        That order explains most of how I work: I test what I build, I care how it ships, and I would rather make a
        system visible than clever.
      </PageIntro>

      <div className="reveal flex flex-wrap items-center justify-between gap-4" style={{ '--i': 1 } as React.CSSProperties}>
        <h2 className="text-base font-medium text-ink">Experience</h2>
        <ButtonLink href={profile.resume} variant="secondary" download>
          Résumé (PDF)
        </ButtonLink>
      </div>

      <ol className="mt-4 space-y-4">
        {experience.map((role, i) => (
          <li
            key={role.id}
            id={role.id}
            className="reveal grid scroll-mt-24 gap-6 rounded-2xl bg-surface p-6 lg:grid-cols-[10rem_minmax(0,1fr)_16rem] lg:gap-10"
            style={{ '--i': i + 2 } as React.CSSProperties}
          >
            <div>
              <p className="font-mono text-xs text-ink-3">
                {role.start} – {role.end}
              </p>
              <p className="mt-1 font-mono text-xs text-ink-3">{role.place}</p>
            </div>
            <div>
              <h3 className="font-serif text-4xl leading-tight text-ink">{role.org}</h3>
              <p className="mt-1 text-ink-2">{role.title}</p>
              <ul className="mt-4 space-y-2.5">
                {role.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              {role.related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline decoration-accent/60 underline-offset-4 hover:text-accent-ink"
                >
                  {link.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
            <p className="font-serif text-lg italic leading-snug text-accent-ink lg:pt-1">{role.lesson}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-surface p-6">
          <h2 className="text-base font-medium text-ink">Education</h2>
          {educationHistory.map((entry) => (
            <div key={entry.id} id={entry.id} className="mt-4 scroll-mt-24">
              <p className="font-mono text-xs text-ink-3">
                {entry.start} – {entry.end} · {entry.place}
              </p>
              <h3 className="mt-1 font-serif text-3xl text-ink">{entry.org}</h3>
              <p className="text-ink-2">{entry.title}</p>
              {entry.note && <p className="mt-2 leading-relaxed text-ink-2">{entry.note}</p>}
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-surface p-6">
          <h2 className="text-base font-medium text-ink">Leadership and certification</h2>
          {leadership.map((entry) => (
            <div key={entry.id} id={entry.id} className="mt-4 scroll-mt-24">
              <p className="font-mono text-xs text-ink-3">
                {entry.start} – {entry.end}
              </p>
              <h3 className="mt-1 font-serif text-3xl text-ink">{entry.org}</h3>
              <p className="text-ink-2">{entry.title}</p>
            </div>
          ))}
          {certifications.map((name) => (
            <div key={name} className="mt-6">
              <p className="font-mono text-xs text-ink-3">Certification</p>
              <h3 className="mt-1 font-serif text-3xl text-ink">{name}</h3>
              <p className="text-ink-2">Make, the automation platform behind the Arabia Hills ingestion flow</p>
            </div>
          ))}
        </section>
      </div>

      <section className="mt-16 rounded-2xl bg-ink p-8 text-paper sm:p-10">
        <p className="font-mono text-xs text-paper/60">Next</p>
        <p className="mt-3 max-w-3xl font-serif text-4xl leading-tight">
          I&apos;m looking for a team where I can own a product or feature end to end, from the data model to the pipeline
          it ships through.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-paper">
            Get in touch
          </Link>
          <Link href="/" className="rounded-full border border-paper/40 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-paper">
            See how it all connects
          </Link>
        </div>
      </section>
    </Container>
  );
}
