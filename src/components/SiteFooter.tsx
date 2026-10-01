import Link from 'next/link';
import { profile } from '@/data/site';
import { Container } from './ui';

export default function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-3xl leading-tight text-ink">
            Start with the problem.
            <br />
            The stack can come later.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-4 inline-block text-ink underline decoration-accent/60 underline-offset-4 hover:text-accent-ink"
          >
            {profile.email}
          </a>
        </div>
        <nav aria-label="Footer" className="grid content-start gap-0.5 text-sm text-ink-2 [&_a]:py-1.5">
          <Link href="/products" className="hover:text-ink">Work</Link>
          <Link href="/journey" className="hover:text-ink">Journey</Link>
          <Link href="/process" className="hover:text-ink">How I built this</Link>
          <Link href="/explorer" className="hover:text-ink">Explorer</Link>
          <Link href="/contact" className="hover:text-ink">Contact</Link>
        </nav>
        <div className="grid content-start gap-0.5 text-sm text-ink-2 [&_a]:py-1.5">
          <a href={profile.resume} className="hover:text-ink">Résumé (PDF)</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">LinkedIn</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">GitHub</a>
          <a href={profile.repo} target="_blank" rel="noopener noreferrer" className="hover:text-ink">Source for this site</a>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-rule py-5 font-mono text-xs text-ink-3 sm:flex-row sm:justify-between">
        <span>{profile.name} · {profile.location}</span>
        <span>Next.js · statically rendered · tested in CI with Playwright</span>
      </Container>
    </footer>
  );
}
