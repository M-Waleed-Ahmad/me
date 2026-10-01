'use client';

import { useEffect, useState } from 'react';

/** Opens the question named in the URL fragment, on load and when the fragment changes. */
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: 'start' });
      }
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}

export function CopyLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.hash = slug;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="mt-6 font-mono text-xs text-ink-3 underline decoration-rule-strong underline-offset-4 hover:text-ink"
    >
      {copied ? 'link copied' : 'copy link to this answer'}
    </button>
  );
}
