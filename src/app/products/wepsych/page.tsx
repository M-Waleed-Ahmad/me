'use client';

import React from 'react';
import CaseStudyLayout, {
  EngineeringNote, Tradeoff, MetricCard, ArchDiagramPlaceholder,
  CaseStudySection, ProjectMeta
} from '@/components/CaseStudyLayout';

const meta: ProjectMeta = {
  name: 'WePsych',
  tagline: '{{PLACEHOLDER: One sentence on WePsych — what it is, who uses it, the scale.}}',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production · International',
  tech: ['FastAPI', 'React', 'Supabase', 'PostgreSQL', 'Docker', 'GitHub Actions'],
  metrics: [
    { label: 'Active Users', value: '{{PLACEHOLDER: N+}}' },
    { label: 'Uptime SLA', value: '{{PLACEHOLDER: 99.x%}}' },
    { label: 'Countries',   value: '{{PLACEHOLDER: N}}' },
    { label: 'Appointments', value: '{{PLACEHOLDER: N+}}' },
  ],
};

const sections: CaseStudySection[] = [
  {
    id: 'problem',
    number: '01',
    title: 'The Problem',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          {'{{PLACEHOLDER: Describe the core user pain — what was broken or missing in the mental health access space for this client\'s market? E.g. fragmented scheduling, no secure digital records, therapist availability gaps.}}'}
        </p>
        <p>
          {'{{PLACEHOLDER: Why did this problem require a purpose-built platform rather than an off-the-shelf solution? What made it non-trivial?}}'}
        </p>
        <EngineeringNote>
          {'{{PLACEHOLDER: What was the specific signal that the status quo was failing? E.g. therapists managing 100+ appointments manually in spreadsheets, zero audit trail.}}'}
        </EngineeringNote>
      </div>
    ),
  },
  {
    id: 'constraints',
    number: '02',
    title: 'Constraints',
    children: (
      <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the hard constraints: regulatory, budget, technical, timeline, team size.}}'}</p>
        <ul className="space-y-2.5 pl-1">
          {[
            '{{PLACEHOLDER: Constraint 1 — e.g. HIPAA-equivalent data residency requirements in target market.}}',
            '{{PLACEHOLDER: Constraint 2 — e.g. Zero budget for managed ML services; all inference must run on a $X/month server.}}',
            '{{PLACEHOLDER: Constraint 3 — e.g. Client required weekly demos; architecture had to be iteratively deployable.}}',
            '{{PLACEHOLDER: Constraint 4 — e.g. Therapist onboarding had to be zero-technical — no app installs.}}',
          ].map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent font-mono text-[10px] mt-0.5 flex-shrink-0">→</span>
              <span className="font-mono text-[11px]">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'architecture',
    number: '03',
    title: 'System Design',
    children: (
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        <p>
          {'{{PLACEHOLDER: Describe the top-level architecture decision. E.g. decoupled FastAPI service layer + Supabase for auth/storage + React SPA + background worker pool for notification handling.}}'}
        </p>
        <ArchDiagramPlaceholder label="WePsych System Architecture — Data Flow Diagram" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            { layer: 'API Layer', desc: '{{PLACEHOLDER: FastAPI async handlers — why async? What concurrency requirements made this necessary?}}' },
            { layer: 'Auth & Sessions', desc: '{{PLACEHOLDER: Supabase Auth — JWT flows, session expiry, therapist vs patient role separation.}}' },
            { layer: 'Database', desc: '{{PLACEHOLDER: PostgreSQL schema — how is the appointment/notes/user data structured? Any normalisation decisions?}}' },
            { layer: 'Background Workers', desc: '{{PLACEHOLDER: How are reminders, notifications, and async tasks handled without blocking main API thread?}}' },
          ].map(({ layer, desc }) => (
            <div key={layer} className="p-4 rounded-lg border border-border-muted bg-bg-dark space-y-1.5">
              <p className="text-[10px] font-mono text-accent uppercase tracking-wider">{layer}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'decisions',
    number: '04',
    title: 'Technical Decisions',
    children: (
      <div className="space-y-3">
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {'{{PLACEHOLDER: Brief framing — what were the key fork-in-the-road architectural moments on this project?}}'}
        </p>
        <Tradeoff
          decision="{{PLACEHOLDER: Decision 1 — e.g. Supabase Auth vs. building custom auth}}"
          pro="{{PLACEHOLDER: What was gained — e.g. weeks of saved development time, immediate MFA support, battle-tested security.}}"
          con="{{PLACEHOLDER: What was accepted — e.g. limited customisation of session tokens, vendor lock-in for auth flows.}}"
        />
        <Tradeoff
          decision="{{PLACEHOLDER: Decision 2 — e.g. FastAPI vs. Django REST Framework}}"
          pro="{{PLACEHOLDER: What was gained — e.g. async-native, 60% lower server cost under load, clean OpenAPI schema generation.}}"
          con="{{PLACEHOLDER: What was accepted — e.g. smaller ecosystem, had to build own pagination helpers and background job wiring.}}"
        />
        <Tradeoff
          decision="{{PLACEHOLDER: Decision 3 — e.g. React SPA vs. Next.js SSR}}"
          pro="{{PLACEHOLDER: What was gained — e.g. near-zero cold start on client, fully decoupled frontend deployments.}}"
          con="{{PLACEHOLDER: What was accepted — e.g. SEO is irrelevant for this app, so trade was acceptable; initial bundle size needed pruning.}}"
        />
        <EngineeringNote>
          {'{{PLACEHOLDER: The decision that surprised you most in hindsight — why was it harder or easier than expected?}}'}
        </EngineeringNote>
      </div>
    ),
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    children: (
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: High-level implementation narrative — phases, team, approach. How did you go from spec to production?}}'}</p>
        {/* Process timeline placeholder */}
        <div className="rounded-lg border border-border-muted bg-bg-dark p-6 space-y-3">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Delivery Timeline</p>
          {[
            { phase: '{{PLACEHOLDER: Phase name e.g. Discovery & Schema}}', duration: '{{PLACEHOLDER: N weeks}}', note: '{{PLACEHOLDER: Key output of this phase.}}' },
            { phase: '{{PLACEHOLDER: Phase name e.g. Core API + Auth}}',    duration: '{{PLACEHOLDER: N weeks}}', note: '{{PLACEHOLDER: Key output of this phase.}}' },
            { phase: '{{PLACEHOLDER: Phase name e.g. Frontend Sprint}}',    duration: '{{PLACEHOLDER: N weeks}}', note: '{{PLACEHOLDER: Key output of this phase.}}' },
            { phase: '{{PLACEHOLDER: Phase name e.g. Testing & Launch}}',   duration: '{{PLACEHOLDER: N weeks}}', note: '{{PLACEHOLDER: Key output of this phase.}}' },
          ].map((row, i) => (
            <div key={i} className="flex items-start gap-4 py-2.5 border-b border-border-muted last:border-0">
              <span className="font-mono text-[10px] text-accent w-6 flex-shrink-0">{`0${i + 1}`}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-text-primary">{row.phase}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{row.note}</p>
              </div>
              <span className="text-[10px] font-mono text-text-muted flex-shrink-0">{row.duration}</span>
            </div>
          ))}
        </div>
        <p>{'{{PLACEHOLDER: What was the hardest part of implementation that didn\'t show up in any spec? E.g. webhook retry logic, appointment conflict resolution, session expiry UX edge cases.}}'}</p>
      </div>
    ),
  },
  {
    id: 'outcome',
    number: '06',
    title: 'Outcome',
    children: (
      <div className="space-y-6">
        <p className="text-sm text-text-secondary leading-relaxed">
          {'{{PLACEHOLDER: Frame the outcome — who is using it, how is it being used, what changed for the client or users?}}'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard value="{{PLACEHOLDER: N+}}" label="Active Patients" note="{{PLACEHOLDER: clarify — monthly active? total registered?}}" />
          <MetricCard value="{{PLACEHOLDER: 99.x%}}" label="Appointment Delivery" note="Webhook success rate" />
          <MetricCard value="{{PLACEHOLDER: Xms}}" label="API P95 Latency" note="{{PLACEHOLDER: measured where? staging? prod?}}" />
          <MetricCard value="{{PLACEHOLDER: N}}" label="Countries" note="{{PLACEHOLDER: confirm deployment regions}}" />
        </div>
        <div className="p-5 rounded-lg border border-border-muted bg-bg-dark space-y-2">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Client Outcome</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            {'{{PLACEHOLDER: What did the platform enable for the business? E.g. expanded to N new cities, onboarded X therapists, reduced admin overhead by Y hours/week.}}'}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'reflection',
    number: '07',
    title: 'Reflection',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: What would you do differently if you started this today? No blame — honest engineering retrospective.}}'}</p>
        <p>{'{{PLACEHOLDER: What did WePsych teach you that you now carry into every project? E.g. design for offline recovery state early, separate domain logic from transport layer from day one.}}'}</p>
        <div className="p-4 rounded-lg border-l-2 border-accent/40 bg-bg-dark mt-2">
          <p className="text-xs font-mono text-text-muted italic">
            {'{{PLACEHOLDER: One honest sentence about the messiest part — the thing that didn\'t show up in any post-mortem but shaped how you work now.}}'}
          </p>
        </div>
      </div>
    ),
  },
];

export default function WePsychPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
