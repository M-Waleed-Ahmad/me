import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { profile } from '@/data/site';
import { Container, Kicker } from '@/components/ui';
import BriefComposer from '@/components/contact/BriefComposer';
import CopyEmail from '@/components/contact/CopyEmail';
import LahoreClock from '@/components/contact/LahoreClock';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: `Email, LinkedIn, GitHub and résumé for ${profile.name}, AI & full-stack developer in ${profile.location}. Open to full-time roles and remote work.`,
  path: '/contact',
});

const links = [
  { label: 'LinkedIn', href: profile.linkedin, external: true },
  { label: 'GitHub', href: profile.github, external: true },
  { label: 'Résumé (PDF)', href: profile.resume, external: false },
];

export default function ContactPage() {
  return (
    <Container className="pb-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div className="reveal">
          <Kicker>Contact</Kicker>
          <h1 className="mt-4 font-serif text-6xl leading-none text-ink sm:text-7xl">Let&apos;s talk.</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Open to full-time roles and focused freelance builds. Remote-friendly.
          </p>
          <p className="mt-4 font-mono text-sm text-ink-3">
            {profile.location} · <LahoreClock /> local time
          </p>

          <div className="mt-8">
            <CopyEmail email={profile.email} />
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1 text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink"
                >
                  {link.label}
                  {link.external && <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal" style={{ '--i': 2 } as React.CSSProperties}>
          <BriefComposer />
        </div>
      </div>
    </Container>
  );
}
