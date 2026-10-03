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
  { id: 'upload', x: 80, y: 70, label: 'Upload', sub: 'Flutter user app', w: 140, external: true },
  { id: 'intake', x: 80, y: 200, label: 'Intake', sub: 'SHA-256 dedup', w: 140 },
  { id: 'forensics', x: 300, y: 90, label: 'Forensics', sub: 'UCF + Xception', w: 170 },
  { id: 'ai', x: 300, y: 290, label: 'AI detector', sub: 'Hugging Face ViT', w: 170 },
  { id: 'band', x: 510, y: 90, label: 'Forensic band', sub: '≤0.35 · ≥0.55', w: 150 },
  { id: 'gradcam', x: 510, y: 190, label: 'Grad-CAM++', sub: 'only above 0.55', w: 150 },
  { id: 'report', x: 680, y: 230, label: 'Report', sub: 'PDF · local chain', w: 140 },
  { id: 'admin', x: 680, y: 330, label: 'Admin', sub: 'React · roles', w: 140 },
];

const edges: DiagramEdge[] = [
  { from: 'upload', to: 'intake' },
  { from: 'intake', to: 'forensics' },
  { from: 'intake', to: 'ai' },
  { from: 'forensics', to: 'band' },
  { from: 'forensics', to: 'gradcam' },
  { from: 'band', to: 'report' },
  { from: 'gradcam', to: 'report' },
  { from: 'ai', to: 'report', label: 'may override label', labelDy: 18 },
  { from: 'report', to: 'admin' },
];

const prose = 'max-w-2xl space-y-4 text-[1.0625rem] leading-relaxed text-ink-2';

export default function DeepShieldProject() {
  return (
    <Container className="pb-24 pt-10">
      <ProjectHero
        item={item}
        description="Detects manipulated and AI-generated media, and shows its evidence: two independent signals that are never fused, heatmaps of where the model looked, and report hashes anchored on a local chain."
        facts={[
          { value: '2', label: 'independent signals, never fused' },
          { value: '3', label: 'forensic verdicts: Authentic, Inconclusive, Manipulated' },
          { value: '0.55', label: 'score above which Grad-CAM++ heatmaps are drawn' },
        ]}
      />

      {/* Kept visible on purpose: what this is, and isn't. */}
      <p className="reveal mt-8 rounded-2xl border border-dashed border-rule-strong px-5 py-4 text-ink-2" style={{ '--i': 5 } as React.CSSProperties}>
        <span className="font-mono text-xs text-accent-ink">Status · </span>
        A working final-year prototype, not publicly deployed. Evaluation was qualitative, not a formal benchmark, so
        there are no accuracy figures here.
      </p>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
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
              ['Forensics', 'UCF dual-encoder + Xception'],
              ['AI detector', 'Hugging Face ViT (umm-maybe/AI-image-detector)'],
              ['Apps', 'Flutter user app, React/TypeScript admin'],
              ['Backend', 'FastAPI, Supabase'],
            ]}
          />
        </SoftCard>
      </div>

      <div className="mt-14">
        <HardParts
          items={[
            'Report how strong the evidence is without overstating it.',
            'Detect AI-generated media without letting that verdict move the forensic evidence.',
            'Show a reviewer where the model looked, only when the score warrants it.',
            'Keep finished reports tamper-evident after they leave the system.',
          ]}
        />
      </div>

      <div className="mt-14">
        <Questions
          items={[
            {
              slug: 'walkthrough',
              ask: 'Walk me through the system',
              hint: '5 steps',
              answer: (
                <WalkThrough
                  idPrefix="deepshield-walk"
                  title="DeepShield: uploads are deduplicated, then scored by two independent signals. Forensics sets the band and triggers Grad-CAM++ above 0.55; the AI detector can only override the label. Reports are anchored on a local chain and reviewed in an admin dashboard."
                  width={760}
                  height={380}
                  nodes={nodes}
                  edges={edges}
                  steps={[
                    {
                      title: 'Check what came in',
                      body: 'Media comes in through the Flutter user app, with Supabase handling auth and storage. A SHA-256 hash catches duplicates before any model runs.',
                      highlight: ['upload', 'intake', 'upload>intake'],
                    },
                    {
                      title: 'Signal one: manipulation forensics',
                      body: 'Images are scored by the UCF dual-encoder alone. For video, UCF’s temporal score is combined with Xception’s per-frame evidence through a UCF-dominant weighting: 0.60/0.40 by default, 0.80/0.20 on a strong UCF signal, 0.55/0.45 on a strong Xception burst.',
                      highlight: ['intake', 'forensics', 'intake>forensics'],
                    },
                    {
                      title: 'Decide the forensic band',
                      body: '0.35 or below is Authentic, 0.55 or above is Manipulated, and anything between is Inconclusive. Above 0.55, Grad-CAM++ heatmaps are generated and overlaid at full original resolution.',
                      highlight: ['forensics', 'band', 'gradcam', 'forensics>band', 'forensics>gradcam'],
                    },
                    {
                      title: 'Signal two: AI-generation detection',
                      body: 'Separately, a pretrained Hugging Face Vision Transformer (umm-maybe/AI-image-detector) checks for AI generation, falling back to an optional EfficientNet-B0 classifier and then to classical heuristics. Above its 0.55 threshold it can override the prediction to “AI-Generated”, but it never changes the forensic band.',
                      highlight: ['intake', 'ai', 'report', 'intake>ai', 'ai>report'],
                    },
                    {
                      title: 'Report, anchor and review',
                      body: 'A PDF report with QR verification is generated in the background, and its hash is anchored on a local Hardhat chain. Results are reviewed in a React/TypeScript admin dashboard with admin, investigator and viewer roles, audit logs and review notes.',
                      highlight: ['band', 'gradcam', 'report', 'admin', 'band>report', 'gradcam>report', 'report>admin'],
                    },
                  ]}
                />
              ),
            },
            {
              slug: 'two-signals',
              ask: 'Why are the two signals never fused?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      They answer different questions. Manipulation forensics asks whether real media was altered; AI-generation
                      detection asks whether it was generated at all. The AI detector can override the prediction to
                      “AI-Generated”, but it never moves the forensic band, so the forensic evidence always reads the same way.
                    </p>
                  </div>
                  <Decision
                    title="Two independent signals, never fused"
                    gained="The forensic band means the same thing whatever the AI detector says."
                    accepted="Two results to explain instead of one combined score."
                  />
                </div>
              ),
            },
            {
              slug: 'forensic-score',
              ask: 'How is the forensic score computed?',
              answer: (
                <div className={prose}>
                  <p className="font-mono text-sm leading-7 text-ink">
                    image: score = UCF
                    <br />
                    video: score = 0.60 · UCF + 0.40 · Xception
                    <br />
                    <span className="text-accent-ink">strong UCF signal → 0.80 / 0.20 · strong Xception burst → 0.55 / 0.45</span>
                  </p>
                  <p>
                    UCF carries the temporal view of a video and Xception contributes per-frame evidence. The weighting stays
                    UCF-dominant, and shifts towards whichever model shows a strong signal.
                  </p>
                </div>
              ),
            },
            {
              slug: 'inconclusive',
              ask: 'What makes a result Inconclusive?',
              answer: (
                <div className="space-y-6">
                  <div className={prose}>
                    <p>
                      A forensic score of 0.35 or below is Authentic, 0.55 or above is Manipulated, and anything in between is
                      Inconclusive. Grad-CAM++ heatmaps are only generated above 0.55, so a reviewer sees heatmaps when there
                      is evidence to look at. The AI detector uses its own 0.55 threshold.
                    </p>
                  </div>
                  <Decision
                    title="An explicit Inconclusive band"
                    gained="Borderline scores are reported as borderline instead of being forced into a verdict."
                    accepted="Some results need a person to follow up."
                  />
                </div>
              ),
            },
            {
              slug: 'tamper',
              ask: 'What stops a report being altered later?',
              answer: (
                <div className={prose}>
                  <p>
                    Each PDF report carries a QR code for verification, and its hash is anchored on a local Hardhat chain: a
                    local development chain, not a public network. If a report is edited afterwards, it no longer matches
                    its anchored hash.
                  </p>
                  <p>Earlier in the pipeline, a SHA-256 hash of every upload catches duplicates before any model runs.</p>
                </div>
              ),
            },
            {
              slug: 'evaluation',
              ask: 'How was it evaluated?',
              answer: (
                <div className={prose}>
                  <p>
                    DeepShield is a working final-year prototype and isn’t publicly deployed. Evaluation was qualitative, not a
                    formal benchmark, which is why this page doesn’t quote accuracy figures.
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
