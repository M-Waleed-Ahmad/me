'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

// ─── Staggered reveal hook ────────────────────────────────────────────────────

function useReveal(count: number, stagger = 90, delay = 300) {
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => {
        setVisible(v => { const n = [...v]; n[i] = true; return n; });
      }, delay + i * stagger));
    }
    return () => timers.forEach(clearTimeout);
  }, [count, stagger, delay]);
  return visible;
}

// ─── Typewriter ───────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 32, startDelay = 120) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0; setOut(''); setDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { out, done };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHANNELS = [
  {
    id:    'email',
    tag:   'MAIL',
    label: 'waleed.ahmadmunir@gmail.com',
    sub:   'Roles · project conversations · longer technical context',
    href:  'mailto:waleed.ahmadmunir@gmail.com',
    icon:  Mail,
    ext:   false,
  },
  {
    id:    'linkedin',
    tag:   'LINK',
    label: 'linkedin.com/in/waleed-ahmad-0bb087260',
    sub:   'Professional history · recruiter conversations · mutual context',
    href:  'https://www.linkedin.com/in/waleed-ahmad-0bb087260/',
    icon:  Linkedin,
    ext:   true,
  },
  {
    id:    'github',
    tag:   'CODE',
    label: 'github.com/M-Waleed-Ahmad',
    sub:   'Public repositories · experiments · technical artifacts',
    href:  'https://github.com/M-Waleed-Ahmad',
    icon:  Github,
    ext:   true,
  },
];

const INTERESTS = [
  { tag: 'PROD', text: 'Product engineering with real users and real constraints' },
  { tag: 'SYS',  text: 'Systems, automation, CI/CD, and backend architecture' },
  { tag: 'AI',   text: 'Applied AI workflows where reliability matters more than hype' },
];

// ─── Log row ──────────────────────────────────────────────────────────────────

function LogRow({
  visible,
  index,
  tag,
  label,
  sub,
  href,
  ext,
  icon: Icon,
}: {
  visible: boolean;
  index: number;
  tag: string;
  label: string;
  sub: string;
  href: string;
  ext: boolean;
  icon: React.ElementType;
}) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      target={ext ? '_blank' : undefined}
      rel={ext ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateX(0)' : 'translateX(-10px)',
        transition: `opacity 0.38s ease ${index * 0.04}s, transform 0.38s ease ${index * 0.04}s`,
      }}
      className={`group relative flex items-start gap-0 border-b border-border-muted py-5 transition-colors ${
        hov ? 'bg-[#0d0d0d]' : 'bg-transparent'
      }`}
    >
      {/* Left accent bar */}
      <div
        className="flex-shrink-0 w-[3px] self-stretch mr-6 transition-colors duration-200"
        style={{ background: hov ? '#10b981' : '#333333' }}
      />

      {/* Tag */}
      <div className="flex-shrink-0 w-14 pt-0.5">
        <span
          className="font-mono text-[9px] tracking-[0.15em] transition-colors duration-200"
          style={{ color: hov ? '#10b981' : '#6b6b6e' }}
        >
          {tag}
        </span>
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 mr-4 mt-0.5">
        <Icon
          className="w-3.5 h-3.5 transition-colors duration-200"
          style={{ color: hov ? '#34d399' : '#6b6b6e' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="font-mono text-sm leading-none truncate transition-colors duration-200"
          style={{ color: hov ? '#f5f5f7' : '#a1a1a6' }}
        >
          {label}
        </p>
        <p className="font-mono text-[10px] text-[#6b6b6e] mt-2 leading-relaxed">{sub}</p>
      </div>

      {/* Status pip */}
      <div className="flex-shrink-0 flex items-center gap-1.5 ml-6 pt-0.5">
        <div
          className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
          style={{ background: hov ? '#10b981' : '#333333' }}
        />
        <span
          className="font-mono text-[9px] tracking-widest hidden sm:block transition-colors duration-200"
          style={{ color: hov ? '#10b981' : '#48484a' }}
        >
          {ext ? 'OPEN' : 'SEND'}
        </span>
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const { out, done } = useTypewriter('waleed@dev:~$ ready to connect', 42, 200);
  // channels + interests + resume = 3 + 3 + 1
  const rowCount = CHANNELS.length + INTERESTS.length + 1;
  const visible  = useReveal(rowCount, 80, 600);

  return (
    <div className="flex-1 bg-bg-dark min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-8 py-16 sm:py-24">

        {/* ── Terminal prompt header ── */}
        <div className="mb-14">
          {/* Prompt line */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-[#6b6b6e] ml-2 tracking-wider">contact.sh</span>
          </div>

          <p className="font-mono text-sm text-[#6b6b6e] mb-3 tracking-wider">
            {out}
            <span
              className="inline-block w-[7px] h-[1em] ml-0.5 align-middle bg-accent transition-opacity duration-300"
              style={{ opacity: done ? 0 : 1 }}
            />
          </p>

          <h1 className="text-3xl sm:text-[2.6rem] font-bold tracking-tight leading-[1.08] text-text-primary max-w-xl">
            Start with the problem.<br />
            <span className="text-accent">The stack can come later.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm text-text-secondary leading-relaxed font-light">
            Open to roles, product builds, and systems work. Reach out on any channel below.
          </p>
        </div>

        {/* ── Section label ── */}
        <div className="flex items-center gap-4 mb-0">
          <span className="font-mono text-[9px] text-[#6b6b6e] tracking-[0.2em] uppercase">Channels</span>
          <div className="flex-1 border-t border-border-muted" />
          <span className="font-mono text-[9px] text-[#6b6b6e]">{CHANNELS.length} active</span>
        </div>

        {/* ── Channel log rows ── */}
        <div className="border-t border-border-muted">
          {CHANNELS.map((ch, i) => (
            <LogRow
              key={ch.id}
              visible={visible[i]}
              index={i}
              tag={ch.tag}
              label={ch.label}
              sub={ch.sub}
              href={ch.href}
              ext={ch.ext}
              icon={ch.icon}
            />
          ))}
        </div>

        {/* ── Best fit ── */}
        <div className="mt-14">
          <div className="flex items-center gap-4 mb-0">
            <span className="font-mono text-[9px] text-[#6b6b6e] tracking-[0.2em] uppercase">Best fit</span>
            <div className="flex-1 border-t border-border-muted" />
          </div>

          <div className="border-t border-border-muted">
            {INTERESTS.map((item, i) => {
              const vi = visible[CHANNELS.length + i];
              return (
                <div
                  key={item.tag}
                  style={{
                    opacity:    vi ? 1 : 0,
                    transform:  vi ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `opacity 0.38s ease ${i * 0.04}s, transform 0.38s ease ${i * 0.04}s`,
                  }}
                  className="flex items-start gap-0 border-b border-border-muted py-4"
                >
                  <div className="flex-shrink-0 w-[3px] self-stretch mr-6 bg-[#333333]" />
                  <div className="flex-shrink-0 w-14 pt-px">
                    <span className="font-mono text-[9px] tracking-[0.15em] text-[#6b6b6e]">{item.tag}</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#a1a1a6] leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Resume ── */}
        <div className="mt-14">
          <div className="flex items-center gap-4 mb-0">
            <span className="font-mono text-[9px] text-[#6b6b6e] tracking-[0.2em] uppercase">Resume</span>
            <div className="flex-1 border-t border-border-muted" />
          </div>

          <div
            className="border-t border-border-muted"
            style={{
              opacity:   visible[rowCount - 1] ? 1 : 0,
              transform: visible[rowCount - 1] ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'opacity 0.38s ease, transform 0.38s ease',
            }}
          >
            {/* Swap href + aria-disabled when resume is ready */}
            <div className="flex items-start gap-0 py-5 opacity-50 cursor-not-allowed">
              <div className="flex-shrink-0 w-[3px] self-stretch mr-6 bg-[#333333]" />
              <div className="flex-shrink-0 w-14 pt-0.5">
                <span className="font-mono text-[9px] tracking-[0.15em] text-[#6b6b6e]">PDF</span>
              </div>
              <FileText className="w-3.5 h-3.5 text-[#6b6b6e] mr-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-mono text-sm text-[#6b6b6e]">Available on request</p>
                <p className="font-mono text-[10px] text-[#48484a] mt-2">Swap href when ready to publish</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer timestamp ── */}
        <div className="mt-16 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[9px] text-[#48484a] tracking-widest uppercase">
            transmission ready · waleed ahmad munir
          </span>
        </div>

      </div>
    </div>
  );
}