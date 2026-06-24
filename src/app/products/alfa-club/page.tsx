'use client';

import React from 'react';
import CaseStudyLayout, {
  EngineeringNote, Tradeoff, MetricCard,
  CaseStudySection, ProjectMeta
} from '@/components/CaseStudyLayout';

const meta: ProjectMeta = {
  name: 'ALFA Club',
  tagline: '{{PLACEHOLDER: One sentence — membership platform, the luxury brand context, the performance gap that had to be closed.}}',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production',
  tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  metrics: [
    { label: 'Lighthouse Score', value: '{{PLACEHOLDER: 9X}}' },
    { label: 'LCP',             value: '{{PLACEHOLDER: X.Xs}}' },
    { label: 'CLS',             value: '{{PLACEHOLDER: 0.0X}}' },
    { label: 'Bounce ↓',        value: '{{PLACEHOLDER: X%}}' },
  ],
};

const sections: CaseStudySection[] = [
  {
    id: 'problem',
    number: '01',
    title: 'The Problem',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the UX/performance problem. E.g. The platform had a luxury brand positioning but a web experience that felt like a corporate intranet — jank on scroll, layout shifts on image load, delayed button feedback.}}'}</p>
        <p>{'{{PLACEHOLDER: What did user testing or analytics reveal? E.g. 65% of mobile sessions dropped within 8 seconds; the average LCP was 6.4s on a mid-tier device.}}'}</p>
        <EngineeringNote>
          {'{{PLACEHOLDER: The most telling metric that crystallised why this mattered commercially — e.g. "Every 1s of LCP improvement correlated with an X% increase in membership signup completion."}}'}
        </EngineeringNote>
      </div>
    ),
  },
  {
    id: 'constraints',
    number: '02',
    title: 'Constraints',
    children: (
      <ul className="space-y-2.5 text-sm text-text-secondary">
        {[
          '{{PLACEHOLDER: Constraint 1 — e.g. Could not restructure the content API or change CMS — had to work within existing data shape.}}',
          '{{PLACEHOLDER: Constraint 2 — e.g. Brand team had final say on every animation — had to implement their Figma transitions pixel-perfectly.}}',
          '{{PLACEHOLDER: Constraint 3 — e.g. Primary users were on mid-range Android devices with 4G connections.}}',
          '{{PLACEHOLDER: Constraint 4 — e.g. No rewrite — refactor only. Full redesign was out of scope.}}',
        ].map((c, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent font-mono text-[10px] mt-0.5 flex-shrink-0">→</span>
            <span className="font-mono text-[11px]">{c}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'architecture',
    number: '03',
    title: 'Architecture Decision',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the performance architecture: what was restructured, what optimization layers were added, and why each one was necessary rather than cosmetic.}}'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Image Pipeline', desc: '{{PLACEHOLDER: How were images optimised? Lazy loading strategy, format selection (WebP/AVIF), responsive sizes, blur placeholder approach.}}' },
            { label: 'Bundle Strategy', desc: '{{PLACEHOLDER: Code splitting approach, dynamic imports, what was deferred vs. inlined in critical path.}}' },
            { label: 'Animation Layer', desc: '{{PLACEHOLDER: Why Framer Motion over CSS animations here? What interaction model required JavaScript-driven motion?}}' },
            { label: 'Cache Strategy', desc: '{{PLACEHOLDER: How were API responses cached client-side? What was the eviction policy and why?}}' },
          ].map(({ label, desc }) => (
            <div key={label} className="p-4 rounded-lg border border-border-muted bg-bg-dark space-y-1.5">
              <p className="text-[10px] font-mono text-accent uppercase tracking-wider">{label}</p>
              <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'tradeoffs',
    number: '04',
    title: 'Tradeoffs',
    children: (
      <div className="space-y-3">
        <Tradeoff
          decision="{{PLACEHOLDER: Framer Motion vs. pure CSS transitions}}"
          pro="{{PLACEHOLDER: What Framer Motion enabled — e.g. gesture-driven animations, layout animations, shared-element transitions that CSS alone can't do.}}"
          con="{{PLACEHOLDER: Bundle cost — Framer Motion adds ~30KB gzipped. Required careful tree-shaking and deferred loading to keep initial bundle lean.}}"
        />
        <Tradeoff
          decision="{{PLACEHOLDER: Client-side API caching vs. SSR/ISR}}"
          pro="{{PLACEHOLDER: Near-instant navigation for repeat visits, reduced server load during campaigns.}}"
          con="{{PLACEHOLDER: Required designing a storage eviction system; stale data edge cases needed explicit handling.}}"
        />
        <Tradeoff
          decision="{{PLACEHOLDER: Virtualized lists vs. pagination}}"
          pro="{{PLACEHOLDER: Smooth infinite scroll experience matching luxury brand expectation.}}"
          con="{{PLACEHOLDER: DOM complexity during rapid scroll required careful windowing buffer tuning to avoid visual gaps.}}"
        />
      </div>
    ),
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the optimization sprint sequence. E.g. started with a Lighthouse baseline audit, addressed CLS first (highest impact per effort), then LCP, then TBT.}}'}</p>
        {/* Lighthouse progress visualization */}
        <div className="rounded-lg border border-border-muted bg-bg-dark p-5 space-y-3">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Lighthouse — Before vs. After</p>
          {[
            { metric: 'Performance', before: '{{PLACEHOLDER: XX}}', after: '{{PLACEHOLDER: 9X}}' },
            { metric: 'LCP',         before: '{{PLACEHOLDER: X.Xs}}', after: '{{PLACEHOLDER: X.Xs}}' },
            { metric: 'CLS',         before: '{{PLACEHOLDER: 0.XX}}', after: '{{PLACEHOLDER: 0.0X}}' },
            { metric: 'TBT',         before: '{{PLACEHOLDER: XXXms}}', after: '{{PLACEHOLDER: XXms}}' },
          ].map(row => (
            <div key={row.metric} className="flex items-center justify-between py-2 border-b border-border-muted last:border-0">
              <span className="text-[11px] font-mono text-text-secondary w-28">{row.metric}</span>
              <span className="text-[11px] font-mono text-text-muted line-through">{row.before}</span>
              <span className="text-[11px] font-mono text-accent font-semibold">{row.after}</span>
            </div>
          ))}
        </div>
        <p>{'{{PLACEHOLDER: The optimization that had the most outsized impact relative to implementation effort — and why it was easy to miss.}}'}</p>
      </div>
    ),
  },
  {
    id: 'outcome',
    number: '06',
    title: 'Outcome',
    children: (
      <div className="space-y-5">
        <p className="text-sm text-text-secondary leading-relaxed">
          {'{{PLACEHOLDER: Frame the outcome — what the brand team said, what the metrics showed, how user sessions changed.}}'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard value="{{PLACEHOLDER: 9X}}" label="Lighthouse Score"  note="Mobile" />
          <MetricCard value="{{PLACEHOLDER: X.Xs}}" label="Largest Contentful Paint" note="P75" />
          <MetricCard value="{{PLACEHOLDER: X%}}" label="Bounce Rate ↓"   note="{{PLACEHOLDER: vs. baseline}}" />
          <MetricCard value="{{PLACEHOLDER: X%}}" label="Session Duration ↑" note="{{PLACEHOLDER: vs. baseline}}" />
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
        <p>{'{{PLACEHOLDER: What does frontend performance engineering teach you that backend work doesn\'t? E.g. the performance budget mindset, treating every byte as a cost.}}'}</p>
        <p>{'{{PLACEHOLDER: What would you do differently — e.g. establish performance budgets in CI from day one rather than retrofitting at the end.}}'}</p>
        <EngineeringNote>
          {'{{PLACEHOLDER: The animation or interaction detail that took the most engineering effort but that users now take for granted as "just how the site feels."}}'}
        </EngineeringNote>
      </div>
    ),
  },
];

export default function AlfaClubPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
