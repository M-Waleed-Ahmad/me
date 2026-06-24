'use client';

import React from 'react';
import CaseStudyLayout, {
  EngineeringNote, Tradeoff, MetricCard, ArchDiagramPlaceholder,
  CaseStudySection, ProjectMeta
} from '@/components/CaseStudyLayout';

const meta: ProjectMeta = {
  name: 'Arabia Hills',
  tagline: '{{PLACEHOLDER: One sentence — real estate portal, scale of listings, the engineering problem that defined the build.}}',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production',
  tech: ['Next.js', 'Supabase', 'PostgreSQL', 'PostGIS', 'TypeScript'],
  metrics: [
    { label: 'Listings',     value: '{{PLACEHOLDER: N+}}' },
    { label: 'Query Latency', value: '{{PLACEHOLDER: <Xms}}' },
    { label: 'Monthly Searches', value: '{{PLACEHOLDER: N+}}' },
    { label: 'DB Size',      value: '{{PLACEHOLDER: NGB}}' },
  ],
};

const sections: CaseStudySection[] = [
  {
    id: 'problem',
    number: '01',
    title: 'The Problem',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the listing search performance problem. E.g. users searching by polygon, radius, price band, and custom attributes were hitting 8–12s query times on a 200k-row listings table.}}'}</p>
        <p>{'{{PLACEHOLDER: What was the business consequence of slow search? e.g. 70% of property search sessions timed out before results loaded.}}'}</p>
        <EngineeringNote>
          {'{{PLACEHOLDER: Was the root cause bad queries, missing indexes, data model design, or all three? What did the first diagnostic show?}}'}
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
          '{{PLACEHOLDER: Constraint 1 — e.g. No budget for Elasticsearch or Algolia; solution had to live in the existing PostgreSQL instance.}}',
          '{{PLACEHOLDER: Constraint 2 — e.g. Listing data updated by non-technical agents via CSV import; schema had to be migration-safe.}}',
          '{{PLACEHOLDER: Constraint 3 — e.g. Peak load during marketing campaigns: 10x normal traffic for 24-hour windows.}}',
          '{{PLACEHOLDER: Constraint 4 — e.g. Geospatial filtering required polygon drawing on the frontend — no lat/lng radius was sufficient.}}',
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
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Describe the PostGIS spatial indexing approach. Why was a native PostgreSQL extension chosen over an external search engine?}}'}</p>
        <ArchDiagramPlaceholder label="Arabia Hills — Database Architecture & Query Flow" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Spatial Index', desc: '{{PLACEHOLDER: PostGIS GiST index on geometry column — what queries does it accelerate and how?}}' },
            { label: 'Materialized Views', desc: '{{PLACEHOLDER: What aggregations are pre-computed? When do they refresh? What triggers invalidation?}}' },
            { label: 'Edge Caching', desc: '{{PLACEHOLDER: How are Next.js route handlers used to cache common search responses at the edge?}}' },
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
          decision="{{PLACEHOLDER: PostgreSQL + PostGIS vs. dedicated search engine (Elasticsearch / Typesense)}}"
          pro="{{PLACEHOLDER: No additional infrastructure, leverages existing DB expertise, spatial queries are first-class citizens.}}"
          con="{{PLACEHOLDER: Text-match relevance scoring is weaker than dedicated FTS; required manual synonym handling.}}"
        />
        <Tradeoff
          decision="{{PLACEHOLDER: Materialized views vs. real-time aggregation}}"
          pro="{{PLACEHOLDER: Sub-5ms stat lookups; no aggregate computed on read path.}}"
          con="{{PLACEHOLDER: Stale data window during refresh; required a careful invalidation trigger strategy to avoid missed updates.}}"
        />
        <EngineeringNote>
          {'{{PLACEHOLDER: The specific index configuration that had the biggest performance impact and why it was non-obvious to get right.}}'}
        </EngineeringNote>
      </div>
    ),
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>{'{{PLACEHOLDER: Walk through the implementation sequence. What was built first? Why?}}'}</p>
        <div className="rounded-lg border border-border-muted bg-bg-dark p-5 space-y-2">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">Data Flow — Listing Search</p>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-text-secondary">
            {['User Draws Polygon', 'GeoJSON → API', 'PostGIS ST_Within', 'Filter + Sort', 'Paginated Response', 'Edge Cache Hit'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="px-2 py-1 rounded border border-border-muted bg-bg-panel">{step}</span>
                {i < arr.length - 1 && <span className="text-text-muted">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p>{'{{PLACEHOLDER: What was the hardest part? E.g. The CSV import had inconsistent coordinate formats; building a fault-tolerant normaliser was unexpectedly complex.}}'}</p>
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
          {'{{PLACEHOLDER: Frame the outcome — query latency improvement, user session improvement, business expansion enabled by the platform.}}'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard value="{{PLACEHOLDER: X%}}"  label="Query Speed Gain"   note="{{PLACEHOLDER: baseline vs. optimised}}" />
          <MetricCard value="{{PLACEHOLDER: <Xms}}" label="P95 Search Latency" note="{{PLACEHOLDER: production measured}}" />
          <MetricCard value="{{PLACEHOLDER: N+}}"   label="Monthly Searches"   note="Sustained peak" />
          <MetricCard value="{{PLACEHOLDER: X%}}"   label="Session Completion"  note="{{PLACEHOLDER: before vs. after}}" />
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
        <p>{'{{PLACEHOLDER: What would you do differently with PostGIS or the data model knowing what you know now?}}'}</p>
        <p>{'{{PLACEHOLDER: What does Arabia Hills prove about your engineering judgment? What would you point to in this project to show a senior engineer your systems thinking?}}'}</p>
        <EngineeringNote>
          {'{{PLACEHOLDER: The one decision that the client questioned at the time and that turned out to be exactly right.}}'}
        </EngineeringNote>
      </div>
    ),
  },
];

export default function ArabiaHillsPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
