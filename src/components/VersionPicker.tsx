'use client';

import { useSyncExternalStore } from 'react';
import { getSiteVersion, setSiteVersion, SiteVersion, subscribeSiteVersion } from '@/lib/siteVersion';

export type VersionCard = {
  tag: SiteVersion;
  name: string;
  why: string;
  bg: string;
  ink: string;
  accent: string;
  font: string;
};

/** The four versions as buttons: clicking one re-themes the whole site in that look. */
export default function VersionPicker({ versions }: { versions: VersionCard[] }) {
  const active = useSyncExternalStore(subscribeSiteVersion, getSiteVersion, () => 'v4' as const);

  return (
    <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {versions.map((v, i) => {
        const on = active === v.tag;
        return (
          <li key={v.tag} className="reveal" style={{ '--i': i + 2 } as React.CSSProperties}>
            <button
              type="button"
              onClick={() => setSiteVersion(v.tag)}
              aria-pressed={on}
              className="group block w-full text-left"
            >
              <span
                className={`flex aspect-[4/3] flex-col justify-between rounded-2xl p-5 transition-transform group-hover:-translate-y-0.5 ${
                  on ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper' : 'ring-1 ring-rule'
                }`}
                style={{ background: v.bg, color: v.ink }}
              >
                <span className="flex items-center justify-between font-mono text-xs opacity-70">
                  <span>{v.tag}</span>
                  <span>{on ? 'viewing' : v.tag === 'v4' ? 'current' : 'try it'}</span>
                </span>
                <span>
                  <span className="block text-5xl leading-none" style={{ fontFamily: v.font }}>
                    Aa
                  </span>
                  <span className="mt-3 flex gap-1.5">
                    <span className="h-3 w-8 rounded-full" style={{ background: v.accent }} />
                    <span className="h-3 w-3 rounded-full opacity-40" style={{ background: v.ink }} />
                  </span>
                </span>
              </span>
              <span className="mt-3 block font-serif text-xl text-ink">{v.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-3">{v.why}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
