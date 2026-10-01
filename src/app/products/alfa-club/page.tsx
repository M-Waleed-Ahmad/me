import type { Metadata } from 'next';
import { selectedWork } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import CheckoutRisks from '@/components/figures/CheckoutRisks';
import { Container, Decision } from '@/components/ui';
import { HardParts, KeyValues, NextProject, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';

const item = selectedWork.find((w) => w.slug === 'alfa-club')!;

export const metadata: Metadata = pageMetadata({
  title: 'ALFA Club',
  description: item.summary,
  path: '/products/alfa-club',
});

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function AlfaClubProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="A responsive React storefront for alfaclub.ca, built on the idea that on an ecommerce site the frontend is the product: fast pages, light media and a checkout that feels dependable on a phone."
        facts={[
          { value: '90+', label: 'Lighthouse performance on key pages' },
          { value: '4', label: 'checkout steps, each with its own risk' },
          { value: '1', label: 'storefront, built mobile-first' },
        ]}
      />

      <div className="mt-14 grid gap-4">
        <SoftCard title="Where the sale can be lost" lede="The checkout treated as a critical path: each step, the failure most likely to cost the sale, and what I did about it.">
          <CheckoutRisks />
        </SoftCard>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Client', 'alfaclub.ca'],
              ['Role', item.role],
              ['Stack', 'React, Tailwind CSS, Cloudinary'],
              ['Focus', 'Page speed, mobile checkout'],
              ['Status', item.status],
            ]}
          />
        </SoftCard>
        <div className="flex items-center rounded-2xl px-2 py-4 lg:px-6">
          <HardParts
            items={[
              'Improve perceived speed without changing what the store sells or how.',
              'Prioritise mobile checkout, where small delays cost the most.',
              'Report only improvements I could measure. No invented conversion numbers.',
              'Treat spacing, responsiveness and feedback states as engineering work.',
            ]}
          />
        </div>
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'lighthouse',
              ask: 'How did you get to 90+ on Lighthouse?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      I treated a Lighthouse score in the 90s as a floor from the start, and worked on the things that move
                      it: render-blocking assets, image loading strategy and keeping the initial bundle small.
                    </p>
                    <p>
                      Optimising only what felt slow would have left gaps that compound. A measurable floor made performance
                      a constraint rather than a clean-up task.
                    </p>
                  </div>
                  <Decision
                    title="A Lighthouse floor, not “fix what feels slow”"
                    gained="An honest, checkable performance story, and a rule for deciding between competing frontend changes."
                    accepted="Some visual richness waited until the performance budget could afford it."
                  />
                </div>
              ),
            },
            {
              slug: 'media',
              ask: 'How did you handle product media?',
              answer: (
                <div className={prose}>
                  <p>
                    On a storefront, images are most of the page weight. Product media went through Cloudinary so images
                    stayed light on mobile connections, which is where the performance and the checkout work met.
                  </p>
                </div>
              ),
            },
            {
              slug: 'checkout',
              ask: 'Why treat checkout as a critical path?',
              answer: (
                <div className={prose}>
                  <p>
                    A layout shift at the wrong moment, a tap target that is slightly too small, a missing loading state:
                    any of those erodes trust before the payment screen. So the checkout was built as a critical product
                    surface, not a derived UI layer.
                  </p>
                </div>
              ),
            },
            {
              slug: 'polish',
              ask: 'How did you balance polish and speed?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      The polish pass tightened hover feedback, empty states and responsive breakpoints across the store so
                      nothing looked provisional in production, but every visual idea had to justify its weight.
                    </p>
                  </div>
                  <Decision
                    title="Polish inside the performance budget"
                    gained="A refined, responsive storefront across the whole purchase path."
                    accepted="Every visual idea had to justify its weight against speed, not just taste."
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
