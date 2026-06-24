'use client';

import React from 'react';
import { Cpu, ShieldCheck, HelpCircle, GitFork, Play } from 'lucide-react';

export default function IntelligencePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
      {/* Pillar Header */}
      <div className="border-b border-border-muted pb-8">
        <div className="flex items-center gap-2 text-accent font-mono text-xs tracking-widest uppercase mb-3">
          <Cpu className="w-4 h-4" />
          Pillar 03 // Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Research & Applied AI Lab</h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
          Applied machine learning, deep learning verification, robotics control architectures, and safety testing. 
          Focus is placed on mathematical depth, model inspectability, and practical deployment safety.
        </p>
      </div>

      {/* Showcases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DeepShield Showcase */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">DeepShield</h2>
                <p className="text-xs text-text-secondary">Deepfake verification pipeline & heatmaps</p>
              </div>
            </div>
            <span className="font-mono text-xs text-accent">Pillar_03_Hero</span>
          </div>

          {/* Sequential Pipeline Visual */}
          <div className="p-6 rounded bg-bg-dark border border-border-muted border-dashed space-y-4">
            <div className="text-center font-mono text-xs text-text-secondary">
              [Pipeline Stage Inspector: Inactive in Phase 1]
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] text-text-secondary">
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Video Input</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Dual Encoder</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Xception Analysis</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border-accent/20 text-accent">GradCAM++</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Confidence Score</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Result</span>
            </div>
          </div>

          <p className="text-sm text-text-secondary">
            {'{{PLACEHOLDER: "Describe DeepShield computer vision pipeline. Explain the neural network structure, why Xception nets were chosen, and how GradCAM++ highlights anomalies in frame faces to build client trust."}}'}
          </p>
        </div>

        {/* Robotics Skill Showcase */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Robotics Skill Architecture</h2>
              <p className="text-xs text-text-secondary">Modular hierarchical action composition</p>
            </div>
          </div>
          <div className="p-6 rounded bg-bg-dark border border-border-muted border-dashed text-center font-mono text-xs text-text-secondary">
            [Robotics Composition Tree: Inactive in Phase 1]
          </div>
          <p className="text-sm text-text-secondary">
            {'{{PLACEHOLDER: "Explain robotics hierarchy. Show how high-level behavioral goals decompose into state policies, trajectory optimization, and low-level physical servo loops."}}'}
          </p>
        </div>

        {/* Red Teaming Showcase */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
              <Play className="w-5 h-5 rotate-90" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Red Teaming Research</h2>
              <p className="text-xs text-text-secondary">Safety testing, evaluations & alignments</p>
            </div>
          </div>
          <div className="p-6 rounded bg-bg-dark border border-border-muted border-dashed text-center font-mono text-xs text-text-secondary">
            [Safety Assessment Board: Inactive in Phase 1]
          </div>
          <p className="text-sm text-text-secondary">
            {'{{PLACEHOLDER: "Describe model safety testing. Explain prompt injection defensive design, system instruction validation, adversarial inputs, and why deterministic guardrails are needed."}}'}
          </p>
        </div>
      </div>
    </div>
  );
}
