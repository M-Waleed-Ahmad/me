import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { selectedWork } from '@/data/site';
import Diagram from '@/components/figures/Diagram';
import { Container, PageIntro } from '@/components/ui';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Work',
  description:
    'Projects with the decisions behind them: DeepShield, WePsych, Arabia Hills and ALFA Club, plus smaller builds and an ongoing robotics exploration.',
  path: '/products',
});

export default function WorkPage() {
  return (
    <Container className="pb-24">
      <PageIntro kicker="Work" title="Projects, each with the decisions behind it.">
        Every page covers what the project is, the constraints, the system and the tradeoffs, plus the questions I
        usually get asked about it.
      </PageIntro>

      <ul className="grid gap-4 md:grid-cols-2">
        {selectedWork.map((item, i) => (
          <li key={item.slug} className="reveal" style={{ '--i': i + 1 } as React.CSSProperties}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-2xl bg-surface p-6 transition-colors hover:bg-rule/60"
            >
              <p className="font-mono text-xs text-ink-3">{item.kind}</p>
              <h2 className="mt-2 flex items-center gap-2 font-serif text-4xl leading-none text-ink transition-colors group-hover:text-accent-ink">
                {item.name}
                <ArrowUpRight className="h-5 w-5 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </h2>
              <p className="mt-3 leading-relaxed text-ink-2">{item.summary}</p>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                <div>
                  <p className="font-serif text-4xl leading-none text-ink">{item.figure.value}</p>
                  <p className="mt-1 text-sm text-ink-3">{item.figure.label}</p>
                </div>
                <ul className="flex flex-wrap justify-end gap-1.5" aria-label="Stack">
                  {item.stack.slice(0, 3).map((tech) => (
                    <li key={tech} className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-ink-2">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </li>
        ))}
        <li className="reveal md:col-span-2" style={{ '--i': selectedWork.length + 1 } as React.CSSProperties}>
          <Link
            href="/products/other"
            className="group flex h-full flex-col justify-between rounded-2xl border border-dashed border-rule-strong p-6 transition-colors hover:border-ink"
          >
            <div>
              <p className="font-mono text-xs text-ink-3">Client sites</p>
              <h2 className="mt-2 font-serif text-4xl leading-none text-ink">Smaller builds</h2>
              <p className="mt-3 leading-relaxed text-ink-2">
                Zillabyte and CCHROME: media-heavy agency and portfolio sites built with React and Cloudinary.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-ink-2">
              See them <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      </ul>

      {/* One honest lab-notebook entry: an exploration, written up with what's still open */}
      <section id="robotics" className="mt-24 scroll-mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-4xl text-ink">From the lab notebook</h2>
          <p className="text-sm text-ink-3">Exploration, not production work</p>
        </div>

        <article className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-2xl bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/12 px-3 py-1 text-xs text-accent-ink">Ongoing</span>
              <span className="font-mono text-xs text-ink-3">FAST NUCES · Python</span>
            </div>
            <h3 className="mt-4 font-serif text-4xl leading-tight text-ink">Robotics skill composition</h3>

            <dl className="mt-6 space-y-5">
              {[
                ['Question', 'Can a robot get reliable behaviour from small, named skills instead of one monolithic learned policy?'],
                ['Approach', 'A rule-based planner breaks goals into checkpoints and picks from a library of scripted and learned skills. Training data comes from automated expert rollouts, not teleoperation.'],
                ['What works', 'Navigation and obstacle avoidance compose reliably, and when a behaviour fails you can inspect the planner, the skill or the feedback loop instead of guessing.'],
                ['Still open', 'Larger, maze-scale arenas exposed reactive-control tuning I’m still working through.'],
              ].map(([label, text]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
                  <dt className={`font-mono text-xs leading-6 ${label === 'Still open' ? 'text-accent-ink' : 'text-ink-3'}`}>{label}</dt>
                  <dd className="leading-relaxed text-ink-2">{text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="self-center overflow-x-auto rounded-xl bg-paper p-3 sm:p-4">
            <div className="min-w-[680px] lg:min-w-0">
              <Diagram
                idPrefix="robotics"
                title="Robotics architecture: goal, planner, skill library, policy and arena, with a feedback loop from the arena back to the planner."
                width={760}
                height={220}
                nodes={[
                  { id: 'goal', x: 75, y: 90, label: 'Goal', w: 110, external: true },
                  { id: 'planner', x: 225, y: 90, label: 'Planner', sub: 'rule-based', w: 130 },
                  { id: 'skills', x: 390, y: 90, label: 'Skill library', sub: 'scripted + learned', w: 150, emphasis: true },
                  { id: 'policy', x: 555, y: 90, label: 'Policy', sub: 'imitation-learned', w: 140 },
                  { id: 'arena', x: 695, y: 90, label: 'Arena', w: 100, external: true },
                ]}
                edges={[
                  { from: 'goal', to: 'planner' },
                  { from: 'planner', to: 'skills' },
                  { from: 'skills', to: 'policy' },
                  { from: 'policy', to: 'arena' },
                  { from: 'arena', to: 'planner', label: 'feedback', bend: -100, dashed: true, labelDy: 0 },
                ]}
              />
            </div>
          </div>
        </article>
      </section>
    </Container>
  );
}
