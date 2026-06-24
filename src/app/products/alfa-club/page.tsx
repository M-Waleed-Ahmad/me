'use client';

import React from 'react';
import CaseStudyLayout, {
  EngineeringNote,
  Tradeoff,
  MetricCard,
  ImplementationTimeline,
  CaseStudySection,
  ProjectMeta,
} from '@/components/CaseStudyLayout';

const meta: ProjectMeta = {
  name: 'ALFA Club',
  tagline: 'React ecommerce storefront work for alfaclub.ca focused on performance, polish, and mobile checkout UX.',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production',
  tech: ['React', 'TypeScript', 'Tailwind CSS'],
  metrics: [
    { label: 'Lighthouse', value: '90s est.' },
    { label: 'Surface', value: 'Ecommerce' },
    { label: 'Focus', value: 'Checkout UX' },
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
          ALFA Club needed storefront work that treated frontend quality as product quality:
          fast pages, responsive interaction, and a checkout flow that felt dependable on mobile.
        </p>
        <p>
          The available source does not include exact traffic, conversion, or Core Web Vitals
          baselines, so the case study stays focused on the verified scope: React storefront
          implementation, performance optimization, and ecommerce UX craftsmanship.
        </p>
        <EngineeringNote>
          Ecommerce frontend work is systems work at the user edge. Every delayed image, oversized
          bundle, or awkward checkout step becomes friction in the business workflow.
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
          'Preserve the existing ecommerce intent while improving perceived speed and interaction quality.',
          'Prioritize mobile checkout because that is where small frontend delays feel most expensive.',
          'Use measurable frontend improvements where available, but avoid inventing analytics or conversion numbers.',
        ].map((constraint) => (
          <li key={constraint} className="flex items-start gap-2">
            <span className="text-accent font-mono text-[10px] mt-0.5 flex-shrink-0">-&gt;</span>
            <span className="font-mono text-[11px]">{constraint}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'architecture',
    number: '03',
    title: 'Frontend Decisions',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          The work centered on the customer-facing React surface: keeping the storefront responsive,
          reducing friction around the purchase path, and making the visual implementation feel
          intentional rather than template-driven.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Performance', desc: 'Optimized pages into the 90s on Lighthouse according to Waleed\'s measured-in-practice account.' },
            { label: 'Checkout', desc: 'Focused on mobile checkout ergonomics and reducing interaction friction.' },
            { label: 'Craft', desc: 'Treated spacing, responsiveness, and feedback states as part of the engineering surface.' },
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
          decision="Visual polish vs. performance budget"
          summary="Storefront interaction had to feel refined without making the page heavier."
          pro="Kept the brand experience polished and responsive for shoppers."
          con="Required frontend choices to be measured against speed, not just visual preference."
        />
        <Tradeoff
          decision="Optimization claims vs. audited metrics"
          summary="The case study uses a qualified estimate instead of pretending to have a formal report."
          pro="Keeps the portfolio credible while still showing the direction and quality of the work."
          con="Leaves exact before/after numbers as future evidence to add if the audit artifacts are recovered."
        />
      </div>
    ),
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    children: (
      <ImplementationTimeline
        phases={[
          {
            phase: 'Storefront review',
            duration: 'Audit',
            note: 'Identified the parts of the shopping flow where responsiveness and layout quality most affected trust.',
          },
          {
            phase: 'Performance and UX pass',
            duration: 'Optimization',
            note: 'Improved frontend behavior around rendering, mobile layout, and checkout interaction.',
          },
          {
            phase: 'Polish pass',
            duration: 'Delivery',
            note: 'Tightened visual states so the site felt stable, fast, and production-ready.',
          },
        ]}
      />
    ),
  },
  {
    id: 'outcome',
    number: '06',
    title: 'Outcome',
    children: (
      <div className="space-y-5">
        <p className="text-sm text-text-secondary leading-relaxed">
          The result was a production ecommerce storefront with stronger mobile checkout UX and
          performance work reported in the Lighthouse 90s range. Because the prompt does not
          provide an audited Lighthouse export, this is intentionally labeled as an estimate.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard value="90s est." label="Lighthouse" note="Waleed's measurement" />
          <MetricCard value="Mobile" label="Checkout Focus" note="UX optimization" />
          <MetricCard value="React" label="Storefront" note="Production surface" />
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
        <p>
          This project reveals Waleed&apos;s attention to the product feel of frontend engineering:
          performance, layout stability, and checkout clarity all affect whether a user trusts
          the software enough to keep going.
        </p>
        <EngineeringNote>
          The lesson is to treat performance budgets as part of the product brief. A storefront
          can look complete while still feeling unreliable if the interaction layer is slow.
        </EngineeringNote>
      </div>
    ),
  },
];

export default function AlfaClubPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
