'use client';

import React, { useState } from 'react';
import { Briefcase, ArrowRight, BookOpen, KeyRound, Award } from 'lucide-react';

interface JourneyNode {
  id: string;
  company: string;
  role: string;
  period: string;
  tagline: string;
  description: string;
  lessons: string[];
  skills: string[];
}

export default function JourneyPage() {
  const [activeNode, setActiveNode] = useState<string>('axelliant');

  const journeyNodes: JourneyNode[] = [
    {
      id: 'axelliant',
      company: 'Axelliant',
      role: '{{PLACEHOLDER: confirm role title}}',
      period: '{{PLACEHOLDER: confirm dates e.g. 2023 - Present}}',
      tagline: 'Scale-up engineering and database operations',
      description: '{{PLACEHOLDER: Summarize your impact at Axelliant. Focus on system scalability, database tuning (e.g. Arabia Hills), and cloud operations.}}',
      lessons: [
        '{{PLACEHOLDER: Lesson 1 e.g., Spatial database optimization requires strict boundary indexing}}',
        '{{PLACEHOLDER: Lesson 2 e.g., Asynchronous API designs are only as good as their telemetry reporting}}'
      ],
      skills: ['PostgreSQL', 'Next.js', 'System Design', 'Supabase']
    },
    {
      id: 'arrivy',
      company: 'Arrivy',
      role: '{{PLACEHOLDER: confirm role title}}',
      period: '{{PLACEHOLDER: confirm dates e.g. 2022 - 2023}}',
      tagline: 'High-craftsmanship client interfaces & performance',
      description: '{{PLACEHOLDER: Summarize your impact at Arrivy. Focus on frontend loading speeds (e.g. ALFA Club), styling standards, and fluid mobile UX.}}',
      lessons: [
        '{{PLACEHOLDER: Lesson 1 e.g., Smooth animations directly impact user session lengths}}',
        '{{PLACEHOLDER: Lesson 2 e.g., Keep client-side caching thin to avoid runtime leaks}}'
      ],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
    },
    {
      id: 'ashtex',
      company: 'Ashtex Solutions',
      role: '{{PLACEHOLDER: confirm role title}}',
      period: '{{PLACEHOLDER: confirm dates e.g. 2020 - 2022}}',
      tagline: 'Full-stack software development & mental health platforms',
      description: '{{PLACEHOLDER: Summarize your impact at Ashtex Solutions. Focus on full-stack application lifecycle, API development (e.g. WePsych), and patient-doctor scheduling systems.}}',
      lessons: [
        '{{PLACEHOLDER: Lesson 1 e.g., Healthcare apps demand early modularity for data security compliance}}',
        '{{PLACEHOLDER: Lesson 2 e.g., Decoupling backend workers prevents appointment webhook drops}}'
      ],
      skills: ['FastAPI', 'React', 'Docker', 'REST APIs']
    },
    {
      id: 'fast',
      company: 'FAST-NUCES',
      role: 'Computer Science Education',
      period: '{{PLACEHOLDER: confirm dates e.g. 2016 - 2020}}',
      tagline: 'Computer science principles and systems fundamentals',
      description: '{{PLACEHOLDER: Summarize academic achievements. Focus on data structures, algorithms, operating systems, and core mathematical models.}}',
      lessons: [
        '{{PLACEHOLDER: Lesson 1 e.g., Memory management rules remain true even in high-level runtimes}}',
        '{{PLACEHOLDER: Lesson 2 e.g., Graph representations are the core of system data mapping}}'
      ],
      skills: ['C++', 'Python', 'Algorithms', 'Data Structures']
    }
  ];

  const activeData = journeyNodes.find(node => node.id === activeNode) || journeyNodes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
      {/* Page Header */}
      <div className="border-b border-border-muted pb-8">
        <div className="flex items-center gap-2 text-accent font-mono text-xs tracking-widest uppercase mb-3">
          <Briefcase className="w-4 h-4" />
          Journey
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Non-Linear Workspace Map</h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
          Waleed's professional career represented as an interactive graph of experience. Click a company node on the
          left map to inspect key projects, architectural lessons, and skills gained in that workspace.
        </p>
      </div>

      {/* Journey Map Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Map List */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block mb-2">Workspace Nodes</span>
          {journeyNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`w-full text-left p-5 rounded-lg border transition-all flex items-center justify-between group ${
                activeNode === node.id
                  ? 'bg-bg-panel border-accent/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  : 'bg-bg-panel/40 border-border-muted hover:border-accent/20 hover:bg-bg-panel'
              }`}
            >
              <div>
                <h3 className={`font-bold transition-colors ${activeNode === node.id ? 'text-accent' : 'text-text-primary'}`}>
                  {node.company}
                </h3>
                <span className="text-xs font-mono text-text-secondary">{node.role}</span>
              </div>
              <ArrowRight className={`w-4 h-4 transition-all ${
                activeNode === node.id ? 'text-accent translate-x-1' : 'text-text-muted group-hover:text-text-secondary'
              }`} />
            </button>
          ))}
        </div>

        {/* Right Side: Details Inspector */}
        <div className="md:col-span-2 p-8 rounded-lg bg-bg-panel border border-border-muted space-y-6">
          {/* Header */}
          <div className="border-b border-border-muted pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-accent">{activeData.period}</span>
              <h2 className="text-2xl font-bold mt-1 text-text-primary">{activeData.company}</h2>
              <p className="text-xs text-text-secondary font-mono mt-1">{activeData.role}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-bg-dark border border-border-muted text-text-secondary px-3 py-1 rounded">
                Node: {activeData.id.toUpperCase()}_ENV
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider">Mission Statement</h4>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">{activeData.description}</p>
          </div>

          {/* Lessons */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent" /> Architectural Lessons Learned
            </h4>
            <ul className="space-y-2 font-mono text-xs text-text-secondary list-disc pl-4 leading-relaxed">
              {activeData.lessons.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-accent" /> Skills Acquired
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeData.skills.map((skill) => (
                <span 
                  key={skill}
                  className="font-mono text-[10px] bg-bg-dark border border-border-muted text-text-primary px-2.5 py-1 rounded hover:border-accent/25 hover:text-accent transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
