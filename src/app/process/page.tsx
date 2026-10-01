import type { Metadata } from 'next';
import { Container, Kicker, TextLink } from '@/components/ui';
import { profile } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import VersionPicker, { VersionCard } from '@/components/VersionPicker';

export const metadata: Metadata = pageMetadata({
  title: 'How I built this',
  description: 'How this portfolio was built with an AI coding assistant: the versions it went through, what I decided, what the AI did, and how it was checked.',
  path: '/process',
});

/*
  The story of this site, shown rather than listed: the four looks it went
  through, the decisions as before/after pairs, who did what, and the checks.
  Version swatches use their historical colours on purpose.
*/

const versions: VersionCard[] = [
  {
    tag: 'v1',
    name: 'Emerald on black',
    bg: '#030303',
    ink: '#f5f5f7',
    accent: '#10b981',
    font: 'var(--font-geist-sans)',
    why: 'A strong idea, the workspace graph, sitting dimmed behind the headline where nobody could explore it.',
  },
  {
    tag: 'v2',
    name: 'Paper and terracotta',
    bg: '#f3f0e8',
    ink: '#1b1a17',
    accent: '#c2410c',
    font: 'var(--font-instrument-serif)',
    why: 'Real content and figures, but it read like a long document, and the palette was close to Claude’s own.',
  },
  {
    tag: 'v3',
    name: 'Blueprint datasheets',
    bg: '#f1f1ed',
    ink: '#16171a',
    accent: '#2748b8',
    font: 'var(--font-instrument-serif)',
    why: 'Better colour, but the spec-sheet layout felt tight and old-school, with too many ruled lines.',
  },
  {
    tag: 'v4',
    name: 'Map and soft surfaces',
    bg: 'var(--v4-paper)',
    ink: 'var(--v4-ink)',
    accent: 'var(--v4-accent)',
    font: 'var(--font-instrument-serif)',
    why: 'This one: a map you can explore, one-screen project pages, depth on request.',
  },
];

const lanes = [
  {
    phase: 'Audit',
    me: 'Asked for every perspective, recruiter to designer, and pushed back on the parts I disagreed with.',
    ai: 'Reviewed the first version from a recruiter’s, an engineer’s and a designer’s point of view.',
  },
  {
    phase: 'Content',
    me: 'Decided what each project should say, and cut anything I couldn’t defend in an interview.',
    ai: 'Drafted copy from my CV and notes for me to rewrite.',
  },
  {
    phase: 'Direction',
    me: 'Rejected designs that felt generated, too tight or too empty, and chose the map and project pages.',
    ai: 'Proposed directions and wireframes for me to react to.',
  },
  {
    phase: 'Build',
    me: 'Reviewed every page and asked for changes until it felt right.',
    ai: 'Wrote most of the code and the first drafts of copy.',
  },
  {
    phase: 'Checks',
    me: 'Set the bar: no number on the site without a source.',
    ai: 'Wrote the automated tests that run on every push.',
  },
];

const stats = [
  { value: '45', label: 'automated checks on every push' },
  { value: '2', label: 'viewports tested: desktop and phone' },
  { value: '0', label: 'console errors tolerated' },
  { value: '100%', label: 'of pages statically rendered' },
];

function MiniGraph() {
  // The original hero: a dimmed force-directed hairball.
  const dots = [
    [30, 40], [52, 22], [70, 50], [44, 62], [88, 30], [96, 60], [62, 76], [24, 70], [80, 14], [110, 44],
  ];
  return (
    <svg viewBox="0 0 130 90" className="h-20 w-full" aria-hidden>
      {dots.map(([x, y], i) =>
        dots.slice(i + 1, i + 4).map(([x2, y2]) => (
          <line key={`${i}-${x2}-${y2}`} x1={x} y1={y} x2={x2} y2={y2} stroke="var(--color-rule-strong)" strokeWidth={0.8} opacity={0.5} />
        ))
      )}
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="var(--color-rule-strong)" opacity={0.6} />
      ))}
    </svg>
  );
}

function MiniMap() {
  // Its replacement: three ordered columns, every line meaningful.
  return (
    <svg viewBox="0 0 130 90" className="h-20 w-full" aria-hidden>
      {[20, 45, 70].map((y, i) => (
        <path key={y} d={`M22 ${y} C45 ${y},45 ${25 + i * 20},62 ${25 + i * 20}`} fill="none" stroke="var(--color-accent)" strokeWidth={1} />
      ))}
      {[25, 45, 65].map((y, i) => (
        <path key={y} d={`M72 ${y} C92 ${y},92 ${15 + i * 28},108 ${15 + i * 28}`} fill="none" stroke="var(--color-accent)" strokeWidth={1} />
      ))}
      {[20, 45, 70].map((y) => <circle key={`l${y}`} cx={20} cy={y} r={2.5} fill="var(--color-ink)" />)}
      {[25, 45, 65].map((y) => <rect key={`m${y}`} x={62} y={y - 3} width={10} height={6} rx={1} fill="var(--color-ink)" />)}
      {[15, 43, 71].map((y) => <circle key={`r${y}`} cx={110} cy={y} r={2.5} fill="var(--color-ink)" />)}
    </svg>
  );
}

function PageHeights({ bars }: { bars: number[] }) {
  return (
    <div className="flex h-20 items-end gap-1.5" aria-hidden>
      {bars.map((h, i) => (
        <span key={i} className="w-4 rounded-sm bg-ink/70" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function Chips({ items, struck = false }: { items: string[]; struck?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full px-2.5 py-1 text-xs ${struck ? 'bg-paper text-ink-3 line-through decoration-accent' : 'bg-accent/12 text-accent-ink'}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const pairs = [
  {
    title: 'The hero graph',
    before: { visual: <MiniGraph />, note: 'A physics simulation, dimmed so far behind the headline that nobody could read it.' },
    after: { visual: <MiniMap />, note: 'A hand-ordered map: where I worked, what I built, what it runs on.' },
  },
  {
    title: 'A project write-up',
    before: { visual: <PageHeights bars={[100, 100, 100, 100, 100, 100, 100]} />, note: 'Around seven screens of scrolling per case study.' },
    after: { visual: <PageHeights bars={[100, 35]} />, note: 'One screen to understand it; questions open the depth on request.' },
  },
  {
    title: 'The navigation',
    before: { visual: <Chips struck items={['Products', 'Systems', 'Intelligence', 'Explorer', 'Journey', 'Navigator']} />, note: 'Six destinations plus a separate navigator panel.' },
    after: { visual: <Chips items={['Work', 'Journey', 'Explorer', 'How I built this']} />, note: 'Four, with the map as the way in.' },
  },
  {
    title: 'The first second',
    before: { visual: <p className="font-mono text-xs text-ink-3">Opening workspace… Mapping connections…</p>, note: 'A separate loading screen before the site appeared.' },
    after: { visual: <p className="font-serif text-lg italic text-accent-ink">the map draws itself, then settles</p>, note: 'The intro is the homepage’s own map, and a click skips it.' },
  },
];

export default function ProcessPage() {
  return (
    <Container className="pb-24 pt-12 sm:pt-16">
      <header className="reveal">
        <Kicker>How I built this</Kicker>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
          I built this site with AI. Here&apos;s how I kept it mine.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          I used an AI coding assistant (Claude Code) as a collaborator throughout. It went through four versions before it
          felt right. Here is what changed, who did what, and how it was checked.
        </p>
      </header>

      {/* Four versions */}
      <section className="mt-14">
        <h2 className="reveal text-base font-medium text-ink" style={{ '--i': 1 } as React.CSSProperties}>
          Four versions
        </h2>
        <p className="reveal mt-1 text-sm text-ink-3" style={{ '--i': 1 } as React.CSSProperties}>
          Click one to see the whole site in that look. Your choice follows you around until you switch back.
        </p>
        <VersionPicker versions={versions} />
      </section>

      {/* Before / after */}
      <section className="mt-20">
        <h2 className="reveal text-base font-medium text-ink">What changed, side by side</h2>
        <ol className="mt-4 space-y-3">
          {pairs.map((pair) => (
            <li key={pair.title} className="grid grid-cols-[minmax(0,1fr)] gap-3 rounded-2xl bg-surface p-4 sm:p-5 lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-6">
              <p className="font-serif text-2xl leading-tight text-ink">{pair.title}</p>
              {(['before', 'after'] as const).map((side) => (
                <div key={side} className={`rounded-xl p-4 ${side === 'after' ? 'bg-paper' : ''}`}>
                  <p className={`font-mono text-xs ${side === 'after' ? 'text-accent-ink' : 'text-ink-3'}`}>{side}</p>
                  <div className="mt-2 flex min-h-20 items-center">{pair[side].visual}</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{pair[side].note}</p>
                </div>
              ))}
            </li>
          ))}
        </ol>
      </section>

      {/* Who did what */}
      <section className="mt-20">
        <h2 className="reveal text-base font-medium text-ink">Who did what</h2>
        <div className="mt-4 overflow-hidden rounded-2xl bg-surface">
          <div className="hidden grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] gap-6 px-6 pt-5 font-mono text-xs text-ink-3 sm:grid">
            <span />
            <span className="text-accent-ink">me</span>
            <span>the AI</span>
          </div>
          <ol className="divide-y divide-paper">
            {lanes.map((lane) => (
              <li key={lane.phase} className="grid gap-2 px-6 py-4 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
                <p className="font-serif text-xl text-ink">{lane.phase}</p>
                <p className="leading-relaxed text-ink">
                  <span className="mr-2 font-mono text-xs text-accent-ink sm:hidden">me</span>
                  {lane.me}
                </p>
                <p className="leading-relaxed text-ink-3">
                  <span className="mr-2 font-mono text-xs sm:hidden">AI</span>
                  {lane.ai}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quality panel */}
      <section className="mt-20 rounded-2xl bg-ink p-8 text-paper sm:p-10">
        <p className="font-mono text-xs text-paper/60">The quality bar</p>
        <p className="mt-3 max-w-2xl font-serif text-3xl leading-tight">
          AI makes it cheap to produce something that looks finished. The checks are what make it finished.
        </p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-serif text-6xl leading-none">{stat.value}</dd>
              <dt className="mt-2 text-sm text-paper/70">{stat.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-paper/70">
          Every check runs in public.{' '}
          <span className="[&_a]:text-paper [&_a]:decoration-paper/50">
            <TextLink href={`${profile.repo}/blob/main/.github/workflows/ci.yml`} external>
              See the CI workflow
            </TextLink>
          </span>
        </p>
      </section>
    </Container>
  );
}
