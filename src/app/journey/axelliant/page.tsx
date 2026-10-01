import type { Metadata } from 'next';
import Link from 'next/link';
import { profile, roleDeepDives } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import TestCycleChart from '@/components/figures/TestCycleChart';
import { Container, Decision, TextLink } from '@/components/ui';
import { HardParts, KeyValues, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';
import WalkThrough from '@/components/project/WalkThrough';
import type { DiagramEdge, DiagramNode } from '@/components/figures/Diagram';

const item = roleDeepDives.find((w) => w.slug === 'axelliant')!;

export const metadata: Metadata = pageMetadata({
  title: 'Axelliant: CI/CD and test automation',
  description: item.summary,
  path: '/journey/axelliant',
});

const nodes: DiagramNode[] = [
  { id: 'push', x: 80, y: 150, label: 'Push / PR', sub: 'GitHub', w: 120, external: true },
  { id: 'pw', x: 330, y: 60, label: 'Playwright', sub: 'browser flows', w: 150 },
  { id: 'cy', x: 330, y: 150, label: 'Cypress', sub: 'workflow checks', w: 150 },
  { id: 'build', x: 330, y: 240, label: 'Build', sub: 'artifact', w: 150 },
  { id: 'gate', x: 540, y: 150, label: 'All green?', w: 120 },
  { id: 'deploy', x: 690, y: 150, label: 'Deploy', w: 100 },
];

const edges: DiagramEdge[] = [
  { from: 'push', to: 'pw' },
  { from: 'push', to: 'cy' },
  { from: 'push', to: 'build' },
  { from: 'pw', to: 'gate' },
  { from: 'cy', to: 'gate' },
  { from: 'build', to: 'gate' },
  { from: 'gate', to: 'deploy' },
];

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function AxelliantProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        back={{ href: '/journey#axelliant', label: 'Back to journey' }}
        description="CI/CD and end-to-end test automation for hybrid systems: Playwright and Cypress frameworks wired into parallel GitHub Actions pipelines."
        facts={[
          { value: '~2 h', label: 'full test cycle, down from 2–3 days' },
          { value: '2', label: 'test frameworks: Playwright and Cypress' },
          { value: '10', label: 'months, May 2025 to Feb 2026' },
        ]}
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SoftCard title="Test cycle, before and after" lede="Drawn to scale. Before is a range because the honest answer was “two to three days”.">
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <TestCycleChart />
            </div>
          </div>
        </SoftCard>
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Role', item.role],
              ['Dates', item.status],
              ['Where', 'Axelliant, Lahore'],
              ['Tools', 'GitHub Actions, Playwright, Cypress'],
              ['Scope', 'Hybrid systems across client projects'],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          items={[
            'Hybrid-system testing that was largely manual and took days.',
            'Slow feedback, which teaches a team to stop trusting the pipeline.',
            'Parallel jobs only where the dependency graph actually allowed it.',
            'Releases that depended on someone remembering a fragile sequence of steps.',
          ]}
        />
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'walkthrough',
              ask: 'Walk me through the pipeline',
              hint: '4 steps',
              answer: (
                <WalkThrough
                  idPrefix="axelliant-walk"
                  title="CI/CD pipeline: a push fans out into parallel Playwright, Cypress and build jobs, which must all pass before deploy."
                  width={760}
                  height={300}
                  nodes={nodes}
                  edges={edges}
                  steps={[
                    {
                      title: 'A change enters the pipeline',
                      body: 'Every push or pull request starts GitHub Actions. Feedback begins immediately, instead of after a manual test pass.',
                      highlight: ['push'],
                    },
                    {
                      title: 'Suites run side by side',
                      body: 'Playwright covers browser flows and Cypress covers workflow regressions. They run as parallel jobs, next to the build, wherever the dependency graph allows.',
                      highlight: ['push', 'pw', 'cy', 'build', 'push>pw', 'push>cy', 'push>build'],
                    },
                    {
                      title: 'One gate, not three waits',
                      body: 'Deploy waits on a single question: did everything pass? A failure points at one suite instead of one giant log.',
                      highlight: ['pw', 'cy', 'build', 'gate', 'pw>gate', 'cy>gate', 'build>gate'],
                    },
                    {
                      title: 'Release as a repeatable step',
                      body: 'Deployment runs as a pipeline stage with visible pass and fail states, so it no longer depends on someone remembering the sequence.',
                      highlight: ['gate', 'deploy', 'gate>deploy'],
                    },
                  ]}
                />
              ),
            },
            {
              slug: 'parallel',
              ask: 'Why parallel jobs?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      Slow builds delay feedback, and delayed feedback makes teams less likely to trust the pipeline. Running
                      the suites and the build side by side turns three waits into one.
                    </p>
                  </div>
                  <Decision
                    title="Parallel jobs over one long sequential run"
                    gained="Faster feedback on every change, and failures that point at one suite instead of one giant log."
                    accepted="More pipeline configuration to maintain, and jobs had to be kept independent of each other."
                  />
                </div>
              ),
            },
            {
              slug: 'change',
              ask: 'What did it change for the team?',
              answer: (
                <div className={prose}>
                  <p>
                    Full testing cycles for the hybrid systems went from two to three days to about two hours. Automated
                    checks became part of the normal delivery path, and I worked with the dev and product teams to keep
                    builds stable.
                  </p>
                  <p>
                    The lesson I kept: the most useful CI check is the one that changes how the team works. A pipeline is a
                    product for engineers, and it only helps if people believe its red and green.
                  </p>
                </div>
              ),
            },
            {
              slug: 'this-site',
              ask: 'Is this site tested the same way?',
              answer: (
                <div className={prose}>
                  <p>
                    Yes. Every push runs lint, a type check, a production build and Playwright tests on desktop and mobile
                    viewports, which fail on console errors, hydration mismatches and missing page metadata.{' '}
                    <TextLink href={`${profile.repo}/blob/main/.github/workflows/ci.yml`} external>
                      The workflow is public.
                    </TextLink>
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Link
        href="/journey"
        className="group mt-16 flex items-center justify-between gap-6 rounded-2xl bg-surface px-6 py-5 transition-colors hover:bg-rule/60"
      >
        <span>
          <span className="block text-sm text-ink-3">Back to</span>
          <span className="mt-1 block font-serif text-3xl text-ink transition-colors group-hover:text-accent-ink">The full journey</span>
        </span>
        <span className="text-sm text-ink-3">Experience and education →</span>
      </Link>
    </Container>
  );
}
