'use client';

import { useSyncExternalStore } from 'react';
import { getSiteVersion, setSiteVersion, subscribeSiteVersion } from '@/lib/siteVersion';

const NAMES = { v1: 'Emerald on black', v2: 'Paper and terracotta', v3: 'Blueprint datasheets', v4: '' };

/** Shown on every page while an earlier version of the site is being viewed. */
export default function VersionPill() {
  const version = useSyncExternalStore(subscribeSiteVersion, getSiteVersion, () => 'v4' as const);
  if (version === 'v4') return null;
  return (
    <div
      role="status"
      data-no-print
      className="fixed bottom-4 left-4 z-[65] flex items-center gap-3 rounded-full border border-rule bg-paper px-4 py-2 text-sm text-ink shadow-sm"
    >
      <span>
        Viewing {version} · <span className="text-ink-3">{NAMES[version]}</span>
      </span>
      <button
        type="button"
        onClick={() => setSiteVersion('v4')}
        className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper transition-colors hover:bg-accent"
      >
        Back to now
      </button>
    </div>
  );
}
