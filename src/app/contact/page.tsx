'use client';

import React from 'react';
import {
  ArrowRight,
  Calendar,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react';

type ContactLink = {
  label: string;
  value: string;
  href: string;
  note: string;
  icon: React.ElementType;
};

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: '{{PLACEHOLDER: waleed@example.com}}',
    href: 'mailto:{{PLACEHOLDER: waleed@example.com}}',
    note: 'Best for project conversations, role outreach, and longer context.',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: '{{PLACEHOLDER: linkedin.com/in/waleed-ahmad}}',
    href: 'https://linkedin.com/in/{{PLACEHOLDER: username}}',
    note: 'Professional history, mutual context, and recruiter conversations.',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    value: '{{PLACEHOLDER: github.com/waleed}}',
    href: 'https://github.com/{{PLACEHOLDER: username}}',
    note: 'Code, experiments, public repositories, and technical artifacts.',
    icon: Github,
  },
];

const conversationTypes = [
  'Product engineering with real users and real constraints',
  'Systems, automation, CI/CD, and backend architecture',
  'Applied AI workflows where reliability matters more than hype',
];

export default function ContactPage() {
  return (
    <div className="flex-1">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-6xl flex-col justify-center gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <section className="grid gap-8 border-b border-border-muted pb-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Send className="h-4 w-4" />
              Contact
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Start with the problem. The stack can come later.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
              Reach out for roles, product builds, systems work, or technical conversations where
              clear thinking matters as much as implementation speed.
            </p>
          </div>

          <aside className="border border-border-muted bg-bg-panel p-5">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <MessageSquare className="h-3.5 w-3.5" />
              Best fit
            </p>
            <div className="mt-4 space-y-3">
              {conversationTypes.map((item) => (
                <div key={item} className="border border-border-muted bg-bg-dark p-3 text-xs leading-relaxed text-text-secondary">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {contactLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="group border border-border-muted bg-bg-panel p-5 transition-all hover:border-accent/35 hover:bg-bg-panel-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-border-muted bg-bg-dark text-text-secondary transition-colors group-hover:border-accent/25 group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <h2 className="mt-5 text-base font-semibold text-text-primary">{link.label}</h2>
                <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-text-muted">{link.value}</p>
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">{link.note}</p>
              </a>
            );
          })}
        </section>

        <section className="grid gap-4 border-t border-border-muted pt-8 sm:grid-cols-2">
          <a
            href="{{PLACEHOLDER: resume link}}"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 border border-border-muted bg-bg-panel p-5 transition-all hover:border-accent/35"
          >
            <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">Resume</p>
                <p className="mt-1 text-xs text-text-muted">{'{{PLACEHOLDER: attach or link latest resume}}'}</p>
                </div>
              </div>
            <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
          </a>

          <a
            href="https://calendly.com/{{PLACEHOLDER: username}}"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 border border-border-muted bg-bg-panel p-5 transition-all hover:border-accent/35"
          >
            <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">Calendar</p>
                <p className="mt-1 text-xs text-text-muted">{'{{PLACEHOLDER: confirm Calendly or remove this link}}'}</p>
                </div>
              </div>
            <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
          </a>
        </section>
      </div>
    </div>
  );
}
