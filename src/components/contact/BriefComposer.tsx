'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { workspaceEdges, workspaceNodes } from '@/data/workspaceData';
import { profile, roleDeepDives, selectedWork } from '@/data/site';

/*
  "Tell me the problem": as a visitor describes what they need, the skills it
  touches are matched by keyword and drawn as a small map to the projects where
  I've used them. Links come from the same graph as the homepage map, so it only
  ever points at real work. Sending opens the visitor's own email app; nothing
  is submitted to or stored by this site.
*/

const KINDS = ['A role', 'A project', 'Something else'] as const;

/** Phrases a visitor might use, mapped to technology nodes in the graph. */
const KEYWORDS: [RegExp, string][] = [
  [/flutter|mobile|\bios\b|android|cross.?platform/, 'flutter'],
  [/supabase|\bauth\b|backend|realtime/, 'supabase'],
  [/postgres|\bsql\b|database|schema/, 'postgresql'],
  [/react|frontend|front-end|web ?app|website|dashboard/, 'react'],
  [/python|script|data pipeline/, 'python'],
  [/\bai\b|\bml\b|machine learning|model|deep ?fake|detect|classif|neural|pytorch/, 'pytorch'],
  [/fastapi|\bapis?\b|server|endpoint/, 'fastapi'],
  [/vision|video|image analysis|opencv|frames?/, 'opencv'],
  [/test|\bqa\b|playwright|e2e|end.to.end|regression/, 'playwright'],
  [/cypress/, 'cypress'],
  [/\bci\b|\bcd\b|ci\/cd|pipeline|deploy|github actions|devops|release/, 'github-actions'],
  [/automat|workflow|bulk|import|make\.com|zapier/, 'makecom'],
  [/ecommerce|e-commerce|shop|store|checkout|media|cloudinary/, 'cloudinary'],
];

/** Where each project node in the graph is written up on the site. */
const PROJECT_PAGES: Record<string, { name: string; href: string }> = {
  ...Object.fromEntries(selectedWork.map((w) => [w.slug, { name: w.name, href: w.href }])),
  cicd: { name: 'Axelliant CI/CD', href: roleDeepDives[0].href },
  testing: { name: 'Axelliant CI/CD', href: roleDeepDives[0].href },
  robotics: { name: 'Robotics', href: '/products#robotics' },
};

const nodeLabel = (id: string) => workspaceNodes.find((n) => n.id === id)?.label ?? id;

function projectsFor(techId: string) {
  const ids = workspaceEdges
    .filter((e) => e.target === techId && PROJECT_PAGES[e.source])
    .map((e) => e.source);
  return ids.map((id) => PROJECT_PAGES[id]);
}

function match(text: string) {
  const t = text.toLowerCase();
  const skills = KEYWORDS.filter(([re]) => re.test(t)).map(([, id]) => id);
  const unique = [...new Set(skills)].filter((id) => projectsFor(id).length > 0).slice(0, 4);
  const projects: { name: string; href: string }[] = [];
  for (const id of unique) {
    for (const p of projectsFor(id)) if (!projects.some((q) => q.name === p.name)) projects.push(p);
  }
  return { skills: unique, projects: projects.slice(0, 4) };
}

const EXAMPLES = ['Flutter app with Supabase', 'CI pipeline with Playwright tests', 'AI model to detect fake images'];

function spread(n: number, top = 22, height = 116) {
  return Array.from({ length: n }, (_, i) => (n === 1 ? top + height / 2 : top + (i * height) / (n - 1)));
}

export default function BriefComposer() {
  const [kind, setKind] = useState<(typeof KINDS)[number]>('A role');
  const [problem, setProblem] = useState('');
  const [timeline, setTimeline] = useState('');
  const [existing, setExisting] = useState('');

  const { skills, projects } = useMemo(() => match(problem), [problem]);
  const hasText = problem.trim().length > 0;

  const mailto = useMemo(() => {
    const origin = typeof window === 'undefined' ? '' : window.location.origin;
    const subject = `${kind}: ${problem.trim().slice(0, 70) || 'hello'}`;
    const lines = [
      `The problem: ${problem.trim() || '…'}`,
      `Timeline: ${timeline.trim() || '…'}`,
      `What already exists: ${existing.trim() || '…'}`,
    ];
    if (projects.length) lines.push('', `Related work I saw: ${projects.map((p) => `${p.name} (${origin}${p.href})`).join(', ')}`);
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [kind, problem, timeline, existing, projects]);

  const skillY = spread(skills.length);
  const projectY = spread(projects.length);
  const drawKey = skills.join('|');

  return (
    <section className="rounded-2xl bg-surface p-6 sm:p-7" aria-labelledby="brief-title">
      <h2 id="brief-title" className="text-base font-medium text-ink">
        Tell me the problem
      </h2>
      <p className="mt-1 text-sm text-ink-3">The problem, the timeline and what exists. I can usually reply with a useful next step.</p>

      <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="What are you writing about?">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            onClick={() => setKind(k)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              kind === k ? 'bg-ink text-paper' : 'border border-rule-strong text-ink-2 hover:border-ink hover:text-ink'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="font-mono text-xs text-ink-3">What are you building, or what needs fixing?</span>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={2}
          placeholder="A Flutter app that…"
          className="mt-1.5 w-full resize-none rounded-xl bg-paper px-4 py-3 text-ink outline-none ring-1 ring-rule placeholder:text-ink-3 focus:ring-accent"
        />
      </label>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="text-ink-3">Try:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex} type="button" onClick={() => setProblem(ex)} className="text-ink-2 underline decoration-rule-strong underline-offset-4 hover:text-ink">
            {ex}
          </button>
        ))}
      </p>

      {/* The brief, drawn into the map */}
      <figure className="mt-5 rounded-xl bg-paper p-4" aria-live="polite">
        <figcaption className="flex flex-wrap justify-between gap-2 font-mono text-[11px] text-ink-3">
          <span>your brief → skills it needs → where I&apos;ve used them</span>
          {skills.length > 0 && (
            <span>
              {skills.length} skill{skills.length === 1 ? '' : 's'} · {projects.length} project{projects.length === 1 ? '' : 's'}
            </span>
          )}
        </figcaption>
        <svg key={drawKey} viewBox="0 0 520 160" className="mt-2 block h-auto w-full" role="img" aria-label={skills.length ? `Your brief connects to ${skills.map(nodeLabel).join(', ')}, used in ${projects.map((p) => p.name).join(', ')}.` : 'No matches yet.'}>
          {skills.length === 0 ? (
            <text x="260" y="84" textAnchor="middle" fontSize="13" className="font-mono" fill="var(--color-ink-3)">
              {hasText ? 'no direct match yet. Tell me more, or send it anyway' : 'start typing to see related work'}
            </text>
          ) : (
            <>
              <g fill="none">
                {skills.map((id, i) => (
                  <path key={id} className="ink-line" pathLength={1} d={`M92 80 C140 80,140 ${skillY[i]},196 ${skillY[i]}`} stroke="var(--color-accent)" strokeWidth={1.4} style={{ animationDelay: `${i * 80}ms` }} />
                ))}
                {skills.flatMap((id, i) =>
                  projectsFor(id)
                    .map((p) => projects.findIndex((q) => q.name === p.name))
                    .filter((j, k, all) => j > -1 && all.indexOf(j) === k)
                    .map((j) => (
                      <path key={`${id}-${j}`} className="ink-line" pathLength={1} d={`M300 ${skillY[i]} C340 ${skillY[i]},340 ${projectY[j]},378 ${projectY[j]}`} stroke="var(--color-accent)" strokeOpacity={0.6} strokeWidth={1} style={{ animationDelay: `${250 + i * 80}ms` }} />
                    ))
                )}
              </g>
              <rect x="4" y="64" width="88" height="32" rx="8" fill="var(--color-ink)" />
              <text x="48" y="85" textAnchor="middle" fontSize="14" className="font-serif" fill="var(--color-paper)">
                your brief
              </text>
              {skills.map((id, i) => (
                <text key={id} x="248" y={skillY[i]} dy="0.35em" textAnchor="middle" fontSize="13" className="ink-label font-mono" fill="var(--color-ink)" style={{ animationDelay: `${i * 80}ms` }}>
                  {nodeLabel(id)}
                </text>
              ))}
              {projects.map((p, j) => (
                <a key={p.name} href={p.href}>
                  <text x="386" y={projectY[j]} dy="0.35em" fontSize="16" className="ink-label font-serif" fill="var(--color-ink)" style={{ animationDelay: `${300 + j * 80}ms` }}>
                    {p.name}
                  </text>
                </a>
              ))}
            </>
          )}
        </svg>
        {projects.length > 0 && (
          <p className="mt-2 text-sm text-ink-2">
            Related work you might want to look at:{' '}
            {projects.map((p, i) => (
              <React.Fragment key={p.name}>
                {i > 0 && ', '}
                <Link href={p.href} className="text-ink underline decoration-accent/60 underline-offset-4 hover:text-accent-ink">
                  {p.name}
                </Link>
              </React.Fragment>
            ))}
            .
          </p>
        )}
      </figure>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs text-ink-3">Timeline</span>
          <input value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="Starting next month" className="mt-1.5 w-full rounded-xl bg-paper px-4 py-2.5 text-ink outline-none ring-1 ring-rule placeholder:text-ink-3 focus:ring-accent" />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-ink-3">What already exists?</span>
          <input value={existing} onChange={(e) => setExisting(e.target.value)} placeholder="Designs, an API, nothing yet" className="mt-1.5 w-full rounded-xl bg-paper px-4 py-2.5 text-ink outline-none ring-1 ring-rule placeholder:text-ink-3 focus:ring-accent" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-3">Opens your own email app. Nothing is sent from this page.</p>
        <a href={mailto} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent">
          Email this brief <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
