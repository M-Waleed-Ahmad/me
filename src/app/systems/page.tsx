'use client';

import React from 'react';
import { Code2, Settings, Terminal, Database, HelpCircle } from 'lucide-react';

export default function SystemsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
      {/* Pillar Header */}
      <div className="border-b border-border-muted pb-8">
        <div className="flex items-center gap-2 text-accent font-mono text-xs tracking-widest uppercase mb-3">
          <Code2 className="w-4 h-4" />
          Pillar 02 // Systems
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Operations Control Center</h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
          Backbone infrastructure, custom API automation, and code integration logic. This space highlights Waleed's
          ability to design scalable workflows that require zero manual operation.
        </p>
      </div>

      {/* Showcases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Showcase 1: Automation */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Automation Showcase</h2>
              <p className="text-xs text-text-secondary">Process orchestrators & background workflows</p>
            </div>
          </div>
          <div className="p-6 rounded bg-bg-dark border border-border-muted border-dashed text-center font-mono text-xs text-text-secondary">
            [Interactive Workflow Builder View: Inactive in Phase 1]
            <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Trigger</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Processing</span>
              <span>→</span>
              <span className="bg-bg-panel px-2.5 py-1 rounded border border-border-muted">Output</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            {'{{PLACEHOLDER: "Describe automation achievements (e.g., custom webhooks, Make.com triggers, syncing CRM files with patient profiles securely)."}}'}
          </p>
          
          {/* Engineering Note */}
          <div className="p-4 rounded border-l-2 border-accent bg-accent/5 font-mono text-xs space-y-1">
            <span className="text-accent font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Engineering Note: Why FastAPI + Webhooks?
            </span>
            <p className="text-text-secondary">
              {'{{PLACEHOLDER: "FastAPI handles asynchronous IO extremely efficiently. It reduced server costs by [METRIC: e.g., 50%] compared to synchronous wrappers."}}'}
            </p>
          </div>
        </div>

        {/* Showcase 2: CI/CD */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">CI/CD Showcase</h2>
              <p className="text-xs text-text-secondary">Testing runtimes & build deployment pipelines</p>
            </div>
          </div>
          <div className="p-6 rounded bg-bg-dark border border-border-muted border-dashed text-center font-mono text-xs text-text-secondary">
            [Animated Build Pipeline View: Inactive in Phase 1]
            <div className="mt-4 flex items-center justify-center gap-3 opacity-60">
              <span className="bg-bg-panel px-2 py-0.5 rounded border border-border-muted">Push</span>
              <span>→</span>
              <span className="bg-bg-panel px-2 py-0.5 rounded border border-border-muted">Test</span>
              <span>→</span>
              <span className="bg-bg-panel px-2 py-0.5 rounded border border-border-muted">Build</span>
              <span>→</span>
              <span className="bg-bg-panel px-2 py-0.5 rounded border border-accent/30 text-accent">Deploy</span>
            </div>
          </div>
          <p className="text-sm text-text-secondary">
            {'{{PLACEHOLDER: "Describe deployment scaling (e.g., Docker containerization, automated testing steps run in GitHub Actions on every pull request, rollback hooks)."}}'}
          </p>

          {/* Engineering Note */}
          <div className="p-4 rounded border-l-2 border-accent bg-accent/5 font-mono text-xs space-y-1">
            <span className="text-accent font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Engineering Note: Why isolated runner containers?
            </span>
            <p className="text-text-secondary">
              {'{{PLACEHOLDER: "Isolating testing environments prevents dependency conflicts and prevents test suites from accessing shared cache parameters."}}'}
            </p>
          </div>
        </div>

        {/* Showcase 3: Architecture & DB Design */}
        <div className="p-8 rounded-lg bg-bg-panel border border-border-muted lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg-dark border border-border-muted text-accent">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">System Architecture Maps</h2>
              <p className="text-xs text-text-secondary">Data schemas, database replicas, and pipeline architecture</p>
            </div>
          </div>
          <div className="p-12 rounded bg-bg-dark border border-border-muted border-dashed text-center font-mono text-xs text-text-secondary">
            [Complex System Architecture Graph: Inactive in Phase 1]
          </div>
          <p className="text-sm text-text-secondary max-w-3xl">
            {'{{PLACEHOLDER: "Introduce backend blueprints. Explain data movement between relational tables, external APIs, queues, and frontends, and how data sovereignty laws are preserved."}}'}
          </p>
        </div>
      </div>
    </div>
  );
}
