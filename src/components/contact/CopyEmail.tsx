'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface p-4 pl-5">
      <div className="min-w-0">
        <p className="font-mono text-xs text-ink-3">email</p>
        <a href={`mailto:${email}`} className="mt-0.5 block truncate text-lg text-ink hover:text-accent-ink">
          {email}
        </a>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rule-strong px-3.5 py-1.5 text-sm text-ink transition-colors hover:border-ink"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
