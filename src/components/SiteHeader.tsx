'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search as SearchIcon, X } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { profile } from '@/data/site';

const NAV = [
  { label: 'Work', href: '/products' },
  { label: 'Journey', href: '/journey' },
  { label: 'Explorer', href: '/explorer' },
  { label: 'How I built this', href: '/process' },
];

const noopSubscribe = () => () => {};

/** Mac users see ⌘K, everyone else Ctrl K. Server render assumes Ctrl to avoid a hydration mismatch. */
function useShortcutLabel() {
  const isMac = useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false
  );
  return isMac ? '⌘K' : 'Ctrl K';
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const shortcut = useShortcutLabel();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const closeMenu = () => setMenuOpen(false);

  return (
    // Named so page transitions hold it still as a visual anchor.
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-md" style={{ viewTransitionName: 'site-header' }}>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" onClick={closeMenu} className="group flex items-baseline gap-2">
          <span className="font-serif text-2xl leading-none text-ink">{profile.name}</span>
          <span className="hidden font-mono text-xs text-ink-3 sm:inline">{profile.role}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-sm transition-colors ${
                isActive(item.href)
                  ? 'text-ink underline decoration-accent decoration-2 underline-offset-[6px]'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            aria-label={`Search (${shortcut})`}
            className="flex items-center gap-2 px-2 py-2 text-ink-2 transition-colors hover:text-ink"
          >
            <SearchIcon className="h-4 w-4" />
            <kbd className="hidden rounded-sm border border-rule px-1.5 py-0.5 font-mono text-[11px] text-ink-3 md:inline">
              {shortcut}
            </kbd>
          </button>
          <a
            href={profile.resume}
            className="hidden px-2 py-2 text-sm text-ink-2 transition-colors hover:text-ink sm:inline"
          >
            Résumé
          </a>
          <Link
            href="/contact"
            className="hidden bg-ink px-3.5 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent sm:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-ink md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-rule bg-paper md:hidden">
          <ul className="mx-auto w-full max-w-6xl px-5 py-4 sm:px-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block border-b border-rule py-3 font-serif text-2xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex gap-3 pt-4">
              <Link
                href="/contact"
                onClick={closeMenu}
                className="flex-1 bg-ink px-4 py-3 text-center text-sm font-medium text-paper"
              >
                Contact
              </Link>
              <a
                href={profile.resume}
                className="flex-1 border border-rule-strong px-4 py-3 text-center text-sm font-medium text-ink"
              >
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
