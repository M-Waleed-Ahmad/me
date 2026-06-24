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
  name: 'Arabia Hills',
  tagline: 'A real estate platform built by a two-person team with a CMS and Make.com-powered listing ingestion.',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production',
  tech: ['Next.js', 'Supabase', 'PostgreSQL', 'Make.com', 'TypeScript'],
  metrics: [
    { label: 'Team', value: '2 people' },
    { label: 'Catalog', value: '20+ est.' },
    { label: 'Search', value: 'Responsive' },
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
          Arabia Hills needed a property platform that a small team could actually operate.
          The hard part was not only building listing pages; it was making bulk listing data,
          agent-facing edits, and public search feel like one maintainable product.
        </p>
        <p>
          The team was only two people, with no hard frontend/backend split. That forced the
          architecture to stay practical: one schema, clear admin workflows, and automation that
          could be inspected when listing data changed shape.
        </p>
        <EngineeringNote>
          The strongest decision was keeping the data tools visible. For a two-person build,
          inspectable ingestion and a simple CMS mattered more than maximizing infrastructure
          flexibility.
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
          'Bulk listing data had to be validated and transformed before it reached the database.',
          'Non-technical agents needed an admin CMS that matched the same listing schema.',
          'Search was attribute and filter based, not a geospatial or map-search system.',
          'The delivery model required both product implementation and operational tooling from the same small team.',
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
    title: 'Architecture Decision',
    children: (
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        <p>
          The platform used Next.js for the product surface and Supabase/PostgreSQL for auth,
          structured listing data, and admin-facing state. Make.com handled bulk ingestion so
          imported listing data could be checked and reshaped before becoming trusted app data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Bulk Source', desc: 'Incoming listing data enters through an automation pipeline rather than direct manual database edits.' },
            { label: 'Make.com', desc: 'Records are validated, transformed, and prepared before insertion into the app schema.' },
            { label: 'Supabase', desc: 'PostgreSQL stores the canonical listing model used by both the CMS and public site.' },
            { label: 'Next.js App', desc: 'Agents manage listings through the CMS while visitors filter and inspect the same structured data.' },
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
          decision="Make.com ingestion vs. custom backend importer"
          summary="The automation layer kept the pipeline visible and easier to adjust."
          pro="Faster to ship, easier for a small team to inspect, and useful for changing listing formats without a full backend release."
          con="Less control than a custom importer, so validation rules had to stay explicit and easy to audit."
        />
        <Tradeoff
          decision="Simple filters vs. map/geospatial search"
          summary="The project stayed aligned with its real search requirements."
          pro="Reduced complexity and kept the user experience focused on listing attributes that mattered for the catalog."
          con="It left advanced map-based discovery out of scope rather than pretending the platform had a spatial search engine."
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
            phase: 'Schema and listing model',
            duration: 'Foundation',
            note: 'Defined the listing fields that would be shared by the public site, admin CMS, and ingestion pipeline.',
          },
          {
            phase: 'Automation pipeline',
            duration: 'Ingestion',
            note: 'Built the Make.com flow to validate and transform bulk data before writing to Supabase.',
          },
          {
            phase: 'CMS and search surface',
            duration: 'Product',
            note: 'Implemented agent-facing listing management and public filtering against the same canonical data.',
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
          Arabia Hills became a complete real estate delivery rather than a static catalog:
          the same system supported public browsing, agent updates, and bulk listing ingestion.
          The catalog was in the 20+ listing range during the measured build period, with
          responsive filtering in practice rather than a benchmarked latency claim.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard value="2" label="Person Team" note="End-to-end delivery" />
          <MetricCard value="20+ est." label="Listings" note="Rough catalog range" />
          <MetricCard value="CMS + Pipeline" label="Operations" note="Agent editing and bulk ingestion" />
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
          The project shows Waleed thinking like a product owner, not only an implementer:
          the public website, the admin workflow, and the ingestion path all had to make sense
          together.
        </p>
        <EngineeringNote>
          The lesson was that small teams need tools they can understand under pressure.
          A clever architecture is less valuable than one where the data path is visible when
          a listing import goes wrong.
        </EngineeringNote>
      </div>
    ),
  },
];

export default function ArabiaHillsPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
