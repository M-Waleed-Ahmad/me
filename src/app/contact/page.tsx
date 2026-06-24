'use client';

import React from 'react';
import { Mail, Linkedin, Github, FileText, Calendar, Send } from 'lucide-react';

export default function ContactPage() {
  const contactLinks = [
    {
      label: 'Email',
      value: '{{PLACEHOLDER: walee@example.com}}',
      href: 'mailto:{{PLACEHOLDER: walee@example.com}}',
      icon: Mail,
      desc: 'For professional inquiries & technical consults'
    },
    {
      label: 'LinkedIn',
      value: '{{PLACEHOLDER: linkedin.com/in/waleed}}',
      href: 'https://linkedin.com/in/{{PLACEHOLDER: username}}',
      icon: Linkedin,
      desc: 'Industry networking & professional history'
    },
    {
      label: 'GitHub',
      value: '{{PLACEHOLDER: github.com/waleed}}',
      href: 'https://github.com/{{PLACEHOLDER: username}}',
      icon: Github,
      desc: 'Repositories, open-source work & shell files'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12 flex flex-col justify-center">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-lg mx-auto">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-accent/5 border border-accent/20 text-accent">
          <Send className="w-5 h-5 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Establish Contact</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          Need a systems mind to solve an application blocker, design a workflow, or review a codebase?
          Reach out through any platform below.
        </p>
      </div>

      {/* Grid Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-lg bg-bg-panel border border-border-muted hover:border-accent/40 hover:bg-bg-panel-hover transition-all text-center flex flex-col items-center space-y-4"
            >
              <div className="p-3 rounded bg-bg-dark border border-border-muted group-hover:border-accent/20 text-text-secondary group-hover:text-accent transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors">{link.label}</h3>
                <p className="text-[10px] text-text-muted font-mono mt-1">{link.value}</p>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">{link.desc}</p>
            </a>
          );
        })}
      </div>

      {/* Scheduling & Resume */}
      <div className="max-w-xl mx-auto w-full p-6 rounded-lg bg-bg-panel border border-border-muted grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Scheduling & Artifacts</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Direct calendar access for consultations or copyable copy of resume.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-mono text-xs">
          <a
            href="{{PLACEHOLDER: resume link}}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded border border-border-muted hover:border-accent/30 bg-bg-dark text-text-secondary hover:text-text-primary transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Download Resume
          </a>
          <a
            href="https://calendly.com/{{PLACEHOLDER: username}}"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded border border-border-muted hover:border-accent/30 bg-bg-dark text-text-secondary hover:text-text-primary transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Calendly Slot
          </a>
        </div>
      </div>
    </div>
  );
}
