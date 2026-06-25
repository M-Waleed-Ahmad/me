'use client';

import React from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Download,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const channels = [
  {
    label: 'Email',
    value: 'waleed.ahmadmunir@gmail.com',
    note: 'Best for roles, projects, and longer technical context.',
    href: 'mailto:waleed.ahmadmunir@gmail.com',
    action: 'Send email',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/waleed-ahmad-0bb087260',
    note: 'Professional history, recruiter conversations, and mutual context.',
    href: 'https://www.linkedin.com/in/waleed-ahmad-0bb087260/',
    action: 'Open profile',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    value: 'github.com/M-Waleed-Ahmad',
    note: 'Public repositories, experiments, and technical artifacts.',
    href: 'https://github.com/M-Waleed-Ahmad',
    action: 'View code',
    icon: Github,
  },
];

const bestFit = [
  'Product engineering with real users and real constraints',
  'Systems, automation, CI/CD, and backend architecture',
  'Applied AI workflows where reliability matters more than hype',
];

export default function ContactPage() {
  return (
    <main className="flex-1 bg-bg-dark">
      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:px-8 lg:py-20">
        <section className="flex flex-col justify-between gap-14">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <MessageSquare className="h-4 w-4" />
              Contact
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Start with the problem. The stack can come later.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Open to product engineering roles, focused freelance builds, and systems work where clarity,
              reliability, and useful software matter more than noise.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:waleed.ahmadmunir@gmail.com"
                className="inline-flex items-center justify-center gap-2 border border-accent/40 bg-accent px-4 py-3 text-sm font-semibold text-bg-dark transition-all hover:bg-accent-bright"
              >
                <Mail className="h-4 w-4" />
                Email Waleed
              </a>
              <a
                href="/Waleed_Ahmad_CV.pdf"
                download
                className="inline-flex items-center justify-center gap-2 border border-border-muted bg-bg-panel px-4 py-3 text-sm font-semibold text-text-primary transition-all hover:border-accent/35 hover:text-accent"
              >
                <Download className="h-4 w-4" />
                Download resume
              </a>
            </div>
          </div>

          <div className="grid gap-4 border-y border-border-muted py-6 sm:grid-cols-3 sm:divide-x sm:divide-border-muted">
            {[
              ['Focus', 'Product + systems'],
              ['Location', 'United States / remote'],
              ['Signal', 'Reliable execution'],
            ].map(([label, value]) => (
              <div key={label} className="sm:px-5 first:sm:pl-0 last:sm:pr-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="border border-border-muted bg-bg-panel">
            <div className="flex items-center justify-between border-b border-border-muted px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Channels</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">3 active</p>
            </div>
            <div className="divide-y divide-border-muted">
              {channels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group grid gap-4 px-5 py-5 transition-colors hover:bg-bg-panel-hover sm:grid-cols-[36px_1fr_auto]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center border border-border-muted bg-bg-dark text-text-muted transition-colors group-hover:border-accent/35 group-hover:text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent">{channel.label}</p>
                      <p className="mt-1 truncate text-sm font-medium text-text-primary">{channel.value}</p>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{channel.note}</p>
                    </div>
                    <div className="flex items-start justify-end">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors group-hover:text-accent">
                        {channel.action}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="border border-border-muted bg-bg-panel p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <BriefcaseBusiness className="h-4 w-4" />
              Best fit
            </div>
            <div className="mt-5 space-y-3">
              {bestFit.map((item) => (
                <div key={item} className="flex gap-3 border-t border-border-muted pt-3 first:border-t-0 first:pt-0">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <p className="text-sm leading-relaxed text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Sparkles className="h-4 w-4" />
              Quick note
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              If you are reaching out about a role or project, send the problem context, timeline,
              and what already exists. I can usually respond with the useful next step faster that way.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
