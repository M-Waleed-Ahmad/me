'use client';

import React from 'react';
import CaseStudyLayout, {
  EngineeringNote, Tradeoff, MetricCard, ArchDiagramPlaceholder, ImplementationTimeline,
  CaseStudySection, ProjectMeta
} from '@/components/CaseStudyLayout';

const meta: ProjectMeta = {
  name: 'WePsych',
  tagline: 'A CPD compliance and peer-support platform for Australian psychologists working against AHPRA and PsyBA requirements.',
  pillar: 'Products',
  pillarHref: '/products',
  status: 'Production',
  tech: ['Flutter', 'Supabase', 'PostgreSQL', 'Supabase Auth', 'Supabase Storage'],
};

const sections: CaseStudySection[] = [
  {
    id: 'problem',
    number: '01',
    title: 'The Problem',
    children: (
      <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
        <p>
          Australian psychologists need to maintain CPD records for registration renewal, but the rules are not the same for every practitioner. Provisional psychologists, registrar psychologists, endorsed psychologists, and supervisors each carry different compliance responsibilities.
        </p>
        <p>
          The hardest workflows were not simply &quot;log an activity.&quot; Provisional and registrar pathways require practice-hour tracking, supervision ratios, case reports, peer consultation evidence, and audit-ready exports. Without a dedicated tool, that becomes a manual compliance system spread across notes, files, and spreadsheets.
        </p>
        <EngineeringNote>
          The domain logic mattered more than the UI surface. Modeling 4+2, 5+1, and registrar pathways correctly was the difference between a helpful tracker and a tool that could quietly mislead a user.
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
        <p>The platform had to support three distinct user groups without splitting into three separate products.</p>
        <ul className="space-y-2.5 pl-1">
          {[
            'Support provisional psychologists, registrar psychologists, registered or endorsed psychologists, and board-approved supervisors from one account system.',
            'Represent AHPRA pathway requirements accurately, including 4+2 at 3,000 hours, 5+1 at 1,400 hours, registrar at 1,760 hours, and 1 hour of supervision per 17.5 practice hours.',
            'Keep personal reflection notes private even when a peer consultation session is shared between participants.',
            'Track supervisor status independently from registration or endorsement stage, because a supervisor badge can apply across different user contexts.',
          ].map((constraint) => (
            <li key={constraint} className="flex items-start gap-2">
              <span className="text-accent font-mono text-[10px] mt-0.5 flex-shrink-0">-</span>
              <span className="font-mono text-[11px]">{constraint}</span>
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
          WePsych was built as a Flutter application talking directly to Supabase for authentication, Postgres-backed data, and storage for certificates, signed forms, and audit documents. There was no separate custom backend API layer; the hard part was encoding the compliance model and access boundaries cleanly.
        </p>
        <ArchDiagramPlaceholder label="WePsych System Architecture - Flutter, Supabase, Storage, and Audit Export Flow" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {[
            { layer: 'Flutter App', desc: 'The primary product surface for logging CPD activities, peer consultations, practice hours, supervision records, and exports.' },
            { layer: 'Supabase Auth', desc: 'Authentication and role-aware access for psychologists, supervisors, and admin workflows.' },
            { layer: 'Postgres Data Model', desc: 'Compliance records, shared sessions, supervision logs, pathway progress, and exportable audit metadata.' },
            { layer: 'Storage + Exports', desc: 'Certificate uploads, signed forms, and audit-ready PDF exports for CPD, peer consultation, and supervision logs.' },
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
          The most important decisions were about access boundaries and delivery speed, not novelty in the stack.
        </p>
        <Tradeoff
          decision="Shared peer-session model with per-user private reflections"
          summary="Session metadata is shared; each participant's reflection stays isolated."
          pro="Participants can see shared details like attendance, date, duration, and topic, while still keeping personal reflective notes private from peers, supervisors, and admins."
          con="The data model needs stricter access boundaries than a simpler fully shared session record."
        />
        <Tradeoff
          decision="Flutter directly against Supabase"
          summary="Skip a custom API layer so effort goes into regulatory workflow modeling."
          pro="Faster delivery for a domain-heavy product: auth, database, and storage are handled through Supabase while the app focuses on pathway rules and user workflows."
          con="Some backend flexibility is traded away; future custom business logic may need edge functions or a dedicated API if requirements grow."
        />
        <Tradeoff
          decision="One profile system for multiple professional roles"
          summary="A user can hold multiple roles where the regulatory model allows it."
          pro="The platform can represent real professional overlap, such as a practitioner who is both a registrar and a supervisor."
          con="Role logic becomes more complex than a single fixed user type per account."
        />
      </div>
    ),
  },
  {
    id: 'implementation',
    number: '05',
    title: 'Implementation',
    children: (
      <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
        <p>
          The implementation centered on turning AHPRA-aligned requirements into product workflows: CPD activity logging, peer consultation, internship and registrar tracking, supervisor review, admin verification, and audit export.
        </p>
        <ImplementationTimeline
          phases={[
            { phase: 'Compliance model', duration: 'Domain-first', note: 'Mapped CPD, 4+2, 5+1, registrar, and supervision requirements into product states and records.' },
            { phase: 'Core logging', duration: 'Product build', note: 'Built CPD logs, peer consultation logs, certificates, practice-hour tracking, case reports, and supervision entries.' },
            { phase: 'Supervisor and admin workflows', duration: 'Access-control build', note: 'Added supervisee review, approve/reject flows, AHPRA verification, and audit oversight without exposing private reflections.' },
            { phase: 'Audit export', duration: 'Submission support', note: 'Generated PDF exports for CPD logs, shared peer consultation details, and supervision records.' },
          ]}
        />
        <p>
          The platform also includes a clear disclaimer: it helps users track compliance, but it does not guarantee the user&apos;s actual compliance with AHPRA requirements.
        </p>
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
          WePsych was built and used to track real AHPRA-aligned compliance workflows for Australian psychologists across CPD, peer consultation, internship or registrar progress, supervision, and audit export.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard value="AHPRA-aligned" label="Compliance model" note="CPD, peer consultation, practice hours, supervision, and audit export" />
          <MetricCard value="3 user groups" label="Role coverage" note="Provisional/registrar, registered/endorsed, and supervisors" />
          <MetricCard value="~30%" label="Admin overhead estimate" note="Waleed's rough estimate from observing the workflow shift" />
        </div>
        <div className="p-5 rounded-lg border border-border-muted bg-bg-dark space-y-2">
          <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Qualitative outcome</p>
          <p className="text-sm text-text-secondary leading-relaxed">
            By Waleed&apos;s estimate, moving users from manual logging into structured tracking cut administrative overhead by roughly 30%. That figure is an estimate, not an audited KPI.
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
        <p>
          The hardest part was not drawing screens in Flutter. It was translating Australia&apos;s psychologist registration and endorsement pathways into a coherent data model that could handle multiple roles, hour thresholds, supervision ratios, and audit needs without becoming confusing.
        </p>
        <p>
          The strongest lesson from WePsych is that compliance software succeeds or fails at the boundary between domain accuracy and user trust. A clean interface matters, but accurate rules and private-by-design records matter more.
        </p>
      </div>
    ),
  },
];

export default function WePsychPage() {
  return <CaseStudyLayout meta={meta} sections={sections} />;
}
