import type { Metadata } from 'next';
import { selectedWork } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import IngestionFigure from '@/components/figures/IngestionFigure';
import { Container, Decision } from '@/components/ui';
import { HardParts, KeyValues, NextProject, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';
import WalkThrough from '@/components/project/WalkThrough';
import type { DiagramEdge, DiagramNode } from '@/components/figures/Diagram';

const item = selectedWork.find((w) => w.slug === 'arabia-hills')!;

export const metadata: Metadata = pageMetadata({
  title: 'Arabia Hills',
  description: item.summary,
  path: '/products/arabia-hills',
});

const nodes: DiagramNode[] = [
  { id: 'files', x: 85, y: 90, label: 'Listing files', sub: 'bulk source', w: 130, external: true },
  { id: 'make', x: 305, y: 90, label: 'Make.com', sub: 'validate · transform', w: 150 },
  { id: 'cms', x: 305, y: 270, label: 'Agent CMS', sub: 'React · auth', w: 150 },
  { id: 'db', x: 490, y: 180, label: 'Supabase', sub: 'Postgres · Auth · Storage', w: 170 },
  { id: 'site', x: 685, y: 180, label: 'Public site', sub: 'filter · browse', w: 120 },
];

const edges: DiagramEdge[] = [
  { from: 'files', to: 'make', label: 'raw rows' },
  { from: 'make', to: 'db', label: 'validated', labelDx: 22 },
  { from: 'cms', to: 'db', label: 'edits', labelDx: 18, labelDy: 18 },
  { from: 'db', to: 'site' },
];

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function ArabiaHillsProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="A real estate platform for a UAE client with live listings in Dubai: automated bulk uploads, an agent CMS and public search, all on one shared schema."
        facts={[
          { value: '2', label: 'people building product and tooling' },
          { value: '3', label: 'surfaces: uploads, agent CMS, public site' },
          { value: '1', label: 'schema behind all of them' },
        ]}
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SoftCard title="What happens to a bulk upload" lede="Every row is checked before it can touch the listings. A bad row goes back with its reason.">
          <IngestionFigure />
        </SoftCard>
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Client', 'Real estate, UAE (Dubai listings)'],
              ['Team', 'Two people'],
              ['Role', item.role],
              ['Frontend', 'React: agent CMS and public site'],
              ['Data', 'Supabase: Postgres, Auth, Storage'],
              ['Status', item.status],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          items={[
            'Validate and reshape bulk listing data before it reaches the database.',
            'Give non-technical agents a CMS on the same schema as the public site.',
            'Keep search to attributes and filters, with no map search in scope.',
            'Build the product and its operational tooling with a team of two.',
          ]}
        />
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'walkthrough',
              ask: 'Walk me through the data path',
              hint: '4 steps',
              answer: (
                <WalkThrough
                  idPrefix="arabia-walk"
                  title="Arabia Hills data path: listing files pass through Make.com for validation into Supabase; agents edit through a React CMS; the public site reads the same records."
                  width={760}
                  height={360}
                  nodes={nodes}
                  edges={edges}
                  steps={[
                    {
                      title: 'Bulk data goes through a checkpoint',
                      body: 'Listing files never write straight to the database. They go through Make.com, which checks field shapes, reshapes rows to fit the schema and surfaces errors first.',
                      highlight: ['files', 'make', 'files>make'],
                    },
                    {
                      title: 'Only clean rows land',
                      body: 'Validated rows are written to Supabase. The import record is the listing record: there is no separate import model to translate from.',
                      highlight: ['make', 'db', 'make>db'],
                    },
                    {
                      title: 'Agents edit the same records',
                      body: 'Non-technical agents manage listings in a React CMS that writes to the same schema, so a bulk import and a manual edit end up in exactly the same shape.',
                      highlight: ['cms', 'db', 'cms>db'],
                    },
                    {
                      title: 'Visitors browse them',
                      body: 'The public site reads those canonical records and lets visitors filter by listing attributes. One schema, three surfaces.',
                      highlight: ['db', 'site', 'db>site'],
                    },
                  ]}
                />
              ),
            },
            {
              slug: 'make',
              ask: 'Why Make.com instead of a custom importer?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      A custom backend importer would have given more control, at the cost of another service to build and
                      maintain. For a team of two, a flow anyone could open and inspect when listing data changed shape was
                      worth more than raw flexibility.
                    </p>
                  </div>
                  <Decision
                    title="Make.com ingestion over a custom importer"
                    gained="Faster to ship, easy to inspect, and adaptable to new listing formats without a backend release."
                    accepted="Less control than custom code, so validation rules had to stay explicit and auditable inside the flow."
                  />
                </div>
              ),
            },
            {
              slug: 'schema',
              ask: 'Why decide the schema first?',
              answer: (
                <div className={prose}>
                  <p>
                    Three surfaces share one schema: the bulk import, the agent CMS and the public site. Listing fields,
                    relationships and status logic had to cover what agents manage and what visitors browse, without
                    compromising either, so it had to be right before anything else was built.
                  </p>
                </div>
              ),
            },
            {
              slug: 'search',
              ask: 'Why no map search?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      Search stayed attribute and filter based on purpose. Geospatial search was out of scope rather than
                      deferred, which kept the data model honest and avoided infrastructure the platform didn&apos;t need.
                    </p>
                  </div>
                  <Decision
                    title="Attribute filters instead of map search"
                    gained="Less complexity, focused on the listing attributes that mattered for this catalogue."
                    accepted="No map-based discovery. A deliberate call rather than an oversight."
                  />
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
