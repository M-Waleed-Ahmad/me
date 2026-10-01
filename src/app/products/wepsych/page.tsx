import type { Metadata } from 'next';
import { selectedWork } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import AccessMatrix from '@/components/figures/AccessMatrix';
import { Container, Decision } from '@/components/ui';
import { HardParts, KeyValues, NextProject, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';
import WalkThrough from '@/components/project/WalkThrough';
import type { DiagramEdge, DiagramNode } from '@/components/figures/Diagram';

const item = selectedWork.find((w) => w.slug === 'wepsych')!;

export const metadata: Metadata = pageMetadata({
  title: 'WePsych',
  description: item.summary,
  path: '/products/wepsych',
});

const nodes: DiagramNode[] = [
  { id: 'people', x: 100, y: 205, label: 'Practitioners', sub: '+ supervisors, admins', w: 170, external: true },
  { id: 'app', x: 345, y: 205, label: 'Flutter app', sub: 'log · review · export', w: 160 },
  { id: 'auth', x: 612, y: 80, label: 'Supabase Auth', sub: 'role-aware access', w: 170 },
  { id: 'db', x: 612, y: 205, label: 'Postgres model', sub: 'CPD · sessions · hours', w: 170 },
  { id: 'storage', x: 612, y: 330, label: 'Storage', sub: 'certificates · PDFs', w: 170 },
];

const edges: DiagramEdge[] = [
  { from: 'people', to: 'app', label: 'use' },
  { from: 'app', to: 'auth', label: 'sign in', labelDx: -14 },
  { from: 'app', to: 'db', label: 'read / write' },
  { from: 'app', to: 'storage', label: 'uploads · exports', labelDx: 44, labelDy: -12 },
];

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function WePsychProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="CPD compliance and peer support for a psychiatric healthcare firm: registration pathways, supervision and audit export from one data model."
        facts={[
          { value: '3', label: 'user groups, one account system' },
          { value: '1', label: 'data model for everything' },
          { value: '~30%', label: 'less admin time (my estimate)' },
        ]}
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SoftCard title="Who can see what" lede="Session facts are shared. Reflections belong to one person.">
          <AccessMatrix
            caption="WePsych access model by record and role"
            roles={['Author', 'Peer', 'Supervisor', 'Admin']}
            rows={[
              { record: 'Session details', access: ['writes', 'reads', 'reads', 'reads'] },
              { record: 'Reflection', access: ['writes', 'none', 'none', 'none'], emphasis: true },
              { record: 'Supervision progress', access: ['writes', 'none', 'approves', 'audits'] },
            ]}
          />
        </SoftCard>
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Role', item.role],
              ['Client', 'Austrian psychiatric healthcare firm'],
              ['Users', 'Psychologists, supervisors, admins'],
              ['Platform', 'Flutter, one cross-platform codebase'],
              ['Backend', 'Supabase, no custom API'],
              ['Status', item.status],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          items={[
            'One account system for every role, not separate products.',
            'Each pathway encoded exactly: required hours and supervision ratio.',
            'Reflections private, even inside a shared session.',
            'Supervisor status tracked apart from registration stage.',
          ]}
        />
      </div>

      {/* The deep layer, on request */}
      <div className="mt-14" id="notes">
          <Questions
            items={[
              {
                slug: 'walkthrough',
                ask: 'Walk me through the system',
                hint: '5 steps',
                answer: (
                  <WalkThrough
                    idPrefix="wepsych-walk"
                    title="WePsych architecture: practitioners use a Flutter app that talks directly to Supabase Auth, a Postgres data model and Storage."
                    width={760}
                    height={400}
                    nodes={nodes}
                    edges={edges}
                    steps={[
                      {
                        title: 'Sign in once, carry every role',
                        body: 'Practitioners, supervisors and admins share one account system. Supabase Auth carries role-aware access, and one profile can hold several roles, so a registrar can also supervise.',
                        highlight: ['people', 'app', 'auth', 'people>app', 'app>auth'],
                      },
                      {
                        title: 'Log the daily work',
                        body: 'CPD activities, peer consultations, practice hours, supervision and case reports all write into one Postgres schema. The same records later drive review and export.',
                        highlight: ['app', 'db', 'app>db'],
                      },
                      {
                        title: 'Split shared from private',
                        body: "A peer session's attendance, date, duration and topic are shared. Each participant's reflection is stored privately, hidden even from the supervisors and admins reviewing that session.",
                        highlight: ['db'],
                      },
                      {
                        title: 'Review without overreach',
                        body: 'Supervisors approve or reject supervisee progress; admins handle registration verification and audit oversight. Neither ever sees a private reflection.',
                        highlight: ['people', 'app', 'db', 'people>app', 'app>db'],
                      },
                      {
                        title: 'Export at renewal',
                        body: 'Certificates and signed forms live in Storage, next to the PDF exports practitioners need when their registration comes up for renewal.',
                        highlight: ['app', 'storage', 'app>storage'],
                      },
                    ]}
                  />
                ),
              },
              {
                slug: 'hardest-tradeoff',
                ask: 'What was the hardest tradeoff?',
                answer: (
                  <div className="space-y-6">
                    <div className={prose}>
                      <p>
                        Peer consultation sessions. The facts of a session (who attended, when, how long, what topic) had to
                        be shared between participants, but each person&apos;s reflection had to stay theirs alone, including
                        from the supervisors and admins who review the same session.
                      </p>
                    </div>
                    <Decision
                      title="Shared sessions, per-person reflections"
                      gained="Participants see the shared facts of a session while their reflective notes stay private from peers, supervisors and admins."
                      accepted="Stricter access boundaries than a simple fully shared record, and more to get right in the data model."
                    />
                  </div>
                ),
              },
              {
                slug: 'no-backend',
                ask: 'Why no custom backend?',
                answer: (
                  <div className="space-y-6">
                    <div className={prose}>
                      <p>
                        The screens were the easy part. The work was the compliance model and the access boundaries, so I
                        put the Flutter app directly on Supabase for auth, data and storage and spent the time on the rules.
                      </p>
                    </div>
                    <Decision
                      title="Flutter talks to Supabase directly"
                      gained="Faster delivery for a domain-heavy product, with effort going into pathway rules and workflows."
                      accepted="Less backend flexibility. If business logic grows, it will need edge functions or a dedicated API."
                    />
                  </div>
                ),
              },
              {
                slug: 'roles',
                ask: 'How did you model roles and pathways?',
                answer: (
                  <div className={prose}>
                    <p>
                      One profile system supports several professional roles at once. A practitioner can be a registrar and
                      a supervisor at the same time, so supervisor status is tracked separately from registration stage
                      rather than as another step in it.
                    </p>
                    <p>
                      Each pathway&apos;s rules (the practice hours it requires and the ratio of supervision to practice) are
                      mapped to product states alongside CPD and supervision, which is what pathway progress is built on.
                    </p>
                  </div>
                ),
              },
              {
                slug: 'outcome',
                ask: 'What did it change for the client?',
                answer: (
                  <div className={prose}>
                    <p>
                      Moving from manual logging to structured tracking cut the team&apos;s administrative overhead by roughly
                      30%. That is my estimate from watching the workflow change, not an audited figure.
                    </p>
                    <p>
                      What I took from it: compliance software succeeds or fails where domain accuracy meets user trust. A
                      clean interface matters, but accurate rules and private-by-design records matter more.
                    </p>
                  </div>
                ),
              },
            ]}
          />
      </div>

      <NextProject slug={item.slug} />
    </Container>
  );
}
