import type { Metadata } from 'next';
import { selectedWork } from '@/data/site';
import { pageMetadata } from '@/lib/metadata';
import ConfidenceBands from '@/components/figures/ConfidenceBands';
import { Container, Decision } from '@/components/ui';
import { HardParts, KeyValues, NextProject, ProjectHero, SoftCard } from '@/components/project/ProjectPage';
import Questions from '@/components/project/Questions';
import WalkThrough from '@/components/project/WalkThrough';
import type { DiagramEdge, DiagramNode } from '@/components/figures/Diagram';

const item = selectedWork.find((w) => w.slug === 'deepshield')!;

export const metadata: Metadata = pageMetadata({
  title: 'DeepShield',
  description: item.summary,
  path: '/products/deepshield',
});

const nodes: DiagramNode[] = [
  { id: 'upload', x: 85, y: 70, label: 'Upload', sub: 'Flutter / React', w: 140, external: true },
  { id: 'intake', x: 85, y: 200, label: 'Intake', sub: 'SHA-256 · 8 frames', w: 140 },
  { id: 'ucf', x: 290, y: 90, label: 'UCF encoder', sub: 'primary model', w: 150 },
  { id: 'xception', x: 290, y: 210, label: 'Xception', sub: 'video frames', w: 150 },
  { id: 'fusion', x: 490, y: 150, label: 'Fusion + bands', sub: '0.80 / 0.20', w: 160 },
  { id: 'gradcam', x: 490, y: 290, label: 'Grad-CAM++', sub: 'where it looked', w: 160 },
  { id: 'report', x: 680, y: 220, label: 'Report', sub: 'PDF · on-chain', w: 130 },
];

const edges: DiagramEdge[] = [
  { from: 'upload', to: 'intake' },
  { from: 'intake', to: 'ucf' },
  { from: 'intake', to: 'xception' },
  { from: 'ucf', to: 'fusion' },
  { from: 'xception', to: 'fusion' },
  { from: 'ucf', to: 'gradcam', bend: 40 },
  { from: 'fusion', to: 'report' },
  { from: 'gradcam', to: 'report' },
];

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function DeepShieldProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="A deepfake detection pipeline built so a person can see why it reached a result: two fused models, heatmaps of where they looked, and a report that shows if anyone altered it."
        facts={[
          { value: '2', label: 'models fused into one score' },
          { value: '8', label: 'frames sampled from every video' },
          { value: '4', label: 'confidence bands, not a yes/no' },
        ]}
      />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <SoftCard title="How sure is it?" lede="Drag the score. The same model output becomes a different kind of claim depending on where it lands.">
          <div className="-mx-4 -mb-4 sm:-mx-6">
            <ConfidenceBands />
          </div>
        </SoftCard>
        <SoftCard title="At a glance">
          <KeyValues
            rows={[
              ['Type', 'Final-year project, FAST NUCES'],
              ['Role', item.role],
              ['Models', 'UCF dual-encoder, Xception'],
              ['Evidence', 'Grad-CAM++ heatmaps'],
              ['Backend', 'FastAPI, Supabase'],
              ['Clients', 'Flutter and React'],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          items={[
            'Say how confident the system is without overstating it.',
            'Combine two models without hiding which one drove the result.',
            'Show a reviewer where the model looked, not just what it decided.',
            'Keep a finished report tamper-evident long after it was produced.',
          ]}
        />
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'walkthrough',
              ask: 'Walk me through the pipeline',
              hint: '5 steps',
              answer: (
                <WalkThrough
                  idPrefix="deepshield-walk"
                  title="DeepShield pipeline: uploads pass intake checks, two models score the media, scores are fused into a confidence band, Grad-CAM++ shows where the model looked, and a report is produced and anchored on-chain."
                  width={760}
                  height={340}
                  nodes={nodes}
                  edges={edges}
                  steps={[
                    {
                      title: 'Check what came in',
                      body: 'Flutter and React clients upload through Supabase auth and storage. A SHA-256 hash catches duplicate media before any model runs, and video is sampled at 8 evenly spaced frames so no result rests on one convenient moment.',
                      highlight: ['upload', 'intake', 'upload>intake'],
                    },
                    {
                      title: 'Score it with the primary model',
                      body: 'The UCF dual-encoder does most of the work. In my test notes, real samples generally scored 0.45–0.60 and fakes 0.80–0.95, so its output is treated as a band rather than a truth.',
                      highlight: ['intake', 'ucf', 'intake>ucf'],
                    },
                    {
                      title: 'Let a second model object',
                      body: 'Xception inspects the video frames. Fusion normally weights UCF/Xception at 0.80/0.20, and shifts to 0.55/0.45 when Xception raises a strong alarm, without hiding which model moved the score.',
                      highlight: ['intake', 'xception', 'ucf', 'fusion', 'intake>xception', 'ucf>fusion', 'xception>fusion'],
                    },
                    {
                      title: 'Show where it looked',
                      body: 'Grad-CAM++ heatmaps come from encoder_f.block12 for images, or the peak-frame Xception block for video, resized back onto the original media for a reviewer.',
                      highlight: ['ucf', 'gradcam', 'ucf>gradcam'],
                    },
                    {
                      title: 'Report it, and make it hold',
                      body: 'Verdict, band and heatmap go into an automated PDF report with QR verification. The result is anchored on-chain via Hardhat/Web3, so any later change to a report is detectable.',
                      highlight: ['fusion', 'gradcam', 'report', 'fusion>report', 'gradcam>report'],
                    },
                  ]}
                />
              ),
            },
            {
              slug: 'bands',
              ask: 'Why bands instead of a probability?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      Most detectors hand you a verdict and ask you to trust it. A 51% and a 99% are very different
                      findings, and a single number invites people to treat them the same.
                    </p>
                    <p>
                      Four explicit bands (Real up to 0.30, Unsure to 0.65, Likely fake to 0.85, Strong fake above) make
                      the system say how sure it is in words a reviewer can act on.
                    </p>
                  </div>
                  <Decision
                    title="Report bands, not a single probability"
                    gained="Readers can tell a borderline result from a confident one, and the system never overstates what it knows."
                    accepted="Borderline cases end in “Unsure”, which is less satisfying than a verdict and needs a person to follow up."
                  />
                </div>
              ),
            },
            {
              slug: 'fusion',
              ask: 'How do the two models combine?',
              answer: (
                <div className={prose}>
                  <p className="font-mono text-sm text-ink">
                    score = 0.80 · UCF + 0.20 · Xception
                    <br />
                    <span className="text-accent-ink">strong Xception alarm → 0.55 / 0.45</span>
                  </p>
                  <p>
                    UCF is the primary model; Xception is a second opinion on video frames. Normally it only nudges the
                    score, but when it raises a strong alarm its weight rises, so a confident objection can&apos;t be
                    drowned out. The report shows which path influenced the result.
                  </p>
                </div>
              ),
            },
            {
              slug: 'tamper',
              ask: 'What stops a report being altered later?',
              answer: (
                <div className={prose}>
                  <p>
                    Each result is anchored on-chain through Hardhat/Web3, and the PDF carries a QR code for
                    verification. If someone edits a report after the fact, it no longer matches its anchor.
                  </p>
                  <p>
                    Earlier in the pipeline, a SHA-256 hash of every upload catches duplicates before any model runs.
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
